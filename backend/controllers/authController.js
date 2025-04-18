const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { employeeId, password } = req.body;

  // Validation
  if (!employeeId || !password) {
    return res.status(400).json({ error: 'Employee ID and password are required' });
  }

  try {
    // Check if employee exists
    const result = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [employeeId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token (optional)
    const token = jwt.sign({ employeeId: user.employee_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      employee: {
        employeeId: user.employee_id,
        name: user.name,
        jobTitle: user.job_title,
        employmentType: user.employment_type,
        contactNumber: user.contact_number,
        jobLocation: user.job_location,
        dateOfJoining: user.date_of_joining,
        address: user.address,
        photo: user.photo_url, // Assuming this is stored
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.signUpUser = async (req, res) => {
  const { name, employeeId, password } = req.body;

  // Input validation
  if (!name || !employeeId || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM employees WHERE employee_id = $1',
      [employeeId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Employee already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    await pool.query(
      'INSERT INTO employees (name, employee_id, password) VALUES ($1, $2, $3)',
      [name, employeeId, hashedPassword]
    );

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
}


