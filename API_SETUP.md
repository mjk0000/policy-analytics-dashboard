# API Setup Documentation

## Overview

Your Policy Analytics Dashboard now integrates with **all available federal government APIs** to provide real-time data on affordability and cost of living.

## API Status

### ✅ Fully Configured APIs

All three federal data APIs are now working:

#### 1. Census Bureau API
- **Status**: ✅ Active (no API key required)
- **Data**: Median household income
- **Source**: American Community Survey (ACS) 1-Year Estimates
- **Latest Data**: 2022 (2023 releases September 2024)
- **Update Frequency**: Annual
- **Documentation**: https://www.census.gov/data/developers/data-sets.html

#### 2. Bureau of Labor Statistics (BLS) API
- **Status**: ✅ Active (no API key required for basic use)
- **Data**: Consumer Price Index (CPI), inflation data
- **Source**: BLS Public Data API
- **Update Frequency**: Monthly
- **Rate Limit**: 25 requests/day (without registration)
- **Optional Enhancement**: Register at https://data.bls.gov/registrationEngine/ for 500 requests/day
- **Documentation**: https://www.bls.gov/developers/

#### 3. HUD API (Housing and Urban Development)
- **Status**: ✅ Active (API key configured)
- **Data**: Fair Market Rents (FMR) for national and metro areas
- **Source**: HUD User Data API
- **Update Frequency**: Annual (Fiscal Year updates)
- **API Key**: Stored in `.env` file (secured via `.gitignore`)
- **Documentation**: https://www.huduser.gov/portal/dataset/fmr-api.html

## Environment Configuration

### .env File

Your API key is stored in `/Users/michaeljkeeley/Documents/ClaudeCode/.env`:

```bash
VITE_HUD_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGci...
```

**Security Notes:**
- ✅ This file is **excluded from git** via `.gitignore`
- ✅ Never commit this file to version control
- ✅ If you share this project, provide instructions for users to get their own HUD API key

### Getting a New HUD API Key

If you need to regenerate or get a new key:

1. Visit: https://www.huduser.gov/portal/dataset/fmr-api.html
2. Click "Register for API Token"
3. Fill out the registration form (free, instant approval)
4. Check your email for the JWT token
5. Update the `VITE_HUD_API_KEY` value in `.env`
6. Restart the dev server: `npm run dev`

## Data Caching

The dashboard caches API responses for **24 hours** to:
- Reduce API calls and respect rate limits
- Improve performance
- Work offline after initial data load

### Manual Cache Refresh

To force fetch fresh data:
1. Click the "↻ Refresh Data" button in the dashboard header, OR
2. Run in browser console: `localStorage.clear()`

### Cache Keys

Data is stored in browser localStorage with these keys:
- `census_income` - Census median income data
- `bls_cpi` - BLS Consumer Price Index data
- `hud_fmr` - HUD Fair Market Rents data

## Static/Calculated Data

Some data doesn't require API calls because it's either static or calculated:

### Federal Minimum Wage
- **Value**: $7.25/hour
- **Last Increased**: July 24, 2009
- **Source**: US Department of Labor
- **Note**: Hardcoded because it hasn't changed since 2009

### 2024 Tax Brackets
- **Source**: IRS 2024 tax tables
- **Includes**: Federal income tax + FICA (Social Security + Medicare)
- **Calculation**: Progressive brackets applied to taxable income
- **Updates**: Manually updated annually when IRS releases new brackets

### Living Wage
- **Calculation**: 200% of Federal Poverty Level
- **2024 FPL**: $15,060 for 1 person (48 states + DC)
- **Living Wage**: $14.47/hour ($30,120/year)
- **Source**: HHS Poverty Guidelines
- **Updates**: Annually when HHS publishes new guidelines

### Transportation Costs
- **Car Ownership**: $1,015/month average (AAA 2024)
- **Public Transit**: $95/month average (APTA)
- **Bikeshare**: $20/month average
- **Note**: National averages, not API-sourced

### Budget Expenditures
- **Source**: BLS Consumer Expenditure Survey 2022
- **Values**: Median household expenditures by category
- **Note**: Using published median values (not API-sourced)

## Data Freshness Summary

| Data Source | Latest Available | Update Frequency | Last Updated |
|-------------|------------------|------------------|--------------|
| Census Income | 2022 | Annual (Sept release) | Sept 2023 |
| BLS CPI | Current month | Monthly | Live |
| HUD FMR | FY 2024 | Annual | Oct 2023 |
| Federal Min Wage | 2009 | As legislated | July 2009 |
| Tax Brackets | 2024 | Annual | Jan 2024 |
| Federal Poverty Level | 2024 | Annual | Jan 2024 |

## API Integration Details

### How the APIs Work

The dashboard fetches data on initial load and caches responses:

```javascript
// src/services/dataService.js - Main API integration
export async function fetchIncomeData() {
  // Fetches from Census Bureau API
  // Caches for 24 hours
}

export async function fetchCPIData() {
  // Fetches from BLS API
  // Caches for 24 hours
}

export async function fetchHousingData() {
  // Fetches from HUD API with Bearer token
  // Caches for 24 hours
}
```

### Data Flow

1. **User loads dashboard** → `usePolicyData()` hook triggers
2. **Parallel API calls** → All three APIs called simultaneously
3. **Cache check** → Returns cached data if < 24 hours old
4. **Fresh fetch** → If no cache or expired, fetches from API
5. **Store cache** → Saves response to localStorage
6. **Render** → Components receive data via props

## Troubleshooting

### HUD API Not Working

If you see "Error loading data" or the Housing tab shows fallback data:

1. **Check API key**: Verify `.env` file exists and contains valid key
2. **Restart server**: Environment variables only load on server start
3. **Check console**: Open browser DevTools (F12) and look for errors
4. **Test API key**: Visit HUD API docs and test your key directly
5. **Regenerate key**: If expired, get a new key from HUD

### BLS API Rate Limit

If you see BLS errors:
- You've hit the 25 requests/day limit
- Wait until tomorrow, OR
- Register for a free API key (500 requests/day limit)

### Census API Issues

The Census API has no authentication and generous rate limits. If it fails:
- Check your internet connection
- Try again in a few minutes
- Census servers may be temporarily down

### Clear All Data

To completely reset:
```bash
# In browser console
localStorage.clear()

# Then refresh the page
location.reload()
```

## Next Steps

### Optional Enhancements

1. **Register for BLS API key** (optional, for higher rate limits)
   - Visit: https://data.bls.gov/registrationEngine/
   - Add to `.env` as `VITE_BLS_API_KEY`
   - Update `fetchCPIData()` to include key in request

2. **Add state-specific data** (future enhancement)
   - State minimum wages
   - State tax rates
   - Metro-area Fair Market Rents from HUD

3. **Export functionality** (future enhancement)
   - CSV export for budget data
   - PDF report generation
   - Shareable links

## Support

- **HUD API Issues**: https://www.huduser.gov/portal/dataset/fmr-api.html
- **Census API Issues**: https://www.census.gov/data/developers/about.html
- **BLS API Issues**: https://www.bls.gov/developers/

---

**Dashboard Running At**: http://localhost:3001/

**All APIs**: ✅ Active and configured
