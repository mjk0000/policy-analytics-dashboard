import React from 'react'
import { Line, Bar } from 'react-chartjs-2'
// Chart.js elements are registered globally in main.jsx via src/utils/chartConfig.js
import { BAR_OPTIONS } from '../utils/chartConfig'

/**
 * Housing Affordability Widget - Uses Real Federal Data
 * Data sources: Census Bureau (income), HUD (Fair Market Rents)
 */
function HousingAffordability({ data, metrics }) {
  const medianIncome = data?.income?.medianHouseholdIncome || 74580;
  const livingWageAnnual = data?.livingWage?.annualLivingWage || 30120;

  // Housing affordability threshold: 30% of AFTER-TAX income
  // Median household pays ~18% effective tax rate (federal + FICA)
  const effectiveTaxRate = 0.18;
  const afterTaxIncome = medianIncome * (1 - effectiveTaxRate);
  const afterTaxLivingWage = livingWageAnnual * (1 - 0.15); // Lower tax rate for living wage income

  const affordabilityThreshold = 0.30;
  const affordableRentMedian = Math.round((afterTaxIncome * affordabilityThreshold) / 12);
  const affordableRentLowIncome = Math.round((afterTaxLivingWage * affordabilityThreshold) / 12);

  // Sample rent trend data (would use HUD FMR API for specific metros)
  const rentTrendData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Median Rent ($)',
        data: [1100, 1150, 1175, 1250, 1375, 1450],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      },
      {
        label: 'Affordable Rent at Median Income ($)',
        data: [
          Math.round(61372 * 0.82 * 0.30 / 12), // After 18% taxes
          Math.round(65084 * 0.82 * 0.30 / 12),
          Math.round(67521 * 0.82 * 0.30 / 12),
          Math.round(70784 * 0.82 * 0.30 / 12),
          Math.round(69717 * 0.82 * 0.30 / 12),
          Math.round(afterTaxIncome * 0.30 / 12)
        ],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Rent burden by income level
  const incomeLevels = [
    { income: 20000, label: '<$25k' },
    { income: 37500, label: '$25k-$50k' },
    { income: 62500, label: '$50k-$75k' },
    { income: 87500, label: '$75k-$100k' },
    { income: 150000, label: '>$100k' }
  ];

  const medianRent = 1450; // National median

  const rentBurdenByIncome = {
    labels: incomeLevels.map(l => l.label),
    datasets: [
      {
        label: 'Rent Burden (%)',
        data: incomeLevels.map(l => {
          const afterTax = l.income * 0.82; // After ~18% tax
          return Math.round((medianRent * 12 / afterTax) * 100);
        }),
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#10b981'
        ]
      }
    ]
  };

  // Use shared chart options from chartConfig
  const chartOptions = BAR_OPTIONS;

  // Calculate rent burden for median income (using AFTER-TAX income)
  const rentBurdenMedian = ((medianRent * 12 / afterTaxIncome) * 100).toFixed(1);
  const costBurdened = rentBurdenMedian > 30;

  return (
    <div>
      <div className="widget">
        <h2>Housing Affordability Analysis</h2>
        <p className="widget-description">
          National housing affordability data based on Census Bureau income statistics.
          Housing is considered affordable when it costs no more than 30% of after-tax household income.
          Affordable rent calculated using median income after 18% effective tax rate (federal + FICA).
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">National Median Rent</div>
            <div className="metric-value">$1,450</div>
            <div className="metric-change">Monthly (2023 estimate)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Income</div>
            <div className="metric-value">${medianIncome.toLocaleString()}</div>
            <div className="metric-change">US Census Bureau {data?.income?.year || '2022'}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Affordable Rent (Median Income)</div>
            <div className="metric-value">${affordableRentMedian.toLocaleString()}</div>
            <div className="metric-change positive">30% of after-tax income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Rent Burden</div>
            <div className="metric-value">{rentBurdenMedian}%</div>
            <div className={`metric-change ${costBurdened ? 'negative' : 'positive'}`}>
              {costBurdened ? 'Above' : 'Below'} 30% threshold
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Rent vs Affordable Housing Threshold</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Illustrative trend showing median rent compared to 30% of after-tax median income.
            Affordable threshold accounts for 18% effective tax rate.
          </p>
          <Line data={rentTrendData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Rent Burden by Income Level</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Percentage of income spent on median rent ($1,450/month)
          </p>
          <Bar data={rentBurdenByIncome} options={chartOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Cost-Burdened Households</h2>
        <p className="widget-description">
          According to HUD, a household is "cost-burdened" if it spends more than 30% of income on housing,
          and "severely cost-burdened" if it spends more than 50%.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Cost-Burdened Renters</div>
            <div className="metric-value">46.5%</div>
            <div className="metric-change negative">Paying &gt;30% of income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Severely Burdened Renters</div>
            <div className="metric-value">23.1%</div>
            <div className="metric-change negative">Paying &gt;50% of income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Affordable Rent (Living Wage)</div>
            <div className="metric-value">${affordableRentLowIncome}</div>
            <div className="metric-change">For ${livingWageAnnual.toLocaleString()} income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Rent Gap (Low Income)</div>
            <div className="metric-value">${medianRent - affordableRentLowIncome}</div>
            <div className="metric-change negative">Monthly shortfall</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Housing Supply & Availability</h2>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Rental Vacancy Rate</div>
            <div className="metric-value">6.5%</div>
            <div className="metric-change">Census Bureau (Q3 2023)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Housing Starts (Annual)</div>
            <div className="metric-value">1.4M</div>
            <div className="metric-change">Below historical average</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Years to Save Down Payment</div>
            <div className="metric-value">8.5</div>
            <div className="metric-change negative">For median-priced home</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Homeownership Rate</div>
            <div className="metric-value">65.7%</div>
            <div className="metric-change">US Census (2023)</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Federal Housing Assistance (Section 8)</h2>
        <p className="widget-description">
          Housing Choice Voucher Program (Section 8) helps low-income families afford housing.
          Vouchers cover the difference between 30% of income and actual rent (up to Fair Market Rent).
          Data from HUD and CBPP.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Section 8 Participants</div>
            <div className="metric-value">2.3M</div>
            <div className="metric-change">Households receiving vouchers</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Eligible But Not Served</div>
            <div className="metric-value" style={{color: '#ef4444'}}>75%</div>
            <div className="metric-change negative">Only 25% of eligible receive aid</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Average Wait Time</div>
            <div className="metric-value" style={{color: '#f97316'}}>2.5 years</div>
            <div className="metric-change negative">National average waitlist</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Average Voucher Value</div>
            <div className="metric-value">$1,095/mo</div>
            <div className="metric-change">Varies by location (FMR)</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Section 8 Eligibility & Impact</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Income Limit (Family of 4)</div>
            <div className="metric-value">$37,290/yr</div>
            <div className="metric-change">50% Area Median Income (AMI)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Without Voucher</div>
            <div className="metric-value" style={{color: '#ef4444'}}>$931/mo</div>
            <div className="metric-change negative">30% of low income for housing</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Rent</div>
            <div className="metric-value">$1,450/mo</div>
            <div className="metric-change">Actual market rent</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Voucher Assistance</div>
            <div className="metric-value" style={{color: '#22c55e'}}>$519/mo</div>
            <div className="metric-change positive">Average subsidy needed</div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#92400e'}}>⚠️ Section 8 Gap Analysis</h4>
          <div style={{fontSize: '0.95rem', color: '#78350f', lineHeight: '1.8'}}>
            <p><strong>The Problem:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>11 million households are eligible for Section 8</li>
              <li>Only 2.3 million receive vouchers (21% served)</li>
              <li><strong>8.7 million eligible households receive NO assistance</strong></li>
              <li>Average waitlist: 2.5 years (some cities: 5-10 years)</li>
              <li>Many cities have CLOSED waitlists (not accepting new applications)</li>
            </ul>

            <p style={{marginTop: '1rem'}}><strong>Budget Impact on Low-Income Families:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Family earning $37,290 (50% AMI): $3,108/month after-tax</li>
              <li>Median rent: $1,450/month = <strong>46.7% of after-tax income</strong></li>
              <li>With Section 8: Only $931/month = <strong>30% of after-tax income</strong></li>
              <li><strong>Savings: $519/month for food, healthcare, emergencies</strong></li>
            </ul>

            <p style={{marginTop: '1rem'}}><strong>Progressive Policy Proposal:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li><strong>Universal Housing Vouchers</strong> - Serve all 11M eligible households</li>
              <li>Annual cost: ~$70B (CBPP estimate)</li>
              <li>Would eliminate housing cost burden for lowest-income families</li>
              <li>Creates housing market stability and reduces homelessness</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>46.5% of renter households are cost-burdened, spending more than 30% of income on housing</li>
          <li>Low-income households earning living wage ($30,120) face $699/month gap between median rent and affordable level</li>
          <li>Housing supply constraints: 6.5% vacancy rate and below-average construction rates limit availability</li>
          <li>Median household can afford $1,857/month in rent (30% of $74,580), but geographic variation is extreme</li>
          <li>First-time homebuyers need 8.5 years to save for down payment at median income levels</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Expand Housing Choice Voucher (Section 8) program to serve more eligible families (currently only 25% served)</li>
              <li>Increase funding for Low-Income Housing Tax Credit (LIHTC) to stimulate affordable housing construction</li>
              <li>Reform zoning laws to allow higher-density development and reduce housing costs</li>
              <li>Create/expand down payment assistance programs for first-time homebuyers</li>
              <li>Implement rent stabilization policies to prevent displacement in high-cost areas</li>
              <li>Invest in social housing development as alternative to market-rate construction</li>
            </ul>
          </li>
        </ul>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Data Sources:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <li>Median Income: U.S. Census Bureau, American Community Survey</li>
            <li>Rent Data: HUD Fair Market Rents, Census Bureau</li>
            <li>Cost Burden Statistics: HUD Worst Case Housing Needs Report</li>
            <li>Housing Supply: Census Bureau, Housing Vacancy Survey</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HousingAffordability
