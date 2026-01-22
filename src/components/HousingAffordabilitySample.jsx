import React from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function HousingAffordability() {
  // Sample data for New York City housing trends
  const rentBurdenData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Median Rent ($)',
        data: [2850, 2950, 2900, 3100, 3400, 3600],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      },
      {
        label: 'Median Income ($)',
        data: [65000, 67000, 68000, 70000, 72000, 74000],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }

  const rentBurdenByIncome = {
    labels: ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '>$100k'],
    datasets: [
      {
        label: 'Rent Burden (%)',
        data: [65, 48, 38, 28, 18],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#10b981'
        ]
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
        <h2>Housing Affordability Analysis</h2>
        <p className="widget-description">
          Track rent burden, housing supply, and affordability metrics across income levels.
          Housing is considered affordable when it costs no more than 30% of household income.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Monthly Rent</div>
            <div className="metric-value">$3,600</div>
            <div className="metric-change negative">↑ 5.9% from last year</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Income</div>
            <div className="metric-value">$74,000</div>
            <div className="metric-change positive">↑ 2.8% from last year</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Rent Burden</div>
            <div className="metric-value">58%</div>
            <div className="metric-change negative">Above 30% threshold</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Cost-Burdened Households</div>
            <div className="metric-value">52%</div>
            <div className="metric-change negative">Paying >30% on rent</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Rent vs Income Trends</h3>
          <Line data={rentBurdenData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Rent Burden by Income Level</h3>
          <Bar data={rentBurdenByIncome} options={chartOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Low-income households (&lt;$25k) spend 65% of income on rent, more than double the affordability threshold</li>
          <li>Rent has grown 26% since 2018 while median income grew only 14%</li>
          <li>Over half of households are rent-burdened, indicating a structural affordability crisis</li>
          <li>Policy interventions needed: rent stabilization expansion, public housing investment, inclusionary zoning</li>
        </ul>
      </div>
    </div>
  )
}

export default HousingAffordability
