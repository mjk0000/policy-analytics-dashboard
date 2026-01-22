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
  // Data sources: Census Bureau ACS 2022, BEA Regional Price Parities, Tax Foundation
  const stateData = {
    'National Average': {
      housing: 1.0,
      overall: 1.0,
      tax: 0.18,
      medicaidExpansion: true,
      medianHouseholdIncome: 74580,
      medianIndividualIncome: 44000,
      medianHomePrice: 417000
    },

    // States (alphabetical)
    'Alabama': { housing: 0.72, overall: 0.86, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 56929, medianIndividualIncome: 35200, medianHomePrice: 194000 },
    'Alaska': { housing: 1.15, overall: 1.06, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 86370, medianIndividualIncome: 52800, medianHomePrice: 322000 },
    'Arizona': { housing: 0.95, overall: 0.94, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 72581, medianIndividualIncome: 42500, medianHomePrice: 412000 },
    'Arkansas': { housing: 0.69, overall: 0.85, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 52123, medianIndividualIncome: 33100, medianHomePrice: 170000 },
    'California': { housing: 1.65, overall: 1.15, tax: 0.21, medicaidExpansion: true, medianHouseholdIncome: 91905, medianIndividualIncome: 54200, medianHomePrice: 783000 },
    'Colorado': { housing: 1.30, overall: 1.05, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 87598, medianIndividualIncome: 52000, medianHomePrice: 565000 },
    'Connecticut': { housing: 1.25, overall: 1.08, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 90213, medianIndividualIncome: 54800, medianHomePrice: 336000 },
    'Delaware': { housing: 0.98, overall: 0.99, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 79325, medianIndividualIncome: 47500, medianHomePrice: 320000 },
    'Florida': { housing: 1.05, overall: 0.98, tax: 0.15, medicaidExpansion: false, medianHouseholdIncome: 67106, medianIndividualIncome: 40200, medianHomePrice: 404000 },
    'Georgia': { housing: 0.90, overall: 0.92, tax: 0.17, medicaidExpansion: false, medianHouseholdIncome: 71355, medianIndividualIncome: 42000, medianHomePrice: 321000 },
    'Hawaii': { housing: 1.75, overall: 1.18, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 94814, medianIndividualIncome: 56000, medianHomePrice: 830000 },
    'Idaho': { housing: 0.92, overall: 0.93, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 70214, medianIndividualIncome: 41200, medianHomePrice: 455000 },
    'Illinois': { housing: 1.10, overall: 1.02, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 79253, medianIndividualIncome: 47000, medianHomePrice: 260000 },
    'Indiana': { housing: 0.76, overall: 0.88, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 67173, medianIndividualIncome: 39800, medianHomePrice: 215000 },
    'Iowa': { housing: 0.73, overall: 0.89, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 70571, medianIndividualIncome: 41500, medianHomePrice: 190000 },
    'Kansas': { housing: 0.74, overall: 0.88, tax: 0.17, medicaidExpansion: false, medianHouseholdIncome: 69747, medianIndividualIncome: 41000, medianHomePrice: 194000 },
    'Kentucky': { housing: 0.74, overall: 0.87, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 60183, medianIndividualIncome: 36500, medianHomePrice: 190000 },
    'Louisiana': { housing: 0.78, overall: 0.89, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 57206, medianIndividualIncome: 35000, medianHomePrice: 210000 },
    'Maine': { housing: 0.95, overall: 0.97, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 68251, medianIndividualIncome: 40500, medianHomePrice: 325000 },
    'Maryland': { housing: 1.35, overall: 1.09, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 98461, medianIndividualIncome: 58500, medianHomePrice: 380000 },
    'Massachusetts': { housing: 1.45, overall: 1.10, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 96505, medianIndividualIncome: 57500, medianHomePrice: 625000 },
    'Michigan': { housing: 0.78, overall: 0.89, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 68505, medianIndividualIncome: 40500, medianHomePrice: 225000 },
    'Minnesota': { housing: 0.95, overall: 0.97, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 84313, medianIndividualIncome: 50000, medianHomePrice: 315000 },
    'Mississippi': { housing: 0.68, overall: 0.84, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 52985, medianIndividualIncome: 32500, medianHomePrice: 165000 },
    'Missouri': { housing: 0.76, overall: 0.88, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 65920, medianIndividualIncome: 39200, medianHomePrice: 220000 },
    'Montana': { housing: 0.91, overall: 0.95, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 66341, medianIndividualIncome: 39500, medianHomePrice: 455000 },
    'Nebraska': { housing: 0.78, overall: 0.90, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 71722, medianIndividualIncome: 42200, medianHomePrice: 230000 },
    'Nevada': { housing: 1.05, overall: 0.98, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 71646, medianIndividualIncome: 42500, medianHomePrice: 425000 },
    'New Hampshire': { housing: 1.18, overall: 1.05, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 90845, medianIndividualIncome: 54000, medianHomePrice: 445000 },
    'New Jersey': { housing: 1.38, overall: 1.10, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 97126, medianIndividualIncome: 58000, medianHomePrice: 485000 },
    'New Mexico': { housing: 0.82, overall: 0.91, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 58722, medianIndividualIncome: 35800, medianHomePrice: 270000 },
    'New York': { housing: 1.55, overall: 1.12, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 81386, medianIndividualIncome: 48500, medianHomePrice: 460000 },
    'North Carolina': { housing: 0.88, overall: 0.91, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 66186, medianIndividualIncome: 39500, medianHomePrice: 330000 },
    'North Dakota': { housing: 0.82, overall: 0.93, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 73959, medianIndividualIncome: 43800, medianHomePrice: 255000 },
    'Ohio': { housing: 0.75, overall: 0.88, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 66990, medianIndividualIncome: 39800, medianHomePrice: 205000 },
    'Oklahoma': { housing: 0.72, overall: 0.86, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 61364, medianIndividualIncome: 37000, medianHomePrice: 190000 },
    'Oregon': { housing: 1.25, overall: 1.04, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 76362, medianIndividualIncome: 45500, medianHomePrice: 510000 },
    'Pennsylvania': { housing: 0.85, overall: 0.92, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 73170, medianIndividualIncome: 43500, medianHomePrice: 240000 },
    'Rhode Island': { housing: 1.15, overall: 1.03, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 81370, medianIndividualIncome: 48500, medianHomePrice: 420000 },
    'South Carolina': { housing: 0.82, overall: 0.89, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 63623, medianIndividualIncome: 38200, medianHomePrice: 260000 },
    'South Dakota': { housing: 0.80, overall: 0.91, tax: 0.14, medicaidExpansion: false, medianHouseholdIncome: 69457, medianIndividualIncome: 41000, medianHomePrice: 255000 },
    'Tennessee': { housing: 0.81, overall: 0.89, tax: 0.15, medicaidExpansion: false, medianHouseholdIncome: 64035, medianIndividualIncome: 38500, medianHomePrice: 310000 },
    'Texas': { housing: 0.95, overall: 0.95, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 73035, medianIndividualIncome: 43500, medianHomePrice: 303000 },
    'Utah': { housing: 1.05, overall: 0.98, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 86833, medianIndividualIncome: 51500, medianHomePrice: 505000 },
    'Vermont': { housing: 1.08, overall: 1.02, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 74014, medianIndividualIncome: 44000, medianHomePrice: 355000 },
    'Virginia': { housing: 1.12, overall: 1.02, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 87249, medianIndividualIncome: 52000, medianHomePrice: 370000 },
    'Washington': { housing: 1.35, overall: 1.08, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 90955, medianIndividualIncome: 54500, medianHomePrice: 575000 },
    'West Virginia': { housing: 0.70, overall: 0.85, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 54329, medianIndividualIncome: 33500, medianHomePrice: 145000 },
    'Wisconsin': { housing: 0.85, overall: 0.92, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 72458, medianIndividualIncome: 42800, medianHomePrice: 270000 },
    'Wyoming': { housing: 0.88, overall: 0.94, tax: 0.13, medicaidExpansion: false, medianHouseholdIncome: 72495, medianIndividualIncome: 43000, medianHomePrice: 305000 },

    // U.S. Territories
    'Puerto Rico': { housing: 0.75, overall: 0.90, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 23324, medianIndividualIncome: 15800, medianHomePrice: 185000 },
    'U.S. Virgin Islands': { housing: 1.20, overall: 1.10, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 44800, medianIndividualIncome: 28500, medianHomePrice: 425000 },
    'Guam': { housing: 1.30, overall: 1.12, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 60000, medianIndividualIncome: 37000, medianHomePrice: 450000 },
    'Northern Mariana Islands': { housing: 1.15, overall: 1.05, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 42500, medianIndividualIncome: 27000, medianHomePrice: 380000 },
    'American Samoa': { housing: 0.95, overall: 0.98, tax: 0.14, medicaidExpansion: false, medianHouseholdIncome: 28539, medianIndividualIncome: 19000, medianHomePrice: 220000 },

    // District of Columbia
    'Washington, D.C.': { housing: 1.60, overall: 1.14, tax: 0.21, medicaidExpansion: true, medianHouseholdIncome: 101722, medianIndividualIncome: 60500, medianHomePrice: 680000 }
  }

  const stateInfo = stateData[state] || stateData['National Average']
  const isIndividual = numAdults === 1 && numChildren === 0
  const householdSize = numAdults + numChildren

  // Get appropriate median income for this state and household type
  const stateMedianIncome = isIndividual ? stateInfo.medianIndividualIncome : stateInfo.medianHouseholdIncome

  // Calculate income percentile based on state-specific median
  // Uses more granular calculation for accuracy
  const incomePercentile = useMemo(() => {
    const medianIncome = stateMedianIncome
    const ratio = income / medianIncome

    // Income distribution roughly follows log-normal distribution
    // These percentiles are based on Census Bureau income distribution data
    if (ratio < 0.15) return 5    // Very low income
    if (ratio < 0.25) return 10
    if (ratio < 0.35) return 15
    if (ratio < 0.45) return 20   // Low income
    if (ratio < 0.55) return 25
    if (ratio < 0.65) return 30
    if (ratio < 0.75) return 35   // Below median
    if (ratio < 0.85) return 40
    if (ratio < 0.95) return 45
    if (ratio < 1.05) return 50   // At median (±5%)
    if (ratio < 1.15) return 55
    if (ratio < 1.25) return 60   // Above median
    if (ratio < 1.40) return 65
    if (ratio < 1.55) return 70
    if (ratio < 1.75) return 75   // Upper middle
    if (ratio < 2.00) return 80
    if (ratio < 2.30) return 85   // High income
    if (ratio < 2.70) return 90
    if (ratio < 3.20) return 92   // Very high income
    if (ratio < 3.80) return 94
    if (ratio < 4.50) return 96   // Top 5%
    if (ratio < 5.50) return 97
    if (ratio < 7.00) return 98   // Top 2%
    if (ratio < 10.0) return 99   // Top 1%
    return 99                     // Top 1% (capped at 99)
  }, [income, stateMedianIncome])

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
            <div style={{fontSize: '0.85rem', color: '#666', marginTop: '0.25rem'}}>
              You're in the <strong>{incomePercentile}th percentile</strong> for {isIndividual ? 'individual' : 'household'} income in {state}
              {state !== 'National Average' && (
                <> (Median {isIndividual ? 'individual' : 'household'}: ${stateMedianIncome.toLocaleString()})</>
              )}
            </div>
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

        {/* Data Sources & Methodology Section */}
        <div style={{marginTop: '3rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', fontSize: '0.85rem', color: '#666'}}>
          <h4 style={{marginBottom: '0.75rem', color: '#333', fontSize: '0.95rem'}}>📊 Data Sources & Methodology</h4>
          <div style={{lineHeight: '1.6'}}>
            <p style={{marginBottom: '0.5rem'}}>
              <strong>Income & Economic Data:</strong> U.S. Census Bureau American Community Survey (ACS) 2022 for state median household and individual incomes. Bureau of Economic Analysis (BEA) Regional Price Parities for cost of living adjustments.
            </p>
            <p style={{marginBottom: '0.5rem'}}>
              <strong>Tax Rates:</strong> Tax Foundation state tax burden data, combined with effective federal tax rates from IRS Statistics of Income.
            </p>
            <p style={{marginBottom: '0.5rem'}}>
              <strong>Emergency Scenario Costs:</strong> Bureau of Labor Statistics Consumer Expenditure Survey, AAA automotive repair cost data, healthcare cost estimates from Kaiser Family Foundation, and Bureau of Labor Statistics household expenditure data.
            </p>
            <p style={{marginBottom: '0.5rem'}}>
              <strong>Seasonal Stress Calendar:</strong> Analysis based on BLS Consumer Expenditure Survey quarterly patterns showing increased spending in January (holiday bills), August (back-to-school), and December (holiday shopping).
            </p>
            <p style={{marginBottom: '0.5rem'}}>
              <strong>Policy Impact Estimates:</strong> Research synthesis from Economic Policy Institute (EPI), Center on Budget and Policy Priorities (CBPP), Center for American Progress (CAP), Roosevelt Institute, and Urban Institute. Policy cost/benefit estimates derived from published research on Medicare for All, universal childcare, housing assistance, and social safety net expansions.
            </p>
            <p style={{marginTop: '0.75rem', fontStyle: 'italic'}}>
              <strong>Methodology:</strong> The Financial Resilience Score is an original metric developed for this tool. It combines emergency fund coverage (40%), monthly cushion (30%), debt burden (15%), and housing cost burden (15%). This differs from traditional budget calculators by measuring crisis preparedness rather than income adequacy. See ATTRIBUTION.md for complete source documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffordabilityStressTest
