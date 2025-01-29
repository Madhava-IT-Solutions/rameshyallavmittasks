const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

const router = express.Router();



console.log("apply.js");
// Configure MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});






// router.post("/update-profile", async(req, res) => {
//   const { name, email, phone } = req.body;

//   // Update fields if provided
//   try {
//     const connection = await pool.getConnection();
//     try {
//       const response = await connection.query(
//         `UPDATE INTO users (
//           tender_id,
//           user_id,
//           name,
//           license_number,
//           license_type,
//           bid_amount,
//           phone,
//           email) 
//          VALUES (?,?,?,?,?,?,?,?)`,
//         [
//           tender_id,
//           user_id,
//           name,
//           license_no,
//           license_type,
//           bid_amount,
//           mobile,
//           email
//         ]
//       );
//       connection.release();
//       res.status(200).json({ message: `application submitted successfully.` });

//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: `${email}, yallaramesh79@gmail.com`,
//         subject: "Tender Submission Confirmation",
//         text: emailBody ,
//       };
//       transporter.sendMail(mailOptions, (error) => {
//         if (error) {
//           return res.status(500).json({ error: "Email error" });
//         }
//         res.json({ message: "Tender submitted successfully" });
//       });
//     } catch (queryError) {
//       console.error("Query error:", queryError);
//       connection.release();
//       res.status(500).json({ error: "Database query error" });
//     }
//   } catch (connectionError) {
//     console.error("Database connection error:", connectionError);
//     res.status(500).json({ error: "Database connection error" });
//   }
 
//   res.status(200).json({
//     message: "Profile updated successfully!",
//     updatedProfile: userProfile,
//   });
// });
// Apply for a Tender
router.post("/api/apply-tender",async (req, res) => {
  const {
    name,
    tender_id,
    user_id,
    license_no,
    license_type,
    bid_amount,
    mobile,
    email
  } = req.body;
  const emailBody = `
        Dear ${name},

        Your application for the tender with Tender-Id: ${tender_id} has been successfully processed. Below are your details:

        Contractor ID: ${user_id}
        Contractor Name: ${name}
        License Number: ${license_no}
        License Type: ${license_type}
        Mobile Number: ${mobile}
        Email: ${email}

        Best regards,
        The SSV Tenders Team
    `;
  try {
    const connection = await pool.getConnection();
    try {
      const response = await connection.query(
        `INSERT INTO applications (
          tender_id,
          user_id,
          name,
          license_number,
          license_type,
          bid_amount,
          phone,
          email) 
         VALUES (?,?,?,?,?,?,?,?)`,
        [
          tender_id,
          user_id,
          name,
          license_no,
          license_type,
          bid_amount,
          mobile,
          email
        ]
      );
      connection.release();
      res.status(200).json({ message: `application submitted successfully.` });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}, yallaramesh79@gmail.com`,
        subject: "Tender Submission Confirmation",
        text: emailBody ,
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(500).json({ error: "Email error" });
        }
        res.json({ message: "Tender submitted successfully" });
      });
    } catch (queryError) {
      console.error("Query error:", queryError);
      connection.release();
      res.status(500).json({ error: "Database query error" });
    }
  } catch (connectionError) {
    console.error("Database connection error:", connectionError);
    res.status(500).json({ error: "Database connection error" });
  }
});



module.exports = router;
