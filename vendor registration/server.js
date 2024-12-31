const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Serve HTML file

// Database Setup
const db = new sqlite3.Database('./vendors2.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS vendors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendor_name TEXT,
            firm_name TEXT,
            gst_number TEXT,
            state TEXT,
            district TEXT,
            place TEXT,
            experience INTEGER,
            materials TEXT,
            gst_certificate TEXT 
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

// Submit Vendor Data
app.post('/submit-vendor', upload.single('gst_certificate'), (req, res) => {
    const { vendor_name, firm_name, gst_number, state, district, place, experience, materials } = req.body;
    const gst_certificate = req.file ? req.file.filename : null; // Save the uploaded file's name

    let materialsArray = Array.isArray(materials) ? materials : materials ? [materials] : [];
    const materialsJson = JSON.stringify(materialsArray);

    db.run(
        `INSERT INTO vendors (vendor_name, firm_name, gst_number, state, district, place, experience, materials, gst_certificate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            vendor_name,
            firm_name,
            gst_number,
            state,
            district,
            place,
            experience,
            materialsJson,
            gst_certificate
        ],
        (err) => {
            if (err) {
                console.error('Error saving to database:', err);
                res.status(500).send('Error saving data');
            } else {
                res.redirect('/');
            }
        }
    );
});

// Update /data-vendors endpoint to include the file path
app.get('/data-vendors', (req, res) => {
    const { search = '', page = 1 } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    let searchQuery = '';
    let params = [];

    if (search) {
        searchQuery = `WHERE vendor_name LIKE ? OR firm_name LIKE ? OR gst_number LIKE ?`;
        params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    db.all(`
        SELECT * FROM vendors ${searchQuery} 
        LIMIT ? OFFSET ?`, 
        [...params, limit, offset],
        (err, rows) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).send('Error fetching data');
            }

            db.get('SELECT COUNT(*) AS count FROM vendors', (err, countResult) => {
                if (err) {
                    console.error('Error counting vendors:', err);
                    return res.status(500).send('Error counting vendors');
                }

                const totalVendors = countResult.count;
                const totalPages = Math.ceil(totalVendors / limit);

                const formattedRows = rows.map(row => ({
                    ...row,
                    materials: row.materials ? JSON.parse(row.materials) : []
                }));

                res.json({ vendors: formattedRows, totalPages });
            });
        }
    );
});
// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
