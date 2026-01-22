import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'

function TransportationCosts() {
  // Transportation costs by mode
  const costsByMode = {
    labels: ['Car Ownership', 'Ride-share', 'MTA Monthly', 'Bike (Annual)', 'Walking'],
    datasets: [
      {
        label: 'Monthly Cost ($)',
        data: [850, 420, 132, 25, 0],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#22c55e',
          '#10b981',
          '#06b6d4'
        ]
      }
    ]
  }

  // Transportation burden by income level
  const transportBurden = {
    labels: ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '>$100k'],
    datasets: [
      {
        label: 'Transport Burden (%)',
        data: [18.5, 14.2, 11.3, 8.5, 5.2],
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

  // Transit accessibility by borough
  const transitAccessibility = {
    labels: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
    datasets: [
      {
        label: 'Access Score',
        data: [95, 78, 65, 58, 32],
        backgroundColor: [
          '#10b981',
          '#22c55e',
          '#eab308',
          '#f97316',
          '#ef4444'
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
        <h2>Transportation Costs Analysis</h2>
        <p className="widget-description">
          Examine transportation costs, transit accessibility, and the burden of commuting
          across income levels and neighborhoods in NYC.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Avg Monthly Transport Cost</div>
            <div className="metric-value">$285</div>
            <div className="metric-change">Across all modes</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">MTA Monthly Pass</div>
            <div className="metric-value">$132</div>
            <div className="metric-change positive">Most affordable option</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Commute Time</div>
            <div className="metric-value">42 min</div>
            <div className="metric-change">Each way</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Low-Income Transport Burden</div>
            <div className="metric-value">18.5%</div>
            <div className="metric-change negative">of income</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Monthly Transportation Cost by Mode</h3>
          <Bar data={costsByMode} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Transportation Burden by Income Level</h3>
          <Bar data={transportBurden} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Transit Accessibility Score by Borough</h3>
          <Bar data={transitAccessibility} options={chartOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Transit Equity Metrics</h2>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Jobs Accessible (30min)</div>
            <div className="metric-value">485k</div>
            <div className="metric-change">Manhattan avg</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Jobs Accessible (30min)</div>
            <div className="metric-value">142k</div>
            <div className="metric-change negative">Outer borough avg</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Fair Fares Enrollment</div>
            <div className="metric-value">28%</div>
            <div className="metric-change negative">Of eligible households</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Transit Deserts</div>
            <div className="metric-value">15%</div>
            <div className="metric-change negative">Of NYC area</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Car Ownership Economics</h2>
        <p className="widget-description">
          For households that own cars, total monthly costs average $850 including:
        </p>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Loan Payment</div>
            <div className="metric-value">$425</div>
            <div className="metric-change">Average monthly</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Insurance</div>
            <div className="metric-value">$215</div>
            <div className="metric-change">Monthly premium</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Gas + Maintenance</div>
            <div className="metric-value">$140</div>
            <div className="metric-change">Average monthly</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Parking</div>
            <div className="metric-value">$70</div>
            <div className="metric-change">Monthly avg</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Low-income households spend 18.5% of income on transportation, nearly 4x higher than wealthy households</li>
          <li>Car ownership costs $850/month - over 6x the MTA monthly pass, yet many outer borough residents lack transit access</li>
          <li>Manhattan residents can access 3.4x more jobs within 30 minutes by transit than outer borough residents</li>
          <li>Only 28% of eligible households are enrolled in Fair Fares program ($66 half-price MetroCards)</li>
          <li>15% of NYC area are "transit deserts" with poor access to public transportation</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Expand Fair Fares automatic enrollment and increase income eligibility threshold</li>
              <li>Invest in outer borough transit connections and bus rapid transit</li>
              <li>Implement free bus transfers and discounted monthly passes for low-income residents</li>
              <li>Create protected bike lanes and expand bike-share to transit deserts</li>
              <li>Zone for transit-oriented development near subway and commuter rail stations</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TransportationCosts
