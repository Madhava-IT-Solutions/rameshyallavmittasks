const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite3 database
const db = new sqlite3.Database('tender.db');

// Create a table to store tender data (if not exists)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tenders (
   
      name_of_work TEXT,
      area TEXT,
      plinth_area TEXT,
      state TEXT,
      district TEXT,
      place TEXT,
      nature_of_work TEXT,
      tender_published_on DATE,
      tender_response_by DATE,

      contractor_id TEXT,
      license_no TEXT,
      license_type TEXT,
      address TEXT,
      mobile TEXT,
      email TEXT
    )
  `);
});

// Configure Nodemailer with SMTP credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Gmail service
  auth: {
    user: 'trainee6madhavaitsolutions@gmail.com',    // Your Gmail address
    pass: 'bnbg jnnq ajbv kdym'  // The 16-character App Password you generated
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'confir.html'));
});
// Handle form submission
app.post('/submit-tender', (req, res) => {
  const {
    name_of_work, area, plinth_area, state, district, place, nature_of_work,
    tender_published_on, tender_response_by, contractor_id, license_no,
    license_type, address, mobile, email
  } = req.body;
  console.log('Received Data:', req.body);
  // Store the tender data in the database
  db.run(`
    INSERT INTO tenders (name_of_work, area, plinth_area, state, district, place, nature_of_work, 
                         tender_published_on, tender_response_by, contractor_id, license_no, 
                         license_type, address, mobile, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name_of_work, area, plinth_area, state, district, place, nature_of_work, tender_published_on, 
      tender_response_by, contractor_id, license_no, license_type, address, mobile, email],
    function(err) {
      if (err) {
        console.error('Error inserting data into database:', err.message);
        return res.status(500).send('Failed to submit tender.');
      }

      // Send the email with tender details
      const mailOptions = {
        from: 'trainee6madhavaitsolutions@gmail.com', // Replace with your "From" email
        to: `${email},yallaramesh79@gmail.com`, // Replace with your "To" email
        subject: 'New Tender Application Submitted',
        text: `
          Tender Details:
          Name of Work: ${name_of_work}
          Area: ${area}
          Plinth Area: ${plinth_area}
          State: ${state}
          District: ${district}
          Place: ${place}
          Nature of Work: ${nature_of_work}
          Tender Published On: ${tender_published_on}
          Tender Response By: ${tender_response_by}
        
          Contractor ID: ${contractor_id}
          License No: ${license_no}
          Type of License: ${license_type}
          Address: ${address}
          Mobile: ${mobile}
          Email: ${email}
        `,
       
      };





      // Send email via Nodemailer
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error.message);
          return res.status(500).send('Error sending email.');
        }
        console.log('Email sent successfully:', info.response);
        res.send('Tender application submitted successfully!');
      });
    });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
