# Project Documentation for Claude

## Project Overview
Policy Analytics Dashboard - A web-based suite of tools for analyzing affordability and cost of living policy outcomes. Built for policy and budget analysts focusing on housing, wages, taxes, and transportation issues.

**Policy Focus**: Similar to NYC affordability issues (housing costs, living wages, tax burden, transit equity)

## Directory Structure
```
/Users/michaeljkeeley/Documents/ClaudeCode/
├── src/
│   ├── components/          # Policy analysis widgets
│   │   ├── HousingAffordability.jsx
│   │   ├── WageAnalysis.jsx
│   │   ├── TaxBurden.jsx
│   │   └── TransportationCosts.jsx
│   ├── App.jsx             # Main application
│   ├── App.css             # Application styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Project Context
- **Working Directory**: `/Users/michaeljkeeley/Documents/ClaudeCode`
- **Git Repository**: Not currently a git repository
- **Platform**: macOS (Darwin 24.4.0)
- **Project Type**: React web application
- **User Experience Level**: Beginner programmer
- **Build Tool**: Vite

## Technology Stack
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Visualization**: Chart.js 4.4 + react-chartjs-2 5.2
- **Language**: JavaScript (JSX)
- **Styling**: CSS

## Development Guidelines
- Keep code simple and well-documented for beginner understanding
- Use clear variable and function names that reflect policy concepts
- Add comments explaining policy calculations and metrics
- Prioritize readability over clever optimizations

## Build and Test Commands
```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features

### 1. Housing Affordability Widget
- Rent burden analysis (30% income threshold)
- Rent vs income trends over time
- Cost-burdened household calculations
- Policy recommendations for housing crisis

### 2. Wage Analysis Widget
- Living wage calculations
- Minimum wage vs living wage gap
- Wage growth vs cost of living comparison
- Income inequality metrics (Gini coefficient)

### 3. Tax Burden Widget
- Effective tax rates by income level
- Tax credit utilization and uptake gaps
- Regressivity analysis (sales tax, property tax)
- Unclaimed benefits tracking

### 4. Transportation Costs Widget
- Cost comparison across modes (car, rideshare, transit, bike)
- Transportation burden by income level
- Transit accessibility scores by borough
- Transit equity metrics

## Data Customization
All widgets currently use sample NYC data. To customize:

1. Open the relevant component file in `src/components/`
2. Locate the data objects (e.g., `rentBurdenData`)
3. Replace `labels` array with your time periods or categories
4. Replace `data` arrays with your values
5. Update metric cards with calculated values

## Notes for Claude
- **User Goal**: Building policy analysis tools for studying affordability/cost of living issues
- **User Background**: Studying to be a policy/budget analyst, beginner programmer
- **Code Style**: Prioritize clarity and documentation over brevity
- **Sample Data**: Currently uses NYC-based examples but should be easily customizable
- **Policy Perspective**: Progressive focus on housing affordability, living wages, tax equity, transit access
- **Future Extensions**: May want to add data import, export, real-time APIs, multi-city comparisons

## Common Tasks
- Adding new policy metrics: Create metric cards in component files
- Updating data: Modify data objects in component files
- Adding new widgets: Create new component in `src/components/`, add to App.jsx
- Styling changes: Modify `src/App.css` for widget styles, `src/index.css` for global styles

---
*Last updated: 2026-01-19*
