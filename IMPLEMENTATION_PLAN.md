# Climate Finance Website - Excel Compatibility Update

## 🎯 Objective
Align website features with Excel data structure by:
1. **Adding** Climate Relevance Score (missing critical field)
2. **Removing** features not in Excel (disbursement tracking)
3. **Keeping** everything else as-is (sector, status, division work fine with dynamic data)

---

## 📋 Implementation Steps

### PHASE 1: Add Climate Relevance Score

#### 1.1 Database Schema
**File**: `backend/src/config/init.sql`

Add to **Project** table (after line 43):
```sql
climate_relevance_score DECIMAL(5,2),
climate_relevance_category VARCHAR(50) CHECK (climate_relevance_category IN ('High', 'Moderate-High', 'Moderate', 'Moderate-Low', 'Low', '')),
climate_relevance_justification TEXT
```

Add to **PendingProject** table (after line 83):
```sql
climate_relevance_score DECIMAL(5,2),
climate_relevance_category VARCHAR(50) CHECK (climate_relevance_category IN ('High', 'Moderate-High', 'Moderate', 'Moderate-Low', 'Low', '')),
climate_relevance_justification TEXT
```

#### 1.2 Backend Model
**File**: `backend/src/models/Project.model.js`

**In `addProjectWithRelations()`** (~line 33):
- Add to destructuring: `climate_relevance_score, climate_relevance_category, climate_relevance_justification`
- Add to INSERT query columns (line 52)
- Add to values array (line 62)

**In `updateProject()`** (~line 313):
- Add to destructuring: `climate_relevance_score, climate_relevance_category, climate_relevance_justification`
- Add to UPDATE query (line 329)
- Add to values array (line 343)

**In `getAllProjects()`** (~line 161):
- Add to SELECT query (line 143-180)
- Add to return mapping (line 226-276)

**In `getProjectById()`** (~line 461):
- Add to SELECT query (line 448-456)

#### 1.3 Frontend - Project Form
**File**: `climate-finance/src/pages/ProjectFormPage.jsx`

Add new section after Financial Information (~line 670):
```jsx
<div>
  <h3 className="text-lg font-medium text-gray-900 mb-4">Climate Relevance</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Score Input */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Climate Relevance Score (%)
      </label>
      <input
        type="number"
        name="climate_relevance_score"
        value={formData.climate_relevance_score || ''}
        onChange={handleInputChange}
        min="0"
        max="100"
        step="0.01"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
        placeholder="0-100"
      />
    </div>
    
    {/* Category Dropdown */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Relevance Category
      </label>
      <select
        name="climate_relevance_category"
        value={formData.climate_relevance_category || ''}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
      >
        <option value="">Select Category</option>
        <option value="High">High</option>
        <option value="Moderate-High">Moderate-High</option>
        <option value="Moderate">Moderate</option>
        <option value="Moderate-Low">Moderate-Low</option>
        <option value="Low">Low</option>
      </select>
    </div>
  </div>
  
  {/* Justification */}
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">
      Climate Relevance Justification
    </label>
    <textarea
      name="climate_relevance_justification"
      value={formData.climate_relevance_justification || ''}
      onChange={handleInputChange}
      rows={4}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
      placeholder="Explain the climate relevance score and category..."
    />
  </div>
</div>
```

#### 1.4 Frontend - Project Details Page
**File**: `climate-finance/src/pages/ProjectDetails.jsx`

Add after Assessment section (~line 562):
```jsx
{/* Climate Relevance */}
{(project.climate_relevance_score || project.climate_relevance_category || project.climate_relevance_justification) && (
  <Card padding="p-4 sm:p-6" className="mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Relevance</h3>
    <div className="space-y-4">
      {project.climate_relevance_score && (
        <div>
          <div className="text-sm text-gray-600 font-medium mb-2">Climate Relevance Score</div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-blue-600">{project.climate_relevance_score}%</div>
            {project.climate_relevance_category && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                project.climate_relevance_category === 'High' ? 'bg-green-100 text-green-800' :
                project.climate_relevance_category === 'Moderate-High' ? 'bg-blue-100 text-blue-800' :
                project.climate_relevance_category === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                project.climate_relevance_category === 'Moderate-Low' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {project.climate_relevance_category}
              </span>
            )}
          </div>
        </div>
      )}
      {project.climate_relevance_justification && (
        <div>
          <div className="text-sm text-gray-600 font-medium mb-1">Justification</div>
          <div className="text-sm text-gray-700">{project.climate_relevance_justification}</div>
        </div>
      )}
    </div>
  </Card>
)}
```

