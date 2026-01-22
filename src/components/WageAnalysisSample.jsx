import React from 'react'
import { Line, Bar } from 'react-chartjs-2'

function WageAnalysis() {
  // Living wage calculation for NYC (single adult)
  const livingWageBreakdown = {
    labels: ['Housing', 'Food', 'Transport', 'Healthcare', 'Childcare', 'Other'],
    datasets: [
      {
        label: 'Monthly Cost ($)',
        data: [1800, 450, 350, 300, 0, 600],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fad0c4'
        ]
      }
    ]
  }

  const wageGrowthVsCost = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Median Wage Growth (%)',
        data: [2.1, 2.5, 1.8, 3.2, 3.8, 2.9],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Cost of Living Increase (%)',
        data: [3.2, 3.5, 2.9, 4.8, 6.2, 5.1],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
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
        beginAtZero: true
      }
    }
  }

  return (
    <div>
      <div className="widget">
        <h2>Wage & Income Analysis</h2>
        <p className="widget-description">
          Compare wages to living costs, track income inequality, and analyze whether wages
          are keeping pace with the rising cost of living in NYC.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Living Wage (Single Adult)</div>
            <div className="metric-value">$21.25/hr</div>
            <div className="metric-change negative">vs $15 minimum wage</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Hourly Wage</div>
            <div className="metric-value">$28.50</div>
            <div className="metric-change positive">↑ 2.9% from last year</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Annual Living Wage</div>
            <div className="metric-value">$44,200</div>
            <div className="metric-change">For 1 adult, no children</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Wage Gap</div>
            <div className="metric-value">41%</div>
            <div className="metric-change negative">Min wage vs living wage</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Wage Growth vs Cost of Living</h3>
          <Line data={wageGrowthVsCost} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Living Wage Breakdown (Monthly)</h3>
          <Bar data={livingWageBreakdown} options={chartOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Income Inequality Metrics</h2>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Gini Coefficient</div>
            <div className="metric-value">0.55</div>
            <div className="metric-change negative">High inequality</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Top 10% Income Share</div>
            <div className="metric-value">48%</div>
            <div className="metric-change">Of total income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">20/20 Ratio</div>
            <div className="metric-value">15.8x</div>
            <div className="metric-change">Top 20% vs Bottom 20%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Real Wage Growth</div>
            <div className="metric-value">-2.2%</div>
            <div className="metric-change negative">Inflation-adjusted</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Minimum wage ($15/hr) falls 41% short of living wage ($21.25/hr) for single adults</li>
          <li>Cost of living has outpaced wage growth in 5 of the last 6 years</li>
          <li>Real wages (adjusted for inflation) have declined 2.2% over the period</li>
          <li>NYC has one of the highest Gini coefficients among major US cities, indicating severe inequality</li>
          <li>Policy recommendations: raise minimum wage to living wage levels, strengthen collective bargaining, progressive taxation</li>
        </ul>
      </div>
    </div>
  )
}

export default WageAnalysis
