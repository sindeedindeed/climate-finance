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

User.getAllUser = async () =>{
    const response = await pool.query('SELECT * FROM users')
    return response.rows[0];
}

User.deleteUserById = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

User.updateUserById = async (id, updates) => {
    const keys = Object.keys(updates);
    if (keys.length === 0) {
        throw new Error("No fields provided for update.");
    }

    // Build query dynamically
    const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(", ");
    const values = [...Object.values(updates), id];

    const query = `
    UPDATE users
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

    const result = await pool.query(query, values);
    return result.rows[0];
};


module.exports = User
