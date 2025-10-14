# Website Compatibility Analysis - Excel Data vs Current Database

## Summary

After analyzing sheets 1-4 of Climate_Finance_WASH_Dashboard_CPRD.xlsx, here's what can and cannot be displayed on your current website.

---

## ✅ FIELDS THAT ARE DISPLAYABLE (Already in Database)

### Core Project Information
- **Project ID** ✓ (Excel) → `project_id` (Database)
- **Project Name** ✓ → `title`
- **Year / Period** ✓ → `beginning`, `closing`, `approval_fy`
- **Location** ✓ → `districts` array + `geographic_division`
- **Project Information** ✓ → `objectives`
- **Assessment** ✓ → `assessment`

### Financial Data
- **Loan (USD M)** ✓ → Stored in `FundingSource` table (`loan_amount`)
- **Grant (USD M)** ✓ → `gef_grant`
- **Co Finance (USD M)** ✓ → `cofinancing`
- **Total Financing (USD M)** ✓ → `total_cost_usd`

### WASH Components
- **WASH Components & % Budget** ✓ → `wash_component_description` + `wash_finance_percent`
- **Water supply percent** ✓ → In `WASHComponent` table
- **Sanitation percent** ✓ → In `WASHComponent` table
- **Public Admin percent** ✓ → In `WASHComponent` table

### Beneficiary Information
- **Direct Beneficiaries** ✓ → `direct_beneficiaries`
- **Indirect Beneficiaries** ✓ → `indirect_beneficiaries`
- **Beneficiary Focus** ✓ → `beneficiary_description`

### Vulnerability & Climate
- **Hotspot / Vulnerability Type** ✓ → `hotspot_vulnerability_type`

### Gender & Equity
- **Gender & Inclusion (Design + Data)** ✓ → `gender_inclusion`
- **Equity Marker** ✓ → `equity_marker` (strong/medium/weak)

### Alignment
- **Alignment (SDG / NAP / CFF)** ✓ → `alignment_nap`, `alignment_cff`, `alignment_sdg` (array)

---

## ❌ FIELDS THAT ARE **NOT** DISPLAYABLE (Missing from Database)

### 1. **Multilateral Implementing Entities** / **Implementing Entities**
   - **Excel columns**: "Multilateral Implementing Entities", "Implementing Entities", "Implementing Entities/ Ministry"
   - **Current database**: Only has generic `Agency` table with `type` field
   - **Issue**: No distinction between types like:
     - Green Climate Fund (GCF)
     - Adaptation Fund (AF)
     - World Bank
     - UNDP
     - ICIMOD
     - WMO
     - etc.
   - **What's missing**: The funding institution/multilateral entity is not properly categorized

### 2. **Executing Agency (EA)**
   - **Excel column**: "EA", "Executing Agency"
   - **Current database**: Has `Agency` table but no way to distinguish EA from other agencies
   - **Examples from Excel**: 
     - PKSF
     - IDCOL
     - DPHE
     - Chattogram WASA
     - Dhaka WASA
     - Forest Department
   - **What's missing**: No "role" field to distinguish Executing vs Implementing vs Accredited agencies

### 3. **Development Partner (DP)**
   - **Excel column**: "DP", "DP/Funding Source"
   - **Current database**: `FundingSource` has `dev_partner` field ✓, but Excel has this as a separate entity
   - **Examples from Excel**:
     - None/Not specified
     - Local Government Institutions, NGOs
     - Ministry of Water Resources
     - Community-Based Organizations
     - WB (IDA) / AIIB
   - **What's missing**: Multiple DPs per project (array), distinguished from funding source

### 4. **Climate Relevance Score (%)**
   - **Excel column**: "Climate Relevance Score (%)"
   - **Examples from Excel**:
     - "57% – High. Strong WASH & MAR systems..."
     - "45% – Moderate-High..."
     - "65-70% (High) Strong adaptation project..."
   - **Current database**: No field for this
   - **What's missing**: Numeric score (0-100%) + relevance category (High/Moderate/Low) + justification text

### 5. **Equity Marker Description**
   - **Excel column**: Full text descriptions for equity
   - **Examples**:
     - "Strong: Equity is integrated throughout design – from targeting to governance..."
     - "Partial: Gender-sensitive workplace reforms, but lacks mechanisms..."
   - **Current database**: Has `equity_marker_description` ✓ (Actually this IS in database)
   - **Status**: ✅ DISPLAYABLE (I was wrong - this exists)

### 6. **Project Type/Category Distinction**
   - **Excel sheets**: Separate sheets for GCF, AF, GEF, ERD portfolios
   - **Current database**: Only has `type` (Adaptation/Mitigation) and `sector`
   - **What's missing**: Funding mechanism categorization (GCF/AF/GEF/ERD/World Bank)

### 7. **Disbursement** (Partially missing)
   - **Excel**: Not present in sheets 1-4
   - **Database**: Has `disbursement` field ✓
   - **Status**: Database is more complete here

---

## 📊 DATA STRUCTURE ISSUES

### Issue 1: Mixed Data Types in Excel

**Co-Finance column**:
- Sometimes numeric: `7.79`
- Sometimes text: `"5.00 (PKSF loan + in-kind)"`
- Sometimes text: `"None reported"`, `"Not specified"`

**Total Financing column**:
- Sometimes numeric: `29.96`
- Sometimes formula: `"=G2+H2"`
- Sometimes text: `"550.5 (WB+AIIB loans; GoB)"`

**Year / Period column**:
- Sometimes range: `"2023–2027"`
- Sometimes year: `2021`
- Sometimes text range: `"2021-26"`

