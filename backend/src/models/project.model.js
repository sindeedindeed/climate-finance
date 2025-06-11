const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Project = {};

Project.addProjectWithRelations = async (data) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            title,
            type,
            sector,
            division,
            status,
            approval_fy,
            beginning,
            closing,
            total_cost_usd,
            gef_grant,
            cofinancing,
            wash_finance,
            wash_finance_percent,
            beneficiaries,
            objectives,
            agency_ids = [],
            location_ids = [],
            funding_source_ids = [],
            focal_area_ids = [],
            wash_component
        } = data;

        const project_id = uuidv4(); // 🔑 Generate project ID

        const insertProjectQuery = `
            INSERT INTO Project (
                project_id, title, type, sector, division, status, approval_fy, beginning, closing,
                total_cost_usd, gef_grant, cofinancing, wash_finance,
                wash_finance_percent, beneficiaries, objectives
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        `;
        const values = [
            project_id, title, type, sector, division, status, approval_fy, beginning, closing,
            total_cost_usd, gef_grant, cofinancing, wash_finance,
            wash_finance_percent, beneficiaries, objectives
        ];
        await client.query(insertProjectQuery, values);

        // Optional WASHComponent
        if (wash_component) {
            const { presence, water_supply_percent, sanitation_percent, public_admin_percent } = wash_component;
            const insertWASH = `
                INSERT INTO WASHComponent (
                    project_id, presence, water_supply_percent, sanitation_percent, public_admin_percent
                ) VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(insertWASH, [
                project_id,
                presence,
                water_supply_percent || 0,
                sanitation_percent || 0,
                public_admin_percent || 0
            ]);
        }

        for (const agency_id of agency_ids) {
            await client.query(
                'INSERT INTO ProjectAgency (project_id, agency_id) VALUES ($1, $2)',
                [project_id, agency_id]
            );
        }

        for (const location_id of location_ids) {
            await client.query(
                'INSERT INTO ProjectLocation (project_id, location_id) VALUES ($1, $2)',
                [project_id, location_id]
            );
        }

        for (const funding_source_id of funding_source_ids) {
            await client.query(
                'INSERT INTO ProjectFundingSource (project_id, funding_source_id) VALUES ($1, $2)',
                [project_id, funding_source_id]
            );
        }

        for (const focal_area_id of focal_area_ids) {
            await client.query(
                'INSERT INTO ProjectFocalArea (project_id, focal_area_id) VALUES ($1, $2)',
                [project_id, focal_area_id]
            );
        }

        await client.query('COMMIT');
        return { project_id }; // Return the auto-generated ID
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

Project.getAllProjects = async () => {
    const query = `
                SELECT p.*, wc.* 
                FROM Project p
                INNER JOIN WASHComponent wc ON p.project_id = wc.project_id
                `
    const { rows } = await pool.query(query);
    return rows;
};

Project.updateProject = async (id, data) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

    const query = `UPDATE Project SET ${setClause} WHERE project_id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
};

Project.deleteProject = async (id) => {
    await pool.query('DELETE FROM Project WHERE project_id = $1', [id]);
};

Project.getProjectById = async (id) => {
    const query = `
            SELECT p.*, wc.*  
            FROM Project p
            INNER JOIN WASHComponent wc ON p.project_id = wc.project_id 
            WHERE p.project_id = $1
        `
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

Project.getProjectsOverviewStats = async () => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM Project) AS total_projects,
                (SELECT COUNT(*) FROM Project WHERE now() BETWEEN beginning AND closing) AS active_projects,
                (SELECT COUNT(*) FROM Project WHERE status IN('Implemented')) AS completed_projects,
                (SELECT COALESCE(SUM(total_cost_usd), 0) FROM Project) AS total_investment
        `;

        const trendQuery = `
            SELECT
                COUNT(*) AS total_projects,
                COUNT(*) FILTER (WHERE now() BETWEEN beginning AND closing) AS active_projects,
                    COUNT(*) FILTER (WHERE status IN ('Implemented')) AS completed_projects,
                    COALESCE(SUM(total_cost_usd), 0) AS total_investment
            FROM Project
            WHERE approval_fy = EXTRACT(YEAR FROM CURRENT_DATE)
        `;

        const result = await client.query(query);
        const trendResult = await client.query(trendQuery);

        return {
            ...result.rows[0],
            current_year: trendResult.rows
        };
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

Project.getProjectByStatus = async () => {
    const query = `
        SELECT status, COUNT(*) AS value
        FROM Project
        GROUP BY status
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => ({
        name: row.status,
        value: parseInt(row.value)
    }));
};

