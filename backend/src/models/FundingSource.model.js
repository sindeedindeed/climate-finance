const { pool } = require('../config/db');
const FundingSource = {};

FundingSource.addFundingSource = async (data) => {
    const {
        name,
        dev_partner,
        grant_amount,
        type,
        loan_amount,
        counterpart_funding,
        disbursement,
        non_grant_instrument
    } = data;

    const query = `
        INSERT INTO FundingSource (
            name, dev_partner, type, grant_amount, loan_amount, counterpart_funding, disbursement, non_grant_instrument
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const values = [name, dev_partner, type, grant_amount, loan_amount, counterpart_funding, disbursement, non_grant_instrument];
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

FundingSource.getFundingSourceById = async (id) => {
    const client = await pool.connect();
    try {
        // Get basic funding source data
        const fundingSourceQuery = `
            SELECT * FROM FundingSource WHERE funding_source_id = $1
        `;
        const fundingSourceResult = await client.query(fundingSourceQuery, [id]);
        
        if (fundingSourceResult.rows.length === 0) {
            return null;
        }
        
        const fundingSource = fundingSourceResult.rows[0];
        
        // Get related sectors from projects using this funding source
        const sectorsQuery = `
            SELECT DISTINCT p.sector
            FROM Project p
            INNER JOIN ProjectFundingSource pfs ON p.project_id = pfs.project_id
            WHERE pfs.funding_source_id = $1 AND p.sector IS NOT NULL
            ORDER BY p.sector
        `;
        const sectorsResult = await client.query(sectorsQuery, [id]);
        
        // Get count of active projects
        const activeProjectsQuery = `
            SELECT COUNT(DISTINCT p.project_id) AS active_projects
            FROM Project p
            INNER JOIN ProjectFundingSource pfs ON p.project_id = pfs.project_id
            WHERE pfs.funding_source_id = $1
        `;
        const activeProjectsResult = await client.query(activeProjectsQuery, [id]);
        
        return {
            ...fundingSource,
            sectors: sectorsResult.rows.map(row => row.sector),
            active_projects: parseInt(activeProjectsResult.rows[0]?.active_projects || 0)
        };
        
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

module.exports = FundingSource;
