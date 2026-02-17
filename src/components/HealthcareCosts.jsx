import React from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
// Chart.js elements are registered globally in main.jsx via src/utils/chartConfig.js
import { BAR_OPTIONS, PIE_OPTIONS } from '../utils/chartConfig'

/**
 * Healthcare Costs Widget - Uses Real Federal Data
 * Data sources: CMS, MEPS, Kaiser Family Foundation, CDC, Medicare.gov
 */
function HealthcareCosts({ data, metrics }) {
  const medianIncome = data?.income?.medianHouseholdIncome || 74580;
  const individualIncome = 44000;

  // After-tax income for burden calculations
  const effectiveTaxRate = 0.18;
  const afterTaxIncomeHousehold = medianIncome * (1 - effectiveTaxRate);
  const afterTaxIncomeIndividual = individualIncome * (1 - 0.15);

  // Healthcare spending data (MEPS 2022)
  const householdHealthcare = 480; // Monthly avg with employer insurance
  const individualHealthcare = 300; // Monthly avg single person

  // Premium costs by type
  const employerPremium = 625; // Monthly for family plan (employee share)
  const marketplacePremium = 750; // Monthly for family on ACA
  const medicarePremium = 175; // Monthly Part B + Part D

  // Out-of-pocket spending
  const oopHousehold = 250; // Monthly average (copays, deductibles, prescriptions)
  const oopIndividual = 150; // Monthly average for individual

  // Calculate burden
  const healthcareBurdenHousehold = ((householdHealthcare * 12 / afterTaxIncomeHousehold) * 100).toFixed(1);
  const healthcareBurdenIndividual = ((individualHealthcare * 12 / afterTaxIncomeIndividual) * 100).toFixed(1);

  // Uninsured rates by income (Census/CDC)
  const uninsuredByIncome = {
    labels: ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '>$100k'],
    datasets: [{
      label: 'Uninsured Rate (%)',
      data: [21.5, 15.8, 9.2, 5.1, 2.8],
      backgroundColor: ['#ef4444', '#f97316', '#fbbf24', '#84cc16', '#22c55e']
    }]
  };

  // Healthcare spending trends
  const healthcareSpendingTrend = {
    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Avg Monthly Premium ($)',
        data: [450, 475, 495, 520, 545, 575, 600, 625, 650],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Affordable Amount (8.5% of Income) ($)',
        data: [400, 410, 425, 440, 460, 465, 470, 485, 530],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Healthcare spending breakdown
  const healthcareBreakdown = {
    labels: ['Insurance Premiums', 'Out-of-Pocket Care', 'Prescriptions', 'Dental/Vision', 'Uncovered Services'],
    datasets: [{
      data: [625, 150, 75, 50, 30],
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#fad0c4']
    }]
  };

  // Use shared chart options from chartConfig
  const chartOptions = BAR_OPTIONS;
  const pieOptions = PIE_OPTIONS;

  return (
    <div>
      <div className="widget">
        <h2>Healthcare Costs & Affordability</h2>
        <p className="widget-description">
          Healthcare costs continue to rise faster than wages. National health expenditure is 17.3% of GDP ($4.5 trillion).
          Average family pays over $7,500/year in premiums plus out-of-pocket costs. Data from CMS, MEPS, Kaiser Family Foundation.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Household Healthcare (Monthly)</div>
            <div className="metric-value">${householdHealthcare}</div>
            <div className="metric-change">Premiums + out-of-pocket</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Individual Healthcare (Monthly)</div>
            <div className="metric-value">${individualHealthcare}</div>
            <div className="metric-change">Single person average</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Healthcare Burden (Household)</div>
            <div className="metric-value">{healthcareBurdenHousehold}%</div>
            <div className="metric-change">Of after-tax income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Healthcare Burden (Individual)</div>
            <div className="metric-value">{healthcareBurdenIndividual}%</div>
            <div className="metric-change">Of after-tax income</div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">National Health Spending</div>
            <div className="metric-value">$4.5T</div>
            <div className="metric-change">17.3% of GDP (2023)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Per Capita Spending</div>
            <div className="metric-value">$13,493</div>
            <div className="metric-change">Highest in developed world</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Uninsured Americans</div>
            <div className="metric-value">27.5M</div>
            <div className="metric-change negative">8.4% of population</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Underinsured Americans</div>
            <div className="metric-value">43M</div>
            <div className="metric-change negative">High deductibles, poor coverage</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Healthcare Premium Trends vs Affordability</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Premiums rising faster than ACA affordability threshold (8.5% of income)
          </p>
          <Line data={healthcareSpendingTrend} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Monthly Healthcare Spending Breakdown</h3>
          <Pie data={healthcareBreakdown} options={pieOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Insurance Coverage & Access</h2>
        <p className="widget-description">
          Insurance coverage varies dramatically by income level. Lower-income Americans face much higher
          uninsured rates despite Medicaid expansion. Data from Census Bureau and CDC.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Employer-Sponsored Insurance</div>
            <div className="metric-value">54.3%</div>
            <div className="metric-change">158M Americans</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Medicare</div>
            <div className="metric-value">18.7%</div>
            <div className="metric-change">65M Americans (65+, disabled)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Medicaid/CHIP</div>
            <div className="metric-value">23.3%</div>
            <div className="metric-change">90M Americans (expanded in 40 states)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ACA Marketplace</div>
            <div className="metric-value">4.8%</div>
            <div className="metric-change">16M Americans</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Uninsured Rate by Income Level</h3>
          <Bar data={uninsuredByIncome} options={chartOptions} />
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#991b1b'}}>⚠️ Coverage Gaps</h4>
          <div style={{fontSize: '0.95rem', color: '#7f1d1d', lineHeight: '1.8'}}>
            <p><strong>Key Issues:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>12 states haven't expanded Medicaid, leaving 2.2M in coverage gap</li>
              <li>Those earning &lt;138% FPL in non-expansion states: too rich for Medicaid, too poor for ACA subsidies</li>
              <li>21.5% of people earning &lt;$25k/year are uninsured (vs 2.8% earning &gt;$100k)</li>
              <li>43M Americans are underinsured: have coverage but can't afford care due to high deductibles</li>
              <li>Medical debt affects 41% of Americans (~100M people)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Prescription Drug Costs</h2>
        <p className="widget-description">
          Prescription drug prices in the US are 2-3x higher than other developed countries.
          Medicare negotiation authority (IRA 2022) will help but is limited to 10 drugs initially.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Avg Prescription Cost (Monthly)</div>
            <div className="metric-value">$75</div>
            <div className="metric-change">Per household with prescriptions</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Americans Rationing Meds</div>
            <div className="metric-value">18M</div>
            <div className="metric-change negative">Skip doses to save money</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Insulin Users Rationing</div>
            <div className="metric-value">1.3M</div>
            <div className="metric-change negative">Despite $35 cap (Medicare only)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">US vs Canada Drug Prices</div>
            <div className="metric-value">2.5x</div>
            <div className="metric-change negative">Same drugs cost 2.5x more</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Medicare Part D (Prescription Coverage)</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Part D Premium (Avg)</div>
            <div className="metric-value">$55/mo</div>
            <div className="metric-change">Varies by plan</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Standard Deductible</div>
            <div className="metric-value">$545</div>
            <div className="metric-change">Annual (2024)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Out-of-Pocket Cap (2024)</div>
            <div className="metric-value">$8,000</div>
            <div className="metric-change">Before "catastrophic" coverage</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">IRA 2025 Cap</div>
            <div className="metric-value">$2,000</div>
            <div className="metric-change positive">New annual OOP maximum</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Medicare for All vs Current System</h2>
        <p className="widget-description">
          Comparison of Medicare for All (single-payer) proposal versus current multi-payer system.
          Analysis based on studies from PERI, Yale, RAND, and Congressional Budget Office.
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
            <h3 style={{marginTop: 0, color: '#166534'}}>Medicare for All</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Coverage:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>100% of Americans covered</li>
                <li>No deductibles, no copays</li>
                <li>Comprehensive: medical, dental, vision, mental health, long-term care</li>
              </ul>

              <p><strong>Costs (Household):</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Premiums: $0</li>
                <li>Out-of-pocket: $0</li>
                <li>New 4% payroll tax: ~$248/mo</li>
                <li><strong>Total: $248/mo (saves $232/mo)</strong></li>
              </ul>

              <p><strong>National Cost:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>$4.1T annually (9% less than current)</li>
                <li>Saves $450B/year on administration</li>
                <li>Lower drug prices save $200B/year</li>
              </ul>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#991b1b'}}>Current System</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Coverage:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>91.6% covered (27.5M uninsured)</li>
                <li>43M underinsured (high deductibles)</li>
                <li>Coverage varies: many gaps and exclusions</li>
              </ul>

              <p><strong>Costs (Household):</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Premiums: $625/mo (employee share)</li>
                <li>Out-of-pocket: $250/mo</li>
                <li>Deductibles: Often $1,500-$5,000</li>
                <li><strong>Total: $875/mo + deductibles</strong></li>
              </ul>

              <p><strong>National Cost:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>$4.5T annually (17.3% of GDP)</li>
                <li>$1,055B spent on administration</li>
                <li>Highest drug prices in world</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Household Savings (M4A)</div>
            <div className="metric-value">$232/mo</div>
            <div className="metric-change positive">$2,784 annually</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Individual Savings (M4A)</div>
            <div className="metric-value">$133/mo</div>
            <div className="metric-change positive">$1,596 annually</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">National Savings (M4A)</div>
            <div className="metric-value">$450B/yr</div>
            <div className="metric-change positive">From reduced administration</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Lives Saved (M4A)</div>
            <div className="metric-value">68,000/yr</div>
            <div className="metric-change positive">From universal coverage (Yale study)</div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f0f9ff',
          border: '2px solid #0ea5e9',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#075985'}}>💡 Key Insights</h4>
          <div style={{fontSize: '0.95rem', color: '#0c4a6e', lineHeight: '1.8'}}>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>95% of Americans would save money under Medicare for All (only top 5% pay more)</li>
              <li>Businesses save by eliminating employer healthcare costs ($1.2T/year)</li>
              <li>Medical bankruptcies (500,000/year) would be eliminated</li>
              <li>Entrepreneurship would increase (no "job lock" from needing employer insurance)</li>
              <li>Every other developed country has universal healthcare at lower cost</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Healthcare costs consume 9.4% of median after-tax household income ($480/mo of $61,156/year)</li>
          <li>27.5M Americans remain uninsured; 43M are underinsured with high-deductible plans</li>
          <li>Medical debt affects 41% of Americans (~100M people), with $220B in total medical debt</li>
          <li>Prescription drug prices are 2-3x higher than other countries; 18M Americans ration medications</li>
          <li>Current system costs $4.5T (17.3% of GDP); Medicare for All would cost $4.1T (9% savings)</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Implement Medicare for All to achieve universal coverage and reduce costs</li>
              <li>Expand Medicare drug price negotiation to all drugs (not just 10)</li>
              <li>Public option as interim step (government plan competing with private insurance)</li>
              <li>Medicaid expansion in remaining 12 states to close coverage gap</li>
              <li>Cap out-of-pocket costs at 5% of income for all insurance plans</li>
              <li>Regulate hospital prices and eliminate surprise medical billing entirely</li>
            </ul>
          </li>
        </ul>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Data Sources:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <li>National Health Expenditures: Centers for Medicare & Medicaid Services (CMS)</li>
            <li>Healthcare Spending: Medical Expenditure Panel Survey (MEPS)</li>
            <li>Insurance Coverage: U.S. Census Bureau, CDC</li>
            <li>Drug Prices: Medicare.gov, Kaiser Family Foundation</li>
            <li>Medicare for All Analysis: PERI, Yale, RAND, CBO, Economic Policy Institute</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HealthcareCosts
