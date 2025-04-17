const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const { employee } = require('./routes/employes');
const authMiddleware = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.get('/employee/:id', async (req, res) => {
    const { id } = req.params;

    // Optional: Ensure the requested ID matches the JWT payload
    if (req.user.id !== id) return res.status(403).json({ msg: 'Forbidden' });

    const emp = await db.query('SELECT * FROM employees WHERE employee_id = $1', [id]);
    res.json(emp.rows[0]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const bcrypt = require('bcrypt')
// bcrypt.hash("emp123", 10).then(console.log);