const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const pool = require('./db');

app.use('/api/auth', authRoutes);
app.get('/employee/:id', async (req, res) => {
    const id = req.params.id.trim();
  
    try {
      const result = await pool.query(
        'SELECT * FROM employees WHERE employee_id = $1',
        [id]  // id is passed as a parameter, safe from SQL injection
      );
      
      console.log(result)
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.json(result.rows[0]); // send the employee object as JSON
    } catch (err) {
      console.error('Error retrieving employee:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const bcrypt = require('bcrypt')
// bcrypt.hash("emp123", 10).then(console.log);