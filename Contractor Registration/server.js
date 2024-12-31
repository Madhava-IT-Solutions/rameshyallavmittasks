const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');

const fs = require('fs');
require('dotenv').config();
const xlsx = require('xlsx');





// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Database Setup
const db = new sqlite3.Database('./contractors5.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS contractors (
             id TEXT PRIMARY KEY, 
            contractor_name TEXT,
            firm_name TEXT,
            license_number TEXT,
            license_type TEXT,
            state TEXT,
            district TEXT,
            place TEXT,
            experience INTEGER,
            license_file TEXT,
            interests TEXT,
            mobile_number TEXT,
            email TEXT
        )`);
    }
});

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });



// Submit Form Data
// Submit Form Data with Custom ID
app.post('/submit', upload.single('license_file'), (req, res) => {
    const {
        contractor_name,
        firm_name,
        license_number,
        license_type,
        state,
        district,
        place,
        experience,
        interests,
        mobile_number,
        email
    } = req.body;

    const licenseFilePath = req.file ? req.file.filename : null;
    const interestsJson = interests ? JSON.stringify(interests.split(',')) : '[]';

    // Generate the custom contractor ID (e.g., "CN00001")
    const generateCustomId = () => {
        return new Promise((resolve, reject) => {
            db.get("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) AS max_id FROM contractors", (err, row) => {
                if (err) {
                    reject('Error fetching max ID');
                } else {
                    const nextId = row.max_id ? row.max_id + 1 : 1; // If no rows, start from 1
                    resolve(`CN${nextId.toString().padStart(5, '0')}`); // Format ID like CN00001
                }
            });
        });
    };

    generateCustomId().then((customId) => {
        db.run(
            `INSERT INTO contractors (id, contractor_name, firm_name, license_number, license_type, state, district, place, experience, license_file, interests, mobile_number, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

            [
                customId,
                contractor_name,
                firm_name,
                license_number,
                license_type,
                state,
                district,
                place,
                experience,
                licenseFilePath,
                interestsJson,
                mobile_number,
                email
            ],
            async (err) => {
                if (err) {
                    console.error('Error saving to database:', err);
                    res.status(500).send('Error saving data');
                } else {
                    // Update the Excel file with new data
                    console.log('Contractor data inserted:', customId);
                    await updateExcelFile({
                        custom_id: customId,
                        contractor_name,
                        firm_name,
                        license_number,
                        license_type,
                        state,
                        district,
                        place,
                        experience,
                        interests,
                        mobile_number,
                        email
                    });
                    
                    // Send email with contractor details (no Excel file attachment)
                    sendEmail(contractor_name, firm_name, license_number, license_type, state, district, place, experience, interests, mobile_number, email, customId)
                        .then(() => {
                            res.redirect('/');
                        })
                        .catch((error) => {
                            console.error('Error sending email:', error);
                            res.status(500).send('Error sending email');
                        });
                }
            }
        );
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error generating custom ID');
    });
});

// Function to update the Excel file with new data






const updateExcelFile = async (contractorData) => {
  const filePath = path.join(__dirname, 'uploads', 'contractors_data2.xlsx');
  
  console.log('Contractor Data:', contractorData);

  try {
    let workbook;

    // Check if file exists
    if (fs.existsSync(filePath)) {
      console.log('File exists, reading...');
      // Read the existing Excel file
      workbook = xlsx.readFile(filePath);
    } else {
      console.log('File does not exist, creating a new file...');
      // Create a new workbook if file does not exist
      workbook = xlsx.utils.book_new();
      // Create a sheet with headers
      const newSheet = xlsx.utils.aoa_to_sheet([[
        'Contractor ID', 'Contractor Name', 'Firm Name', 'License Number', 'License Type',
        'State', 'District', 'Place', 'Experience', 'Interests', 'Mobile Number', 'Email'
      ]]);
      xlsx.utils.book_append_sheet(workbook, newSheet, 'Contractor Data');
    }

    // Get the 'Contractor Data' sheet or create one if it doesn't exist
    const worksheet = workbook.Sheets['Contractor Data'];

    // Append the new contractor data
    const newRow = [
      contractorData.custom_id,
      contractorData.contractor_name,
      contractorData.firm_name,
      contractorData.license_number,
      contractorData.license_type,
      contractorData.state,
      contractorData.district,
      contractorData.place,
      contractorData.experience,
      contractorData.interests,
      contractorData.mobile_number,
      contractorData.email
    ];

    // Convert the sheet data to JSON and append the new row
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    data.push(newRow);

    data.classList.add("w")

    // Convert the updated data back to a sheet
    const updatedSheet = xlsx.utils.aoa_to_sheet(data);

    // Replace the existing sheet with the updated sheet
    workbook.Sheets['Contractor Data'] = updatedSheet;

    // Write the updated workbook back to the file
    xlsx.writeFile(workbook, filePath);
    console.log('Excel file updated successfully with the new row.');

  } catch (error) {
    console.error('Error processing Excel file:', error);
  }
};



