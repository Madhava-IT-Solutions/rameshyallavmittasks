const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const router = express.Router();
console.log("registration.js")


const bcrypt = require("bcrypt");

// Function to hash password
async function hashPassword(password) {
  const saltRounds = 10; // Cost factor for hashing
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Function to verify password
async function verifyPassword(inputPassword, storedHashedPassword) {
  const match = await bcrypt.compare(inputPassword, storedHashedPassword);
  return match; // Returns true if passwords match, false otherwise
}

// Example Usage
(async () => {
  const plainTextPassword = "my_secure_password";

  // Hash the password
  const hashedPassword = await hashPassword(plainTextPassword);
  console.log("Hashed Password:", hashedPassword);

  // Verify the password
  const isMatch = await verifyPassword("my_secure_password", hashedPassword);
  console.log("Password Match:", isMatch);
})();



// Set up file upload directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Remote database host (e.g., 'remote.mysql.server.com' or IP address)
  user: process.env.DB_USER,       // Database username (the user with remote access privileges)
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME,   // Database name
  port: process.env.DB_PORT || 3306, // Database port (default: 3306, change if different)
  waitForConnections: true,
  connectionLimit: 10,            // Maximum number of connections in the pool
  queueLimit: 0,                  // Unlimited queue
});


// Connection check
pool.getConnection()
  .then((connection) => {
    console.log("Database connected successfully in registrations");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to database in registrations:", err);
  });



// Helper function to register a user and their role-specific data
async function registerUser(user, role, res, extraData, tableName) {
  const { username, email, password } = user;
  console.log(role)
  
  try {
    const hashedPassword = await hashPassword(password); // Hash password before storing
    
    const userQuery = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    const roleQuery = `INSERT INTO ${tableName} (user_id, ${Object.keys(extraData).join(", ")}) VALUES (?, ${Object.values(extraData).map(() => "?").join(", ")})`;

    console.log(Object.keys(extraData) ,Object.values(extraData))

    const connection = await pool.getConnection();
    const [userResult] = await connection.query(userQuery, [username, email, hashedPassword, role]);

    const userId = userResult.insertId;
    await connection.query(roleQuery, [userId, ...Object.values(extraData)]);

    connection.release();
    res.status(200).json({ message: `${role} registered successfully.` });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
}

  
  
// Register Client
router.post("/api/register-client", (req, res) => {
  const user = req.body;
  const extraData = {
    username:user.username,
    organisation_name:user.organisationName,
    email: user.email,
    password:user.password,
    confirm_password:user.confirmPassword,
    mobile: user.mobile,
    state: user.state,
    district: user.district,
  };
  registerUser(user, "client", res, extraData, "clients");
});

// Register Vendor
router.post("/api/register-vendor", (req, res) => {
  console.log(req.body)
  const user = req.body;
  const extraData = {
    phone: user.phone,
    firm_name: user.firm_name,
    gst_number: user.gst_number,
    experience: user.experience,
    state: user.state,
    district: user.district,
    materials: user.materials 
  };
  registerUser(user, "vendor", res, extraData, "vendors");
});



// Register Contractor
router.post("/api/register-contractor", (req, res) => {
  console.log(req.body)
  const user = req.body;
  const extraData = {
    phone: user.phone,
    license_number:user.license_number,
    license_type:user.license_type,
    company_name:user.name_of_firm,
    address:`${user.state}, ${user.district}`,
    interests:user.interests.join(',')
  };
  registerUser(user, "contractor", res, extraData, "contractors");
});


module.exports = router;

// // Send email function
// const sendEmail = async (email, user_name, password) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "your_email@gmail.com",
//       pass: "your_email_password",
//     },
//   });

//   const mailOptions = {
//     from: "your_email@gmail.com",
//     to: email,
//     subject: "Registration Successful",
//     text: Dear ${user_name},\n\nYour registration is successful. Here are your login details:\n\nUsername: ${user_name}\nPassword: ${password}\n\nRegards,\nRegistration System,
//   };

//   await transporter.sendMail(mailOptions);
// };
// Start the server