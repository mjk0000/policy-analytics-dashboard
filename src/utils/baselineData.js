/**
 * Baseline Economic Data - Shared Constants
 *
 * This file provides a single source of truth for baseline economic data
 * used across multiple components (BudgetOverview, PolicyComparison, etc.)
 *
 * All values are MEDIAN (not mean/average) and use AFTER-TAX income for
 * affordability calculations, as verified in AUDIT_FINDINGS.md
 */

/**
 * Median Income Data
 * Source: Census Bureau ACS 2022
 */
export const MEDIAN_INCOME = {
  household: 74580,      // Median household income
  individual: 44000,     // Median individual (full-time single earner)
};

/**
 * Effective Tax Rates
 * Includes Federal income tax + FICA (Social Security + Medicare)
 * Based on 2024 tax brackets and median income levels
 */
export const EFFECTIVE_TAX_RATES = {
  household: 0.18,       // 18% effective rate for median household
  individual: 0.15,      // 15% effective rate for median individual
};

/**
 * Calculate after-tax income
 */
export function getAfterTaxIncome(income, taxRate) {
  return income * (1 - taxRate);
}

/**
 * Median Monthly Household Expenses
 * Source: BLS Consumer Expenditure Survey 2022 (median values, not mean)
 * Total: $4,840/month = $58,080/year
 */
export const MEDIAN_HOUSEHOLD_EXPENSES = {
  housing: 1650,          // Rent/mortgage, utilities, maintenance
  transportation: 800,    // Vehicle, gas, insurance, public transit
  food: 670,              // Groceries and dining
  healthcare: 380,        // Out-of-pocket costs
  insurance: 420,         // Pensions/SS, property insurance
  entertainment: 250,     // Recreation, entertainment
  other: 670,             // Clothing, personal care, education, etc.
};

/**
 * Median Monthly Individual Expenses
 * Source: BLS Consumer Expenditure Survey 2022 (single-person households)
 * Total: $3,150/month = $37,800/year
 */
export const MEDIAN_INDIVIDUAL_EXPENSES = {
  housing: 1200,          // Singles pay more per person
  transportation: 550,    // Lower than household but higher per capita
  food: 400,              // Lower than household
  healthcare: 300,        // Out-of-pocket costs
  insurance: 250,         // Lower than household
  other: 450,             // Clothing, personal care, etc.
};

/**
 * Calculate total expenses
 */
export function getTotalExpenses(expenseObject) {
  return Object.values(expenseObject).reduce((sum, val) => sum + val, 0);
}

/**
 * Baseline Budget Calculations
 * Returns comprehensive budget data for household or individual
 */
export function getBaselineBudget(type = 'household') {
  const isHousehold = type === 'household';

  const income = isHousehold ? MEDIAN_INCOME.household : MEDIAN_INCOME.individual;
  const taxRate = isHousehold ? EFFECTIVE_TAX_RATES.household : EFFECTIVE_TAX_RATES.individual;
  const expenses = isHousehold ? MEDIAN_HOUSEHOLD_EXPENSES : MEDIAN_INDIVIDUAL_EXPENSES;

  const afterTaxIncome = getAfterTaxIncome(income, taxRate);
  const monthlyAfterTax = Math.round(afterTaxIncome / 12);
  const totalExpenses = getTotalExpenses(expenses);
  const disposableIncome = monthlyAfterTax - totalExpenses;

  return {
    // Income
    preTaxIncome: income,
    taxRate: taxRate,
    afterTaxIncome: afterTaxIncome,
    monthlyAfterTax: monthlyAfterTax,
    annualTaxBurden: Math.round(income * taxRate),

    // Expenses (all monthly)
    expenses: expenses,
    totalExpenses: totalExpenses,

    // Disposable Income
    disposableIncome: disposableIncome,
    disposablePercent: ((disposableIncome / monthlyAfterTax) * 100).toFixed(1),

    // Annual projections
    annualDisposable: disposableIncome * 12,
  };
}

/**
 * Quick accessor for current baseline values
 */
export const CURRENT_BASELINE = {
  household: getBaselineBudget('household'),
  individual: getBaselineBudget('individual'),
};

/**
 * Wealth and Debt Data
 * Source: Federal Reserve Survey of Consumer Finances 2022
 */
export const MEDIAN_WEALTH_DEBT = {
  netWorth: 192900,      // Median household net worth
  totalDebt: 67000,      // Median household debt
  totalAssets: 259900,   // Total assets (net worth + debt)
};

/**
 * Verify that calculations match expected values
 * Run this as a sanity check
 */
export function verifyBaselineData() {
  const household = getBaselineBudget('household');
  const individual = getBaselineBudget('individual');

  const checks = [
    { name: 'Household monthly after-tax', value: household.monthlyAfterTax, expected: 5096 },
    { name: 'Household total expenses', value: household.totalExpenses, expected: 4840 },
    { name: 'Household disposable income', value: household.disposableIncome, expected: 256 },
    { name: 'Individual monthly after-tax', value: individual.monthlyAfterTax, expected: 3117 },
    { name: 'Individual total expenses', value: individual.totalExpenses, expected: 3150 },
    { name: 'Individual disposable income', value: individual.disposableIncome, expected: -33 },
  ];

  const failures = checks.filter(check => check.value !== check.expected);

  if (failures.length > 0) {
    console.error('❌ Baseline data verification FAILED:');
    failures.forEach(f => {
      console.error(`  ${f.name}: Expected ${f.expected}, got ${f.value}`);
    });
    return false;
  } else {
    console.log('✅ Baseline data verification PASSED - all values correct!');
    return true;
  }
}

// Auto-verify on import in development
if (import.meta.env.DEV) {
  verifyBaselineData();
}
