const { pool } = require('../config/db');
const Location = {};

Location.addLocation = async ({ name, region }) => {
    const query = `INSERT INTO Location (name, region) VALUES ($1, $2) RETURNING *`;
    const values = [name, region];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = Location;
