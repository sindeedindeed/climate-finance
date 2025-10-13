# Backend Implementation Guide for New Project Fields

## Overview
This document outlines the required backend changes to support the new project input fields added to the frontend form. These changes are needed to fully integrate the new data structure with the existing system.

## ⚠️ Important Notes

### Field Deprecations
The following fields are being replaced and should be deprecated in future backend updates:
- **Old `beneficiaries` field** (text) → Replaced with `direct_beneficiaries` (number), `indirect_beneficiaries` (number), and `beneficiary_description` (text)
- **Old WASH component structure** (separate water_supply_percent, sanitation_percent, public_admin_percent) → Replaced with single `wash_percentage` field + `wash_component_description`
- **Old `division` field** (organizational type: Local Government/National Government/NGO/International) → Replaced with `geographic_division` (Bangladesh administrative division)
- **Old location system** (location_ids array) → Replaced with hierarchical `geographic_division` + `districts` system

### Migration Strategy
When implementing backend changes:
1. Keep old fields temporarily for backward compatibility
2. Implement new fields alongside old ones
3. Create data migration scripts to convert old data to new format
4. Deprecate old fields after successful migration
5. Remove old fields in a future release

## Database Schema Changes

### 1. Update Project Table
Add the following columns to the `Project` table:

```sql
-- Add new columns to Project table
ALTER TABLE Project ADD COLUMN hotspot_vulnerability_type TEXT;
ALTER TABLE Project ADD COLUMN wash_component_description TEXT;
ALTER TABLE Project ADD COLUMN direct_beneficiaries INTEGER;
ALTER TABLE Project ADD COLUMN indirect_beneficiaries INTEGER;
ALTER TABLE Project ADD COLUMN beneficiary_description TEXT;
ALTER TABLE Project ADD COLUMN gender_inclusion TEXT;
ALTER TABLE Project ADD COLUMN equity_marker VARCHAR(20) CHECK (equity_marker IN ('strong', 'medium', 'weak'));
ALTER TABLE Project ADD COLUMN equity_marker_description TEXT;
ALTER TABLE Project ADD COLUMN assessment TEXT;
ALTER TABLE Project ADD COLUMN alignment_nap TEXT;
ALTER TABLE Project ADD COLUMN alignment_cff TEXT;
ALTER TABLE Project ADD COLUMN geographic_division VARCHAR(50); -- Bangladesh administrative division
ALTER TABLE Project ADD COLUMN districts TEXT[]; -- Array of district names

-- Remove deprecated fields
ALTER TABLE Project DROP COLUMN IF EXISTS division; -- Old organizational division
ALTER TABLE Project DROP COLUMN IF EXISTS beneficiaries; -- Old beneficiaries field
```

### 2. Update WASHComponent Table
Modify the WASHComponent table to support the new single percentage structure:

```sql
-- Update WASHComponent table
ALTER TABLE WASHComponent ADD COLUMN wash_percentage DECIMAL(5,2);
ALTER TABLE WASHComponent ADD COLUMN description TEXT;

-- IMPORTANT: Keep existing columns for backward compatibility during migration
-- Do NOT drop these columns until all data has been migrated:
-- - water_supply_percent
-- - sanitation_percent
-- - public_admin_percent
```

**Migration Script for WASH Component:**
```sql
-- Create a function to migrate old WASH data to new format
-- This calculates the total percentage from old fields
UPDATE WASHComponent 
SET 
  wash_percentage = (water_supply_percent + sanitation_percent + public_admin_percent),
  description = CONCAT(
    'Water Supply: ', water_supply_percent, '%, ',
    'Sanitation: ', sanitation_percent, '%, ',
    'Public Admin: ', public_admin_percent, '%'
  )
WHERE wash_percentage IS NULL;
```

### 3. Create New Junction Tables

#### ProjectSDG Table
```sql
CREATE TABLE ProjectSDG (
    project_id VARCHAR(50),
    sdg_id INTEGER,
    PRIMARY KEY (project_id, sdg_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE
);
```

#### Remove Old Location Dependencies
```sql
-- Remove project-location junction table (if exists)
DROP TABLE IF EXISTS project_locations;

-- Note: districts are now stored as TEXT[] array in Project table
-- No separate junction table needed for districts
```

### 4. Update PendingProject Table
Add the same new columns to the PendingProject table:

