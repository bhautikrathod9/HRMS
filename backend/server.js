const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db')

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const { employee } = require('./routes/employes');
const authMiddleware = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const bcrypt = require('bcrypt')
// bcrypt.hash("emp123", 10).then(console.log);