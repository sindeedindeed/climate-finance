-- Table: User
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Viewer', 'Super Admin', 'Project Manager', 'Finance Admin', 'Data Manager')),
    department VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL,
    last_login TIMESTAMP DEFAULT NULL
);

-- Table: Project
CREATE TABLE IF NOT EXISTS Project (
    project_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) CHECK (type IN ('Adaptation', 'Mitigation')),
    sector VARCHAR(100) NOT NULL DEFAULT 'Agriculture',
    division VARCHAR(100) NOT NULL DEFAULT 'Local Government Division',
    status VARCHAR(50),
    approval_fy INTEGER,
    beginning DATE,
    closing DATE,
    total_cost_usd DECIMAL(15,2),
    gef_grant DECIMAL(15,2),
    cofinancing DECIMAL(15,2),
    disbursement DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    wash_finance DECIMAL(15,2),
    wash_finance_percent DECIMAL(5,2),
    beneficiaries VARCHAR(100),
    objectives TEXT
);

-- Table: PendingProject (for projects awaiting approval)
CREATE TABLE IF NOT EXISTS PendingProject (
    pending_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) CHECK (type IN ('Adaptation', 'Mitigation')),
    sector VARCHAR(100) NOT NULL DEFAULT 'Agriculture',
    division VARCHAR(100) NOT NULL DEFAULT 'Local Government Division',
    status VARCHAR(50),
    approval_fy INTEGER,
    beginning DATE,
    closing DATE,
    total_cost_usd DECIMAL(15,2),
    gef_grant DECIMAL(15,2),
    cofinancing DECIMAL(15,2),
    disbursement DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    wash_finance DECIMAL(15,2),
    wash_finance_percent DECIMAL(5,2),
    beneficiaries VARCHAR(100),
    objectives TEXT,
    submitter_email VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    agency_ids INTEGER[],
    location_ids INTEGER[],
    funding_source_ids INTEGER[],
    focal_area_ids INTEGER[],
    wash_component JSONB
);

-- Table: Agency
CREATE TABLE IF NOT EXISTS Agency (
    agency_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL
);

-- Table: FundingSource
CREATE TABLE IF NOT EXISTS FundingSource (
    funding_source_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dev_partner VARCHAR(255),
    type VARCHAR(100),
    grant_amount DECIMAL(15,2),
    loan_amount DECIMAL(15,2),
    counterpart_funding DECIMAL(15,2),
    disbursement DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    non_grant_instrument VARCHAR(50)
);

-- Table: Location
CREATE TABLE IF NOT EXISTS Location (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100)
);

-- Table: FocalArea
CREATE TABLE IF NOT EXISTS FocalArea (
    focal_area_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table: WASHComponent
CREATE TABLE IF NOT EXISTS WASHComponent (
    project_id VARCHAR(50) PRIMARY KEY,
    presence BOOLEAN NOT NULL,
    water_supply_percent DECIMAL(5,2),
    sanitation_percent DECIMAL(5,2),
    public_admin_percent DECIMAL(5,2),
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE
);

-- Junction Table: ProjectAgency
CREATE TABLE IF NOT EXISTS ProjectAgency (
    project_id VARCHAR(50),
    agency_id INTEGER,
    PRIMARY KEY (project_id, agency_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (agency_id) REFERENCES Agency(agency_id) ON DELETE CASCADE
);

-- Junction Table: ProjectFundingSource
CREATE TABLE IF NOT EXISTS ProjectFundingSource (
    project_id VARCHAR(50),
    funding_source_id INTEGER,
    PRIMARY KEY (project_id, funding_source_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (funding_source_id) REFERENCES FundingSource(funding_source_id) ON DELETE CASCADE
);

-- Junction Table: ProjectLocation
CREATE TABLE IF NOT EXISTS ProjectLocation (
    project_id VARCHAR(50),
    location_id INTEGER,
    PRIMARY KEY (project_id, location_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
);

-- Junction Table: ProjectFocalArea
CREATE TABLE IF NOT EXISTS ProjectFocalArea (
    project_id VARCHAR(50),
    focal_area_id INTEGER,
    PRIMARY KEY (project_id, focal_area_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (focal_area_id) REFERENCES FocalArea(focal_area_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_title ON Project(title);
CREATE INDEX IF NOT EXISTS idx_agency_name ON Agency(name);
CREATE INDEX IF NOT EXISTS idx_funding_source_name ON FundingSource(name);
CREATE INDEX IF NOT EXISTS idx_location_name ON Location(name);
CREATE INDEX IF NOT EXISTS idx_focal_area_name ON FocalArea(name);

-- Comments for documentation
COMMENT ON TABLE Project IS 'Stores information about environmental and climate projects in Bangladesh';
COMMENT ON TABLE Agency IS 'Stores information about implementing, executing, or accredited agencies';
COMMENT ON TABLE FundingSource IS 'Stores information about funding sources for projects';
COMMENT ON TABLE Location IS 'Stores project implementation locations';
COMMENT ON TABLE FocalArea IS 'Stores focal areas addressed by projects';
COMMENT ON TABLE WASHComponent IS 'Stores WASH component details for projects';
COMMENT ON TABLE ProjectAgency IS 'Junction table for Project-Agency many-to-many relationship';
COMMENT ON TABLE ProjectFundingSource IS 'Junction table for Project-FundingSource many-to-many relationship';
COMMENT ON TABLE ProjectLocation IS 'Junction table for Project-Location many-to-many relationship';
COMMENT ON TABLE ProjectFocalArea IS 'Junction table for Project-FocalArea many-to-many relationship';