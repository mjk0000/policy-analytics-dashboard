import React from 'react'
import { Bar } from 'react-chartjs-2'
// Chart.js elements are registered globally in main.jsx via src/utils/chartConfig.js
import { BAR_OPTIONS, PERCENT_BAR_OPTIONS } from '../utils/chartConfig'
import { calculateTaxBurden } from '../services/dataService'

/**
 * Tax Burden Widget - Uses Real Federal Tax Data
 * Data sources: 2024 Federal Tax Brackets, FICA rates, IRS statistics
 */
function TaxBurden({ data, metrics }) {
  // Use calculated tax burdens from metrics
  const taxBurdens = metrics?.taxBurdens || [];

  // Effective tax rate chart using real federal calculations
  const effectiveTaxRates = {
    labels: taxBurdens.map(t => t.label),
    datasets: [
      {
        label: 'Federal Effective Tax Rate (%)',
        data: taxBurdens.map(t => t.effectiveRate),
        backgroundColor: [
          '#10b981',
          '#22c55e',
          '#eab308',
          '#f97316',
          '#ef4444',
          '#dc2626'
        ]
      }
    ]
  };

  // Tax credits utilization (based on IRS statistics)
  const taxCreditsUtilization = {
    labels: ['EITC', 'Child Tax Credit', 'Saver\'s Credit', 'Education Credits'],
    datasets: [
      {
        label: 'Eligible (%)',
        data: [100, 100, 100, 100],
        backgroundColor: 'rgba(102, 126, 234, 0.3)',
        borderColor: '#667eea',
        borderWidth: 2
      },
      {
        label: 'Actually Claiming (%)',
        data: [78, 85, 35, 42], // Based on IRS participation rates
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: '#22c55e',
        borderWidth: 2
      }
    ]
  };

  // Use shared chart options from chartConfig
  const chartOptions = PERCENT_BAR_OPTIONS;  // y-axis capped at 100 for % charts
  const barOptions = BAR_OPTIONS;

  // Sample calculation for a median earner
  const medianIncome = data?.income?.medianHouseholdIncome || 74580;
  const medianTax = calculateTaxBurden(medianIncome);

  return (
    <div>
      <div className="widget">
        <h2>Federal Tax Burden Analysis</h2>
        <p className="widget-description">
          Analysis of federal income tax and FICA (Social Security/Medicare) burden across income levels
          using 2024 tax brackets and standard deduction. Does not include state or local taxes.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Standard Deduction (Single)</div>
            <div className="metric-value">$14,600</div>
            <div className="metric-change">2024 tax year</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">FICA Tax Rate</div>
            <div className="metric-value">7.65%</div>
            <div className="metric-change">Social Security (6.2%) + Medicare (1.45%)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Income Tax</div>
            <div className="metric-value">${medianTax.federalIncomeTax.toLocaleString()}</div>
            <div className="metric-change">For ${medianIncome.toLocaleString()} income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Effective Rate</div>
            <div className="metric-value">{medianTax.effectiveRate}%</div>
            <div className="metric-change">Total federal burden</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Federal Effective Tax Rate by Income Level</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Includes federal income tax + FICA (Social Security/Medicare).
            Based on 2024 tax brackets and single filer standard deduction.
          </p>
          <Bar data={effectiveTaxRates} options={barOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Tax Credits: Eligible vs Actually Claiming</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Millions of eligible taxpayers fail to claim available tax credits, leaving money unclaimed.
          </p>
          <Bar data={taxCreditsUtilization} options={chartOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>2024 Federal Tax Brackets</h2>
        <p className="widget-description">
          Progressive tax system means higher rates apply only to income above each bracket threshold.
        </p>

        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
            <thead>
              <tr style={{background: '#f8f9ff', borderBottom: '2px solid #667eea'}}>
                <th style={{padding: '0.75rem', textAlign: 'left'}}>Tax Rate</th>
                <th style={{padding: '0.75rem', textAlign: 'left'}}>Single Filers</th>
                <th style={{padding: '0.75rem', textAlign: 'left'}}>Married Filing Jointly</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                <td style={{padding: '0.75rem'}}>10%</td>
                <td style={{padding: '0.75rem'}}>$0 - $11,600</td>
                <td style={{padding: '0.75rem'}}>$0 - $23,200</td>
              </tr>
              <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                <td style={{padding: '0.75rem'}}>12%</td>
                <td style={{padding: '0.75rem'}}>$11,601 - $47,150</td>
                <td style={{padding: '0.75rem'}}>$23,201 - $94,300</td>
              </tr>
              <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                <td style={{padding: '0.75rem'}}>22%</td>
                <td style={{padding: '0.75rem'}}>$47,151 - $100,525</td>
                <td style={{padding: '0.75rem'}}>$94,301 - $201,050</td>
              </tr>
              <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                <td style={{padding: '0.75rem'}}>24%</td>
                <td style={{padding: '0.75rem'}}>$100,526 - $191,950</td>
                <td style={{padding: '0.75rem'}}>$201,051 - $383,900</td>
              </tr>
              <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                <td style={{padding: '0.75rem'}}>32%</td>
                <td style={{padding: '0.75rem'}}>$191,951 - $243,725</td>
                <td style={{padding: '0.75rem'}}>$383,901 - $487,450</td>
              </tr>
              <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                <td style={{padding: '0.75rem'}}>35%</td>
                <td style={{padding: '0.75rem'}}>$243,726 - $609,350</td>
                <td style={{padding: '0.75rem'}}>$487,451 - $731,200</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem'}}>37%</td>
                <td style={{padding: '0.75rem'}}>$609,351+</td>
                <td style={{padding: '0.75rem'}}>$731,201+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="widget">
        <h2>Tax Credit Opportunities</h2>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">EITC Take-Up Rate</div>
            <div className="metric-value">78%</div>
            <div className="metric-change negative">22% of eligible don't claim</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Max EITC (3+ children)</div>
            <div className="metric-value">$7,430</div>
            <div className="metric-change positive">2024 maximum benefit</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Child Tax Credit</div>
            <div className="metric-value">$2,000</div>
            <div className="metric-change">Per qualifying child</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Saver's Credit Take-Up</div>
            <div className="metric-value">35%</div>
            <div className="metric-change negative">65% of eligible miss out</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Federal tax system is progressive, with effective rates rising from ~10% to 35% across income levels</li>
          <li>FICA taxes are regressive - same 7.65% rate on wages up to $168,600, nothing on investment income</li>
          <li>22% of EITC-eligible taxpayers don't claim the credit, missing average benefits of $2,400</li>
          <li>Low take-up rates for Saver's Credit (35%) and education credits (42%) indicate awareness gaps</li>
          <li>Standard deduction ($14,600) means many low-income filers owe no federal income tax, but still pay FICA</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Implement automatic EITC enrollment based on tax returns to boost participation</li>
              <li>Expand outreach and free tax preparation services for low-income filers</li>
              <li>Consider raising FICA cap or exempting low earners to reduce regressivity</li>
              <li>Simplify tax credit eligibility and make credits refundable</li>
              <li>Create pre-filled tax returns to reduce filing barriers and increase credit uptake</li>
            </ul>
          </li>
        </ul>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Data Sources:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <li>Tax Brackets: IRS 2024 Tax Tables</li>
            <li>Tax Credit Data: IRS Statistics of Income</li>
            <li>FICA Rates: Social Security Administration</li>
            <li>Participation Rates: Treasury Department, IRS Research</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TaxBurden
