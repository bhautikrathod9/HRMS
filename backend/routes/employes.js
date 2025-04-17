exports.employee = async (req, res) => {
    const { id } = req.params;
    const employee = await db.query('SELECT * FROM employees WHERE employee_id = $1', [id]);
    res.json(employee.rows[0]);
};
  