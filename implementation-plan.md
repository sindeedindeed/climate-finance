# Climate Relevance Score Implementation Plan

## Overview
Add Climate Relevance Score fields to match Excel structure and remove/modify features not supported by Excel data.

## 1. Database Schema Changes

**File**: `backend/src/config/init.sql`

Add to Project table:
```sql
climate_relevance_score DECIMAL(5,2),
climate_relevance_category VARCHAR(50) CHECK (climate_relevance_category IN ('High', 'Moderate-High', 'Moderate', 'Moderate-Low', 'Low', '')),
climate_relevance_justification TEXT
```

Add to PendingProject table (same fields).

## 2. Backend Model Updates

**File**: `backend/src/models/Project.model.js`

- Add fields to `addProjectWithRelations()` function
- Add fields to `updateProject()` function  
- Add fields to `getAllProjects()` SELECT query
- Add fields to `getProjectById()` SELECT query

## 3. Frontend - Project Form

**File**: `climate-finance/src/pages/ProjectFormPage.jsx`

Add form section with:
- Number input for score (0-100, step 0.01)
- Dropdown for category (High, Moderate-High, Moderate, Moderate-Low, Low)
- Textarea for justification

## 4. Frontend - Project Details Page

**File**: `climate-finance/src/pages/ProjectDetails.jsx`

Add new Card component displaying:
- Climate Relevance Score with visual indicator
- Category badge
- Justification text

## 5. Remove Disbursement Tracking

**Files to modify:**
- `climate-finance/src/pages/ProjectDetails.jsx` - Remove progress bars and disbursement metrics
- `climate-finance/src/pages/FundingSourceDetails.jsx` - Remove disbursed amounts and progress bars
- `climate-finance/src/pages/FundingSources.jsx` - Remove disbursed from cards

## 6. Simplify Status Options

**Files to modify:**
- `climate-finance/src/pages/Projects.jsx` - Simplify status filter options
- `climate-finance/src/pages/AdminProjects.jsx` - Same simplification
- `climate-finance/src/pages/ProjectFormPage.jsx` - Update status dropdown

## 7. Update Mock Data

**File**: `climate-finance/src/data/mockProjects.js`

Add climate relevance score data to existing mock projects:
```javascript
{
  climate_relevance_score: 57,
  climate_relevance_category: "High", 
  climate_relevance_justification: "Strong WASH & MAR systems in drought hotspots..."
}
```

## 8. Optional - Add Climate Relevance Filter

**File**: `climate-finance/src/pages/Projects.jsx`

Add filter dropdown for climate relevance category.

## Files to Modify

1. `backend/src/config/init.sql` - Add climate relevance fields
2. `backend/src/models/Project.model.js` - Handle new fields
3. `climate-finance/src/pages/ProjectFormPage.jsx` - Add form inputs
4. `climate-finance/src/pages/ProjectDetails.jsx` - Add display + remove disbursement
5. `climate-finance/src/pages/FundingSourceDetails.jsx` - Remove disbursement
6. `climate-finance/src/pages/FundingSources.jsx` - Remove disbursement
7. `climate-finance/src/pages/Projects.jsx` - Simplify status + add climate filter
8. `climate-finance/src/pages/AdminProjects.jsx` - Simplify status
9. `climate-finance/src/data/mockProjects.js` - Update mock data

## Notes

- No data parsing or inference needed
- Excel file is reference only
- Focus on adding climate relevance score and removing unsupported features
- Keep existing WASH finance slider (no changes needed)
