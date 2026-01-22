/**
 * Data Service - Fetches real policy data from US government APIs
 *
 * Data Sources:
 * - Census Bureau API: Income, poverty, housing costs
 * - Bureau of Labor Statistics (BLS): Wages, CPI, employment
 * - HUD API: Fair Market Rents, housing affordability
 * - Federal Reserve Economic Data (FRED): Economic indicators
 */

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generic fetch with caching
 */
async function fetchWithCache(url, cacheKey) {
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log(`Using cached data for ${cacheKey}`);
      return data;
    }
  }

  // Fetch fresh data
  console.log(`Fetching fresh data from API: ${cacheKey}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  // Cache the result
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));

  return data;
}

/**
 * Census Bureau API - Income and poverty data
 * API: https://www.census.gov/data/developers/data-sets.html
 */
export async function fetchIncomeData() {
  try {
    // Using Census Bureau's American Community Survey (ACS) 1-Year Estimates
    // This fetches median household income by year
    const year = 2022; // Latest available
    const url = `https://api.census.gov/data/${year}/acs/acs1?get=NAME,B19013_001E&for=us:*`;

    const data = await fetchWithCache(url, 'census_income');

    // Parse Census data format: [["NAME","B19013_001E","us"],["United States","$74,580","1"]]
    if (data && data.length > 1) {
      const medianIncome = parseInt(data[1][1].replace(/[$,]/g, ''));
      return {
        medianHouseholdIncome: medianIncome,
        year: year,
        source: 'Census Bureau ACS'
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching Census income data:', error);
    return null;
  }
}

/**
 * BLS API - Consumer Price Index and wage data
 * API: https://www.bls.gov/developers/
 * Note: BLS API requires registration for a key (free), but has public access with limits
 */
export async function fetchCPIData() {
  try {
    // Consumer Price Index for All Urban Consumers (CPI-U)
    const seriesId = 'CUUR0000SA0'; // All items in U.S. city average
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 6; // Get last 6 years

    const url = `https://api.bls.gov/publicAPI/v2/timeseries/data/${seriesId}?startyear=${startYear}&endyear=${currentYear}`;

    const response = await fetchWithCache(url, 'bls_cpi');

    if (response && response.Results && response.Results.series) {
      const series = response.Results.series[0];
      const yearlyData = {};

      // BLS returns monthly data, we'll calculate annual averages
      series.data.forEach(item => {
        const year = parseInt(item.year);
        if (!yearlyData[year]) {
          yearlyData[year] = [];
        }
        yearlyData[year].push(parseFloat(item.value));
      });

      // Calculate annual averages and growth rates
      const years = Object.keys(yearlyData).sort();
      const cpiByYear = years.map(year => ({
        year: parseInt(year),
        cpi: yearlyData[year].reduce((a, b) => a + b) / yearlyData[year].length
      }));

      return {
        cpiData: cpiByYear,
        source: 'Bureau of Labor Statistics'
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching BLS CPI data:', error);
    return null;
  }
}

/**
 * HUD API - Fair Market Rents
 * API: https://www.huduser.gov/portal/dataset/fmr-api.html
 * Requires API key from environment variable VITE_HUD_API_KEY
 */
export async function fetchHousingData() {
  try {
    const apiKey = import.meta.env.VITE_HUD_API_KEY;

    if (!apiKey) {
      console.warn('HUD API key not found in environment variables');
      return null;
    }

    // Fair Market Rents for US metros
    // Using national summary data
    const year = new Date().getFullYear();
    const url = `https://www.huduser.gov/hudapi/public/fmr/data/national?year=${year}`;

    // HUD API requires Bearer token authentication
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HUD API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    localStorage.setItem('hud_fmr', JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return {
      fairMarketRents: data,
      year: year,
      source: 'HUD Fair Market Rents'
    };
  } catch (error) {
    console.error('Error fetching HUD housing data:', error);
    return null;
  }
}

/**
 * MIT Living Wage Calculator API (if available)
 * Alternative: We can calculate living wage based on federal poverty guidelines
 */
export async function fetchLivingWageData() {
  try {
    // Federal Poverty Guidelines are published by HHS
    // For 2024, FPL for 1 person is $15,060
    // Living wage is typically calculated as ~200% of FPL

    const federalPovertyLevel = 15060; // 2024 FPL for 1 person (48 contiguous states)
    const livingWageMultiplier = 2.0;

    const annualLivingWage = federalPovertyLevel * livingWageMultiplier;
    const hourlyLivingWage = annualLivingWage / 2080; // 40 hours/week * 52 weeks

    return {
      hourlyLivingWage: Math.round(hourlyLivingWage * 100) / 100,
      annualLivingWage: annualLivingWage,
      federalPovertyLevel: federalPovertyLevel,
      calculation: '200% of Federal Poverty Level',
      source: 'HHS Poverty Guidelines'
    };
  } catch (error) {
    console.error('Error calculating living wage:', error);
    return null;
  }
}

/**
 * Federal minimum wage data
 */
export function getFederalMinimumWage() {
  return {
    hourlyRate: 7.25,
    lastIncreased: '2009-07-24',
    annualIncome: 7.25 * 2080, // Full-time annual
    source: 'US Department of Labor'
  };
}

/**
 * Calculate tax burden estimates
 * Based on 2024 federal tax brackets and standard deduction
 */
export function calculateTaxBurden(income) {
  const standardDeduction = 14600; // 2024 single filer
  const taxableIncome = Math.max(0, income - standardDeduction);

  // 2024 federal tax brackets (single filer)
  const brackets = [
    { limit: 11600, rate: 0.10 },
    { limit: 47150, rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(taxableIncome - previousLimit, bracket.limit - previousLimit);
      tax += taxableInBracket * bracket.rate;
    }
    previousLimit = bracket.limit;
    if (taxableIncome <= bracket.limit) break;
  }

  // Add estimated FICA (7.65% for employee portion)
  const ficaTax = Math.min(income, 168600) * 0.0765; // Social Security wage base
  const totalTax = tax + ficaTax;

  return {
    federalIncomeTax: Math.round(tax),
    ficaTax: Math.round(ficaTax),
    totalFederalTax: Math.round(totalTax),
    effectiveRate: income > 0 ? Math.round((totalTax / income) * 1000) / 10 : 0
  };
}

/**
 * Transportation cost estimates based on AAA and BTS data
 */
export function getTransportationCosts() {
  return {
    carOwnership: {
      monthly: 1015, // AAA 2024: includes loan, insurance, gas, maintenance, depreciation
      annual: 12180,
      source: 'AAA Your Driving Costs 2024'
    },
    publicTransit: {
      // National average, varies by city
      monthly: 95,
      annual: 1140,
      source: 'American Public Transportation Association'
    },
    bikeshare: {
      monthly: 20,
      annual: 240,
      source: 'National bikeshare programs average'
    }
  };
}

/**
 * Clear all cached data (for refresh functionality)
 */
export function clearDataCache() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('census_') || key.startsWith('bls_') || key.startsWith('hud_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('Data cache cleared');
}
