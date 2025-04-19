const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const pool = require('../db'); // Your PostgreSQL pool
const express = require('express')
const app = express.Router();
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.YOUR_CLOUD_NAME,
  api_key: process.env.YOUR_API_KEY,
  api_secret: process.env.YOUR_API_SECRET,
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'employee_photos', // Optional folder in your cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  },
});

const upload = multer({ storage });

app.post('/employee/upload/:id', upload.single('photo'), async (req, res) => {
  const employeeId = req.params.id;
  const photoUrl = req.file.path; // Cloudinary returns full URL

  try {
    await pool.query(
      'UPDATE employees SET photo_url = $1 WHERE employee_id = $2',
      [photoUrl, employeeId]
    );
    res.json({ success: true, photoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving photo URL' });
  }
});

module.exports = app;