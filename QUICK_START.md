# Quick Start Guide

Get your Policy Analytics Dashboard up and running in 5 minutes!

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The dashboard will open automatically at `http://localhost:3000`

## What You'll See

The dashboard loads with 4 tabs analyzing different policy areas:

### 1. Housing Affordability
Shows national rent burden analysis, cost-burdened households, and housing supply metrics using Census Bureau and HUD data.

### 2. Wage Analysis
Displays federal minimum wage vs. calculated living wage, median income data from Census Bureau, and real wage growth using BLS inflation data.

### 3. Tax Burden
Analyzes federal tax burden across income levels using 2024 IRS tax brackets, FICA rates, and tax credit utilization statistics.

### 4. Transportation
Compares transportation costs by mode (car ownership, public transit, bike) using AAA and Census commute data.

## Understanding the Data

### Real Federal Data
- **Green metrics** = Good/improving indicators
- **Red metrics** = Concerning/worsening indicators
- **Data sources** listed at bottom of each widget
- **Last updated** timestamp shown in header

### Refresh Data
Click the "↻ Refresh Data" button in the header to clear cache and fetch the latest federal data.

## Navigation

- **Tab Navigation**: Click tabs to switch between policy areas
- **Scroll**: Each tab has multiple widgets - scroll to see all analysis
- **Charts**: Interactive charts show trends and comparisons
- **Policy Implications**: Each tab ends with policy recommendations

## Next Steps

### Customize for Your Analysis

1. **Add State Data**: Edit `src/services/dataService.js` to include state-specific wages, taxes, or housing costs

2. **Focus on Specific Metros**: Modify HUD API calls to fetch metro-area Fair Market Rents

3. **Add More Metrics**: Create new metric cards by copying existing patterns in widget components

### Example: Adding Your State's Minimum Wage

```javascript
// In src/services/dataService.js

export function getStateMinimumWage(state) {
  const stateWages = {
    'CA': 16.00,
    'NY': 15.00,
    'TX': 7.25,  // Add your state
    // ...
  };

  return {
    hourlyRate: stateWages[state] || 7.25,
    state: state,
    source: 'State Department of Labor'
  };
}
```

Then use it in your widget:
```javascript
// In src/components/WageAnalysis.jsx

const stateMinWage = getStateMinimumWage('CA');
// Display stateMinWage.hourlyRate in a metric card
```

## Common Tasks

### Export Data
Currently manual - select and copy data from widgets. Future enhancement: Add CSV export buttons.

### Change Time Range
Currently shows recent years. To modify, edit the data arrays in widget components or update API calls to request different date ranges.

### Compare Cities
Not yet implemented. Future enhancement would add dropdown to select metro area and fetch location-specific data.

## Troubleshooting

### Data Not Loading
1. Check browser console (F12) for errors
2. Verify internet connection
3. Try clicking "Refresh Data" button
4. Some APIs have rate limits - wait a few minutes and retry

### Charts Not Displaying
1. Ensure you ran `npm install` to install Chart.js dependencies
2. Check browser console for Chart.js errors
3. Try hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)

### Stale Data
Data is cached for 24 hours. To force update:
1. Click "Refresh Data" button in header
2. Or clear browser localStorage manually
3. Or wait 24 hours for automatic refresh

## Learn More

- **DATA_SOURCES.md** - Detailed documentation on all federal data sources
- **README.md** - Full project documentation
- **CLAUDE.MD** - Project context for Claude Code assistant

## Development

### Project Structure
```
src/
  ├── services/dataService.js   # Federal API integration
  ├── hooks/usePolicyData.js    # Data fetching React hook
  ├── components/               # Widget components
  ├── App.jsx                   # Main app with tabs
  └── App.css                   # Styling
```

### Adding a New Widget

1. Create component file: `src/components/MyWidget.jsx`
2. Import Chart.js components you need
3. Use `data` and `metrics` props passed from App
4. Add metric cards and charts
5. Import in App.jsx and add to tab navigation

Example template:
```javascript
import React from 'react'
import { Bar } from 'react-chartjs-2'

function MyWidget({ data, metrics }) {
  const medianIncome = data?.income?.medianHouseholdIncome || 74580;

  return (
    <div>
      <div className="widget">
        <h2>My Analysis</h2>
        <p className="widget-description">Description here</p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Income</div>
            <div className="metric-value">${medianIncome.toLocaleString()}</div>
            <div className="metric-change">From Census Bureau</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyWidget;
```

## Support

For questions about:
- **Federal Data Sources**: See DATA_SOURCES.md
- **Code/Development**: See README.md
- **U.S. Policy Data**: Visit data.gov, Census.gov, BLS.gov

Happy analyzing! 📊