// Function to send email with contractor details (no Excel file attached)
const sendEmail = async (contractor_name, firm_name, license_number, license_type, state, district, place, experience, interests, mobile_number, email, customId) => {
    // Setup the email transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        }
    });
    
    // Prepare the email body with contractor details
    const emailBody = `
        Dear ${contractor_name},

        Your contractor registration with the ID ${customId} has been successfully processed. Below are your details:

        Contractor ID: ${customId}
        Contractor Name: ${contractor_name}
        Firm Name: ${firm_name}
        License Number: ${license_number}
        License Type: ${license_type}
        State: ${state}
        District: ${district}
        Place: ${place}
        Experience: ${experience}
        Interests: ${interests.split(',').join(', ')}
        Mobile Number: ${mobile_number}
        Email: ${email}

        Best regards,
        The Contractor Registration Team
    `;

    // Send email with contractor details (no Excel file attachment)
    const contractorEmail = email;
    const organizationEmail = 'yallaramesh79@gmail.com'; // Replace with the organization's email
    const mailOptions = {
        from: 'trainee6madhavaitsolutions@gmail.com',
        to: [contractorEmail, organizationEmail],
        subject: `Contractor Registration - ${customId}`,
        text: emailBody // Send contractor details in the email body
    };

    return transporter.sendMail(mailOptions);
};


// Fetch and Display Data with Filtering
// Fetch and Display Data with Filtering and Pagination
app.get('/data', (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query; // Get search, page, and limit parameters
    const offset = (page - 1) * limit; // Calculate offset for SQL query
    const searchTerm = `%${search.toLowerCase()}%`;

    const query = `
        SELECT * FROM contractors 
        WHERE LOWER(contractor_name) LIKE ? 
        OR LOWER(firm_name) LIKE ? 
        OR LOWER(license_number) LIKE ? 
        OR LOWER(license_type) LIKE ? 
        OR LOWER(state) LIKE ? 
        OR LOWER(district) LIKE ? 
        OR LOWER(place) LIKE ?
        OR LOWER(mobile_number) LIKE ? 
        OR LOWER(email) LIKE ?
        LIMIT ? OFFSET ?
    `;
    const countQuery = `
        SELECT COUNT(*) AS total FROM contractors 
        WHERE LOWER(contractor_name) LIKE ? 
        OR LOWER(firm_name) LIKE ? 
        OR LOWER(license_number) LIKE ? 
        OR LOWER(license_type) LIKE ? 
        OR LOWER(state) LIKE ? 
        OR LOWER(district) LIKE ? 
        OR LOWER(place) LIKE ?
        OR LOWER(mobile_number) LIKE ? 
        OR LOWER(email) LIKE ?
    `;
    const params = Array(9).fill(searchTerm);
    const paginationParams = [...params, parseInt(limit), offset];

    db.all(query, paginationParams, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            db.get(countQuery, params, (err, countRow) => {
                if (err) {
                    console.error('Error fetching count:', err);
                    res.status(500).send('Error fetching count');
                } else {
                    const formattedRows = rows.map(row => ({
                        ...row,
                        interests: row.interests ? JSON.parse(row.interests) : []
                    }));
                    res.json({
                        contractors: formattedRows,
                        total: countRow.total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(countRow.total / limit)
                    });
                }
            });
        }
    });
});



// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
