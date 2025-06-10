const { pool } = require('../config/db');
const FocalArea = {};

FocalArea.addFocalArea = async ({ name }) => {
    const query = `INSERT INTO FocalArea (name) VALUES ($1) RETURNING *`;
    const { rows } = await pool.query(query, [name]);
    return rows[0];
};

module.exports = FocalArea;
