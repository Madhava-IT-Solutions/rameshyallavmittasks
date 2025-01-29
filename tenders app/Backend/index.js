const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const homeRoutes = require("./routes/home");
const applyRoutes = require("./routes/apply");
const loginRoutes = require("./routes/login");
const registrationsRoutes = require("./routes/registrations");
const app = express();
const port = 3001;

const multer = require('multer');
const upload = multer();
app.use(upload.any());

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/login", loginRoutes);
app.use("/apply", applyRoutes);
app.use("/home", homeRoutes);
app.use("/registrations", registrationsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Server error occurred");
});



// Start server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});