```sql
-- Add new columns to PendingProject table
ALTER TABLE PendingProject ADD COLUMN hotspot_vulnerability_type TEXT;
ALTER TABLE PendingProject ADD COLUMN wash_component_description TEXT;
ALTER TABLE PendingProject ADD COLUMN direct_beneficiaries INTEGER;
ALTER TABLE PendingProject ADD COLUMN indirect_beneficiaries INTEGER;
ALTER TABLE PendingProject ADD COLUMN beneficiary_description TEXT;
ALTER TABLE PendingProject ADD COLUMN gender_inclusion TEXT;
ALTER TABLE PendingProject ADD COLUMN equity_marker VARCHAR(20) CHECK (equity_marker IN ('strong', 'medium', 'weak'));
ALTER TABLE PendingProject ADD COLUMN equity_marker_description TEXT;
ALTER TABLE PendingProject ADD COLUMN assessment TEXT;
ALTER TABLE PendingProject ADD COLUMN alignment_nap TEXT;
ALTER TABLE PendingProject ADD COLUMN alignment_cff TEXT;
ALTER TABLE PendingProject ADD COLUMN alignment_sdg INTEGER[];
ALTER TABLE PendingProject ADD COLUMN geographic_division VARCHAR(50);
ALTER TABLE PendingProject ADD COLUMN districts TEXT[];

-- Remove deprecated fields
ALTER TABLE PendingProject DROP COLUMN IF EXISTS division;
ALTER TABLE PendingProject DROP COLUMN IF EXISTS beneficiaries;
```

## Backend Model Updates

### 1. Update Project.model.js

#### Add new fields to addProjectWithRelations method:
```javascript
    const {
        // ... existing fields
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
        districts = []
    } = data;
```

