import React from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
// Chart.js elements are registered globally in main.jsx via src/utils/chartConfig.js
import { BAR_OPTIONS, PIE_OPTIONS } from '../utils/chartConfig'

/**
 * Wealth & Inequality Widget - Uses Real Federal Data
 * Data sources: Federal Reserve Survey of Consumer Finances, Census Bureau, IRS, Urban Institute
 */
function WealthInequality({ data, metrics }) {
  // Wealth distribution by percentile (Federal Reserve SCF 2022)
  const wealthByPercentile = {
    labels: ['Bottom 50%', '50-90th', '90-99th', 'Top 1%'],
    datasets: [{
      label: 'Share of Total Wealth (%)',
      data: [2.6, 36.2, 37.7, 23.5],
      backgroundColor: ['#ef4444', '#f97316', '#fbbf24', '#22c55e']
    }]
  };

  // Median net worth by percentile
  const netWorthData = {
    labels: ['Bottom 20%', '20-40th', '40-60th', '60-80th', '80-90th', '90-99th', 'Top 1%'],
    datasets: [{
      label: 'Median Net Worth ($)',
      data: [-8900, 12000, 104000, 332000, 747000, 2400000, 11800000],
      backgroundColor: [
        '#ef4444',
        '#f97316',
        '#fbbf24',
        '#84cc16',
        '#22c55e',
        '#10b981',
        '#059669'
      ]
    }]
  };

  // Wealth inequality trends over time
  const wealthInequalityTrends = {
    labels: ['1989', '1995', '2001', '2007', '2010', '2013', '2016', '2019', '2022'],
    datasets: [
      {
        label: 'Top 1% Share (%)',
        data: [23.1, 21.3, 22.9, 23.4, 22.8, 22.0, 23.1, 23.9, 23.5],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Top 10% Share (%)',
        data: [60.3, 58.9, 60.2, 61.5, 60.8, 59.8, 61.0, 62.1, 61.2],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4
      },
      {
        label: 'Bottom 50% Share (%)',
        data: [3.7, 3.6, 2.8, 2.5, 1.9, 1.8, 2.1, 2.4, 2.6],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Racial wealth gap
  const racialWealthGap = {
    labels: ['White', 'Hispanic', 'Black', 'Other'],
    datasets: [{
      label: 'Median Household Net Worth ($)',
      data: [285000, 61600, 44900, 185000],
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe']
    }]
  };

  // Use shared chart options from chartConfig
  const chartOptions = BAR_OPTIONS;
  const pieOptions = PIE_OPTIONS;

  return (
    <div>
      <div className="widget">
        <h2>Wealth Distribution in America</h2>
        <p className="widget-description">
          Wealth (net worth = assets minus debts) is far more concentrated than income. The top 10% own 61.2% of
          all wealth, while the bottom 50% own just 2.6%. Data from Federal Reserve Survey of Consumer Finances 2022.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Total Household Wealth</div>
            <div className="metric-value">$154T</div>
            <div className="metric-change">All US household net worth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Net Worth</div>
            <div className="metric-value">$192,900</div>
            <div className="metric-change">50th percentile household</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Mean Net Worth</div>
            <div className="metric-value">$1,063,700</div>
            <div className="metric-change">Skewed by billionaires</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Wealth Gini Coefficient</div>
            <div className="metric-value">0.853</div>
            <div className="metric-change negative">Extremely high inequality</div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Top 1% Net Worth (Minimum)</div>
            <div className="metric-value">$11.8M</div>
            <div className="metric-change">To be in top 1%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Top 1% Mean Net Worth</div>
            <div className="metric-value">$26.1M</div>
            <div className="metric-change">Skewed by billionaires</div>
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
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Wealth Distribution by Group</h3>
          <Pie data={wealthByPercentile} options={pieOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Median Net Worth by Percentile</h3>
          <Bar data={netWorthData} options={chartOptions} />
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#991b1b'}}>📊 Extreme Concentration</h4>
          <div style={{fontSize: '0.95rem', color: '#7f1d1d', lineHeight: '1.8'}}>
            <p><strong>Wealth vs Income Inequality:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Wealth Gini: 0.853 (extremely unequal)</li>
              <li>Income Gini: 0.485 (very unequal, but far less than wealth)</li>
              <li>Top 1% owns 23.5% of wealth (vs 15% of income)</li>
              <li>Bottom 50% owns 2.6% of wealth (vs 12% of income)</li>
              <li>Wealth inequality has increased dramatically since 1989</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Wealth Inequality Trends</h2>
        <p className="widget-description">
          Wealth concentration has increased over the past 30+ years. The share held by the bottom 50%
          has fallen from 3.7% (1989) to 2.6% (2022), while the top 10% has grown. Federal Reserve data.
        </p>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Wealth Share Over Time (1989-2022)</h3>
          <Line data={wealthInequalityTrends} options={chartOptions} />
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Bottom 50% (1989)</div>
            <div className="metric-value">3.7%</div>
            <div className="metric-change">Share of total wealth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Bottom 50% (2022)</div>
            <div className="metric-value">2.6%</div>
            <div className="metric-change negative">Decreased 1.1 percentage points</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Top 10% (1989)</div>
            <div className="metric-value">60.3%</div>
            <div className="metric-change">Share of total wealth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Top 10% (2022)</div>
            <div className="metric-value">61.2%</div>
            <div className="metric-change negative">Increased 0.9 percentage points</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Billionaire Wealth Explosion</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">US Billionaires (2024)</div>
            <div className="metric-value">756</div>
            <div className="metric-change">Up from 66 in 1990</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Billionaire Wealth</div>
            <div className="metric-value">$5.5T</div>
            <div className="metric-change">3.6% of all US wealth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Richest American (2024)</div>
            <div className="metric-value">$250B</div>
            <div className="metric-change">Elon Musk net worth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Billionaire Wealth Growth (2020-2024)</div>
            <div className="metric-value">+88%</div>
            <div className="metric-change negative">During pandemic/inflation</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Racial Wealth Gap</h2>
        <p className="widget-description">
          The racial wealth gap is one of the most persistent forms of inequality. White households have
          6.3x the median wealth of Black households. Data from Federal Reserve Survey of Consumer Finances.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median White Household</div>
            <div className="metric-value">$285,000</div>
            <div className="metric-change">Net worth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Black Household</div>
            <div className="metric-value">$44,900</div>
            <div className="metric-change negative">15.8% of white wealth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Hispanic Household</div>
            <div className="metric-value">$61,600</div>
            <div className="metric-change negative">21.6% of white wealth</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">White/Black Wealth Ratio</div>
            <div className="metric-value">6.3x</div>
            <div className="metric-change negative">Barely changed since 1989</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Median Net Worth by Race</h3>
          <Bar data={racialWealthGap} options={chartOptions} />
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Causes of the Racial Wealth Gap</h3>
        <div style={{
          marginTop: '1rem',
          padding: '1.5rem',
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#92400e'}}>🏛️ Historical & Structural Causes</h4>
          <div style={{fontSize: '0.95rem', color: '#78350f', lineHeight: '1.8'}}>
            <p><strong>Major Contributors:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li><strong>Slavery & Jim Crow:</strong> 246 years of slavery, 100 years of legal discrimination prevented wealth accumulation</li>
              <li><strong>Redlining:</strong> FHA/VA excluded Black families from mortgages (1934-1968), preventing homeownership</li>
              <li><strong>Homeownership gap:</strong> 74% white vs 45% Black homeownership (homes = 60% of median wealth)</li>
              <li><strong>Income gap:</strong> Black families earn 61% of white median income, less to save/invest</li>
              <li><strong>Inheritance gap:</strong> White families receive $200k median inheritance vs $50k for Black families</li>
              <li><strong>Debt burden:</strong> Student loans, medical debt disproportionately affect Black households</li>
              <li><strong>Discrimination:</strong> Ongoing mortgage discrimination, hiring bias, wage gaps compound over time</li>
            </ul>
          </div>
        </div>

        <div className="metric-grid" style={{marginTop: '2rem'}}>
          <div className="metric-card">
            <div className="metric-label">Homeownership Rate (White)</div>
            <div className="metric-value">74.0%</div>
            <div className="metric-change">Q3 2023</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Homeownership Rate (Black)</div>
            <div className="metric-value">45.7%</div>
            <div className="metric-change negative">28.3 pp gap</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Income (White)</div>
            <div className="metric-value">$81,060</div>
            <div className="metric-change">Household</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Income (Black)</div>
            <div className="metric-value">$52,860</div>
            <div className="metric-change negative">65% of white income</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Wealth Components & Asset Ownership</h2>
        <p className="widget-description">
          Wealth comes from different asset types. Higher-wealth households own more financial assets
          (stocks, bonds) while lower-wealth households rely more on home equity and vehicles.
        </p>

        <h3 style={{marginBottom: '1rem'}}>Asset Ownership Rates by Percentile</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Own Stocks/Bonds (Top 10%)</div>
            <div className="metric-value">92%</div>
            <div className="metric-change">Direct or retirement accounts</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Own Stocks/Bonds (Bottom 50%)</div>
            <div className="metric-value">35%</div>
            <div className="metric-change negative">Mostly small 401(k) balances</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Own Home (Top 10%)</div>
            <div className="metric-value">95%</div>
            <div className="metric-change">Often multiple properties</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Own Home (Bottom 50%)</div>
            <div className="metric-value">50%</div>
            <div className="metric-change negative">Often with high mortgage debt</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Median Asset Values (All Households)</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Primary Residence Value</div>
            <div className="metric-value">$320,000</div>
            <div className="metric-change">For homeowners (65.7%)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Home Equity</div>
            <div className="metric-value">$185,000</div>
            <div className="metric-change">After mortgage debt</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Retirement Accounts</div>
            <div className="metric-value">$87,000</div>
            <div className="metric-change">For those with accounts (53%)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Vehicle Value</div>
            <div className="metric-value">$23,000</div>
            <div className="metric-change">For vehicle owners (91%)</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Debt Burden</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Household Debt</div>
            <div className="metric-value">$102,000</div>
            <div className="metric-change">All households with debt</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Mortgage Debt (Median)</div>
            <div className="metric-value">$220,000</div>
            <div className="metric-change">For homeowners with mortgage</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Credit Card Debt (Median)</div>
            <div className="metric-value">$5,700</div>
            <div className="metric-change">For households with CC debt (45%)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Student Loan Debt (Median)</div>
            <div className="metric-value">$25,000</div>
            <div className="metric-change">For households with loans (21%)</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Intergenerational Mobility & Opportunity</h2>
        <p className="widget-description">
          The "American Dream" of upward mobility is increasingly difficult. Children born to bottom 20%
          have only 7.5% chance of reaching top 20%. Data from Opportunity Insights (Chetty et al).
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Born Bottom 20%, Stay Bottom</div>
            <div className="metric-value">43%</div>
            <div className="metric-change negative">Limited upward mobility</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Born Bottom 20%, Reach Top 20%</div>
            <div className="metric-value">7.5%</div>
            <div className="metric-change negative">Unlikely to "climb ladder"</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Born Top 20%, Stay Top 20%</div>
            <div className="metric-value">40%</div>
            <div className="metric-change">High likelihood of staying rich</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Born Top 20%, Drop to Bottom</div>
            <div className="metric-value">8%</div>
            <div className="metric-change">Rare to fall to bottom</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Lifetime Earnings by Education & Race</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Bachelor's Degree (White)</div>
            <div className="metric-value">$3.0M</div>
            <div className="metric-change">Lifetime earnings</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Bachelor's Degree (Black)</div>
            <div className="metric-value">$2.4M</div>
            <div className="metric-change negative">$600k less (20% gap)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">High School (White)</div>
            <div className="metric-value">$1.7M</div>
            <div className="metric-change">Lifetime earnings</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">High School (Black)</div>
            <div className="metric-value">$1.3M</div>
            <div className="metric-change negative">$400k less (24% gap)</div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#991b1b'}}>📉 Declining Mobility</h4>
          <div style={{fontSize: '0.95rem', color: '#7f1d1d', lineHeight: '1.8'}}>
            <p><strong>US vs Other Countries:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>US ranks 27th out of 50 countries in intergenerational mobility</li>
              <li>Denmark, Norway, Finland have 2-3x higher mobility than US</li>
              <li>Children born in 1940: 90% earned more than their parents</li>
              <li>Children born in 1980: Only 50% earn more than their parents</li>
              <li>Decline driven by: rising inequality, stagnant wages, expensive education, lack of social safety net</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Progressive Tax Proposals to Reduce Inequality</h2>
        <p className="widget-description">
          Various proposals to tax wealth and reduce inequality. Analysis from economists Saez, Zucman,
          Piketty, and organizations like Economic Policy Institute and Roosevelt Institute.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Wealth Tax (Warren/Sanders)</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>2% annual tax on wealth &gt;$50M</li>
                <li>3% annual tax on wealth &gt;$1B</li>
                <li>Affects ~75,000 households (0.05%)</li>
              </ul>

              <p><strong>Revenue:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>$200B-$300B per year</li>
                <li>$3 trillion over 10 years</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Reduces wealth concentration</li>
                <li>Funds universal programs</li>
                <li>99.95% of Americans pay $0</li>
              </ul>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Billionaire Minimum Tax</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>25% minimum tax on total income</li>
                <li>Includes unrealized capital gains</li>
                <li>Applies to wealth &gt;$100M</li>
              </ul>

              <p><strong>Revenue:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>$360B over 10 years</li>
                <li>~$36B per year</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Closes billionaire tax avoidance</li>
                <li>Ensures ultra-rich pay fair share</li>
                <li>Only ~700 families affected</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Estate Tax Expansion</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Lower exemption: $3.5M (from $13.6M)</li>
                <li>Progressive rates: 45-65% on large estates</li>
                <li>Close loopholes (trusts, valuation)</li>
              </ul>

              <p><strong>Revenue:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>$430B over 10 years</li>
                <li>~$43B per year</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Reduces inherited wealth inequality</li>
                <li>Promotes meritocracy over dynasty</li>
                <li>Only 0.2% of estates affected</li>
              </ul>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Capital Gains Reform</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Tax capital gains as ordinary income</li>
                <li>Or: Raise rate to 28% (from 20%)</li>
                <li>Eliminate "step-up in basis" loophole</li>
              </ul>

              <p><strong>Revenue:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>$1T+ over 10 years</li>
                <li>Depends on implementation</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Treats investment income like wages</li>
                <li>Stops billionaires paying lower rates</li>
                <li>Closes major wealth accumulation path</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Combined Revenue Potential</div>
            <div className="metric-value">$320B/yr</div>
            <div className="metric-change positive">All proposals combined</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Share Paid by Top 1%</div>
            <div className="metric-value">~95%</div>
            <div className="metric-change">Ultra-wealthy bear burden</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">GDP Impact</div>
            <div className="metric-value">-0.1%</div>
            <div className="metric-change">Minimal economic drag (IMF)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Inequality Reduction</div>
            <div className="metric-value">Significant</div>
            <div className="metric-change positive">Slows wealth concentration</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Top 1% owns 23.5% of all wealth ($36.2T) while bottom 50% owns 2.6% ($4.0T)</li>
          <li>Wealth Gini coefficient of 0.853 indicates extreme inequality (vs 0.485 for income)</li>
          <li>Racial wealth gap persists: White households have 6.3x the wealth of Black households ($285k vs $45k)</li>
          <li>Intergenerational mobility declining: Only 7.5% born in bottom 20% reach top 20%</li>
          <li>Billionaire wealth grew 88% during pandemic (2020-2024) while median worker struggled</li>
          <li>Only 35% of bottom 50% own stocks (vs 92% of top 10%), missing out on market gains</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Wealth tax: 2% on wealth &gt;$50M, 3% on wealth &gt;$1B ($200-300B/year revenue)</li>
              <li>Billionaire minimum tax: 25% on total income including unrealized gains ($36B/year)</li>
              <li>Estate tax reform: Lower exemption to $3.5M, progressive rates 45-65% ($43B/year)</li>
              <li>Capital gains reform: Tax as ordinary income or raise rate to 28%, eliminate step-up basis ($100B+/year)</li>
              <li>Baby bonds: $1,000 at birth + $2,000/year for low-income kids (narrows racial wealth gap)</li>
              <li>Expand Social Security to boost retirement security for bottom 50%</li>
            </ul>
          </li>
        </ul>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Data Sources:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <li>Wealth Distribution: Federal Reserve Survey of Consumer Finances (SCF)</li>
            <li>Racial Wealth Gap: Federal Reserve SCF, Urban Institute</li>
            <li>Billionaire Data: Forbes, Bloomberg Billionaires Index</li>
            <li>Intergenerational Mobility: Opportunity Insights (Raj Chetty et al), OECD</li>
            <li>Policy Analysis: Saez & Zucman, Economic Policy Institute, Roosevelt Institute, Tax Policy Center</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WealthInequality
