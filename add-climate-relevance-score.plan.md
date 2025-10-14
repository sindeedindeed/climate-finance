# Add Climate Relevance Score - UPDATED PLAN

## Key Findings from Detailed Analysis

### What's ACTUALLY in Excel but I missed:
1. **Division information** - YES, it's in Location field (Rajshahi, Khulna, Dhaka, Chittagong Hill Tracts, etc.)
2. **Disbursement** - NO, not found in any form in Excel
3. **WASH Finance** - YES, in text form within WASH Components & % Budget field
4. **Adaptation/Mitigation** - YES, mentioned in Climate Relevance Score descriptions
5. **Status** - YES, found "Completed" status in Assessment field
6. **Sector** - YES, mentioned in project descriptions (RMG Sector, Industrial sectors, etc.)

### What's in Website but NOT in Excel:
1. **Type** (Adaptation/Mitigation) - Only mentioned in text, not as structured field
2. **Status** - Only "Completed" found, no Active/Planning/On Hold
3. **Disbursement** - Completely missing from Excel
4. **Sector** - Only mentioned in descriptions, not as structured field

## Updated Implementation Plan

### 1. Database Schema Changes

**File**: `backend/src/config/init.sql`

Add to Project table:
```sql
climate_relevance_score DECIMAL(5,2),
climate_relevance_category VARCHAR(50) CHECK (climate_relevance_category IN ('High', 'Moderate-High', 'Moderate', 'Moderate-Low', 'Low', '')),
climate_relevance_justification TEXT
```

### 2. Backend Model Updates

**File**: `backend/src/models/Project.model.js`

- Add fields to all CRUD operations
- Update form handling for new fields

### 3. Frontend Updates

**Files to modify**:
- `climate-finance/src/pages/ProjectFormPage.jsx` - Add form fields
- `climate-finance/src/pages/ProjectDetails.jsx` - Add display section
- `climate-finance/src/components/layouts/FilterBar.jsx` - Add filter option

### 4. Mock Data Update

**File**: `climate-finance/src/data/mockProjects.js`

Add climate relevance score data to existing mock projects:
- Extract from Excel analysis
- Add realistic score, category, and justification
- Ensure consistency with existing project data

### 5. Data Import Strategy

**For Excel data import**:
- Parse Climate Relevance Score from text like "57% – High. Strong WASH & MAR systems..."
- Extract division from Location field (Rajshahi = Rajshahi Division, etc.)
- Parse WASH finance from WASH Components text
- Determine Type (Adaptation/Mitigation) from Climate Relevance Score descriptions
- Set Status based on Assessment field ("Completed" vs others)

### 6. Website Modifications for Excel Compatibility

**Remove/modify features not supported by Excel data**:
- Remove disbursement tracking (not in Excel)
- Modify sector filtering to use text-based sectors from descriptions
- Simplify status options to match Excel (Completed vs others)
- Use division information from Location field instead of separate division field

## Files to Modify

1. `backend/src/config/init.sql` - Add climate relevance fields
2. `backend/src/models/Project.model.js` - Handle new fields
3. `climate-finance/src/pages/ProjectFormPage.jsx` - Add form inputs
4. `climate-finance/src/pages/ProjectDetails.jsx` - Add display
5. `climate-finance/src/data/mockProjects.js` - Update mock data
6. `climate-finance/src/components/layouts/FilterBar.jsx` - Add filter

## Mock Data Update Details

Based on Excel analysis, add these climate relevance scores to mock data:

```javascript
// Example from Excel data
{
  climate_relevance_score: 57,
  climate_relevance_category: "High",
  climate_relevance_justification: "Strong WASH & MAR systems in drought hotspots; explicit adaptation framing though not 100% WASH-direct."
}
```

## Notes

- User confirmed agency role distinction already exists in admin code
- Division info is in Location field - parse districts to determine division
- WASH finance can be calculated from WASH Components % and total cost
- Type can be inferred from Climate Relevance Score descriptions
- Status is limited to "Completed" and others (not the full range in current DB)