#### Update INSERT query:
```javascript
const insertProjectQuery = `
    INSERT INTO Project (
        project_id, title, type, sector, status, approval_fy, beginning, closing,
        total_cost_usd, gef_grant, cofinancing, wash_finance,
        wash_finance_percent, objectives,
        hotspot_vulnerability_type, direct_beneficiaries, indirect_beneficiaries,
        beneficiary_description, gender_inclusion, equity_marker,
        equity_marker_description, assessment, alignment_nap, alignment_cff,
        geographic_division, districts
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
`;
```

#### Update WASHComponent handling:
```javascript
const washData = wash_component || { 
    presence: false, 
    wash_percentage: 0, 
    description: '' 
};

const insertWASH = `
    INSERT INTO WASHComponent (
        project_id, presence, wash_percentage, description
    ) VALUES ($1, $2, $3, $4)
`;
```

#### Add new relationship handling:
```javascript
// Handle SDG relationships
for (const sdg_id of alignment_sdg) {
    await client.query(
        'INSERT INTO ProjectSDG (project_id, sdg_id) VALUES ($1, $2)',
        [project_id, sdg_id]
    );
}

// Districts are now stored as TEXT[] array in Project table
// No separate junction table needed
```

### 2. Update getAllProjects method
Add new fields to the SELECT query and return object:

```javascript
const projectQuery = `
    SELECT 
        p.project_id, p.title, p.type, p.sector, p.status, p.approval_fy, 
        p.beginning, p.closing, p.total_cost_usd, p.gef_grant, p.cofinancing,
        p.disbursement, p.wash_finance, p.wash_finance_percent, p.objectives,
        p.hotspot_vulnerability_type, p.direct_beneficiaries, p.indirect_beneficiaries,
        p.beneficiary_description, p.gender_inclusion, p.equity_marker,
        p.equity_marker_description, p.assessment, p.alignment_nap, p.alignment_cff,
        p.geographic_division, p.districts,
        wc.presence as wash_presence, wc.wash_percentage, wc.description as wash_description
    FROM Project p
    LEFT JOIN WASHComponent wc ON p.project_id = wc.project_id
`;
```

### 3. Update getProjectById method
Include new fields and relationships in the detailed project view.

## API Controller Updates

### 1. Update project.controller.js
Ensure all new fields are properly handled in:
- `addProject` method
- `updateProject` method
- `getProjectById` method

### 2. Add new API endpoints (optional)
Consider adding endpoints for:
- Get all SDGs: `GET /api/sdgs`
- Get districts by division: `GET /api/districts/:division`

## Data Validation Rules

### 1. Field Validation
- `equity_marker`: Must be one of 'strong', 'medium', 'weak'
- `direct_beneficiaries`, `indirect_beneficiaries`: Must be non-negative integers
- `wash_percentage`: Must be between 0 and 100
- `alignment_sdg`: Array of valid SDG IDs (1-17)
- `districts`: Array of valid district names

### 2. Required Fields
Consider making these fields required:
- `hotspot_vulnerability_type`
- `direct_beneficiaries`
- `indirect_beneficiaries`
- `equity_marker`

## Migration Steps

### 1. Database Migration
1. Run the ALTER TABLE statements to add new columns
2. Create new junction tables
3. Update existing data if needed (set default values for new fields)

### 2. Backend Code Migration
1. Update Project.model.js with new fields
2. Update project.controller.js
3. Update any related models (PendingProject.model.js)
4. Test all CRUD operations

### 3. Frontend Integration
1. Update API calls to include new fields
2. Update form submission logic
3. Update data display components
4. Test form validation

## Testing Checklist

- [ ] Create new project with all new fields
- [ ] Update existing project with new fields
- [ ] Retrieve project with new fields
- [ ] Validate all field types and constraints
- [ ] Test district filtering by division
- [ ] Test SDG multi-selection
- [ ] Test WASH component single slider
- [ ] Test equity marker radio buttons
- [ ] Test all text areas and descriptions

## Frontend Changes Already Implemented

### Form Structure Changes
1. **Removed old beneficiaries field** from "Objectives & Beneficiaries" section
2. **Renamed section** from "Objectives & Beneficiaries" to just "Objectives"
3. **Moved Assessment section** to the end of the form (after Districts)
4. **Updated WASH Component** to use single slider instead of three sliders
5. **Removed placeholder text** from all new input fields
6. **Changed equity marker radio buttons** to purple color scheme
7. **Removed old division field** (organizational type: Local Government/National Government/NGO/International)
8. **Removed entire Project Locations section** and admin's ability to add/remove locations
9. **Added hierarchical Geographic Location section** with Division → Districts selection
10. **Districts are now filtered by selected geographic division** (8 Bangladesh administrative divisions)
11. **Added deprecation labels** to Type and Sector fields - marked as "(to be removed)"
12. **Removed user info display** from project form page header
13. **Removed PeopleAffectedDisplay component** (was location-dependent)

### Form Field Order (Current)
1. Basic Information (Title, Type, Sector, Status)
2. Implementing & Executing Agencies
3. Funding Sources
4. Geographic Location (Division → Districts)
5. Focal Areas
6. WASH Component (new single slider format)
7. Hotspot/Vulnerability Type (new)
8. Beneficiaries (new - direct/indirect/description)
9. Gender & Inclusion (new)
10. Equity Marker (new)
11. Alignment (SDG/NAP/CFF) (new)
12. Assessment (new - moved to end)
13. Financial Information
14. Timeline
15. Objectives

## Notes

1. **Backward Compatibility**: Keep old beneficiaries and WASH component fields temporarily for data migration
2. **Data Migration**: Create scripts to convert old beneficiaries text to new numeric fields
3. **Performance**: Add indexes on new frequently queried fields (equity_marker, direct_beneficiaries, indirect_beneficiaries)
4. **Data Integrity**: Implement proper foreign key constraints for SDG and district relationships
5. **Validation**: Add comprehensive validation both on frontend and backend
6. **Documentation**: Update API documentation to include new fields
7. **Location system**: The old location-based system has been completely replaced with a hierarchical geographic division/district system using Bangladesh's 8 administrative divisions.
8. **Deprecated fields**: Type and Sector fields are marked with "(to be removed)" labels and should be deprecated in future backend updates.
9. **Geographic data**: Districts are stored as an array of district names, filtered by the selected geographic division.

## Data Migration Checklist

- [ ] Backup existing database
- [ ] Run ALTER TABLE statements for new columns
- [ ] Create new junction tables (ProjectSDG, ProjectDistrict)
- [ ] Migrate WASH component data from old to new format
- [ ] Migrate beneficiaries text data to new structure (manual review may be needed)
- [ ] Verify data integrity after migration
- [ ] Test API endpoints with new fields
- [ ] Update API documentation
- [ ] Deploy backend changes
- [ ] Monitor for issues
- [ ] After 2-3 months of stable operation, remove deprecated fields

## Estimated Implementation Time

- Database changes: 2-3 hours
- Backend model updates: 4-6 hours
- API controller updates: 2-3 hours
- Testing and validation: 3-4 hours
- **Total**: 11-16 hours
