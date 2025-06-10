const { pool } = require('../config/db');
const Agency = {};

Agency.addAgency = async ({ name, type }) => {
    const query = `INSERT INTO Agency (name, type) VALUES ($1, $2) RETURNING *`;
    const values = [name, type];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = Agency;
