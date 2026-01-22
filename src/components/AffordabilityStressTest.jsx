import React, { useState, useMemo } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  MEDIAN_INCOME,
  MEDIAN_HOUSEHOLD_EXPENSES,
  MEDIAN_INDIVIDUAL_EXPENSES,
  EFFECTIVE_TAX_RATES
} from '../utils/baselineData'
import {
  calculatePersonalizedPolicyImpacts,
  calculateScenarioImpact
} from '../utils/policyImpactCalculator'

/**
 * Affordability Stress Test
 *
 * A unique calculator that measures household financial resilience through real-world scenarios
 * Focus: Can you handle life's unexpected financial shocks?
 *
 * Different from traditional budget calculators:
 * - Tests ability to absorb financial shocks, not just monthly budgets
 * - Shows seasonal financial pressure points
 * - Demonstrates policy impact on crisis resilience
 * - Focuses on quality of life, not just survival
 */
function AffordabilityStressTest() {
  // Household inputs
  const [state, setState] = useState('National Average')
  const [income, setIncome] = useState(75000)
  const [numAdults, setNumAdults] = useState(2)
  const [numChildren, setNumChildren] = useState(0)
  const [hasChildcare, setHasChildcare] = useState(false)
  const [hasStudentLoans, setHasStudentLoans] = useState(false)
  const [studentLoanBalance, setStudentLoanBalance] = useState(37000)
  const [housingType, setHousingType] = useState('rent')
  const [selectedPolicyScenario, setSelectedPolicyScenario] = useState('none')

  // State data with cost multipliers and median incomes
  const stateData = {
    'National Average': {
      housing: 1.0,
      overall: 1.0,
      tax: 0.18,
      medianHouseholdIncome: 74580,
      medianIndividualIncome: 44000,
      medianHomePrice: 417000
    },
    'California': {
      housing: 1.65,
      overall: 1.15,
      tax: 0.21,
      medianHouseholdIncome: 91905,
      medianIndividualIncome: 54200,
      medianHomePrice: 783000
    },
    'Texas': {
      housing: 0.95,
      overall: 0.95,
      tax: 0.16,
      medianHouseholdIncome: 73035,
      medianIndividualIncome: 43500,
      medianHomePrice: 303000
    },
    'New York': {
      housing: 1.55,
      overall: 1.12,
      tax: 0.20,
      medianHouseholdIncome: 81386,
      medianIndividualIncome: 48500,
      medianHomePrice: 460000
    },
    'Florida': {
      housing: 1.05,
      overall: 0.98,
      tax: 0.15,
      medianHouseholdIncome: 67106,
      medianIndividualIncome: 40200,
      medianHomePrice: 404000
    }
  }

  const stateInfo = stateData[state] || stateData['National Average']
  const isIndividual = numAdults === 1 && numChildren === 0
  const householdSize = numAdults + numChildren

  // Calculate basic finances
  const effectiveTaxRate = Math.max(stateInfo.tax, isIndividual ? EFFECTIVE_TAX_RATES.individual : EFFECTIVE_TAX_RATES.household)
  const monthlyAfterTax = (income * (1 - effectiveTaxRate)) / 12

  // Calculate monthly expenses
  const baseExpenses = isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES : MEDIAN_HOUSEHOLD_EXPENSES
  const housingCost = Math.round(baseExpenses.housing * stateInfo.housing * (housingType === 'own' ? 0.85 : 1.0))
  const transportationCost = Math.round(baseExpenses.transportation * stateInfo.overall * Math.min(numAdults / (isIndividual ? 1 : 2), 1.5))
  const foodCost = Math.round(baseExpenses.food * (householdSize / (isIndividual ? 1 : 2.5)))
  const healthcareCost = Math.round(baseExpenses.healthcare * (numAdults / (isIndividual ? 1 : 2)) * stateInfo.overall)
  const insuranceCost = Math.round(baseExpenses.insurance * (numAdults / (isIndividual ? 1 : 2)) * stateInfo.overall)
  const childcareCost = hasChildcare && numChildren > 0 ? Math.round(950 * numChildren * stateInfo.overall) : 0
  const studentLoanPayment = hasStudentLoans ? Math.round(studentLoanBalance / 120) : 0
  const otherExpenses = Math.round((isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES.other : MEDIAN_HOUSEHOLD_EXPENSES.other) * (householdSize / (isIndividual ? 1 : 2.5)) * stateInfo.overall)

  const totalMonthlyExpenses = housingCost + transportationCost + foodCost + healthcareCost + insuranceCost + childcareCost + studentLoanPayment + otherExpenses
  const monthlyDisposable = monthlyAfterTax - totalMonthlyExpenses

  // Financial shock scenarios - the unique part!
  const shockScenarios = [
    {
      id: 'car_repair',
      name: 'Car Breakdown',
      icon: '🚗',
      cost: 1200,
      description: 'Transmission needs repair, can\'t delay',
      frequency: 'Every 2-3 years',
      category: 'transportation'
    },
    {
      id: 'medical_emergency',
      name: 'Medical Emergency',
      icon: '🏥',
      cost: 2500,
      description: 'ER visit + tests with insurance deductible',
      frequency: 'Unpredictable',
      category: 'healthcare'
    },
    {
      id: 'dental_work',
      name: 'Dental Emergency',
      icon: '🦷',
      cost: 800,
      description: 'Root canal not covered by insurance',
      frequency: '1 in 5 years',
      category: 'healthcare'
    },
    {
      id: 'appliance_breakdown',
      name: 'Major Appliance Fails',
      icon: '❄️',
      cost: 900,
      description: 'Refrigerator or HVAC stops working',
      frequency: 'Every 5-10 years',
      category: 'housing'
    },
    {
      id: 'job_loss',
      name: 'Temporary Job Loss',
      icon: '💼',
      cost: totalMonthlyExpenses * 3,
      description: '3 months to find new employment',
      frequency: 'Once per decade',
      category: 'income'
    },
    {
      id: 'pet_emergency',
      name: 'Pet Emergency',
      icon: '🐕',
      cost: 1500,
      description: 'Unexpected vet surgery',
      frequency: '1 in 3 years (if you have pets)',
      category: 'other'
    }
  ]

  // Calculate resilience score (0-100)
  const calculateResilienceScore = (disposable) => {
    const monthlySavings = Math.max(0, disposable)
    const emergencyFund = monthlySavings * 6 // Assume 6 months saved

    // Score based on ability to handle shocks
    let score = 0

    // Base score from emergency fund coverage
    if (emergencyFund >= totalMonthlyExpenses * 6) score += 40
    else if (emergencyFund >= totalMonthlyExpenses * 3) score += 25
    else if (emergencyFund >= totalMonthlyExpenses) score += 10

    // Score from monthly cushion
    const cushionPercent = (disposable / monthlyAfterTax) * 100
    if (cushionPercent >= 20) score += 30
    else if (cushionPercent >= 10) score += 20
    else if (cushionPercent >= 5) score += 10
    else if (cushionPercent > 0) score += 5

    // Bonus for no debt
    if (!hasStudentLoans) score += 15
    else score += 5

    // Housing cost burden penalty
    const housingBurden = (housingCost / monthlyAfterTax) * 100
    if (housingBurden <= 30) score += 15
    else if (housingBurden <= 40) score += 7

    return Math.min(100, Math.max(0, score))
  }

  const currentResilienceScore = calculateResilienceScore(monthlyDisposable)

  // Calculate scenario outcomes
  const scenarioOutcomes = shockScenarios.map(scenario => {
    const monthsToRecover = monthlyDisposable > 0 ? Math.ceil(scenario.cost / monthlyDisposable) : Infinity
    const canHandle = monthlyDisposable * 3 >= scenario.cost // Can recover in 3 months

    return {
      ...scenario,
      monthsToRecover,
      canHandle,
      impact: canHandle ? 'manageable' : monthsToRecover === Infinity ? 'crisis' : 'difficult'
    }
  })

  // Policy impact calculation
  const householdData = {
    income,
    monthlyAfterTax,
    numChildren,
    numAdults,
    hasStudentLoans,
    studentLoanBalance,
    studentLoanPayment,
    hasChildcare,
    childcareCost,
    housingCost,
    healthcareCost,
    transportationCost,
    state,
    stateInfo
  }

  const policyScenario = selectedPolicyScenario !== 'none'
    ? calculateScenarioImpact(householdData, selectedPolicyScenario)
    : null

  const disposableWithPolicy = policyScenario
    ? monthlyDisposable + policyScenario.totalMonthlyImpact
    : monthlyDisposable

  const resilienceWithPolicy = policyScenario
    ? calculateResilienceScore(disposableWithPolicy)
    : currentResilienceScore

  // Seasonal stress calendar data
  const seasonalStress = [
    { month: 'Jan', stress: 75, reason: 'Holiday bills + heating costs', additionalCost: 400 },
    { month: 'Feb', stress: 70, reason: 'Winter utility bills peak', additionalCost: 200 },
    { month: 'Mar', stress: 50, reason: 'Baseline expenses', additionalCost: 0 },
    { month: 'Apr', stress: 65, reason: 'Tax filing, spring maintenance', additionalCost: 300 },
    { month: 'May', stress: 55, reason: 'End of school year activities', additionalCost: 150 },
    { month: 'Jun', stress: 70, reason: 'Summer childcare begins', additionalCost: hasChildcare ? childcareCost : 0 },
    { month: 'Jul', stress: 65, reason: 'Summer activities, AC costs', additionalCost: 250 },
    { month: 'Aug', stress: 80, reason: 'Back to school shopping', additionalCost: numChildren * 300 },
    { month: 'Sep', stress: 75, reason: 'School fees, supplies, clothing', additionalCost: numChildren * 200 },
    { month: 'Oct', stress: 55, reason: 'Baseline with holiday prep', additionalCost: 100 },
    { month: 'Nov', stress: 70, reason: 'Holiday travel and food', additionalCost: 400 },
    { month: 'Dec', stress: 90, reason: 'Holiday gifts and celebrations', additionalCost: 600 }
  ]

  // Resilience score interpretation
  const getScoreInterpretation = (score) => {
    if (score >= 80) return { level: 'Strong', color: '#22c55e', icon: '💪', description: 'Well-prepared for financial shocks' }
    if (score >= 60) return { level: 'Moderate', color: '#3b82f6', icon: '👍', description: 'Can handle some unexpected expenses' }
    if (score >= 40) return { level: 'Vulnerable', color: '#f59e0b', icon: '⚠️', description: 'Limited buffer for emergencies' }
    return { level: 'At Risk', color: '#ef4444', icon: '🚨', description: 'One emergency away from crisis' }
  }

  const currentInterpretation = getScoreInterpretation(currentResilienceScore)
  const policyInterpretation = getScoreInterpretation(resilienceWithPolicy)

  // Chart data
  const stressCalendarData = {
    labels: seasonalStress.map(m => m.month),
    datasets: [{
      label: 'Financial Stress Level',
      data: seasonalStress.map(m => m.stress),
      backgroundColor: seasonalStress.map(m => {
        if (m.stress >= 80) return '#ef4444'
        if (m.stress >= 65) return '#f59e0b'
        return '#3b82f6'
      }),
      borderColor: '#1e40af',
      borderWidth: 1
    }]
  }

  const resilienceComparisonData = {
    labels: ['Current System', policyScenario ? policyScenario.name : 'With Policy'],
    datasets: [{
      data: [currentResilienceScore, resilienceWithPolicy],
      backgroundColor: [currentInterpretation.color, policyInterpretation.color]
    }]
  }

  return (
    <div>
      <div className="widget">
        <h2>💪 Affordability Stress Test</h2>
        <p className="widget-description">
          Test your household's financial resilience. Can you handle life's unexpected expenses?
          See how progressive policies would strengthen your ability to weather financial shocks.
        </p>

        {/* Input Section */}
        <div style={{
          background: '#f9fafb',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{marginTop: 0, marginBottom: '1.5rem', color: '#1e40af'}}>Your Household</h3>

          {/* State */}
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
              {Object.keys(stateData).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Income */}
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              Annual Household Income: ${income.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value))}
              style={{width: '100%'}}
            />
          </div>

          {/* Household composition */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>Adults</label>
              <input
                type="number"
                min="1"
                max="4"
                value={numAdults}
                onChange={(e) => setNumAdults(parseInt(e.target.value))}
                style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>Children</label>
              <input
                type="number"
                min="0"
                max="6"
                value={numChildren}
                onChange={(e) => setNumChildren(parseInt(e.target.value))}
                style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>
          </div>

          {/* Housing type */}
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>Housing</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
            >
              <option value="rent">Renting</option>
              <option value="own">Own with mortgage</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div>
            <label style={{display: 'flex', alignItems: 'center', marginBottom: '0.75rem'}}>
              <input
                type="checkbox"
                checked={hasChildcare}
                onChange={(e) => setHasChildcare(e.target.checked)}
                style={{marginRight: '0.5rem', width: '18px', height: '18px'}}
              />
              <span style={{fontWeight: 'bold'}}>Need childcare for young children</span>
            </label>

            <label style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={hasStudentLoans}
                onChange={(e) => setHasStudentLoans(e.target.checked)}
                style={{marginRight: '0.5rem', width: '18px', height: '18px'}}
              />
              <span style={{fontWeight: 'bold'}}>Have student loan debt</span>
            </label>

            {hasStudentLoans && (
              <div style={{marginTop: '0.75rem', marginLeft: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem'}}>
                  Balance: ${studentLoanBalance.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={studentLoanBalance}
                  onChange={(e) => setStudentLoanBalance(parseInt(e.target.value))}
                  style={{width: '100%'}}
                />
              </div>
            )}
          </div>
        </div>

        {/* Financial Resilience Score */}
        <div style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1rem', color: '#1e40af'}}>Your Financial Resilience Score</h3>

          <div className="metric-grid">
            <div className="metric-card" style={{background: `${currentInterpretation.color}15`, border: `2px solid ${currentInterpretation.color}`}}>
              <div className="metric-label">Current Resilience</div>
              <div className="metric-value" style={{color: currentInterpretation.color, fontSize: '3rem'}}>
                {currentInterpretation.icon} {currentResilienceScore}
              </div>
              <div className="metric-change" style={{color: currentInterpretation.color, fontWeight: 'bold'}}>
                {currentInterpretation.level} - {currentInterpretation.description}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Monthly Cushion</div>
              <div className="metric-value" style={{color: monthlyDisposable > 0 ? '#22c55e' : '#ef4444'}}>
                ${Math.abs(monthlyDisposable).toLocaleString()}
              </div>
              <div className="metric-change">
                {monthlyDisposable > 0 ? 'Available for savings' : 'Monthly deficit'}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Days Until Crisis</div>
              <div className="metric-value">
                {monthlyDisposable > 0
                  ? Math.floor((monthlyDisposable * 3) / (totalMonthlyExpenses / 30))
                  : '0'
                }
              </div>
              <div className="metric-change">If income stopped today</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Emergency Fund Target</div>
              <div className="metric-value" style={{fontSize: '1.3rem'}}>
                ${(totalMonthlyExpenses * 6).toLocaleString()}
              </div>
              <div className="metric-change">6 months of expenses</div>
            </div>
          </div>
        </div>

        {/* Financial Shock Scenarios */}
        <div style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1rem', color: '#1e40af'}}>Can You Afford These Real-Life Emergencies?</h3>
          <p style={{color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem'}}>
            Life throws curveballs. Here's how long it would take to recover from common financial shocks.
          </p>

          <div style={{display: 'grid', gap: '1rem'}}>
            {scenarioOutcomes.map(scenario => (
              <div
                key={scenario.id}
                style={{
                  padding: '1.25rem',
                  border: `2px solid ${
                    scenario.impact === 'manageable' ? '#22c55e' :
                    scenario.impact === 'difficult' ? '#f59e0b' : '#ef4444'
                  }`,
                  borderRadius: '8px',
                  background: scenario.impact === 'manageable' ? '#f0fdf4' :
                             scenario.impact === 'difficult' ? '#fffbeb' : '#fef2f2'
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem'}}>
                  <div>
                    <h4 style={{margin: 0, fontSize: '1.1rem', color: '#1f2937'}}>
                      {scenario.icon} {scenario.name}
                    </h4>
                    <p style={{margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666'}}>
                      {scenario.description}
                    </p>
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: scenario.impact === 'manageable' ? '#166534' :
                           scenario.impact === 'difficult' ? '#92400e' : '#991b1b'
                  }}>
                    ${scenario.cost.toLocaleString()}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{fontSize: '0.85rem', color: '#666'}}>
                    Frequency: {scenario.frequency}
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    background: scenario.impact === 'manageable' ? '#22c55e' :
                               scenario.impact === 'difficult' ? '#f59e0b' : '#ef4444',
                    color: 'white'
                  }}>
                    {scenario.canHandle
                      ? `✓ Recover in ${scenario.monthsToRecover} ${scenario.monthsToRecover === 1 ? 'month' : 'months'}`
                      : scenario.monthsToRecover === Infinity
                        ? '✗ Would require debt'
                        : `⚠ ${scenario.monthsToRecover} months to recover`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Stress Calendar */}
        <div style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1rem', color: '#1e40af'}}>Your Financial Stress Calendar</h3>
          <p style={{color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem'}}>
            Some months are more expensive than others. Here's when your budget feels the squeeze.
          </p>

          <div className="chart-container">
            <Bar
              data={stressCalendarData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      afterLabel: (context) => {
                        const month = seasonalStress[context.dataIndex]
                        return [
                          month.reason,
                          `Extra cost: $${month.additionalCost}`
                        ]
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Financial Stress Level' }
                  }
                }
              }}
            />
          </div>

          <div style={{marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '4px'}}>
            <strong>💡 Planning Tip:</strong> Set aside extra money in {seasonalStress.reduce((max, m) => m.stress > max.stress ? m : max).month}
            ({seasonalStress.reduce((max, m) => m.stress > max.stress ? m : max).reason}).
          </div>
        </div>

        {/* Policy Impact Section */}
        <div style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e5e7eb'}}>
          <h3 style={{marginBottom: '1rem', color: '#1e40af'}}>🔬 Test Policy Impact on Your Resilience</h3>
          <p style={{color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem'}}>
            See how progressive policies would improve your ability to handle financial shocks.
          </p>

          {/* Policy Selector */}
          <div style={{marginBottom: '2rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              Choose a Policy Package to Test
            </label>
            <select
              value={selectedPolicyScenario}
              onChange={(e) => setSelectedPolicyScenario(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
              <option value="none">No policy changes (baseline)</option>
              <option value="comprehensive">Comprehensive Progressive Agenda</option>
              <option value="healthcare">Universal Healthcare</option>
              <option value="workerSupport">Economic Security Platform</option>
              <option value="housingFocus">Housing Justice Package</option>
              <option value="familySupport">Family Support Package</option>
            </select>
          </div>

          {policyScenario && (
            <>
              {/* Resilience Score Comparison */}
              <div style={{marginBottom: '2rem'}}>
                <h4 style={{marginBottom: '1rem'}}>Resilience Score: Before & After</h4>
                <div className="metric-grid">
                  <div className="metric-card">
                    <div className="metric-label">Current System</div>
                    <div className="metric-value" style={{color: currentInterpretation.color}}>
                      {currentInterpretation.icon} {currentResilienceScore}
                    </div>
                    <div className="metric-change">{currentInterpretation.level}</div>
                  </div>

                  <div className="metric-card" style={{background: '#f0fdf4', border: '2px solid #22c55e'}}>
                    <div className="metric-label">With {policyScenario.name}</div>
                    <div className="metric-value" style={{color: policyInterpretation.color}}>
                      {policyInterpretation.icon} {resilienceWithPolicy}
                    </div>
                    <div className="metric-change positive">
                      +{resilienceWithPolicy - currentResilienceScore} points improvement
                    </div>
                  </div>

                  <div className="metric-card" style={{background: '#dbeafe'}}>
                    <div className="metric-label">Extra Monthly Cushion</div>
                    <div className="metric-value" style={{color: '#1e40af'}}>
                      +${Math.round(policyScenario.totalMonthlyImpact).toLocaleString()}
                    </div>
                    <div className="metric-change">Per month</div>
                  </div>

                  <div className="metric-card" style={{background: '#fef3c7'}}>
                    <div className="metric-label">Days Until Crisis</div>
                    <div className="metric-value" style={{color: '#92400e'}}>
                      {disposableWithPolicy > 0
                        ? Math.floor((disposableWithPolicy * 3) / (totalMonthlyExpenses / 30))
                        : '0'
                      }
                    </div>
                    <div className="metric-change">
                      +{disposableWithPolicy > 0 && monthlyDisposable > 0
                        ? Math.floor((disposableWithPolicy * 3) / (totalMonthlyExpenses / 30)) - Math.floor((monthlyDisposable * 3) / (totalMonthlyExpenses / 30))
                        : 'N/A'
                      } days buffer
                    </div>
                  </div>
                </div>
              </div>

              {/* Shock Scenario Impact */}
              <div style={{marginBottom: '2rem'}}>
                <h4 style={{marginBottom: '1rem'}}>How Policies Change Your Emergency Response</h4>
                <div style={{display: 'grid', gap: '1rem'}}>
                  {scenarioOutcomes.slice(0, 3).map(scenario => {
                    const monthsWithPolicy = disposableWithPolicy > 0 ? Math.ceil(scenario.cost / disposableWithPolicy) : Infinity
                    const improvement = scenario.monthsToRecover - monthsWithPolicy

                    return (
                      <div
                        key={scenario.id}
                        style={{
                          padding: '1rem',
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                          <strong>{scenario.icon} {scenario.name}</strong>
                          <span style={{color: '#666'}}>${scenario.cost.toLocaleString()}</span>
                        </div>
                        <div style={{display: 'flex', gap: '1rem', fontSize: '0.9rem'}}>
                          <div>
                            <div style={{color: '#666'}}>Current:</div>
                            <div style={{fontWeight: 'bold', color: '#ef4444'}}>
                              {scenario.monthsToRecover === Infinity ? 'Requires debt' : `${scenario.monthsToRecover} months`}
                            </div>
                          </div>
                          <div>
                            <div style={{color: '#666'}}>With policy:</div>
                            <div style={{fontWeight: 'bold', color: '#22c55e'}}>
                              {monthsWithPolicy === Infinity ? 'Requires debt' : `${monthsWithPolicy} months`}
                            </div>
                          </div>
                          {improvement > 0 && improvement !== Infinity && (
                            <div style={{marginLeft: 'auto', padding: '0.25rem 0.75rem', background: '#22c55e', color: 'white', borderRadius: '4px', fontWeight: 'bold'}}>
                              {improvement} {improvement === 1 ? 'month' : 'months'} faster
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AffordabilityStressTest
