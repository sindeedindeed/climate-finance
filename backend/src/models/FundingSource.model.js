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

FundingSource.updateFundingSource = async (id, data) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE FundingSource SET ${setClause} WHERE funding_source_id = $${fields.length + 1} RETURNING *`;
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0];
};

FundingSource.deleteFundingSource = async (id) => {
    await pool.query('DELETE FROM FundingSource WHERE funding_source_id = $1', [id]);
};



module.exports = FundingSource;