Project.getProjectBySector = async () => {
    const query = `
        SELECT sector, COUNT(*) AS value
        FROM Project
        GROUP BY sector
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => ({
        name: row.sector,
        value: parseInt(row.value)
    }));
};

Project.getProjectByType = async () => {
    const query = `
        SELECT type, COUNT(*) AS value
        FROM Project
        GROUP BY "type"
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => ({
        name: row.type,
        value: parseInt(row.value)
    }));
};

Project.getProjectTrend = async () => {
    const query = `
        SELECT 
            approval_fy AS year,
            COUNT(*) AS total_projects
        FROM Project
        GROUP BY approval_fy
        ORDER BY approval_fy
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => ({
        year: row.year.toString(),
        projects: parseInt(row.total_projects)
    }));
};

Project.getFundingSourceOverviewStats = async () => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT
                    (SELECT SUM(total_cost_usd) FROM Project) AS total_climate_finance,
                    (SELECT COUNT(DISTINCT fs.funding_source_id)
                     FROM Project p
                              INNER JOIN ProjectFundingSource pfs ON p.project_id = pfs.project_id
                              INNER JOIN FundingSource fs ON pfs.funding_source_id = fs.funding_source_id
                     WHERE p.status != 'Implemented'
                    ) AS active_funding_source,
                (SELECT COALESCE(SUM(gef_grant), 0) FROM Project) AS committed_funds,
                (SELECT COALESCE(SUM(disbursement), 0) FROM Project) AS disbursed_funds
        `;


        const trendQuery = `
            SELECT
                SUM(p.total_cost_usd) AS total_finance,
                (
                    SELECT COUNT(DISTINCT fs.funding_source_id)
                    FROM Project p2
                             INNER JOIN ProjectFundingSource pfs ON p2.project_id = pfs.project_id
                             INNER JOIN FundingSource fs ON pfs.funding_source_id = fs.funding_source_id
                    WHERE p2.status != 'Implemented'
                    AND p2.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE)
                    ) AS active_funding_source,
                COALESCE(SUM(p.gef_grant), 0) AS committed_funds,
                COALESCE(SUM(p.disbursement), 0) AS disbursed_funds
            FROM Project p
            WHERE p.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE);
        `;


        const result = await client.query(query);
        const trendResult = await client.query(trendQuery);

        return {
            ...result.rows[0],
            current_year: trendResult.rows
        };
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

Project.getFundingSourceTrend = async () => {
    const query = `
        SELECT 
            approval_fy AS year,
            SUM(gef_grant) AS gef_grant
        FROM Project
        GROUP BY approval_fy
        ORDER BY approval_fy
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => ({
        year: row.year.toString(),
        gef_grant: parseInt(row.gef_grant)
    }));
};

Project.getFundingSourceSectorAllocation = async () => {
    const query = `
        SELECT 
            sector AS sector,
            SUM(gef_grant) AS gef_grant
        FROM Project
        GROUP BY sector
        ORDER BY sector
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => ({
        sector: row.sector.toString(),
        gef_grant: parseInt(row.gef_grant)
    }));
};

Project.getFundingSource = async () => {
    const query = `
        SELECT
            fs.*,
            COUNT(DISTINCT p.project_id) AS active_projects,
            STRING_AGG(DISTINCT p.sector, ', ') AS sectors
        FROM Project p
                 INNER JOIN ProjectFundingSource pfs ON p.project_id = pfs.project_id
                 INNER JOIN FundingSource fs ON pfs.funding_source_id = fs.funding_source_id
        GROUP BY fs.funding_source_id;

        
    `;
    const { rows } = await pool.query(query);
    return rows;
};


module.exports = Project;
