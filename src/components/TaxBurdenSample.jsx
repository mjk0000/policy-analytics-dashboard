import React from 'react'
import { Bar, Line } from 'react-chartjs-2'

function TaxBurden() {
  // Effective tax rate by income level (Federal + State + Local)
  const effectiveTaxRates = {
    labels: ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '$100k-$200k', '>$200k'],
    datasets: [
      {
        label: 'Effective Tax Rate (%)',
        data: [15.2, 18.5, 22.3, 25.1, 28.4, 32.8],
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
  }

  // Tax credits and benefits utilization
  const taxCreditsUtilization = {
    labels: ['EITC', 'Child Tax Credit', 'Property Tax Credit', 'Sales Tax Relief', 'Transit Benefits'],
    datasets: [
      {
        label: 'Eligible (%)',
        data: [100, 100, 100, 100, 100],
        backgroundColor: 'rgba(102, 126, 234, 0.3)',
        borderColor: '#667eea',
        borderWidth: 2
      },
      {
        label: 'Actually Claiming (%)',
        data: [68, 72, 45, 38, 55],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: '#22c55e',
        borderWidth: 2
      }
    ]
  }

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
        beginAtZero: true,
        max: 100
      }
    }
  }

  const barOptions = {
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
  }

  return (
    <div>
      <div className="widget">
        <h2>Tax Burden Analysis</h2>
        <p className="widget-description">
          Analyze effective tax rates across income levels, tax credit utilization, and
          the overall fiscal burden on working families in NYC.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Avg Effective Tax Rate</div>
            <div className="metric-value">24.7%</div>
            <div className="metric-change">Federal + State + Local</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Sales Tax Rate</div>
            <div className="metric-value">8.875%</div>
            <div className="metric-change">NYC total rate</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Property Tax (Median)</div>
            <div className="metric-value">$3,842</div>
            <div className="metric-change">Annual for homeowners</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Unclaimed Tax Credits</div>
            <div className="metric-value">$890M</div>
            <div className="metric-change negative">Left on the table annually</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Effective Tax Rate by Income Level</h3>
          <Bar data={effectiveTaxRates} options={barOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Tax Credits: Eligible vs Actually Claiming</h3>
          <Bar data={taxCreditsUtilization} options={chartOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Regressivity Analysis</h2>
        <p className="widget-description">
          Sales and property taxes are regressive, taking a larger share of income from
          lower-income households who spend a higher percentage of earnings on necessities.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Sales Tax Burden (Low Income)</div>
            <div className="metric-value">4.2%</div>
            <div className="metric-change">of annual income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Sales Tax Burden (High Income)</div>
            <div className="metric-value">1.1%</div>
            <div className="metric-change">of annual income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">EITC Take-Up Gap</div>
            <div className="metric-value">32%</div>
            <div className="metric-change negative">Eligible but not claiming</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Avg EITC Benefit Lost</div>
            <div className="metric-value">$2,340</div>
            <div className="metric-change negative">Per eligible household</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Sales tax is highly regressive - low-income households pay 4x higher percentage of income than wealthy</li>
          <li>$890M in tax credits go unclaimed annually, representing lost support for working families</li>
          <li>Only 68% of eligible households claim EITC, with average benefit of $2,340 lost per household</li>
          <li>Property tax burden varies significantly by neighborhood, with lower-income areas often paying higher effective rates</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Expand automatic tax credit enrollment and outreach programs</li>
              <li>Exempt essential goods from sales tax to reduce regressivity</li>
              <li>Implement progressive property tax based on property value and owner income</li>
              <li>Create city-level EITC to supplement federal benefits</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TaxBurden
