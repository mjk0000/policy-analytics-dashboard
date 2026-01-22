import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { MEDIAN_HOUSEHOLD_EXPENSES, MEDIAN_INDIVIDUAL_EXPENSES, MEDIAN_INCOME } from '../utils/baselineData';

/**
 * Food & Grocery Costs Widget
 * Analyzes food spending, food insecurity, and SNAP benefits
 *
 * Data sources: BLS Consumer Expenditure Survey, USDA, Feeding America, CBPP
 */
function FoodCosts({ data, metrics }) {
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'snap'

  // Food costs from baseline data
  const householdFoodCost = MEDIAN_HOUSEHOLD_EXPENSES.food; // $670/month
  const individualFoodCost = MEDIAN_INDIVIDUAL_EXPENSES.food; // $400/month

  const medianIncome = data?.income?.medianHouseholdIncome || MEDIAN_INCOME.household;
  const afterTaxIncome = medianIncome * 0.82; // After 18% tax
  const monthlyAfterTax = Math.round(afterTaxIncome / 12);

  // Food spending breakdown (BLS 2022)
  const foodBreakdown = {
    groceries: 420, // 63% - Food at home
    dining: 250, // 37% - Food away from home (restaurants, takeout)
  };

  // Individual food breakdown
  const individualBreakdown = {
    groceries: 260, // 65% - Singles cook more at home
    dining: 140, // 35%
  };

  // USDA Food Plans (Monthly cost for 4-person family, 2022)
  const usdaFoodPlans = {
    thrifty: 975, // SNAP benefit level
    lowCost: 1235,
    moderate: 1540, // Close to median
    liberal: 1885
  };

  // Food insecurity data (Feeding America 2023)
  const foodInsecurity = {
    nationalRate: 12.8, // % of households
    childRate: 17.3, // % of children
    householdsAffected: 17000000, // 17 million households
    childrenAffected: 13100000, // 13.1 million children
  };

  // SNAP (Food Stamps) data (CBPP 2024)
  const snap = {
    participants: 42000000, // 42 million people
    averageBenefitPerPerson: 185, // $/month per person
    averageBenefitHousehold: 343, // $/month per household
    maxBenefitFamily4: 973, // Max for family of 4
    incomeLimit: 29160, // 130% FPL for family of 4 (gross income)
    netIncomeLimit: 22440, // 100% FPL for family of 4 (net income)
    participationRate: 85, // % of eligible who participate
  };

  // SNAP eligibility gap
  const snapGap = {
    eligible: snap.participants / 0.85, // ~49.4M eligible
    notReceiving: (snap.participants / 0.85) - snap.participants, // ~7.4M eligible but not receiving
    percentageGap: 15, // 15% of eligible don't receive
  };

  // Food burden calculation
  const foodBurden = ((householdFoodCost * 12) / afterTaxIncome * 100).toFixed(1);
  const individualFoodBurden = ((individualFoodCost * 12) / (MEDIAN_INCOME.individual * 0.85) * 100).toFixed(1);

  // Healthy food access (USDA Food Desert data)
  const foodDeserts = {
    peopleAffected: 23500000, // 23.5M Americans live in food deserts
    lowIncomeNoAccess: 13500000, // 13.5M low-income with no nearby grocery
    ruralAffected: 2300000, // 2.3M rural residents
    urbanAffected: 11200000, // 11.2M urban residents
  };

  // Food spending by income level
  const foodByIncome = {
    labels: ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '>$100k'],
    datasets: [
      {
        label: 'Monthly Food Spending',
        data: [350, 480, 620, 720, 920],
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 1
      }
    ]
  };

  // Food burden by income
  const burdenByIncome = {
    labels: ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '>$100k'],
    datasets: [
      {
        label: 'Food Burden (% of After-Tax Income)',
        data: [
          ((350 * 12) / (20000 * 0.85) * 100).toFixed(1),
          ((480 * 12) / (37500 * 0.82) * 100).toFixed(1),
          ((620 * 12) / (62500 * 0.82) * 100).toFixed(1),
          ((720 * 12) / (87500 * 0.82) * 100).toFixed(1),
          ((920 * 12) / (150000 * 0.78) * 100).toFixed(1),
        ],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#10b981'
        ],
        borderWidth: 1
      }
    ]
  };

  // Groceries vs Dining breakdown
  const spendingBreakdown = {
    labels: ['Groceries', 'Dining Out'],
    datasets: [
      {
        data: [foodBreakdown.groceries, foodBreakdown.dining],
        backgroundColor: ['#22c55e', '#f59e0b'],
        borderColor: ['#16a34a', '#d97706'],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="widget">
      <h2>Food & Grocery Costs Analysis</h2>
      <p className="widget-description">
        Food spending, affordability, food insecurity, and SNAP (Supplemental Nutrition Assistance Program)
        benefits. Data from BLS, USDA, Feeding America, and CBPP.
      </p>

      {/* View Mode Toggle */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={() => setViewMode('overview')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: viewMode === 'overview' ? '3px solid #3b82f6' : '3px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: viewMode === 'overview' ? 'bold' : 'normal',
            color: viewMode === 'overview' ? '#1e40af' : '#666',
            fontSize: '1rem'
          }}
        >
          🛒 Food Spending Overview
        </button>
        <button
          onClick={() => setViewMode('snap')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: viewMode === 'snap' ? '3px solid #3b82f6' : '3px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: viewMode === 'snap' ? 'bold' : 'normal',
            color: viewMode === 'snap' ? '#1e40af' : '#666',
            fontSize: '1rem'
          }}
        >
          🍎 SNAP & Food Insecurity
        </button>
      </div>

      {/* Overview Tab */}
      {viewMode === 'overview' && (
        <>
          {/* Median Food Costs */}
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Median Monthly Food Costs</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Household Food Cost</div>
              <div className="metric-value">${householdFoodCost}/mo</div>
              <div className="metric-change">{foodBurden}% of after-tax income</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Individual Food Cost</div>
              <div className="metric-value">${individualFoodCost}/mo</div>
              <div className="metric-change">{individualFoodBurden}% of after-tax income</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Groceries (Food at Home)</div>
              <div className="metric-value">${foodBreakdown.groceries}/mo</div>
              <div className="metric-change">63% of food spending</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Dining Out (Restaurants)</div>
              <div className="metric-value">${foodBreakdown.dining}/mo</div>
              <div className="metric-change">37% of food spending</div>
            </div>
          </div>

          {/* Spending Breakdown Chart */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Household Food Spending Breakdown</h3>
          <div style={{ height: '300px', maxWidth: '500px', margin: '0 auto' }}>
            <Pie data={spendingBreakdown} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${label}: $${value}/mo (${percentage}%)`;
                    }
                  }
                }
              }
            }} />
          </div>

          {/* USDA Food Plans */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>USDA Food Plans (Family of 4)</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Thrifty Plan</div>
              <div className="metric-value">${usdaFoodPlans.thrifty}/mo</div>
              <div className="metric-change">SNAP benefit level</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Low-Cost Plan</div>
              <div className="metric-value">${usdaFoodPlans.lowCost}/mo</div>
              <div className="metric-change">Basic nutrition</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Moderate Plan</div>
              <div className="metric-value" style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                ${usdaFoodPlans.moderate}/mo
              </div>
              <div className="metric-change">~Median spending</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Liberal Plan</div>
              <div className="metric-value">${usdaFoodPlans.liberal}/mo</div>
              <div className="metric-change">Higher budget</div>
            </div>
          </div>

          {/* Food Spending by Income */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Food Spending by Income Level</h3>
          <div style={{ height: '400px' }}>
            <Bar data={foodByIncome} options={chartOptions} />
          </div>

          {/* Food Burden by Income */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Food Burden by Income Level</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Lower-income households spend a much higher percentage of their income on food
          </p>
          <div style={{ height: '400px' }}>
            <Bar data={burdenByIncome} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Food Burden: ${context.parsed.y}% of after-tax income`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }} />
          </div>
        </>
      )}

      {/* SNAP & Food Insecurity Tab */}
      {viewMode === 'snap' && (
        <>
          {/* Food Insecurity Statistics */}
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Food Insecurity in America (2023)</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Food Insecurity Rate</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>{foodInsecurity.nationalRate}%</div>
              <div className="metric-change negative">{(foodInsecurity.householdsAffected / 1000000).toFixed(1)}M households</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Child Food Insecurity</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>{foodInsecurity.childRate}%</div>
              <div className="metric-change negative">{(foodInsecurity.childrenAffected / 1000000).toFixed(1)}M children</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">People in Food Deserts</div>
              <div className="metric-value" style={{ color: '#f97316' }}>
                {(foodDeserts.peopleAffected / 1000000).toFixed(1)}M
              </div>
              <div className="metric-change">No nearby grocery store</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Low-Income, No Access</div>
              <div className="metric-value" style={{ color: '#f97316' }}>
                {(foodDeserts.lowIncomeNoAccess / 1000000).toFixed(1)}M
              </div>
              <div className="metric-change">Low-income in food deserts</div>
            </div>
          </div>

          {/* SNAP Participation */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>SNAP (Food Stamps) Program</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">SNAP Participants</div>
              <div className="metric-value">{(snap.participants / 1000000).toFixed(1)}M</div>
              <div className="metric-change">People receiving benefits</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Average Benefit (Person)</div>
              <div className="metric-value">${snap.averageBenefitPerPerson}/mo</div>
              <div className="metric-change">Per person per month</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Average Benefit (Household)</div>
              <div className="metric-value">${snap.averageBenefitHousehold}/mo</div>
              <div className="metric-change">Per household per month</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Max Benefit (Family of 4)</div>
              <div className="metric-value">${snap.maxBenefitFamily4}/mo</div>
              <div className="metric-change">Maximum monthly benefit</div>
            </div>
          </div>

          {/* SNAP Eligibility */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>SNAP Eligibility & Participation Gap</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Income Limit (Gross)</div>
              <div className="metric-value">${(snap.incomeLimit / 12).toLocaleString()}/mo</div>
              <div className="metric-change">130% FPL (family of 4)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Income Limit (Net)</div>
              <div className="metric-value">${(snap.netIncomeLimit / 12).toLocaleString()}/mo</div>
              <div className="metric-change">100% FPL (family of 4)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Participation Rate</div>
              <div className="metric-value">{snap.participationRate}%</div>
              <div className="metric-change">Of eligible who participate</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Eligible But Not Receiving</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>
                {(snapGap.notReceiving / 1000000).toFixed(1)}M
              </div>
              <div className="metric-change negative">{snapGap.percentageGap}% gap</div>
            </div>
          </div>

          {/* Policy Impact Box */}
          <div style={{
            marginTop: '2rem',
            padding: '2rem',
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e40af' }}>💡 Policy Implications</h3>
            <div style={{ fontSize: '0.95rem', color: '#1e40af', lineHeight: '1.8' }}>
              <p><strong>SNAP Benefits vs. Need:</strong></p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Average SNAP benefit: $343/month household</li>
                <li>USDA Thrifty Food Plan: $975/month (family of 4)</li>
                <li><strong>Gap: SNAP only covers ~35% of USDA thrifty plan for families</strong></li>
              </ul>

              <p style={{ marginTop: '1.5rem' }}><strong>Food Insecurity Impact:</strong></p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>12.8% of households don't have reliable access to adequate food</li>
                <li>17.3% of children experience food insecurity</li>
                <li>7.4M eligible Americans don't receive SNAP (stigma, complex application, lack of awareness)</li>
              </ul>

              <p style={{ marginTop: '1.5rem' }}><strong>Progressive Policy Proposals:</strong></p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li><strong>Increase SNAP benefits to cover USDA Low-Cost Plan</strong> (~$1,235/month family of 4)</li>
                <li><strong>Automatic enrollment</strong> for eligible households (close 15% participation gap)</li>
                <li><strong>Invest in food deserts</strong> - grocery store incentives, mobile markets</li>
                <li><strong>School meal expansion</strong> - universal free breakfast and lunch</li>
                <li>Estimated cost: ~$40B/year to close food insecurity gap</li>
              </ul>
            </div>
          </div>

          {/* Comparison: SNAP vs Median Food Spending */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>SNAP Benefits vs. Median Food Spending</h3>
          <div style={{ height: '400px' }}>
            <Bar data={{
              labels: ['SNAP Household', 'Median Household', 'USDA Thrifty (Family 4)', 'USDA Moderate (Family 4)'],
              datasets: [
                {
                  label: 'Monthly Food Budget',
                  data: [snap.averageBenefitHousehold, householdFoodCost, usdaFoodPlans.thrifty, usdaFoodPlans.moderate],
                  backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#22c55e'],
                  borderWidth: 1
                }
              ]
            }} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.label}: $${context.parsed.y}/month`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
                    }
                  }
                }
              }
            }} />
          </div>
        </>
      )}

      {/* School Meals Programs */}
      <div className="widget">
        <h2>School Meal Programs</h2>
        <p className="widget-description">
          National School Lunch Program (NSLP) and School Breakfast Program (SBP) serve millions of children
          daily. Free/reduced-price meals based on family income. Data from USDA Food and Nutrition Service.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">School Lunch Participation</div>
            <div className="metric-value">30.0M</div>
            <div className="metric-change">Students daily (2023)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Free/Reduced Meals</div>
            <div className="metric-value">22.9M</div>
            <div className="metric-change">76% of participants</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">School Breakfast Participation</div>
            <div className="metric-value">15.0M</div>
            <div className="metric-change">Students daily</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Summer Meal Gap</div>
            <div className="metric-value">13.8M</div>
            <div className="metric-change negative">Kids lose access in summer</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Eligibility & Reimbursement Rates</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Free Meal Income Limit</div>
            <div className="metric-value">≤130% FPL</div>
            <div className="metric-change">$36,075 for family of 4</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Reduced-Price Limit</div>
            <div className="metric-value">≤185% FPL</div>
            <div className="metric-change">$51,338 for family of 4</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Federal Reimbursement (Free Lunch)</div>
            <div className="metric-value">$4.66</div>
            <div className="metric-change">Per meal to schools</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Value Per Student (Annual)</div>
            <div className="metric-value">$900</div>
            <div className="metric-change positive">180 days × $5/meal</div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f0fdf4',
          border: '2px solid #22c55e',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#166534'}}>📚 Universal School Meals Proposal</h4>
          <div style={{fontSize: '0.95rem', color: '#14532d', lineHeight: '1.8'}}>
            <p><strong>Current Status:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>8 states have permanent universal free school meals (CA, CO, ME, MA, MI, MN, NM, VT)</li>
              <li>During COVID (2020-2022): All students received free meals regardless of income</li>
              <li>Program ended Sept 2022; participation dropped 10% due to paperwork/stigma</li>
            </ul>

            <p style={{marginTop: '1rem'}}><strong>Universal Meals Proposal:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Free breakfast and lunch for ALL students (50M students)</li>
              <li>Eliminates stigma, paperwork, and means-testing</li>
              <li>Cost: $12B/year additional funding (currently $18B/year, would be $30B total)</li>
              <li>Benefits: Better nutrition, improved academic performance, reduced family food costs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* WIC Program */}
      <div className="widget">
        <h2>WIC (Women, Infants, and Children)</h2>
        <p className="widget-description">
          Special Supplemental Nutrition Program for Women, Infants, and Children provides nutrition assistance
          to pregnant women, new mothers, and young children. Data from USDA Food and Nutrition Service.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">WIC Participants</div>
            <div className="metric-value">6.7M</div>
            <div className="metric-change">Monthly average (2023)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Children Under 5</div>
            <div className="metric-value">3.9M</div>
            <div className="metric-change">58% of participants</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Pregnant/Postpartum Women</div>
            <div className="metric-value">1.7M</div>
            <div className="metric-change">25% of participants</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Infants (0-1 year)</div>
            <div className="metric-value">1.1M</div>
            <div className="metric-change">16% of participants</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>WIC Benefits & Participation</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Average Monthly Benefit</div>
            <div className="metric-value">$44</div>
            <div className="metric-change">Per person (2023)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Income Limit</div>
            <div className="metric-value">≤185% FPL</div>
            <div className="metric-change">$51,338 for family of 4</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Eligible But Not Enrolled</div>
            <div className="metric-value">40%</div>
            <div className="metric-change negative">Participation rate is 60%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Annual Program Cost</div>
            <div className="metric-value">$6.3B</div>
            <div className="metric-change">Federal budget (FY 2024)</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>WIC Food Package</h3>
        <div style={{
          padding: '1.5rem',
          background: '#f0f9ff',
          border: '2px solid #0ea5e9',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#075985'}}>📦 What WIC Covers</h4>
          <div style={{fontSize: '0.95rem', color: '#0c4a6e', lineHeight: '1.8'}}>
            <p><strong>Approved Foods (varies by category):</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li><strong>Infants:</strong> Formula (up to $280/mo value), baby food, infant cereal</li>
              <li><strong>Children 1-5:</strong> Milk, cheese, eggs, cereal, juice, peanut butter, beans, fruits & vegetables ($44/mo voucher)</li>
              <li><strong>Pregnant/Breastfeeding:</strong> Same as children plus additional quantities and fish ($58/mo)</li>
              <li><strong>Cash Value Benefit:</strong> $11/month for children, $13/month for women (for fresh produce)</li>
            </ul>

            <p style={{marginTop: '1rem'}}><strong>Additional Services:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Nutrition education and counseling</li>
              <li>Breastfeeding support and education</li>
              <li>Referrals to healthcare and social services</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#92400e'}}>⚠️ WIC Participation Gap</h4>
          <div style={{fontSize: '0.95rem', color: '#78350f', lineHeight: '1.8'}}>
            <p><strong>Why 40% of eligible don't enroll:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Stigma: Fear of judgment using WIC vouchers in stores</li>
              <li>Complexity: Requires in-person appointments, documentation, recertification every 6-12 months</li>
              <li>Limited foods: Only specific brands/sizes approved, can't use at all stores</li>
              <li>Working parents: Clinic hours during work day, hard to attend appointments</li>
              <li>Recent immigrants: Fear of "public charge" affecting immigration status</li>
            </ul>

            <p style={{marginTop: '1rem'}}><strong>Proposals to increase participation:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Expand to EBT cards (like SNAP) instead of paper vouchers - more discreet</li>
              <li>Online enrollment and recertification</li>
              <li>Automatic enrollment through Medicaid/SNAP</li>
              <li>Increase benefit amounts (haven't kept pace with food inflation)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Sources Footer */}
      <div style={{
        marginTop: '3rem',
        padding: '1rem',
        background: '#f9fafb',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#666'
      }}>
        <strong>Data Sources:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Food spending: Bureau of Labor Statistics (BLS) Consumer Expenditure Survey 2022</li>
          <li>USDA Food Plans: U.S. Department of Agriculture, Official USDA Food Plans 2022</li>
          <li>Food insecurity: Feeding America, Map the Meal Gap 2023</li>
          <li>SNAP data: Center on Budget and Policy Priorities (CBPP), USDA Food and Nutrition Service 2024</li>
          <li>Food deserts: USDA Economic Research Service Food Access Research Atlas</li>
          <li>School meals: USDA Food and Nutrition Service, National School Lunch Program</li>
          <li>WIC data: USDA Food and Nutrition Service, WIC Program</li>
        </ul>
      </div>
    </div>
  );
}

export default FoodCosts;
