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
            wash_component,
            hotspot_vulnerability_type,
            wash_component_description,
            direct_beneficiaries,
            indirect_beneficiaries,
            beneficiary_description,
            gender_inclusion,
            equity_marker,
            equity_marker_description,
            assessment,
            alignment_sdg = [],
            alignment_nap,
            alignment_cff,
            geographic_division,
            districts = [],
            climate_relevance_score,
            climate_relevance_category,
            climate_relevance_justification
        } = data;

        const project_id = uuidv4(); // 🔑 Generate project ID

        const insertProjectQuery = `
            INSERT INTO Project (
                project_id, title, type, sector, division, status, approval_fy, beginning, closing,
                total_cost_usd, gef_grant, cofinancing, wash_finance,
                wash_finance_percent, beneficiaries, objectives,
                hotspot_vulnerability_type, wash_component_description, direct_beneficiaries,
                indirect_beneficiaries, beneficiary_description, gender_inclusion, equity_marker,
                equity_marker_description, assessment, alignment_nap, alignment_cff,
                geographic_division, districts, climate_relevance_score, climate_relevance_category, climate_relevance_justification
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32)
        `;
        const values = [
            project_id, title, type, sector, division, status, approval_fy, beginning, closing,
            total_cost_usd, gef_grant, cofinancing, wash_finance,
            wash_finance_percent, beneficiaries, objectives,
            hotspot_vulnerability_type, wash_component_description, direct_beneficiaries,
            indirect_beneficiaries, beneficiary_description, gender_inclusion, equity_marker,
            equity_marker_description, assessment, alignment_nap, alignment_cff,
            geographic_division, districts, climate_relevance_score, climate_relevance_category, climate_relevance_justification
        ];
        await client.query(insertProjectQuery, values);

        // Always update/create WASHComponent record (required for data consistency)
        const washData = wash_component || { 
            presence: false, 
            water_supply_percent: 0, 
            sanitation_percent: 0, 
            public_admin_percent: 0,
            wash_percentage: 0,
            description: ''
        };
        const { presence, water_supply_percent, sanitation_percent, public_admin_percent, wash_percentage, description } = washData;
        
        const insertWASH = `
            INSERT INTO WASHComponent (
                project_id, presence, water_supply_percent, sanitation_percent, public_admin_percent,
                wash_percentage, description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await client.query(insertWASH, [
            project_id,
            presence,
            water_supply_percent || 0,
            sanitation_percent || 0,
            public_admin_percent || 0,
            wash_percentage || 0,
            description || ''
        ]);

        for (const agency_id of agency_ids) {
            await client.query(
                'INSERT INTO ProjectAgency (project_id, agency_id) VALUES ($1, $2)',
                [project_id, agency_id]
            );
        }

        // Handle SDG relationships
        for (const sdg_id of alignment_sdg) {
            await client.query(
                'INSERT INTO ProjectSDG (project_id, sdg_id) VALUES ($1, $2)',
                [project_id, sdg_id]
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
    const client = await pool.connect();
    try {
        // Get basic project data with WASH component
        const projectQuery = `
            SELECT 
                p.project_id,
                p.title,
                p.type,
                p.sector,
                p.division,
                p.status,
                p.approval_fy,
                p.beginning,
                p.closing,
                p.total_cost_usd,
                p.gef_grant,
                p.cofinancing,
                p.wash_finance,
                p.wash_finance_percent,
                p.beneficiaries,
                p.objectives,
                p.hotspot_vulnerability_type,
                p.wash_component_description,
                p.direct_beneficiaries,
                p.indirect_beneficiaries,
                p.beneficiary_description,
                p.gender_inclusion,
                p.equity_marker,
                p.equity_marker_description,
                p.assessment,
                p.alignment_nap,
                p.alignment_cff,
                p.geographic_division,
                p.districts,
                p.climate_relevance_score,
                p.climate_relevance_category,
                p.climate_relevance_justification,
                wc.presence as wash_presence,
                wc.water_supply_percent,
                wc.sanitation_percent,
                wc.public_admin_percent,
                wc.wash_percentage,
                wc.description as wash_description
            FROM Project p
            LEFT JOIN WASHComponent wc ON p.project_id = wc.project_id
        `;
        const projectResult = await client.query(projectQuery);
        
        // Get all project-agency relationships
        const agencyQuery = `
            SELECT pa.project_id, pa.agency_id, a.name as agency_name
            FROM ProjectAgency pa
            INNER JOIN Agency a ON pa.agency_id = a.agency_id
        `;
        const agencyResult = await client.query(agencyQuery);
        
        // Get all project-funding source relationships
        const fundingSourceQuery = `
            SELECT pfs.project_id, pfs.funding_source_id, fs.name as funding_source_name
            FROM ProjectFundingSource pfs
            INNER JOIN FundingSource fs ON pfs.funding_source_id = fs.funding_source_id
        `;
        const fundingSourceResult = await client.query(fundingSourceQuery);
        
        // Create lookup maps for quick access
        const agencyMap = {};
        const fundingSourceMap = {};
        
        agencyResult.rows.forEach(row => {
            if (!agencyMap[row.project_id]) {
                agencyMap[row.project_id] = [];
            }
            agencyMap[row.project_id].push({
                agency_id: row.agency_id,
                name: row.agency_name
            });
        });
        
        fundingSourceResult.rows.forEach(row => {
            if (!fundingSourceMap[row.project_id]) {
                fundingSourceMap[row.project_id] = [];
            }
            fundingSourceMap[row.project_id].push({
                funding_source_id: row.funding_source_id,
                name: row.funding_source_name
            });
        });
        
        // Transform the results to include related data
        return projectResult.rows.map(row => {
            const projectAgencies = agencyMap[row.project_id] || [];
            const projectFundingSources = fundingSourceMap[row.project_id] || [];
            
            return {
                project_id: row.project_id,
                title: row.title,
                type: row.type,
                sector: row.sector,
                division: row.division,
                status: row.status,
                approval_fy: row.approval_fy,
                beginning: row.beginning,
                closing: row.closing,
                total_cost_usd: row.total_cost_usd,
                gef_grant: row.gef_grant,
                cofinancing: row.cofinancing,
                wash_finance: row.wash_finance,
                wash_finance_percent: row.wash_finance_percent,
                beneficiaries: row.beneficiaries,
                objectives: row.objectives,
                // New fields
                hotspot_vulnerability_type: row.hotspot_vulnerability_type,
                wash_component_description: row.wash_component_description,
                direct_beneficiaries: row.direct_beneficiaries,
                indirect_beneficiaries: row.indirect_beneficiaries,
                beneficiary_description: row.beneficiary_description,
                gender_inclusion: row.gender_inclusion,
                equity_marker: row.equity_marker,
                equity_marker_description: row.equity_marker_description,
                assessment: row.assessment,
                alignment_nap: row.alignment_nap,
                alignment_cff: row.alignment_cff,
                geographic_division: row.geographic_division,
                districts: row.districts || [],
                climate_relevance_score: row.climate_relevance_score,
                climate_relevance_category: row.climate_relevance_category,
                climate_relevance_justification: row.climate_relevance_justification,
                // Add agency and funding source data for filtering
                agency_id: projectAgencies.length > 0 ? projectAgencies[0].agency_id : null,
                funding_source_id: projectFundingSources.length > 0 ? projectFundingSources[0].funding_source_id : null,
                // Keep full arrays for backward compatibility
                agencies: projectAgencies,
                funding_sources: projectFundingSources,
                wash_component: {
                    presence: row.wash_presence || false,
                    water_supply_percent: row.water_supply_percent || 0,
                    sanitation_percent: row.sanitation_percent || 0,
                    public_admin_percent: row.public_admin_percent || 0,
                    wash_percentage: row.wash_percentage || 0,
                    description: row.wash_description || ''
                }
            };
        });
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

Project.updateProject = async (id, data) => {
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
            wash_component,
            hotspot_vulnerability_type,
            wash_component_description,
            direct_beneficiaries,
            indirect_beneficiaries,
            beneficiary_description,
            gender_inclusion,
            equity_marker,
            equity_marker_description,
            assessment,
            alignment_sdg = [],
            alignment_nap,
            alignment_cff,
            geographic_division,
            districts = [],
            climate_relevance_score,
            climate_relevance_category,
            climate_relevance_justification
        } = data;

        // Update the main project record (no wash_component column here)
        const updateProjectQuery = `
            UPDATE Project SET 
                title = $1, type = $2, sector = $3, division = $4, status = $5, 
                approval_fy = $6, beginning = $7, closing = $8, total_cost_usd = $9, 
                gef_grant = $10, cofinancing = $11, wash_finance = $12, 
                wash_finance_percent = $13, beneficiaries = $14, objectives = $15,
                hotspot_vulnerability_type = $16, wash_component_description = $17, direct_beneficiaries = $18,
                indirect_beneficiaries = $19, beneficiary_description = $20, gender_inclusion = $21, 
                equity_marker = $22, equity_marker_description = $23, assessment = $24, 
                alignment_nap = $25, alignment_cff = $26, geographic_division = $27, districts = $28,
                climate_relevance_score = $29, climate_relevance_category = $30, climate_relevance_justification = $31
            WHERE project_id = $32
            RETURNING *
        `;
        
        const values = [
            title, type, sector, division, status, approval_fy, beginning, closing,
            total_cost_usd, gef_grant, cofinancing, wash_finance,
            wash_finance_percent, beneficiaries, objectives,
            hotspot_vulnerability_type, wash_component_description, direct_beneficiaries,
            indirect_beneficiaries, beneficiary_description, gender_inclusion, 
            equity_marker, equity_marker_description, assessment, 
            alignment_nap, alignment_cff, geographic_division, districts, 
            climate_relevance_score, climate_relevance_category, climate_relevance_justification, id
        ];
        
        const result = await client.query(updateProjectQuery, values);

        // Always update/create WASHComponent record (required for data consistency)
        const washData = wash_component || { 
            presence: false, 
            water_supply_percent: 0, 
            sanitation_percent: 0, 
            public_admin_percent: 0,
            wash_percentage: 0,
            description: ''
        };
        const { presence, water_supply_percent, sanitation_percent, public_admin_percent, wash_percentage, description } = washData;
        
        const updateWASH = `
            INSERT INTO WASHComponent (
                project_id, presence, water_supply_percent, sanitation_percent, public_admin_percent,
                wash_percentage, description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (project_id) 
            DO UPDATE SET 
                presence = EXCLUDED.presence,
                water_supply_percent = EXCLUDED.water_supply_percent,
                sanitation_percent = EXCLUDED.sanitation_percent,
                public_admin_percent = EXCLUDED.public_admin_percent,
                wash_percentage = EXCLUDED.wash_percentage,
                description = EXCLUDED.description
        `;
        await client.query(updateWASH, [
            id,
            presence,
            water_supply_percent || 0,
            sanitation_percent || 0,
            public_admin_percent || 0,
            wash_percentage || 0,
            description || ''
        ]);

        // Update relationships - delete existing and insert new ones
        
        // Delete existing relationships
        await client.query('DELETE FROM ProjectAgency WHERE project_id = $1', [id]);
        await client.query('DELETE FROM ProjectFundingSource WHERE project_id = $1', [id]);
        await client.query('DELETE FROM ProjectFocalArea WHERE project_id = $1', [id]);
        await client.query('DELETE FROM ProjectSDG WHERE project_id = $1', [id]);

        // Insert new relationships
        for (const agency_id of agency_ids) {
            await client.query(
                'INSERT INTO ProjectAgency (project_id, agency_id) VALUES ($1, $2)',
                [id, agency_id]
            );
        }

        for (const funding_source_id of funding_source_ids) {
            await client.query(
                'INSERT INTO ProjectFundingSource (project_id, funding_source_id) VALUES ($1, $2)',
                [id, funding_source_id]
            );
        }

        for (const focal_area_id of focal_area_ids) {
            await client.query(
                'INSERT INTO ProjectFocalArea (project_id, focal_area_id) VALUES ($1, $2)',
                [id, focal_area_id]
            );
        }

        // Handle SDG relationships
        for (const sdg_id of alignment_sdg) {
            await client.query(
                'INSERT INTO ProjectSDG (project_id, sdg_id) VALUES ($1, $2)',
                [id, sdg_id]
            );
        }

        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        console.error('Update Project Error:', err.message);
        console.error('Stack trace:', err.stack);
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

Project.deleteProject = async (id) => {
    await pool.query('DELETE FROM Project WHERE project_id = $1', [id]);
};

Project.getProjectById = async (id) => {
    const client = await pool.connect();
    try {
        // Get basic project data with WASH component
        const projectQuery = `
            SELECT 
                p.*,
                wc.presence,
                wc.water_supply_percent,
                wc.sanitation_percent,
                wc.public_admin_percent,
                wc.wash_percentage,
                wc.description as wash_description
            FROM Project p
            LEFT JOIN WASHComponent wc ON p.project_id = wc.project_id 
            WHERE p.project_id = $1
        `;
        const projectResult = await client.query(projectQuery, [id]);
        
        if (projectResult.rows.length === 0) {
            return null;
        }
        
        const project = projectResult.rows[0];
        
        // Get related agencies with full details
        const agenciesQuery = `
            SELECT a.agency_id, a.name, a.type
            FROM Agency a
            INNER JOIN ProjectAgency pa ON a.agency_id = pa.agency_id
            WHERE pa.project_id = $1
        `;
        const agenciesResult = await client.query(agenciesQuery, [id]);
        
        // Get related locations with full details
        const locationsQuery = `
            SELECT l.location_id, l.name, l.region
            FROM Location l
            INNER JOIN ProjectLocation pl ON l.location_id = pl.location_id
            WHERE pl.project_id = $1
        `;
        const locationsResult = await client.query(locationsQuery, [id]);
        
        // Get related funding sources with full details
        const fundingSourcesQuery = `
            SELECT fs.funding_source_id, fs.name, fs.dev_partner, fs.grant_amount, fs.loan_amount
            FROM FundingSource fs
            INNER JOIN ProjectFundingSource pfs ON fs.funding_source_id = pfs.funding_source_id
            WHERE pfs.project_id = $1
        `;
        const fundingSourcesResult = await client.query(fundingSourcesQuery, [id]);
        
        // Get related focal areas with full details
        const focalAreasQuery = `
            SELECT fa.focal_area_id, fa.name
            FROM FocalArea fa
            INNER JOIN ProjectFocalArea pfa ON fa.focal_area_id = pfa.focal_area_id
            WHERE pfa.project_id = $1
        `;
        const focalAreasResult = await client.query(focalAreasQuery, [id]);
        
        // Get related SDGs
        const sdgsQuery = `
            SELECT psd.sdg_id
            FROM ProjectSDG psd
            WHERE psd.project_id = $1
        `;
        const sdgsResult = await client.query(sdgsQuery, [id]);
        
        // Extract project fields excluding WASH component fields
        const {
            presence,
            water_supply_percent,
            sanitation_percent,
            public_admin_percent,
            wash_percentage,
            wash_description,
            ...projectData
        } = project;
        
        // Combine all data with properly structured wash_component and full related data
        return {
            ...projectData,
            // For form editing (return IDs)
            agencies: agenciesResult.rows.map(row => row.agency_id),
            locations: locationsResult.rows.map(row => row.location_id),
            funding_sources: fundingSourcesResult.rows.map(row => row.funding_source_id),
            focal_areas: focalAreasResult.rows.map(row => row.focal_area_id),
            alignment_sdg: sdgsResult.rows.map(row => row.sdg_id),
            // For display purposes (return full objects)
            projectAgencies: agenciesResult.rows,
            projectLocations: locationsResult.rows,
            projectFundingSources: fundingSourcesResult.rows,
            projectFocalAreas: focalAreasResult.rows,
            wash_component: {
                presence: presence || false,
                water_supply_percent: parseFloat(water_supply_percent) || 0,
                sanitation_percent: parseFloat(sanitation_percent) || 0,
                public_admin_percent: parseFloat(public_admin_percent) || 0,
                wash_percentage: parseFloat(wash_percentage) || 0,
                description: wash_description || ''
            }
        };
        
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
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

Project.getFundingSourceByType = async () => {
    const query = `
        SELECT fs.type, COUNT(DISTINCT fs.funding_source_id) AS value
        FROM FundingSource fs
        INNER JOIN ProjectFundingSource pfs ON fs.funding_source_id = pfs.funding_source_id
        INNER JOIN Project p ON p.project_id = pfs.project_id
        GROUP BY fs.type
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => ({
        name: row.type,
        value: parseInt(row.value)
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

/////////Dashboard
Project.getOverviewStats = async () => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT
                (SELECT COUNT(*) FROM Project) AS total_projects,
                (SELECT SUM(total_cost_usd) FROM Project) AS total_climate_finance,
                (SELECT SUM(p.gef_grant)
                 FROM Project p
                 WHERE p.type = 'Adaptation'
                ) AS adaptation_finance,
                (SELECT SUM(p.gef_grant)
                    FROM Project p
                    WHERE p.type = 'Mitigation'
                ) AS mitigation_finance,
                (SELECT COUNT(*) FROM Project WHERE now() BETWEEN beginning AND closing) AS active_projects,
                (SELECT COUNT(*) FROM Project WHERE status IN('Implemented')) AS completed_projects
        `;

        const currentYearQuery = `
            SELECT
                (SELECT COUNT(*) FROM Project WHERE approval_fy = EXTRACT(YEAR FROM CURRENT_DATE)) AS total_projects,
                SUM(p.total_cost_usd) AS total_climate_finance,

                (
                    SELECT COALESCE(SUM(p2.gef_grant), 0)
                    FROM Project p2
                    WHERE p2.type = 'Adaptation'
                      AND p2.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE)
                ) AS adaptation_finance,

                (
                    SELECT COALESCE(SUM(p3.gef_grant), 0)
                    FROM Project p3
                    WHERE p3.type = 'Mitigation'
                      AND p3.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE)
                ) AS mitigation_finance,

                (
                    SELECT COUNT(*)
                    FROM Project
                    WHERE now() BETWEEN beginning AND closing 
                    AND approval_fy = EXTRACT(YEAR FROM CURRENT_DATE)
                ) AS active_projects,

                (
                    SELECT COUNT(*)
                    FROM Project
                    WHERE status IN('Implemented')
                    AND approval_fy = EXTRACT(YEAR FROM CURRENT_DATE)
                ) AS completed_projects

            FROM Project p
            WHERE p.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE);
        `;

        const previousYearQuery = `
            SELECT
                (SELECT COUNT(*) FROM Project WHERE approval_fy = EXTRACT(YEAR FROM CURRENT_DATE) - 1) AS total_projects,
                SUM(p.total_cost_usd) AS total_climate_finance,

                (
                    SELECT COALESCE(SUM(p2.gef_grant), 0)
                    FROM Project p2
                    WHERE p2.type = 'Adaptation'
                      AND p2.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                ) AS adaptation_finance,

                (
                    SELECT COALESCE(SUM(p3.gef_grant), 0)
                    FROM Project p3
                    WHERE p3.type = 'Mitigation'
                      AND p3.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                ) AS mitigation_finance,

                (
                    SELECT COUNT(*)
                    FROM Project
                    WHERE now() BETWEEN beginning AND closing 
                    AND approval_fy = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                ) AS active_projects,

                (
                    SELECT COUNT(*)
                    FROM Project
                    WHERE status IN('Implemented')
                    AND approval_fy = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                ) AS completed_projects

            FROM Project p
            WHERE p.approval_fy = EXTRACT(YEAR FROM CURRENT_DATE) - 1;
        `;

        const result = await client.query(query);
        const currentYearResult = await client.query(currentYearQuery);
        const previousYearResult = await client.query(previousYearQuery);

        return {
            ...result.rows[0],
            current_year: currentYearResult.rows[0],
            previous_year: previousYearResult.rows[0]
        };
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};






module.exports = Project;
