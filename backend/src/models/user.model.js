const {pool} = require('../config/db')

const User = {};

User.create = async (username, email, password, role, department, active) => {
    const query = `
    INSERT INTO users (username, email, password, role, department, active)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
    const values = [username, email, password, role, department, active];
    const result = await pool.query(query, values);
    return result.rows[0];
};

User.getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

User.updateLastLogin = async (userId) => {
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
};

module.exports = User