---

### PHASE 2: Remove Disbursement Tracking

#### 2.1 Project Details Page
**File**: `climate-finance/src/pages/ProjectDetails.jsx`

**Remove** (~lines 158-280):
- `calculateProgress()` function
- `progressPercentage` variable
- `isOverDisbursed` calculation
- Entire ProgressBar component section (lines 266-280)
- "Disbursed" metric from Key Metrics Grid (lines 260-263)

**Keep**: Total Budget and Grant display

#### 2.2 Funding Source Details Page
**File**: `climate-finance/src/pages/FundingSourceDetails.jsx`

**Remove** (~lines 224-273):
- "Disbursed" metric from Key Metrics Grid (lines 237-242)
- ProgressBar component (lines 259-273)
- Related calculations (disbursedNum, committedNum, disbursementRate)

#### 2.3 Funding Sources List Page
**File**: `climate-finance/src/pages/FundingSources.jsx`

**Remove** (~lines 473-481):
- "Disbursed" section from funding source cards

---

### PHASE 3: Update Mock Data

#### 3.1 Mock Projects
**File**: `climate-finance/src/data/mockProjects.js`

Add to each project object:
```javascript
climate_relevance_score: 65,
climate_relevance_category: "High",
climate_relevance_justification: "Strong adaptation components addressing climate vulnerabilities with evidence-based interventions."
```

**Remove** from each project:
```javascript
disbursement: [value]  // Remove this field
```

---

## 📊 What Stays Unchanged

### ✅ Keep These Features (Work Fine)
- **Sector filters/charts** - Populated dynamically from project data
- **Status filters/charts** - Populated dynamically from project data  
- **Division filters** - Already uses `geographic_division` field
- **Type filters** (Adaptation/Mitigation) - Already exists
- **WASH finance slider** - Already exists in forms
- **All other existing features** - Agencies, locations, focal areas, etc.

**Why**: These features already work with dynamic data. The Excel file shows they can be filled in during data entry.

---

## 📁 Files to Modify

### Backend (3 files)
1. `backend/src/config/init.sql` - Add 3 climate relevance fields
2. `backend/src/models/Project.model.js` - Handle new fields in CRUD ops
3. (Optional) Migration script if DB already has data

### Frontend (6 files)
1. `climate-finance/src/pages/ProjectFormPage.jsx` - Add climate relevance form
2. `climate-finance/src/pages/ProjectDetails.jsx` - Add display + remove disbursement
3. `climate-finance/src/pages/FundingSourceDetails.jsx` - Remove disbursement
4. `climate-finance/src/pages/FundingSources.jsx` - Remove disbursement
5. `climate-finance/src/data/mockProjects.js` - Update mock data
6. (Optional) `climate-finance/src/pages/Projects.jsx` - Add climate relevance filter

---

## ✅ Success Criteria

- [ ] Climate Relevance Score fields in database
- [ ] Climate Relevance Score in project forms
- [ ] Climate Relevance Score displayed on project details
- [ ] All disbursement tracking removed
- [ ] Mock data updated
- [ ] No breaking changes to existing features
- [ ] Website loads without errors

---

## 🎯 Key Points

1. **Excel file is reference only** - No data import/parsing needed
2. **Climate Relevance Score** - Critical missing field that appears in all Excel sheets
3. **Disbursement** - Not in Excel, so remove from website
4. **Sector/Status/Division** - Already work dynamically, no changes needed
5. **WASH finance slider** - Already exists, no changes needed

---

## 🚀 Next Steps

1. Confirm this plan
2. Implement Phase 1 (Add Climate Relevance Score)
3. Implement Phase 2 (Remove Disbursement)
4. Implement Phase 3 (Update Mock Data)
5. Test thoroughly
6. Deploy


