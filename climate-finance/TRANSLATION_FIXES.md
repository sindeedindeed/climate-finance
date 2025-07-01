# Pie Chart Translation Standardization

## Overview
This document outlines the comprehensive standardization of pie chart translations across all pages in the climate finance application.

## Changes Made

### 1. Centralized Translation System
- **Created**: `src/utils/chartTranslations.js`
  - Centralized all chart translations in one location
  - Provides helper functions for consistent translation handling
  - Supports both English and Bengali translations

### 2. Updated PieChartComponent
- **File**: `src/components/charts/PieChartComponent.jsx`
  - Replaced inline translations with centralized system
  - Now uses `getChartTranslation()` for all UI elements
  - Maintains consistent translation behavior across all pie charts

### 3. Updated All Pages with Pie Charts

#### LandingPage.jsx
- **Removed**: Inline translations object
- **Added**: Import of centralized translation utilities
- **Updated**: Chart data translation using `translateChartData()`
- **Updated**: Chart titles using `getChartTitle()`

#### Projects.jsx
- **Removed**: Inline translations object
- **Added**: Import of centralized translation utilities
- **Updated**: Chart data translation using `translateChartData()`
- **Updated**: Chart titles using `getChartTitle()`

#### FundingSources.jsx
- **Removed**: Inline translations object
- **Added**: Import of centralized translation utilities
- **Updated**: Chart data translation using `translateChartData()`
- **Updated**: Chart titles using `getChartTitle()`
- **Updated**: Source type labels using `getChartTranslation()`

### 4. Enhanced ChartGrid Component
- **File**: `src/components/ui/ChartGrid.jsx`
- **Added**: Language context integration
- **Added**: Automatic translation support for chart data and titles
- **Added**: Support for `translationCategory` prop for automatic data translation

## Translation Categories Supported

### Chart Titles
- `projectsByStatus` - Projects by Status
- `projectsByType` - Projects by Type
- `projectsBySector` - Projects by Sector
- `fundingByType` - Funding by Type
- `fundingBySource` - Funding by Source

### Data Categories
- `status` - Project status translations (Active, Planning, Completed, Suspended)
- `type` - Project/funding type translations (Grant, Loan, Technical, Other)
- `sector` - Sector translations (Disaster Risk Management, Water, Agriculture, Coastal, Energy)
- `source` - Source translations (Government, Donor, Private, Other)

### UI Elements
- `selected` - Selected segment label
- `amount` - Amount label in tooltips
- `percentage` - Percentage label in tooltips
- `value` - Value label in tooltips

## Helper Functions

### `getChartTranslation(language, category, key)`
- Gets translation for a specific key within a category
- Falls back to the original key if translation not found

### `translateChartData(data, language, category)`
- Translates an array of chart data objects
- Automatically translates the `name` property based on the category

### `getChartTitle(language, titleKey)`
- Gets translated chart title
- Converts title keys to proper format

## Usage Examples

### Basic Chart with Translation
```jsx
<PieChartComponent
  title={getChartTitle(language, 'projectsByStatus')}
  data={translateChartData(projectsByStatus, language, 'status')}
/>
```

### ChartGrid with Translation
```jsx
<ChartGrid
  charts={[
    {
      type: 'pie',
      title: 'Projects by Status',
      data: projectsByStatus,
      translationCategory: 'status'
    }
  ]}
/>
```

## Benefits

1. **Consistency**: All pie charts now use the same translation system
2. **Maintainability**: Translations are centralized and easy to update
3. **Scalability**: Easy to add new translation categories and languages
4. **Performance**: Reduced code duplication and improved bundle size
5. **Reliability**: Consistent fallback behavior across all charts

## Files Modified

1. `src/utils/chartTranslations.js` (NEW)
2. `src/components/charts/PieChartComponent.jsx`
3. `src/components/ui/ChartGrid.jsx`
4. `src/pages/LandingPage.jsx`
5. `src/pages/Projects.jsx`
6. `src/pages/FundingSources.jsx`

## Testing

All pie chart translations have been standardized and should now work consistently across:
- Landing Page (Projects by Sector, Projects by Status)
- Projects Page (Projects by Status, Projects by Type)
- Funding Sources Page (Funding by Type)
- Any future pages using ChartGrid with pie charts

The translation system automatically handles language switching and provides appropriate fallbacks for missing translations. 