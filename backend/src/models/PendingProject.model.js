// Use local database for development, PostgreSQL for production
const dbConfig =
    process.env.NODE_ENV === "production"
        ? require("../config/db")
        : require("../config/db-local");

const { v4: uuidv4 } = require("uuid");

const PendingProject = {};

PendingProject.addPendingProject = async (data) => {
    if (process.env.NODE_ENV === "production") {
        // PostgreSQL implementation
        const { pool } = dbConfig;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

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
                submitter_email,
                agency_ids = [],
                location_ids = [],
                funding_source_ids = [],
                focal_area_ids = [],
                wash_component,
            } = data;

            const insertPendingProjectQuery = `
                INSERT INTO PendingProject (
                    title, type, sector, division, status, approval_fy, beginning, closing,
                    total_cost_usd, gef_grant, cofinancing, wash_finance,
                    wash_finance_percent, beneficiaries, objectives, submitter_email,
                    agency_ids, location_ids, funding_source_ids, focal_area_ids, wash_component
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
                RETURNING *
            `;

            const values = [
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
                submitter_email,
                agency_ids,
                location_ids,
                funding_source_ids,
                focal_area_ids,
                wash_component ? JSON.stringify(wash_component) : null,
            ];

            const result = await client.query(
                insertPendingProjectQuery,
                values
            );

            await client.query("COMMIT");
            return result.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    } else {
        // SQLite implementation
        const db = dbConfig.getDB();
        return new Promise((resolve, reject) => {
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
                submitter_email,
                agency_ids = [],
                location_ids = [],
                funding_source_ids = [],
                focal_area_ids = [],
                wash_component,
            } = data;

            const query = `
                INSERT INTO PendingProject (
                    title, type, sector, division, status, approval_fy, beginning, closing,
                    total_cost_usd, gef_grant, cofinancing, wash_finance,
                    wash_finance_percent, beneficiaries, objectives, submitter_email,
                    agency_ids, location_ids, funding_source_ids, focal_area_ids, wash_component
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
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
                submitter_email,
                JSON.stringify(agency_ids),
                JSON.stringify(location_ids),
                JSON.stringify(funding_source_ids),
                JSON.stringify(focal_area_ids),
                wash_component ? JSON.stringify(wash_component) : null,
            ];

            db.run(query, values, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ pending_id: this.lastID });
                }
            });
        });
    }
};

PendingProject.getAllPendingProjects = async () => {
    if (process.env.NODE_ENV === "production") {
        // PostgreSQL implementation
        const { pool } = dbConfig;
        const query = `
            SELECT * FROM PendingProject 
            ORDER BY submitted_at DESC
        `;
        const { rows } = await pool.query(query);
        return rows;
    } else {
        // SQLite implementation
        const db = dbConfig.getDB();
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM PendingProject 
                ORDER BY submitted_at DESC
            `;
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
};

PendingProject.getPendingProjectById = async (id) => {
    if (process.env.NODE_ENV === "production") {
        // PostgreSQL implementation
        const { pool } = dbConfig;
        const query = `
            SELECT * FROM PendingProject 
            WHERE pending_id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } else {
        // SQLite implementation
        const db = dbConfig.getDB();
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM PendingProject 
                WHERE pending_id = ?
            `;
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
};

PendingProject.deletePendingProject = async (id) => {
    if (process.env.NODE_ENV === "production") {
        // PostgreSQL implementation
        const { pool } = dbConfig;
        const query = `
            DELETE FROM PendingProject 
            WHERE pending_id = $1 
            RETURNING *
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } else {
        // SQLite implementation
        const db = dbConfig.getDB();
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM PendingProject 
                WHERE pending_id = ?
            `;
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }
};

PendingProject.approveProject = async (pendingId) => {
    if (process.env.NODE_ENV === "production") {
        // PostgreSQL implementation
        const { pool } = dbConfig;
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Get the pending project
            const pendingProject = await PendingProject.getPendingProjectById(
                pendingId
            );
            if (!pendingProject) {
                throw new Error("Pending project not found");
            }

            // Generate new project ID
            const project_id = uuidv4();

            // Insert into main Project table
            const insertProjectQuery = `
                INSERT INTO Project (
                    project_id, title, type, sector, division, status, approval_fy, beginning, closing,
                    total_cost_usd, gef_grant, cofinancing, wash_finance,
                    wash_finance_percent, beneficiaries, objectives
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
                RETURNING *
            `;

            const projectValues = [
                project_id,
                pendingProject.title,
                pendingProject.type,
                pendingProject.sector,
                pendingProject.division,
                pendingProject.status,
                pendingProject.approval_fy,
                pendingProject.beginning,
                pendingProject.closing,
                pendingProject.total_cost_usd,
                pendingProject.gef_grant,
                pendingProject.cofinancing,
                pendingProject.wash_finance,
                pendingProject.wash_finance_percent,
                pendingProject.beneficiaries,
                pendingProject.objectives,
            ];

            const projectResult = await client.query(
                insertProjectQuery,
                projectValues
            );
            const approvedProject = projectResult.rows[0];
            // Insert WASH component if exists
            if (pendingProject.wash_component["presence"]) {
                const {
                    presence,
                    water_supply_percent,
                    sanitation_percent,
                    public_admin_percent,
                } = pendingProject.wash_component;

                const washQuery = `
                    INSERT INTO WASHComponent (project_id, presence, water_supply_percent, sanitation_percent, public_admin_percent)
                    VALUES ($1, $2, $3, $4, $5)
                `;
                await client.query(washQuery, [
                    project_id,
                    presence,
                    water_supply_percent,
                    sanitation_percent,
                    public_admin_percent,
                ]);
            }

            // Insert relationships if they exist
            if (
                pendingProject.agency_ids &&
                pendingProject.agency_ids.length > 0
            ) {
                for (const agencyId of pendingProject.agency_ids) {
                    await client.query(
                        "INSERT INTO ProjectAgency (project_id, agency_id) VALUES ($1, $2)",
                        [project_id, agencyId]
                    );
                }
            }

            if (
                pendingProject.location_ids &&
                pendingProject.location_ids.length > 0
            ) {
                for (const locationId of pendingProject.location_ids) {
                    await client.query(
                        "INSERT INTO ProjectLocation (project_id, location_id) VALUES ($1, $2)",
                        [project_id, locationId]
                    );
                }
            }

            if (
                pendingProject.funding_source_ids &&
                pendingProject.funding_source_ids.length > 0
            ) {
                for (const fundingSourceId of pendingProject.funding_source_ids) {
                    await client.query(
                        "INSERT INTO ProjectFundingSource (project_id, funding_source_id) VALUES ($1, $2)",
                        [project_id, fundingSourceId]
                    );
                }
            }

            if (
                pendingProject.focal_area_ids &&
                pendingProject.focal_area_ids.length > 0
            ) {
                for (const focalAreaId of pendingProject.focal_area_ids) {
                    await client.query(
                        "INSERT INTO ProjectFocalArea (project_id, focal_area_id) VALUES ($1, $2)",
                        [project_id, focalAreaId]
                    );
                }
            }

            // Delete from pending projects
            await client.query(
                "DELETE FROM PendingProject WHERE pending_id = $1",
                [pendingId]
            );

            await client.query("COMMIT");
            return approvedProject;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    } else {
        // SQLite implementation - simplified for now
        const db = dbConfig.getDB();
        return new Promise((resolve, reject) => {
            // For now, just delete the pending project
            const query = `DELETE FROM PendingProject WHERE pending_id = ?`;
            db.run(query, [pendingId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ approved: this.changes > 0 });
                }
            });
        });
    }
};

module.exports = PendingProject;
