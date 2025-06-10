const { pool } = require('../config/db');
const FundingSource = {};

FundingSource.addFundingSource = async (data) => {
    const {
        name,
        dev_partner,
        grant_amount,
        loan_amount,
        counterpart_funding,
        non_grant_instrument
    } = data;

    const query = `
        INSERT INTO FundingSource (
            name, dev_partner, grant_amount, loan_amount, counterpart_funding, non_grant_instrument
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [name, dev_partner, grant_amount, loan_amount, counterpart_funding, non_grant_instrument];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

FundingSource.getAllFundingSources = async () => {
    const { rows } = await pool.query('SELECT * FROM FundingSource');
    return rows;
};


module.exports = FundingSource;
