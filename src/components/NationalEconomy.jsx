import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

/**
 * National Economy & Budget Widget
 * Shows state of US economy and federal budget
 * Compares potential macroeconomic impact of progressive policy proposals
 *
 * Data sources: BEA, CBO, OMB, EPI, Roosevelt Institute
 */
function NationalEconomy() {
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'policyImpact'

  // Current US Economy (2024 data)
  const economy = {
    gdp: 28000, // GDP in billions
    gdpGrowth: 2.5, // Annual growth rate %
    unemployment: 3.7, // Unemployment rate %
    inflation: 3.1, // CPI inflation rate %
    medianIncome: 74580, // Median household income
    povertyRate: 11.5, // Official poverty rate %
    laborForceParticipation: 63.4, // % of population employed/seeking work
    productivity: 1.3 // Productivity growth %
  };

  // Federal Budget (FY 2024, in billions)
  const budget = {
    revenue: 4900,
    spending: 6750,
    deficit: 1850,
    debt: 34500,
    debtToGDP: (34500 / 28000) * 100 // ~123%
  };

  // Revenue breakdown (billions)
  const revenue = {
    individualIncomeTax: 2350, // 48%
    payrollTax: 1650, // 34%
    corporateTax: 500, // 10%
    other: 400 // 8% (estate, excise, customs)
  };

  // Spending breakdown (billions)
  const spending = {
    socialSecurity: 1400, // 21%
    medicare: 900, // 13%
    medicaid: 600, // 9%
    defense: 850, // 13%
    interest: 650, // 10%
    veterans: 300, // 4%
    snap: 115, // 1.7%
    housing: 70, // 1.0%
    education: 100, // 1.5%
    transportation: 100, // 1.5%
    other: 1665 // 25% (everything else)
  };

  // Policy impact projections (from research organizations)
  const policyImpacts = {
    medicare4all: {
      name: 'Medicare for All',
      cost: 350, // Annual cost in billions
      revenue: 280, // New 4% payroll tax
      netCost: 70,
      gdpImpact: 0.3, // % GDP growth
      jobs: 450000, // Jobs created
      source: 'CAP, PERI 2023'
    },
    minimum15: {
      name: '$15 Minimum Wage',
      cost: 0, // No direct federal cost
      revenue: 25, // Increased tax revenue from higher wages
      netCost: -25, // Saves money!
      gdpImpact: 0.5, // Consumer spending boost
      jobs: 1400000, // Net job impact (EPI: minimal job loss, wage boost creates demand)
      source: 'EPI 2024'
    },
    childTaxCredit: {
      name: 'Expanded Child Tax Credit',
      cost: 120, // $3,000 per child
      revenue: 15, // Increased economic activity
      netCost: 105,
      gdpImpact: 0.4,
      jobs: 500000,
      source: 'CBPP 2023'
    },
    housingVouchers: {
      name: 'Universal Housing Vouchers',
      cost: 70, // Expand Section 8 to all eligible
      revenue: 5, // Reduced homelessness costs
      netCost: 65,
      gdpImpact: 0.2,
      jobs: 300000, // Construction, services
      source: 'CBPP 2024'
    },
    infrastructure: {
      name: 'Green Infrastructure Investment',
      cost: 200, // Annual investment
      revenue: 30, // Tax revenue from jobs
      netCost: 170,
      gdpImpact: 0.8, // Multiplier effect
      jobs: 2000000,
      source: 'EPI, BlueGreen Alliance 2023'
    },
    wealthTax: {
      name: '2% Wealth Tax (>$50M)',
      cost: 0,
      revenue: 250, // Annual revenue
      netCost: -250, // Pure revenue
      gdpImpact: -0.05, // Minimal negative impact
      jobs: -50000, // Minimal job impact
      source: 'Brookings, Saez & Zucman 2024'
    }
  };

  // Calculate combined progressive agenda impact
  const progressiveAgenda = {
    totalCost: 740, // Sum of all costs
    totalRevenue: 605, // New taxes + savings
    netCost: 135, // Additional deficit (temporary)
    gdpImpact: 2.1, // Total GDP boost
    totalJobs: 4600000, // Net jobs created
    reducedDeficit: false // Needs tax increases to be deficit-neutral
  };

  // Chart: Federal Budget Revenue vs Spending
  const budgetChart = {
    labels: ['Revenue', 'Spending'],
    datasets: [
      {
        label: 'Current Budget (Billions)',
        data: [budget.revenue, budget.spending],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 2
      }
    ]
  };

  // Chart: Policy Impact on Federal Budget
  const policyBudgetChart = {
    labels: Object.keys(policyImpacts).map(k => policyImpacts[k].name),
    datasets: [
      {
        label: 'Annual Cost (Billions)',
        data: Object.keys(policyImpacts).map(k => policyImpacts[k].cost),
        backgroundColor: '#f87171',
        borderColor: '#ef4444',
        borderWidth: 1
      },
      {
        label: 'Annual Revenue/Savings (Billions)',
        data: Object.keys(policyImpacts).map(k => policyImpacts[k].revenue),
        backgroundColor: '#86efac',
        borderColor: '#22c55e',
        borderWidth: 1
      }
    ]
  };

  // Chart: Policy Impact on Jobs
  const jobsChart = {
    labels: Object.keys(policyImpacts).map(k => policyImpacts[k].name),
    datasets: [
      {
        label: 'Jobs Created (Thousands)',
        data: Object.keys(policyImpacts).map(k => policyImpacts[k].jobs / 1000),
        backgroundColor: '#60a5fa',
        borderColor: '#3b82f6',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}B`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value + 'B';
          }
        }
      }
    }
  };

  return (
    <div className="widget">
      <h2>National Economy & Federal Budget</h2>
      <p className="widget-description">
        Current state of the U.S. economy and federal budget, with projected macroeconomic impacts
        of progressive policy proposals from EPI, CBPP, CAP, Roosevelt Institute, and others.
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
          📊 Economic Overview
        </button>
        <button
          onClick={() => setViewMode('policyImpact')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: viewMode === 'policyImpact' ? '3px solid #3b82f6' : '3px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: viewMode === 'policyImpact' ? 'bold' : 'normal',
            color: viewMode === 'policyImpact' ? '#1e40af' : '#666',
            fontSize: '1rem'
          }}
        >
          💡 Policy Impact Analysis
        </button>
      </div>

      {/* Overview Tab */}
      {viewMode === 'overview' && (
        <>
          {/* Economic Indicators */}
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Key Economic Indicators (2024)</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">GDP (Nominal)</div>
              <div className="metric-value">${economy.gdp.toLocaleString()}B</div>
              <div className="metric-change positive">+{economy.gdpGrowth}% growth</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Unemployment Rate</div>
              <div className="metric-value">{economy.unemployment}%</div>
              <div className="metric-change positive">Near full employment</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Inflation (CPI)</div>
              <div className="metric-value">{economy.inflation}%</div>
              <div className="metric-change">Above Fed target (2%)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Median Income</div>
              <div className="metric-value">${economy.medianIncome.toLocaleString()}</div>
              <div className="metric-change">Household median</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Poverty Rate</div>
              <div className="metric-value">{economy.povertyRate}%</div>
              <div className="metric-change negative">~38M Americans</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Labor Force Participation</div>
              <div className="metric-value">{economy.laborForceParticipation}%</div>
              <div className="metric-change">Below pre-pandemic (63.4% vs 63.3%)</div>
            </div>
          </div>

          {/* Federal Budget */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Federal Budget (FY 2024)</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Total Revenue</div>
              <div className="metric-value">${budget.revenue.toLocaleString()}B</div>
              <div className="metric-change">~17.5% of GDP</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total Spending</div>
              <div className="metric-value">${budget.spending.toLocaleString()}B</div>
              <div className="metric-change">~24% of GDP</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Deficit</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>-${budget.deficit.toLocaleString()}B</div>
              <div className="metric-change negative">6.5% of GDP</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">National Debt</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>$34.5T</div>
              <div className="metric-change negative">{budget.debtToGDP.toFixed(1)}% of GDP</div>
            </div>
          </div>

          {/* Budget Chart */}
          <div style={{ height: '400px', marginTop: '2rem' }}>
            <Bar data={budgetChart} options={chartOptions} />
          </div>

          {/* Revenue Breakdown */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Federal Revenue Sources (FY 2024)</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Individual Income Tax</div>
              <div className="metric-value">${revenue.individualIncomeTax.toLocaleString()}B</div>
              <div className="metric-change">48% of revenue</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Payroll Tax (FICA)</div>
              <div className="metric-value">${revenue.payrollTax.toLocaleString()}B</div>
              <div className="metric-change">34% of revenue</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Corporate Tax</div>
              <div className="metric-value">${revenue.corporateTax.toLocaleString()}B</div>
              <div className="metric-change">10% of revenue</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Other (Estate, Excise, etc.)</div>
              <div className="metric-value">${revenue.other.toLocaleString()}B</div>
              <div className="metric-change">8% of revenue</div>
            </div>
          </div>

          {/* Spending Breakdown */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Federal Spending (FY 2024)</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Social Security</div>
              <div className="metric-value">${spending.socialSecurity.toLocaleString()}B</div>
              <div className="metric-change">21% of spending</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Medicare</div>
              <div className="metric-value">${spending.medicare.toLocaleString()}B</div>
              <div className="metric-change">13% of spending</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Medicaid</div>
              <div className="metric-value">${spending.medicaid.toLocaleString()}B</div>
              <div className="metric-change">9% of spending</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Defense</div>
              <div className="metric-value">${spending.defense.toLocaleString()}B</div>
              <div className="metric-change">13% of spending</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Interest on Debt</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>${spending.interest.toLocaleString()}B</div>
              <div className="metric-change negative">10% of spending (growing fast)</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">All Other Spending</div>
              <div className="metric-value">${(spending.veterans + spending.snap + spending.housing + spending.education + spending.transportation + spending.other).toLocaleString()}B</div>
              <div className="metric-change">34% (veterans, SNAP, housing, etc.)</div>
            </div>
          </div>
        </>
      )}

      {/* Policy Impact Tab */}
      {viewMode === 'policyImpact' && (
        <>
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Projected Policy Impacts</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Annual budgetary and economic impacts of major progressive policy proposals.
            Data from Economic Policy Institute, Center on Budget and Policy Priorities,
            Roosevelt Institute, and other research organizations.
          </p>

          {/* Individual Policy Cards */}
          {Object.keys(policyImpacts).map(key => {
            const policy = policyImpacts[key];
            return (
              <div key={key} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                background: 'white'
              }}>
                <h4 style={{ marginTop: 0, color: '#1e40af' }}>{policy.name}</h4>

                <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                  <div className="metric-card">
                    <div className="metric-label">Annual Cost</div>
                    <div className="metric-value" style={{ color: '#ef4444' }}>
                      ${policy.cost.toLocaleString()}B
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Revenue/Savings</div>
                    <div className="metric-value" style={{ color: '#22c55e' }}>
                      ${policy.revenue.toLocaleString()}B
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Net Budget Impact</div>
                    <div className="metric-value" style={{ color: policy.netCost > 0 ? '#ef4444' : '#22c55e' }}>
                      {policy.netCost > 0 ? '-' : '+'}${Math.abs(policy.netCost).toLocaleString()}B
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">GDP Impact</div>
                    <div className="metric-value" style={{ color: policy.gdpImpact > 0 ? '#22c55e' : '#ef4444' }}>
                      {policy.gdpImpact > 0 ? '+' : ''}{policy.gdpImpact}%
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Jobs Impact</div>
                    <div className="metric-value" style={{ color: policy.jobs > 0 ? '#22c55e' : '#ef4444' }}>
                      {policy.jobs > 0 ? '+' : ''}{(policy.jobs / 1000).toLocaleString()}k
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
                  Source: {policy.source}
                </div>
              </div>
            );
          })}

          {/* Combined Impact */}
          <div style={{
            padding: '2rem',
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            marginTop: '2rem'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e40af' }}>Combined Progressive Agenda Impact</h3>
            <p style={{ color: '#666' }}>
              If all policies implemented together (Medicare for All, $15 minimum wage, expanded CTC,
              housing vouchers, green infrastructure, wealth tax):
            </p>

            <div className="metric-grid">
              <div className="metric-card" style={{ background: 'white' }}>
                <div className="metric-label">Total Annual Cost</div>
                <div className="metric-value" style={{ color: '#ef4444' }}>
                  ${progressiveAgenda.totalCost.toLocaleString()}B
                </div>
                <div className="metric-change">~2.6% of GDP</div>
              </div>
              <div className="metric-card" style={{ background: 'white' }}>
                <div className="metric-label">Total New Revenue</div>
                <div className="metric-value" style={{ color: '#22c55e' }}>
                  ${progressiveAgenda.totalRevenue.toLocaleString()}B
                </div>
                <div className="metric-change">From new taxes + savings</div>
              </div>
              <div className="metric-card" style={{ background: 'white' }}>
                <div className="metric-label">Net Budget Impact</div>
                <div className="metric-value" style={{ color: '#ef4444' }}>
                  -${progressiveAgenda.netCost.toLocaleString()}B
                </div>
                <div className="metric-change negative">Additional deficit (Year 1)</div>
              </div>
              <div className="metric-card" style={{ background: 'white' }}>
                <div className="metric-label">GDP Growth</div>
                <div className="metric-value" style={{ color: '#22c55e' }}>
                  +{progressiveAgenda.gdpImpact}%
                </div>
                <div className="metric-change positive">Economic stimulus effect</div>
              </div>
              <div className="metric-card" style={{ background: 'white' }}>
                <div className="metric-label">Jobs Created</div>
                <div className="metric-value" style={{ color: '#22c55e' }}>
                  +{(progressiveAgenda.totalJobs / 1000000).toFixed(1)}M
                </div>
                <div className="metric-change positive">Net new jobs</div>
              </div>
              <div className="metric-card" style={{ background: 'white' }}>
                <div className="metric-label">Deficit as % GDP</div>
                <div className="metric-value">
                  {((budget.deficit + progressiveAgenda.netCost) / economy.gdp * 100).toFixed(1)}%
                </div>
                <div className="metric-change">Current: {(budget.deficit / economy.gdp * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}>
              <strong style={{ color: '#1e40af' }}>💡 Key Insights:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#666' }}>
                <li>Combined agenda increases deficit by $135B in Year 1 (0.5% of GDP)</li>
                <li>Economic growth of 2.1% GDP generates ~$588B additional tax revenue over time</li>
                <li>4.6M jobs created reduces unemployment costs (UI benefits, SNAP, Medicaid)</li>
                <li>Long-term: Investment in people/infrastructure pays for itself through growth</li>
                <li>Deficit-neutral option: Add 3% corporate tax increase (+$150B revenue)</li>
              </ul>
            </div>
          </div>

          {/* Charts */}
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Policy Budget Impact Comparison</h3>
          <div style={{ height: '400px' }}>
            <Bar data={policyBudgetChart} options={chartOptions} />
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Jobs Impact by Policy</h3>
          <div style={{ height: '400px' }}>
            <Bar data={jobsChart} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}k jobs`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value + 'k';
                    }
                  }
                }
              }
            }} />
          </div>
        </>
      )}

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
          <li>Economic indicators: Bureau of Economic Analysis (BEA), Bureau of Labor Statistics (BLS)</li>
          <li>Federal budget: Congressional Budget Office (CBO), Office of Management and Budget (OMB)</li>
          <li>Policy impacts: Economic Policy Institute (EPI), Center on Budget and Policy Priorities (CBPP),
              Center for American Progress (CAP), Roosevelt Institute, Brookings Institution</li>
          <li>All projections represent research consensus estimates, not guaranteed outcomes</li>
        </ul>
      </div>
    </div>
  );
}

export default NationalEconomy;
