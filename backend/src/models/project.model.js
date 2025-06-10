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
                project_id, title, type, status, approval_fy, beginning, closing,
                total_cost_usd, gef_grant, cofinancing, wash_finance,
                wash_finance_percent, beneficiaries, objectives
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        `;
        const values = [
            project_id, title, type, status, approval_fy, beginning, closing,
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



module.exports = Project;
