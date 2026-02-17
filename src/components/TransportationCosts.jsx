import React from 'react'
import { Bar } from 'react-chartjs-2'
// Chart.js elements are registered globally in main.jsx via src/utils/chartConfig.js
import { BAR_OPTIONS } from '../utils/chartConfig'

/**
 * Transportation Costs Widget - Uses Real Federal Data
 * Data sources: AAA, American Public Transportation Association, BTS
 */
function TransportationCosts({ data, metrics }) {
  const transportData = data?.transportation || {};
  const carCost = transportData.carOwnership?.monthly || 1015;
  const transitCost = transportData.publicTransit?.monthly || 95;
  const bikeCost = transportData.bikeshare?.monthly || 20;

  // Transportation costs by mode
  const costsByMode = {
    labels: ['Car Ownership', 'Public Transit', 'Bike/Walk', 'Rideshare (Heavy Use)'],
    datasets: [
      {
        label: 'Monthly Cost ($)',
        data: [carCost, transitCost, bikeCost, 420],
        backgroundColor: [
          '#ef4444',
          '#22c55e',
          '#10b981',
          '#f97316'
        ]
      }
    ]
  };

  // Transportation burden by income level (as % of income)
  const incomeLevels = [
    { income: 20000, label: '<$25k' },
    { income: 37500, label: '$25k-$50k' },
    { income: 62500, label: '$50k-$75k' },
    { income: 87500, label: '$75k-$100k' },
    { income: 150000, label: '>$100k' }
  ];

  const transportBurden = {
    labels: incomeLevels.map(l => l.label),
    datasets: [
      {
        label: 'Car Ownership Burden (%)',
        data: incomeLevels.map(l => {
          const afterTax = l.income * 0.82; // After ~18% tax
          return ((carCost * 12 / afterTax) * 100).toFixed(1);
        }),
        backgroundColor: '#ef4444'
      },
      {
        label: 'Public Transit Burden (%)',
        data: incomeLevels.map(l => {
          const afterTax = l.income * 0.82; // After ~18% tax
          return ((transitCost * 12 / afterTax) * 100).toFixed(1);
        }),
        backgroundColor: '#22c55e'
      }
    ]
  };

  // Use shared chart options from chartConfig
  const chartOptions = BAR_OPTIONS;

  // Calculate burden for median income (using AFTER-TAX income)
  const medianIncome = data?.income?.medianHouseholdIncome || 74580;
  const effectiveTaxRate = 0.18; // Median household effective tax rate
  const afterTaxIncome = medianIncome * (1 - effectiveTaxRate); // After-tax income
  const carBurdenMedian = ((carCost * 12 / afterTaxIncome) * 100).toFixed(1);
  const transitBurdenMedian = ((transitCost * 12 / afterTaxIncome) * 100).toFixed(1);

  return (
    <div>
      <div className="widget">
        <h2>Transportation Costs Analysis</h2>
        <p className="widget-description">
          National average transportation costs by mode. Car ownership includes loan/lease, insurance,
          fuel, maintenance, and depreciation based on AAA data. Public transit based on average
          monthly pass costs nationwide.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Avg Car Ownership Cost</div>
            <div className="metric-value">${carCost}</div>
            <div className="metric-change">Per month (AAA 2024)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Avg Public Transit Cost</div>
            <div className="metric-value">${transitCost}</div>
            <div className="metric-change positive">91% cheaper than car</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Car Burden (Median Income)</div>
            <div className="metric-value">{carBurdenMedian}%</div>
            <div className="metric-change">of annual income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Transit Burden (Median Income)</div>
            <div className="metric-value">{transitBurdenMedian}%</div>
            <div className="metric-change positive">of annual income</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Monthly Transportation Cost by Mode</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            National averages for different transportation modes
          </p>
          <Bar data={costsByMode} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Transportation Burden by Income Level</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Percentage of annual income spent on transportation
          </p>
          <Bar data={transportBurden} options={chartOptions} />
        </div>
      </div>

      <div className="widget">
        <h2>Car Ownership Economics</h2>
        <p className="widget-description">
          According to AAA, the average annual cost to own and operate a new vehicle in 2024 is $12,182.
          This breaks down to approximately $1,015 per month:
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Depreciation</div>
            <div className="metric-value">$392</div>
            <div className="metric-change">Largest monthly cost</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Loan Interest</div>
            <div className="metric-value">$58</div>
            <div className="metric-change">Average financing cost</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Insurance</div>
            <div className="metric-value">$196</div>
            <div className="metric-change">National average premium</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Fuel + Maintenance</div>
            <div className="metric-value">$369</div>
            <div className="metric-change">Operating costs</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Transportation Affordability Analysis</h2>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Low-Income Car Burden</div>
            <div className="metric-value">60.9%</div>
            <div className="metric-change negative">Of $20k annual income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Households Without Cars</div>
            <div className="metric-value">8.6%</div>
            <div className="metric-change">US Census (2023)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Commute Time</div>
            <div className="metric-value">27.6 min</div>
            <div className="metric-change">One-way (Census/ACS)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Transit Dependent Workers</div>
            <div className="metric-value">5.2%</div>
            <div className="metric-change">Primary commute mode</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Car ownership costs $12,182 annually - over 60% of income for someone earning $20,000/year</li>
          <li>Public transit averages $1,140/year - 91% cheaper than car ownership, but unavailable in many areas</li>
          <li>8.6% of US households have no vehicle, creating employment and access barriers in car-dependent areas</li>
          <li>Transportation costs disproportionately burden low-income households who may lack access to transit alternatives</li>
          <li>Median American commute is 27.6 minutes each way, representing unpaid time and stress</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Expand public transit access and frequency to provide affordable alternatives to car ownership</li>
              <li>Create subsidized transit pass programs for low-income workers (like Fair Fares programs)</li>
              <li>Support electric vehicle incentives and charging infrastructure to reduce fuel costs</li>
              <li>Invest in bike infrastructure and micromobility options for short trips</li>
              <li>Zone for transit-oriented development to reduce car dependency</li>
              <li>Implement telework-friendly policies to reduce commute costs and time</li>
            </ul>
          </li>
        </ul>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Data Sources:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <li>Car Ownership Costs: AAA Your Driving Costs 2024</li>
            <li>Public Transit: American Public Transportation Association</li>
            <li>Commute Data: U.S. Census Bureau, American Community Survey</li>
            <li>Transportation Statistics: Bureau of Transportation Statistics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TransportationCosts
