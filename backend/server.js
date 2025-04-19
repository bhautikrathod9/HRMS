const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authMiddleware = require('./middleware/authMiddleware')
const authRoutes = require('./routes/auth');
const cloudinaryRoutes = require('./utils/cloudnary')
const pool = require('./db');

app.use('/api/auth', authRoutes);
app.get('/employee/:id', authMiddleware, async (req, res) => {
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
app.put('/address/:id', async (req, res) => {
     const id = req.params.id.trim(); // Get the employee ID from the URL parameters
    const { line1, city, state, zip } = req.body; // Destructure the address fields from the request body

    // Validate the input
    if (!line1 || !city || !state || !zip) {
        return res.status(400).json({ message: 'All address fields are required.' });
    }

    // Construct the full address
    const fullAddress = `${line1}, ${city}, ${state}, ${zip}`;

    try {
        // Update the address in the database
        const result = await pool.query(
            `UPDATE employees
            SET address = $1
            WHERE employee_id = $2
            RETURNING *`,
            [fullAddress, id] // Use 'id' instead of 'employeeId'
        );

        // Check if the employee was found and updated
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Respond with the updated employee information
        res.json({ message: 'Address updated successfully'});
    } catch (err) {
        console.error('Error updating address:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.use(cloudinaryRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const bcrypt = require('bcrypt')
// bcrypt.hash("emp123", 10).then(console.log);