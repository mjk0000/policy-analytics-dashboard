import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {
  MEDIAN_INCOME,
  MEDIAN_HOUSEHOLD_EXPENSES,
  MEDIAN_INDIVIDUAL_EXPENSES,
  MEDIAN_WEALTH_DEBT,
  EFFECTIVE_TAX_RATES,
  getBaselineBudget
} from '../utils/baselineData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

/**
 * Budget Overview Widget - Comprehensive household financial analysis
 * Data sources: Census Bureau (income, Consumer Expenditure Survey), Federal Reserve (wealth/debt)
 */
function BudgetOverview({ data, metrics }) {
  const medianIncome = data?.income?.medianHouseholdIncome || MEDIAN_INCOME.household;

  // Use shared baseline data for all calculations
  const effectiveTaxRate = EFFECTIVE_TAX_RATES.household;
  const afterTaxIncome = medianIncome * (1 - effectiveTaxRate);
  const monthlyAfterTaxIncome = Math.round(afterTaxIncome / 12);

  // Import median household expenditures from baselineData
  const housingCost = MEDIAN_HOUSEHOLD_EXPENSES.housing;
  const transportationCost = MEDIAN_HOUSEHOLD_EXPENSES.transportation;
  const foodCost = MEDIAN_HOUSEHOLD_EXPENSES.food;
  const healthcareCost = MEDIAN_HOUSEHOLD_EXPENSES.healthcare;
  const insuranceCost = MEDIAN_HOUSEHOLD_EXPENSES.insurance;
  const entertainmentCost = MEDIAN_HOUSEHOLD_EXPENSES.entertainment;
  const otherCost = MEDIAN_HOUSEHOLD_EXPENSES.other;

  // Additional costs from other tabs (childcare, student loans)
  const childcareCost = 950; // Monthly preschool care (from ChildcareEducation tab)
  const studentLoanPayment = 280; // Median monthly payment (from ChildcareEducation tab)

  const totalExpenses = housingCost + transportationCost + foodCost +
                        healthcareCost + insuranceCost + entertainmentCost + otherCost;

  // Expenses including optional childcare and student loans (not all households have these)
  const totalWithChildcare = totalExpenses + childcareCost;
  const totalWithStudentLoans = totalExpenses + studentLoanPayment;
  const totalWithBoth = totalExpenses + childcareCost + studentLoanPayment;

  const disposableIncome = monthlyAfterTaxIncome - totalExpenses;
  const disposablePercent = ((disposableIncome / monthlyAfterTaxIncome) * 100).toFixed(1);

  // Household budget breakdown chart
  const budgetBreakdown = {
    labels: ['Housing', 'Transportation', 'Food', 'Healthcare', 'Insurance/Pensions', 'Entertainment', 'Other'],
    datasets: [
      {
        label: 'Monthly Spending ($)',
        data: [housingCost, transportationCost, foodCost, healthcareCost, insuranceCost, entertainmentCost, otherCost],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fa709a',
          '#feca57'
        ]
      }
    ]
  };

  // Income vs Expenses pie chart
  const incomeVsExpenses = {
    labels: ['Total Expenses', 'Disposable Income'],
    datasets: [
      {
        data: [totalExpenses, disposableIncome],
        backgroundColor: [
          '#ef4444',
          '#22c55e'
        ]
      }
    ]
  };

  // Individual (single person) budget - using shared baseline data
  const medianIndividualIncome = MEDIAN_INCOME.individual;
  const individualEffectiveTaxRate = EFFECTIVE_TAX_RATES.individual;
  const individualAfterTaxIncome = medianIndividualIncome * (1 - individualEffectiveTaxRate);
  const monthlyIndividualAfterTax = Math.round(individualAfterTaxIncome / 12);

  // Import individual expenditures from baselineData
  const individualHousing = MEDIAN_INDIVIDUAL_EXPENSES.housing;
  const individualTransport = MEDIAN_INDIVIDUAL_EXPENSES.transportation;
  const individualFood = MEDIAN_INDIVIDUAL_EXPENSES.food;
  const individualHealthcare = MEDIAN_INDIVIDUAL_EXPENSES.healthcare;
  const individualInsurance = MEDIAN_INDIVIDUAL_EXPENSES.insurance;
  const individualOther = MEDIAN_INDIVIDUAL_EXPENSES.other;

  const individualExpenses = individualHousing + individualTransport + individualFood +
                             individualHealthcare + individualInsurance + individualOther;
  const individualDisposable = monthlyIndividualAfterTax - individualExpenses;

  // Wealth and debt data from baselineData
  const medianNetWorth = MEDIAN_WEALTH_DEBT.netWorth;
  const medianDebt = MEDIAN_WEALTH_DEBT.totalDebt;
  const medianAssets = MEDIAN_WEALTH_DEBT.totalAssets;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  return (
    <div>
      <div className="widget">
        <h2>Household Budget Overview</h2>
        <p className="widget-description">
          Comprehensive analysis of median household finances including income, spending, wealth, and debt.
          Based on Census Bureau income data, BLS Consumer Expenditure Survey, and Federal Reserve
          Survey of Consumer Finances.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Household Income</div>
            <div className="metric-value">${medianIncome.toLocaleString()}</div>
            <div className="metric-change">Pre-tax annual</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">After-Tax Income</div>
            <div className="metric-value">${monthlyAfterTaxIncome.toLocaleString()}</div>
            <div className="metric-change">Per month (18% taxes)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Monthly Expenses</div>
            <div className="metric-value">${totalExpenses.toLocaleString()}</div>
            <div className="metric-change">{((totalExpenses / monthlyAfterTaxIncome) * 100).toFixed(0)}% of after-tax income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Monthly Disposable Income</div>
            <div className="metric-value">${disposableIncome.toLocaleString()}</div>
            <div className={`metric-change ${disposableIncome > 0 ? 'positive' : 'negative'}`}>
              {disposablePercent}% remaining
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Annual Savings Potential</div>
            <div className="metric-value">${(disposableIncome * 12).toLocaleString()}</div>
            <div className="metric-change positive">If all disposable saved</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Federal + FICA Taxes</div>
            <div className="metric-value">${Math.round(medianIncome * effectiveTaxRate).toLocaleString()}</div>
            <div className="metric-change">Annual tax burden</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Largest Expense</div>
            <div className="metric-value">Housing</div>
            <div className="metric-change">${housingCost.toLocaleString()}/month</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Essential Spending</div>
            <div className="metric-value">{(((housingCost + foodCost + healthcareCost) / monthlyAfterTaxIncome) * 100).toFixed(0)}%</div>
            <div className="metric-change">Housing + Food + Healthcare</div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Cost Burden Index by Category</h4>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Percentage of after-tax income consumed by major expense categories
          </p>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Housing Burden</div>
              <div className="metric-value">{((housingCost / monthlyAfterTaxIncome) * 100).toFixed(1)}%</div>
              <div className={`metric-change ${((housingCost / monthlyAfterTaxIncome) * 100) > 30 ? 'negative' : 'positive'}`}>
                {((housingCost / monthlyAfterTaxIncome) * 100) > 30 ? 'Above' : 'Below'} 30% threshold
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Transportation Burden</div>
              <div className="metric-value">{((transportationCost / monthlyAfterTaxIncome) * 100).toFixed(1)}%</div>
              <div className="metric-change">${transportationCost}/month</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Food Burden</div>
              <div className="metric-value">{((foodCost / monthlyAfterTaxIncome) * 100).toFixed(1)}%</div>
              <div className="metric-change">${foodCost}/month</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Healthcare Burden</div>
              <div className="metric-value">{((healthcareCost / monthlyAfterTaxIncome) * 100).toFixed(1)}%</div>
              <div className="metric-change">${healthcareCost}/month</div>
            </div>
          </div>
          <div style={{marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
            <strong>Affordability Context:</strong> Housing above 30%, combined housing+transport above 45%,
            or total essential costs (housing+food+healthcare) above 50% indicates cost burden.
            Median household: Housing {((housingCost / monthlyAfterTaxIncome) * 100).toFixed(0)}%,
            H+T {(((housingCost + transportationCost) / monthlyAfterTaxIncome) * 100).toFixed(0)}%,
            Essentials {(((housingCost + foodCost + healthcareCost) / monthlyAfterTaxIncome) * 100).toFixed(0)}%.
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Median Household Monthly Budget Breakdown</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Based on BLS Consumer Expenditure Survey median percentages
          </p>
          <Bar data={budgetBreakdown} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Income Allocation: Expenses vs Disposable Income</h3>
          <Doughnut data={incomeVsExpenses} options={pieOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Individual (Single Person) Budget</h2>
        <p className="widget-description">
          Median budget for single-person households. Individual income is typically lower and
          spending proportions differ from multi-person households.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Individual Income</div>
            <div className="metric-value">${medianIndividualIncome.toLocaleString()}</div>
            <div className="metric-change">Pre-tax annual</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">After-Tax Income</div>
            <div className="metric-value">${monthlyIndividualAfterTax.toLocaleString()}</div>
            <div className="metric-change">Per month (15% taxes)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Monthly Expenses</div>
            <div className="metric-value">${individualExpenses.toLocaleString()}</div>
            <div className="metric-change">{((individualExpenses / monthlyIndividualAfterTax) * 100).toFixed(0)}% of after-tax income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Monthly Disposable Income</div>
            <div className="metric-value">${individualDisposable.toLocaleString()}</div>
            <div className={`metric-change ${individualDisposable > 0 ? 'positive' : 'negative'}`}>
              {((individualDisposable / monthlyIndividualAfterTax) * 100).toFixed(1)}% remaining
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Housing Burden</div>
            <div className="metric-value">{((individualHousing / monthlyIndividualAfterTax) * 100).toFixed(0)}%</div>
            <div className="metric-change negative">Above 30% threshold</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Annual Savings Potential</div>
            <div className="metric-value">${(individualDisposable * 12).toLocaleString()}</div>
            <div className="metric-change">If all disposable saved</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Essential Spending</div>
            <div className="metric-value">{(((individualHousing + individualFood + individualHealthcare) / monthlyIndividualAfterTax) * 100).toFixed(0)}%</div>
            <div className="metric-change">Housing + Food + Healthcare</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Annual Taxes</div>
            <div className="metric-value">${Math.round(medianIndividualIncome * individualEffectiveTaxRate).toLocaleString()}</div>
            <div className="metric-change">Federal + FICA burden</div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Individual Monthly Budget Detail</h4>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Housing</div>
              <div className="metric-value">${individualHousing.toLocaleString()}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Transportation</div>
              <div className="metric-value">${individualTransport.toLocaleString()}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Food</div>
              <div className="metric-value">${individualFood.toLocaleString()}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Healthcare</div>
              <div className="metric-value">${individualHealthcare.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Wealth & Debt Analysis</h2>
        <p className="widget-description">
          Median household wealth and debt levels from Federal Reserve Survey of Consumer Finances.
          Net worth = Assets - Debt.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Net Worth</div>
            <div className="metric-value">${medianNetWorth.toLocaleString()}</div>
            <div className="metric-change">Federal Reserve SCF 2022</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Total Assets</div>
            <div className="metric-value">${medianAssets.toLocaleString()}</div>
            <div className="metric-change">Includes home, savings, investments</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Total Debt</div>
            <div className="metric-value">${medianDebt.toLocaleString()}</div>
            <div className="metric-change">Mortgage, auto, student, credit cards</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Debt-to-Income Ratio</div>
            <div className="metric-value">{((medianDebt / medianIncome) * 100).toFixed(0)}%</div>
            <div className="metric-change">Annual debt vs annual income</div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Wealth Building Metrics</h4>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Years to Save $10k Emergency Fund</div>
              <div className="metric-value">{(10000 / (disposableIncome * 12)).toFixed(1)}</div>
              <div className="metric-change">If saving all disposable income</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Homeownership Rate</div>
              <div className="metric-value">65.7%</div>
              <div className="metric-change">Census Bureau 2023</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Median Home Equity</div>
              <div className="metric-value">$200,000</div>
              <div className="metric-change">For homeowners</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Retirement Savings (Median)</div>
              <div className="metric-value">$87,000</div>
              <div className="metric-change">For households near retirement</div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Wealth Inequality Context</h4>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Understanding how median wealth compares to the broader distribution
          </p>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Mean Net Worth (Skewed)</div>
              <div className="metric-value">$1,063,700</div>
              <div className="metric-change negative">5.5x median (billionaire effect)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Top 1% Share of Wealth</div>
              <div className="metric-value">23.5%</div>
              <div className="metric-change negative">$36.2 trillion</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Bottom 50% Share of Wealth</div>
              <div className="metric-value">2.6%</div>
              <div className="metric-change negative">$4.0 trillion total</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Wealth Gini Coefficient</div>
              <div className="metric-value">0.853</div>
              <div className="metric-change negative">Extremely high inequality</div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Racial Wealth Gap</h4>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Median net worth by race shows persistent inequality from historical discrimination
          </p>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">White Median Net Worth</div>
              <div className="metric-value">$285,000</div>
              <div className="metric-change">Federal Reserve SCF 2022</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Black Median Net Worth</div>
              <div className="metric-value">$44,900</div>
              <div className="metric-change negative">16% of white wealth</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Latino Median Net Worth</div>
              <div className="metric-value">$61,600</div>
              <div className="metric-change negative">22% of white wealth</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Wealth Gap Ratio</div>
              <div className="metric-value">6.3:1</div>
              <div className="metric-change negative">White-to-Black wealth ratio</div>
            </div>
          </div>
          <div style={{marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px'}}>
            <strong>Historical Context:</strong> The wealth gap stems from slavery, Jim Crow, redlining (1934-1968),
            ongoing discrimination, and compounding over generations. Median inheritance: White families $200k vs Black families $50k.
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Financial Health Indicators</h2>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Emergency Fund Coverage</div>
            <div className="metric-value">
              {(medianNetWorth / totalExpenses).toFixed(1)} months
            </div>
            <div className={`metric-change ${(medianNetWorth / totalExpenses) >= 6 ? 'positive' : 'negative'}`}>
              {(medianNetWorth / totalExpenses) >= 6 ? 'Meets' : 'Below'} 6-month guideline
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Savings Rate Potential</div>
            <div className="metric-value">{disposablePercent}%</div>
            <div className={`metric-change ${parseFloat(disposablePercent) >= 10 ? 'positive' : 'negative'}`}>
              Target: 10-15% of income
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Credit Card Debt (Median)</div>
            <div className="metric-value">$2,700</div>
            <div className="metric-change">Among households with balances</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Student Loan Debt (Median)</div>
            <div className="metric-value">$37,850</div>
            <div className="metric-change">Among borrowers (43M Americans)</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Government Support Programs</h2>
        <p className="widget-description">
          Comprehensive view of federal, state, and local government assistance to individuals and families.
          Data shows actual receipt rates and average benefits across major programs.
        </p>

        <div style={{marginTop: '1.5rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Federal Direct Support Programs</h4>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">SNAP (Food Stamps)</div>
              <div className="metric-value">42.1M people</div>
              <div className="metric-change">Avg: $212/month per person</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Medicaid</div>
              <div className="metric-value">85.6M enrollees</div>
              <div className="metric-change">Free/low-cost healthcare</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Housing Choice Vouchers</div>
              <div className="metric-value">2.3M households</div>
              <div className="metric-change">Avg: $900/month subsidy</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">WIC (Nutrition)</div>
              <div className="metric-value">6.6M participants</div>
              <div className="metric-change">Women, infants, children</div>
            </div>
          </div>

          <div className="metric-grid" style={{marginTop: '1rem'}}>
            <div className="metric-card">
              <div className="metric-label">EITC (Tax Credit)</div>
              <div className="metric-value">25M households</div>
              <div className="metric-change">Avg: $2,541/year</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Child Tax Credit</div>
              <div className="metric-value">62M children</div>
              <div className="metric-change">$2,000 per child/year</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Free/Reduced School Lunch</div>
              <div className="metric-value">30.3M students</div>
              <div className="metric-change">61% of public school students</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">LIHEAP (Energy Assistance)</div>
              <div className="metric-value">5.1M households</div>
              <div className="metric-change">Avg: $730/year heating help</div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>State & Local Government Support</h4>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            State and local governments provide significant additional support beyond federal programs
          </p>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">State EITC (29 states)</div>
              <div className="metric-value">10M households</div>
              <div className="metric-change">Avg: $500/year additional</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">State Child Tax Credits</div>
              <div className="metric-value">12 states + DC</div>
              <div className="metric-change">$200-$1,000/child/year</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">State Childcare Subsidies</div>
              <div className="metric-value">1.4M children</div>
              <div className="metric-change">15% of eligible receive</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">State Energy Assistance</div>
              <div className="metric-value">Varies by state</div>
              <div className="metric-change">Supplements federal LIHEAP</div>
            </div>
          </div>

          <div className="metric-grid" style={{marginTop: '1rem'}}>
            <div className="metric-card">
              <div className="metric-label">State Affordable Housing</div>
              <div className="metric-value">500K+ units</div>
              <div className="metric-change">Low Income Housing Tax Credit</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Local Property Tax Relief</div>
              <div className="metric-value">Varies by locality</div>
              <div className="metric-change">Homestead exemptions, freezes</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">State Tuition Assistance</div>
              <div className="metric-value">All 50 states</div>
              <div className="metric-change">Grants, merit aid, free college</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Local Transit Subsidies</div>
              <div className="metric-value">Reduced/free fares</div>
              <div className="metric-change">Seniors, students, low-income</div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Combined Government Support Examples</h4>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Total monthly support for typical recipient households combining federal + state + local programs
          </p>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Single Parent, 2 Kids (Full Benefits)</div>
              <div className="metric-value">$2,800/month</div>
              <div className="metric-change positive">
                SNAP $600 + Housing $900 + Medicaid $800 + childcare $500
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Low-Income Senior</div>
              <div className="metric-value">$1,200/month</div>
              <div className="metric-change positive">
                Medicare $600 + SNAP $150 + Energy $60 + property tax relief $400
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Working Family, 1 Child (Partial)</div>
              <div className="metric-value">$800/month</div>
              <div className="metric-change positive">
                EITC $200 + CTC $165 + school lunch $150 + Medicaid $285
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Disabled Individual</div>
              <div className="metric-value">$1,900/month</div>
              <div className="metric-change positive">
                SSI $943 + SNAP $280 + Medicaid $600 + housing support
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '1.5rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Support Program Coverage Gaps</h4>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Percentage of eligible populations actually receiving benefits
          </p>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">SNAP Participation Rate</div>
              <div className="metric-value">82%</div>
              <div className="metric-change">18% of eligible don't receive</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Housing Voucher Waitlist</div>
              <div className="metric-value">5+ years</div>
              <div className="metric-change negative">Only 25% of eligible receive</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Childcare Subsidy Coverage</div>
              <div className="metric-value">15%</div>
              <div className="metric-change negative">85% of eligible don't receive</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">EITC Non-Claim Rate</div>
              <div className="metric-value">20%</div>
              <div className="metric-change negative">$7 billion unclaimed annually</div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Total Government Investment:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.7'}}>
            <li><strong>Federal:</strong> $1.1 trillion/year in means-tested benefits (SNAP, Medicaid, housing, etc.)</li>
            <li><strong>State:</strong> ~$200 billion/year (Medicaid match, TANF, childcare, education support)</li>
            <li><strong>Local:</strong> ~$50 billion/year (property tax relief, transit subsidies, local programs)</li>
            <li><strong>Tax Credits:</strong> $145 billion/year (EITC $73B, CTC $72B)</li>
            <li><strong>Total:</strong> ~$1.5 trillion/year supporting low- and moderate-income households</li>
          </ul>
        </div>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px'}}>
          <strong>Key Policy Gaps:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.7'}}>
            <li>Housing vouchers reach only 1 in 4 eligible households due to funding limits</li>
            <li>Childcare subsidies reach only 15% of eligible children, creating massive affordability gap</li>
            <li>State program generosity varies dramatically (CA vs TX EITC, Medicaid expansion)</li>
            <li>20% of eligible families don't claim EITC - $7B left on table due to complexity</li>
            <li>Benefit cliffs create work disincentives (lose $1 in benefits for every $0.50 earned)</li>
            <li>Asset limits ($2,000 in many states) prevent wealth building for benefit recipients</li>
          </ul>
        </div>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', borderLeft: '4px solid #22c55e', borderRadius: '4px'}}>
          <strong>State Program Innovations:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.7'}}>
            <li><strong>California:</strong> State EITC up to 85% of federal + Young Child Tax Credit $1,000</li>
            <li><strong>New York:</strong> Free college tuition (SUNY/CUNY) for families under $125k</li>
            <li><strong>Massachusetts:</strong> Universal Pre-K expansion, childcare subsidies to 50% AMI</li>
            <li><strong>Minnesota:</strong> Renter's credit, child tax credit, Working Family Credit (state EITC)</li>
            <li><strong>Colorado:</strong> Child Tax Credit + cashout EITC for zero-income households</li>
            <li><strong>Maryland:</strong> Child Tax Credit up to $500/child + expanded EITC</li>
          </ul>
        </div>
      </div>

      <div className="widget">
        <h2>Total Government Support Calculator</h2>
        <p className="widget-description">
          Calculate combined federal, state, and local support for different household scenarios.
          Shows the full value of public programs supporting families and individuals.
        </p>

        <div style={{marginTop: '1.5rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Example: Low-Income Single Parent with 2 Children</h4>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Income: $25,000/year | Location: California
          </p>

          <div style={{marginTop: '1rem'}}>
            <h5 style={{marginBottom: '0.75rem', color: '#1e40af'}}>Federal Support Programs:</h5>
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-label">SNAP (Food Assistance)</div>
                <div className="metric-value">$600/month</div>
                <div className="metric-change">Family of 3</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Housing Choice Voucher</div>
                <div className="metric-value">$900/month</div>
                <div className="metric-change">Rent subsidy</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Medicaid</div>
                <div className="metric-value">$800/month</div>
                <div className="metric-change">Health coverage value</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">EITC (Annual)</div>
                <div className="metric-value">$458/month</div>
                <div className="metric-change">$5,500/year tax credit</div>
              </div>
            </div>

            <div className="metric-grid" style={{marginTop: '1rem'}}>
              <div className="metric-card">
                <div className="metric-label">Child Tax Credit</div>
                <div className="metric-value">$333/month</div>
                <div className="metric-change">$4,000/year (2 children)</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Free School Lunch</div>
                <div className="metric-value">$150/month</div>
                <div className="metric-change">2 children</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">LIHEAP (Energy)</div>
                <div className="metric-value">$60/month</div>
                <div className="metric-change">Heating/cooling assistance</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">WIC</div>
                <div className="metric-value">$0/month</div>
                <div className="metric-change">Children over age 5</div>
              </div>
            </div>
          </div>

          <div style={{marginTop: '1.5rem'}}>
            <h5 style={{marginBottom: '0.75rem', color: '#1e40af'}}>State Support (California):</h5>
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-label">State EITC</div>
                <div className="metric-value">$250/month</div>
                <div className="metric-change">$3,000/year (85% of federal)</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Young Child Tax Credit</div>
                <div className="metric-value">$0/month</div>
                <div className="metric-change">Children over age 6</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">CalWORKs Cash Aid</div>
                <div className="metric-value">$450/month</div>
                <div className="metric-change">TANF benefit</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">State Childcare Subsidy</div>
                <div className="metric-value">$0/month</div>
                <div className="metric-change">School-age children</div>
              </div>
            </div>
          </div>

          <div style={{marginTop: '1.5rem'}}>
            <h5 style={{marginBottom: '0.75rem', color: '#1e40af'}}>Local Support:</h5>
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-label">Reduced Transit Fare</div>
                <div className="metric-value">$40/month</div>
                <div className="metric-change">Low-income discount</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Local Food Bank</div>
                <div className="metric-value">$100/month</div>
                <div className="metric-change">Supplemental food assistance</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">After-School Programs</div>
                <div className="metric-value">$200/month</div>
                <div className="metric-change">Free/reduced programs</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Utility Assistance</div>
                <div className="metric-value">$30/month</div>
                <div className="metric-change">Local energy programs</div>
              </div>
            </div>
          </div>

          <div style={{marginTop: '2rem', padding: '1.5rem', background: '#dbeafe', borderRadius: '8px', border: '2px solid #3b82f6'}}>
            <h4 style={{margin: '0 0 1rem 0', color: '#1e40af'}}>Total Monthly Support Package</h4>
            <div className="metric-grid">
              <div className="metric-card" style={{background: 'white'}}>
                <div className="metric-label">Federal Support</div>
                <div className="metric-value" style={{color: '#3b82f6'}}>$3,301/month</div>
                <div className="metric-change">$39,612/year</div>
              </div>
              <div className="metric-card" style={{background: 'white'}}>
                <div className="metric-label">State Support (CA)</div>
                <div className="metric-value" style={{color: '#3b82f6'}}>$700/month</div>
                <div className="metric-change">$8,400/year</div>
              </div>
              <div className="metric-card" style={{background: 'white'}}>
                <div className="metric-label">Local Support</div>
                <div className="metric-value" style={{color: '#3b82f6'}}>$370/month</div>
                <div className="metric-change">$4,440/year</div>
              </div>
              <div className="metric-card" style={{background: '#1e3a8a', color: 'white'}}>
                <div className="metric-label" style={{color: 'white'}}>TOTAL GOVERNMENT SUPPORT</div>
                <div className="metric-value" style={{color: '#fbbf24', fontSize: '2rem'}}>$4,371/month</div>
                <div className="metric-change" style={{color: '#fde68a'}}>$52,452/year combined support</div>
              </div>
            </div>

            <div style={{marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: '6px'}}>
              <strong>Household Budget Impact:</strong>
              <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.7', fontSize: '0.95rem'}}>
                <li>Earned Income: $25,000/year ($2,083/month)</li>
                <li>Government Support: $52,452/year ($4,371/month)</li>
                <li><strong>Total Resources: $77,452/year ($6,454/month)</strong></li>
                <li>Effective Income Boost: +210% from public programs</li>
                <li>Without support, income below poverty line ($23,030 for family of 3)</li>
                <li>With support, household has resources above median expenses</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{marginTop: '2rem'}}>
          <h4 style={{marginBottom: '1rem'}}>Additional Household Examples</h4>

          <div style={{marginBottom: '2rem'}}>
            <h5 style={{color: '#1e40af', marginBottom: '0.75rem'}}>Low-Income Senior (Age 70, $18k/year)</h5>
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-label">Social Security</div>
                <div className="metric-value">$1,500/month</div>
                <div className="metric-change">Federal</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Medicare</div>
                <div className="metric-value">$600/month</div>
                <div className="metric-change">Federal health coverage value</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">SNAP</div>
                <div className="metric-value">$150/month</div>
                <div className="metric-change">Federal food assistance</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Property Tax Relief</div>
                <div className="metric-value">$400/month</div>
                <div className="metric-change">Local (homeowner)</div>
              </div>
            </div>
            <div className="metric-grid" style={{marginTop: '0.5rem'}}>
              <div className="metric-card">
                <div className="metric-label">Energy Assistance</div>
                <div className="metric-value">$60/month</div>
                <div className="metric-change">Federal + State</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Free Transit (Senior Pass)</div>
                <div className="metric-value">$120/month</div>
                <div className="metric-change">Local</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Senior Center Meals</div>
                <div className="metric-value">$80/month</div>
                <div className="metric-change">Local</div>
              </div>
              <div className="metric-card" style={{background: '#1e3a8a', color: 'white'}}>
                <div className="metric-label" style={{color: 'white'}}>Total Support</div>
                <div className="metric-value" style={{color: '#fbbf24'}}>$1,410/month</div>
                <div className="metric-change" style={{color: '#fde68a'}}>+94% income boost</div>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h5 style={{color: '#1e40af', marginBottom: '0.75rem'}}>Working Family with 1 Child ($50k/year)</h5>
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-label">EITC</div>
                <div className="metric-value">$250/month</div>
                <div className="metric-change">Federal tax credit</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Child Tax Credit</div>
                <div className="metric-value">$167/month</div>
                <div className="metric-change">Federal</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Reduced School Lunch</div>
                <div className="metric-value">$40/month</div>
                <div className="metric-change">Federal</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Marketplace Premium Subsidy</div>
                <div className="metric-value">$285/month</div>
                <div className="metric-change">Federal ACA subsidy</div>
              </div>
            </div>
            <div className="metric-grid" style={{marginTop: '0.5rem'}}>
              <div className="metric-card">
                <div className="metric-label">State EITC (if available)</div>
                <div className="metric-value">$100/month</div>
                <div className="metric-change">State</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Childcare Subsidy (Partial)</div>
                <div className="metric-value">$300/month</div>
                <div className="metric-change">State</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">After-School Program</div>
                <div className="metric-value">$100/month</div>
                <div className="metric-change">Local</div>
              </div>
              <div className="metric-card" style={{background: '#1e3a8a', color: 'white'}}>
                <div className="metric-label" style={{color: 'white'}}>Total Support</div>
                <div className="metric-value" style={{color: '#fbbf24'}}>$1,242/month</div>
                <div className="metric-change" style={{color: '#fde68a'}}>+30% income boost</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Key Insights:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.7'}}>
            <li>Combined federal, state, and local support can exceed 200% of earned income for very low-income families</li>
            <li>Median value of support decreases as income rises, targeting those most in need</li>
            <li>Many benefits are in-kind (Medicaid, SNAP) rather than cash, supporting specific needs</li>
            <li>Geographic variation is significant - generous states (CA, NY, MA) provide 2-3x more than others</li>
            <li>Benefit cliffs remain a problem - losing benefits when income increases can discourage work</li>
            <li>Participation rates vary: Medicare/SS near 100%, housing vouchers only 25% of eligible receive</li>
          </ul>
        </div>
      </div>

      <div className="widget">
        <h2>Childcare & Education Cost Impacts</h2>
        <p className="widget-description">
          Many households face additional costs beyond the baseline budget. 33% have student loans,
          and 42% with children under 5 pay for childcare. These costs significantly reduce disposable income.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">With Preschool Childcare</div>
            <div className="metric-value">${(monthlyAfterTaxIncome - totalWithChildcare).toLocaleString()}</div>
            <div className="metric-change negative">
              Disposable: {((monthlyAfterTaxIncome - totalWithChildcare) / monthlyAfterTaxIncome * 100).toFixed(1)}% (-$950/mo)
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">With Student Loan Payment</div>
            <div className="metric-value">${(monthlyAfterTaxIncome - totalWithStudentLoans).toLocaleString()}</div>
            <div className="metric-change negative">
              Disposable: {((monthlyAfterTaxIncome - totalWithStudentLoans) / monthlyAfterTaxIncome * 100).toFixed(1)}% (-$280/mo)
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">With Both Childcare + Loans</div>
            <div className="metric-value">${(monthlyAfterTaxIncome - totalWithBoth).toLocaleString()}</div>
            <div className="metric-change negative">
              Disposable: {((monthlyAfterTaxIncome - totalWithBoth) / monthlyAfterTaxIncome * 100).toFixed(1)}% (-$1,230/mo)
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Childcare Burden</div>
            <div className="metric-value">{((childcareCost / monthlyAfterTaxIncome) * 100).toFixed(1)}%</div>
            <div className="metric-change negative">of after-tax income</div>
          </div>
        </div>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px'}}>
          <strong>Cost Burden Reality:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.7'}}>
            <li>Infant care averages $1,325/month - 26% of median household income</li>
            <li>43M Americans have student loans with median debt of $37,850</li>
            <li>Combined, these costs can consume 20%+ of household income</li>
            <li>Only 15% of eligible children receive childcare subsidies</li>
          </ul>
        </div>

        <div className="chart-container" style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1rem'}}>Household Scenario Comparison</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Disposable income remaining after expenses for different household situations
          </p>
          <Bar
            data={{
              labels: ['Baseline', 'With Childcare', 'With Student Loans', 'Both Costs'],
              datasets: [{
                label: 'Monthly Disposable Income ($)',
                data: [
                  disposableIncome,
                  monthlyAfterTaxIncome - totalWithChildcare,
                  monthlyAfterTaxIncome - totalWithStudentLoans,
                  monthlyAfterTaxIncome - totalWithBoth
                ],
                backgroundColor: ['#22c55e', '#f59e0b', '#f97316', '#ef4444'],
                borderColor: ['#16a34a', '#d97706', '#ea580c', '#dc2626'],
                borderWidth: 2
              }]
            }}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.parsed.y;
                      const percent = ((value / monthlyAfterTaxIncome) * 100).toFixed(1);
                      return `$${value.toLocaleString()} (${percent}% of income)`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Median household has only {disposablePercent}% disposable income after expenses - limited savings capacity</li>
          <li>Single individuals face higher housing burden (36% vs 33% for households), making saving more difficult</li>
          <li>Median net worth of $192,900 provides only {(medianNetWorth / totalExpenses).toFixed(1)} months expense coverage</li>
          <li>Debt-to-income ratio of {((medianDebt / medianIncome) * 100).toFixed(0)}% indicates significant debt burden</li>
          <li>35% of households are renters with no home equity, limiting wealth building</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Expand Child Tax Credit and EITC to increase disposable income for families</li>
              <li>Address housing cost burden through rent stabilization and affordable housing expansion</li>
              <li>Student loan forgiveness and reform to reduce debt burden on younger households</li>
              <li>Strengthen retirement savings incentives (expand Saver's Credit, auto-enrollment)</li>
              <li>Universal healthcare to reduce healthcare cost burden (currently 8% of budget)</li>
              <li>Increase minimum wage to living wage to boost bottom-quintile disposable income</li>
            </ul>
          </li>
        </ul>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Data Sources:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <li>Income: U.S. Census Bureau, American Community Survey</li>
            <li>Budget Breakdown: Bureau of Labor Statistics, Consumer Expenditure Survey</li>
            <li>Wealth & Debt: Federal Reserve, Survey of Consumer Finances 2022</li>
            <li>Homeownership: U.S. Census Bureau</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BudgetOverview
