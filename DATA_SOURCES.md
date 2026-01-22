# Federal Data Sources

This document describes the federal data sources used in the Policy Analytics Dashboard and how to work with them.

## Overview

The dashboard automatically fetches real data from U.S. government APIs to provide accurate, up-to-date policy analysis. Data is cached for 24 hours to minimize API calls and improve performance.

## Data Sources

### 1. U.S. Census Bureau API
**Used For:** Median household income, demographics

**API Endpoint:** `https://api.census.gov/data/{year}/acs/acs1`

**Dataset:** American Community Survey (ACS) 1-Year Estimates

**Variables:**
- `B19013_001E` - Median Household Income

**Notes:**
- No API key required for basic access
- Data typically released in September for previous year
- Most recent complete year is usually 2 years behind current year

**Documentation:** https://www.census.gov/data/developers/data-sets.html

### 2. Bureau of Labor Statistics (BLS) API
**Used For:** Consumer Price Index (CPI), inflation data

**API Endpoint:** `https://api.bls.gov/publicAPI/v2/timeseries/data/{seriesId}`

**Series IDs:**
- `CUUR0000SA0` - CPI-U, All items in U.S. city average

**Notes:**
- Public API has rate limits (25 requests/day, 10 years/query)
- Free registration available for higher limits (500 requests/day)
- Returns monthly data; we calculate annual averages

**Documentation:** https://www.bls.gov/developers/

### 3. HUD User API
**Used For:** Fair Market Rents, housing affordability data

**API Endpoint:** `https://www.huduser.gov/hudapi/public/fmr/data/national`

**Notes:**
- Provides Fair Market Rent data by metro area
- Updated annually
- No API key required for public endpoints

**Documentation:** https://www.huduser.gov/portal/dataset/fmr-api.html

### 4. Calculated Federal Data
**Used For:** Living wage, tax calculations, minimum wage

**Sources:**
- **Living Wage:** Calculated as 200% of HHS Federal Poverty Level ($15,060 for 1 person in 2024)
- **Federal Minimum Wage:** $7.25/hour (U.S. Department of Labor) - unchanged since 2009
- **Tax Calculations:** Based on 2024 IRS tax brackets and FICA rates

## Data Refresh

### Automatic Caching
Data is automatically cached in browser localStorage for 24 hours. After 24 hours, the next page load will fetch fresh data.

### Manual Refresh
Click the "Refresh Data" button in the header to clear cache and fetch fresh data immediately.

### Programmatic Refresh
```javascript
import { clearDataCache } from './services/dataService';

// Clear all cached data
clearDataCache();
```

## API Rate Limits

### Census Bureau
- No published rate limits for public API
- Recommend caching data and avoiding excessive requests

### BLS
- **Public API:** 25 requests per day, 10 years per query
- **Registered API:** 500 requests per day, 20 years per query
- Register for free at: https://data.bls.gov/registrationEngine/

### HUD
- No published rate limits
- Data updated annually, so aggressive caching is appropriate

## Data Update Frequency

| Data Source | Update Frequency | Typical Release | Dashboard Cache |
|-------------|-----------------|-----------------|----------------|
| Census Income | Annual | September (prior year) | 24 hours |
| BLS CPI | Monthly | Mid-month | 24 hours |
| HUD FMR | Annual | October/November | 24 hours |
| Tax Brackets | Annual | October (next year) | Static in code |
| Minimum Wage | As legislated | Varies | Static in code |

## Adding State/Local Data

To extend the dashboard with state or local data:

### 1. State-Specific Minimum Wage
```javascript
// In dataService.js
export function getStateMinimumWage(state) {
  const stateWages = {
    'CA': 16.00,
    'NY': 15.00,
    'FL': 12.00,
    // ... add more states
  };

  return stateWages[state] || 7.25; // Federal default
}
```

### 2. Metro-Specific Fair Market Rents
```javascript
// In dataService.js
export async function fetchMetroFMR(metroCode) {
  const url = `https://www.huduser.gov/hudapi/public/fmr/data/${metroCode}`;
  const data = await fetchWithCache(url, `hud_fmr_${metroCode}`);
  return data;
}
```

### 3. State Tax Data
State tax calculations can be added similarly to federal taxes in `calculateTaxBurden()`.

## Offline Mode

The dashboard works offline using cached data. If APIs are unavailable, fallback values ensure the app still functions:

```javascript
const medianIncome = data?.income?.medianHouseholdIncome || 74580; // Fallback
```

## Data Accuracy Notes

- **Census data:** Generally most reliable, but 1-2 years behind
- **Calculated living wage:** Based on FPL formula; actual living wage varies by location
- **National averages:** Federal data represents national averages; local costs vary significantly
- **CPI data:** May not capture all cost-of-living increases
- **Tax calculations:** Federal only; does not include state/local taxes

## Future Enhancements

Potential additional data sources:

1. **MIT Living Wage Calculator API** - More precise living wage by county
2. **FRED API (Federal Reserve)** - Economic indicators
3. **State APIs** - State-specific wage, tax, housing data
4. **Bureau of Transportation Statistics** - Detailed transportation data
5. **IRS Statistics of Income** - Tax credit utilization rates
6. **Census American Housing Survey** - Detailed housing data

## Troubleshooting

### Data Not Loading
1. Check browser console for errors
2. Verify internet connection
3. Clear cache and refresh
4. Check API status pages

### Stale Data
1. Click "Refresh Data" button
2. Clear browser localStorage manually
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

### API Errors
- Census API: Usually temporary, retry after a few minutes
- BLS API: Check rate limits, register for API key if needed
- HUD API: Data may not be available for all years/metros