### Issue 2: Multi-line Text Fields

Many Excel fields contain:
- Multiple paragraphs
- Bullet points (✓ symbols)
- Percentages embedded in text
- Long descriptive text

**Examples**:
```
Gender & Inclusion (Design + Data):
✓ 50% beneficiaries women; priority for women-headed households. 
✓ CCAGs with ≥50% women; monthly climate & WASH meetings. 
✓ Gender Action Plan & disaggregated beneficiary tracking. 
✓ Reduces women's drudgery (3+ miles fetching water) & time poverty
```

Current database can store these in TEXT fields, but frontend may need formatting.

### Issue 3: Location Data Structure

**Excel**: Free-form text
- "Rajshahi, Naogaon, Chapainawabganj"
- "Chittagong Hill Tracts (Khagrachhari, Rangamati, Bandarban)"
- "30 rural districts across BD."
- "Nationwide"

**Database**: Uses `districts` TEXT array + separate `Location` junction table

---

## 🔍 DETAILED FIELD-BY-FIELD MAPPING

| Excel Field | Database Field | Status | Notes |
|------------|---------------|--------|-------|
| Project ID | `project_id` | ✅ | Fully compatible |
| Project Name | `title` | ✅ | Fully compatible |
| Multilateral Implementing Entities | `Agency` table | ⚠️ | No distinction, needs agency "role" field |
| EA | `Agency` table | ⚠️ | No way to mark as "executing agency" |
| DP | `FundingSource.dev_partner` | ⚠️ | Partial - exists but not as separate entity |
| Loan (USD M) | `FundingSource.loan_amount` | ✅ | Via junction table |
| Grant (USD M) | `gef_grant` | ✅ | Fully compatible |
| Co Finance (USD M) | `cofinancing` | ⚠️ | Data type issues (text vs numeric) |
| Total Financing (USD M) | `total_cost_usd` | ⚠️ | Data type issues (formulas in Excel) |
| Year / Period | `beginning`, `closing`, `approval_fy` | ⚠️ | Format differences |
| Location | `districts[]`, `geographic_division` | ⚠️ | Format differences |
| Hotspot / Vulnerability Type | `hotspot_vulnerability_type` | ✅ | Fully compatible |
| WASH Components & % Budget | `wash_component_description`, `wash_finance_percent` | ✅ | Fully compatible |
| **Climate Relevance Score (%)** | **MISSING** | ❌ | Not in database |
| Beneficiary Focus | `beneficiary_description` | ✅ | Fully compatible |
| Gender & Inclusion | `gender_inclusion` | ✅ | Fully compatible |
| Equity Marker | `equity_marker` | ✅ | Fully compatible |
| Alignment (SDG / NAP / CFF) | `alignment_nap`, `alignment_cff`, `alignment_sdg[]` | ✅ | Fully compatible |
| Assessment | `assessment` | ✅ | Fully compatible |
| Project Information | `objectives` | ✅ | Fully compatible |

---

## 📋 RECOMMENDATIONS

### Critical Missing Fields (Should Add)

1. **`climate_relevance_score`** (DECIMAL 5,2) - The percentage
2. **`climate_relevance_category`** (VARCHAR 50) - High/Moderate/Low
3. **`climate_relevance_justification`** (TEXT) - The explanation
4. **`agency_role`** field in `ProjectAgency` junction table - To distinguish EA/IE/DP

### Data Cleaning Needed Before Import

1. **Co-Finance**: Extract numeric values from text like "5.00 (PKSF loan + in-kind)"
2. **Total Financing**: Resolve formulas and text descriptions
3. **Year/Period**: Parse date ranges into `beginning` and `closing` dates
4. **Location**: Parse free text into district arrays

### Schema Changes Recommended

```sql
-- Add to Project table
ALTER TABLE Project 
ADD COLUMN climate_relevance_score DECIMAL(5,2),
ADD COLUMN climate_relevance_category VARCHAR(50),
ADD COLUMN climate_relevance_justification TEXT;

-- Add role distinction to agency relationships
ALTER TABLE ProjectAgency 
ADD COLUMN role VARCHAR(50) CHECK (role IN ('Implementing Entity', 'Executing Agency', 'Development Partner', 'Accredited Entity'));
```

---

## 📈 SHEET-BY-SHEET BREAKDOWN

### Sheet 1: Portfolio-GCF (7 projects)
- All 20 columns
- **Special**: GCF-specific formatting
- **Missing from DB**: Climate Relevance Score

### Sheet 2: Portfolio-AF (4 projects + 1 empty row)
- All 20 columns
- **Special**: AF-specific project IDs
- **Missing from DB**: Climate Relevance Score

### Sheet 3: Portfolio-GEF (35 projects)
- 21 columns (one extra compared to others)
- **Special**: Historical projects (1999-2010)
- **Data quality**: Some "Not applicable" entries
- **Missing from DB**: Climate Relevance Score

### Sheet 4: Portfolio-ERD (21 projects)
- 23 columns (most columns)
- **Special**: World Bank / AIIB projects
- **Unique fields**: More detailed financing breakdown
- **Missing from DB**: Climate Relevance Score

---

## CONCLUSION

**Displayable**: ~85% of fields
**Not Displayable**: ~15% of fields

**Main gaps**:
1. Climate Relevance Score (critical - appears in ALL sheets)
2. Agency role distinctions (IE vs EA vs DP)
3. Data type inconsistencies need cleaning

**Action needed**:
- Add 3 new columns for climate relevance score
- Add agency role to junction table
- Clean/parse Excel data before import

