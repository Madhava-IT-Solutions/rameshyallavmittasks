const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();

const nodemailer = require("nodemailer");
const router = express.Router();

console.log("login.js")


// Configure MySQL connection pool for remote connection
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
    console.log("Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// API: User login
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
   
    try {
      // Query the database for the user by username
      const [rows] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);

      connection.release(); // Release the connection

      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const user = rows[0];
      
      // Check if password is valid using bcrypt (ensure you are waiting for the promise)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('hashed password match',isPasswordValid); // Debug log for comparison result

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Generate a JWT token for the user
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      // Respond with the token and user profile
      res.status(200).json({
        token,
        userProfile: {
          id: user.id,
          image:"https://avatar.iran.liara.run/public/boy?username=Ash",
          username: user.username,
          email: user.email,
          created_at : user.created_at,
          role: user.role,
          phone:user.phone
        },
      });
      


    } catch (queryError) {
      // Handle query errors
      console.error("Query error:", queryError);
      connection.release(); // Ensure to release the connection in case of query error
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (connectionError) {
    // Handle database connection errors
    console.error("Database connection error:", connectionError);
    res.status(500).json({ message: "Database connection error" });
  }
});


router.post('/api/send', async (req, res) => {
  const { name, email, message } = req.body;

  console.log(name,email,message)

  // Set up Nodemailer transport
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_PASS // Your Gmail App Password
      }
  });

  let mailOptions = {
      from: process.env.EMAIL_USER,
      to:  email,// Your email to receive messages
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Thanks for Contacting us!' });
  } catch (error) {
      res.status(500).json({ message: 'Error sending email', error });
  }
});





module.exports = router;
