const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
const uploadsDir = path.join(__dirname, 'uploads');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index2.html')); // Adjust path to your HTML file
});

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Ensure uploads directory exists

const db = new sqlite3.Database('tenders2.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tenders (
    id TEXT PRIMARY KEY,
    name_of_work TEXT,
    area TEXT,
    plinth_area TEXT,
    state TEXT,
    district TEXT,
    place TEXT,
    nature_of_work TEXT,
    tender_published_on TEXT,
    tender_response_by TEXT,
    boq_file TEXT
  )`);
});

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

// API route to handle form submission
app.post('/api/submit', upload.single('boq_file'), (req, res) => {
  const {
    name_of_work,
    area,
    plinth_area,
    state,
    district,
    place,
    nature_of_work,
    tender_published_on,
    tender_response_by,
  } = req.body;

  const boq_file = req.file ? req.file.filename : null;

  db.get("SELECT COUNT(*) AS count FROM tenders", (err, row) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    const count = row.count;
    const tenderId = `K${String(count + 1).padStart(5, '0')}`;

    db.run(
      `INSERT INTO tenders (id, name_of_work, area, plinth_area, state, district, place, nature_of_work, tender_published_on, tender_response_by, boq_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tenderId,
        name_of_work,
        area,
        plinth_area,
        state,
        district,
        place,
        nature_of_work,
        tender_published_on,
        tender_response_by,
        boq_file,
      ],
      (err) => {
        if (err) {
          return res.status(500).send('Failed to insert data');
        }
        res.send({ message: 'Tender submitted successfully', tenderId });
      }
    );
  });
});




app.get('/api/search', (req, res) => {
  const { query } = req.query;

  db.all(
    `SELECT * FROM tenders WHERE 
      id LIKE ? OR
      name_of_work LIKE ? OR
      state LIKE ? OR
      district LIKE ? OR
      place LIKE ? OR
      nature_of_work LIKE ?`,
    Array(6).fill(`%${query}%`),
    (err, rows) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.json(rows);
    }
  );
});




// API route to fetch tenders
app.get('/api/tenders', (req, res) => {
  db.all("SELECT * FROM tenders", (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  const serverURL = process.env.NODE_ENV === 'production' 
    ? 'https://tenders-4ezx.onrender.com' 
    : `http://localhost:${PORT}`;
  console.log(`Server is running on ${serverURL}`);
});

