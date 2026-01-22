# Policy Analytics Dashboard

A web-based suite of tools for analyzing affordability and cost of living policy outcomes, using **real federal data** from U.S. government APIs.

## Overview

This dashboard provides interactive visualizations and analysis tools for policy analysts studying affordability issues. All data is automatically fetched from official federal sources:

- **Housing Affordability**: Rent burden, housing supply, and affordability metrics (Census Bureau, HUD)
- **Wage Analysis**: Living wage calculations, income inequality, and wage growth trends (Census Bureau, DOL, BLS)
- **Tax Burden**: Effective tax rates, regressivity analysis, and tax credit utilization (IRS, SSA)
- **Transportation Costs**: Transit accessibility, commute costs, and transportation equity (AAA, Census Bureau)

### Key Features
- 📊 **Real Federal Data**: Automatically fetches from Census Bureau, BLS, HUD APIs
- ⚡ **Smart Caching**: 24-hour cache prevents excessive API calls
- 🔄 **Auto-Refresh**: Click button to get latest data anytime
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎯 **Policy-Focused**: Analysis and recommendations for each area

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
/
├── src/
│   ├── components/          # Widget components (with real federal data)
│   │   ├── HousingAffordability.jsx
│   │   ├── WageAnalysis.jsx
│   │   ├── TaxBurden.jsx
│   │   └── TransportationCosts.jsx
│   ├── services/
│   │   └── dataService.js   # Federal API integration
│   ├── hooks/
│   │   └── usePolicyData.js # Data fetching hook
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── DATA_SOURCES.md         # Detailed federal data documentation
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## Features & Federal Data Sources

### Housing Affordability
**Data Sources**: Census Bureau (median income), HUD (Fair Market Rents), Census Housing Survey

- Analyzes national median rent vs. median household income ($74,580)
- Calculates rent burden by income level
- Shows 46.5% of renters are cost-burdened (>30% of income on housing)
- Displays housing supply metrics and vacancy rates
- Policy recommendations based on HUD affordability standards

### Wage Analysis
**Data Sources**: Census Bureau (median income), DOL (minimum wage), BLS (CPI), HHS (poverty guidelines)

- Federal minimum wage: $7.25/hour (unchanged since 2009)
- Calculated living wage: ~$14.50/hour (200% of Federal Poverty Level)
- Shows 50% gap between minimum wage and living wage
- Real wage growth analysis using BLS Consumer Price Index data
- Income inequality metrics

### Tax Burden
**Data Sources**: IRS (2024 tax brackets), SSA (FICA rates), Treasury Department

- Effective federal tax rates by income level (10% to 35%+)
- Progressive income tax + regressive FICA analysis
- 2024 tax bracket tables with standard deduction ($14,600)
- Tax credit utilization: EITC (78% take-up), Child Tax Credit, Saver's Credit
- Identifies $billions in unclaimed tax credits annually

### Transportation Costs
**Data Sources**: AAA (car ownership costs), Census Bureau (commute data), BTS

- Car ownership: $1,015/month average (AAA 2024 data)
- Public transit: $95/month national average
- Transportation burden analysis by income level
- National commute statistics (27.6 min average one-way)
- Car dependency vs. transit access analysis

## Federal Data Integration

The dashboard automatically fetches real data from:

- **U.S. Census Bureau API** - American Community Survey (median income, demographics)
- **Bureau of Labor Statistics API** - Consumer Price Index, inflation data
- **HUD API** - Fair Market Rents (note: currently uses calculated estimates)
- **Calculated Data** - Living wage (from FPL), tax burden (from IRS brackets)

**Data Caching**: Data is cached for 24 hours in browser localStorage to minimize API calls. Click "Refresh Data" in the header to force update.

**See DATA_SOURCES.md for detailed documentation on all federal data sources.**

## Technologies Used

- **React**: UI framework
- **Vite**: Build tool and development server
- **Chart.js**: Data visualization library
- **react-chartjs-2**: React wrapper for Chart.js

## Future Enhancements

Potential additions to enhance the dashboard:

**Data Sources:**
- State-specific minimum wages and cost of living
- Metro-area housing data from HUD FMR API
- MIT Living Wage Calculator API for county-level precision
- FRED API (Federal Reserve) for economic indicators
- State tax calculation engines

**Features:**
- CSV/Excel data import/export functionality
- Export charts as images or PDFs
- Geographic comparison tools (state-to-state, city-to-city)
- Time-series analysis with user-configurable date ranges
- Interactive map visualizations
- Policy scenario modeling ("what-if" analysis)
- Email/PDF report generation

## Learning Resources

- [React Documentation](https://react.dev/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

## License

This project is for educational and analytical purposes.
