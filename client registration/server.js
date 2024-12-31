const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Create a database or open an existing one
const db = new sqlite3.Database('./registration.db');

// Middleware
app.use(express.static('public'));  // Serve static files from the 'public' folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
// Serve client registration form
app.get('/client_registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create the clients table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT,
    organisation_name TEXT,
    state TEXT,
    district TEXT,
    place TEXT,
    experience INTEGER,
    boq_file TEXT
)`);

// File upload configuration for client registration
const clientStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const clientUpload = multer({ storage: clientStorage });

// Route to handle client registration form submission
app.post('/submit-client', clientUpload.single('boq_file'), (req, res) => {
    const { client_name, organisation_name, state, district, place, experience } = req.body;
    const boq_file = req.file ? req.file.filename : null;

    db.run(
        `INSERT INTO clients (client_name, organisation_name, state, district, place, experience, boq_file) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [client_name, organisation_name, state, district, place, experience, boq_file],
        (err) => {
            if (err) {
                console.error("Error saving client data:", err);
                res.status(500).send("Error saving data");
            } else {
                res.redirect("/client_registration.html");
            }
        }
    );
});

// Fetch clients with pagination and search
app.get('/data-clients', (req, res) => {
    const { search = '', page = 1 } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    let searchQuery = '';
    const params = [];

    if (search) {
        searchQuery = `WHERE client_name LIKE ? OR organisation_name LIKE ?`;
        params.push(`%${search}%`, `%${search}%`);
    }

    db.all(
        `SELECT * FROM clients ${searchQuery} LIMIT ? OFFSET ?`,
        [...params, limit, offset],
        (err, rows) => {
            if (err) {
                console.error("Error fetching clients:", err);
                res.status(500).send("Error fetching data");
                return;
            }

            db.get(
                `SELECT COUNT(*) AS count FROM clients ${searchQuery}`,
                params,
                (err, countResult) => {
                    if (err) {
                        console.error("Error counting clients:", err);
                        res.status(500).send("Error counting data");
                        return;
                    }

                    const totalPages = Math.ceil(countResult.count / limit);
                    res.json({ clients: rows, totalPages });
                }
            );
        }
    );
});

// Serve the registration form (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
