import React, { useState, useMemo, useEffect } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  MEDIAN_INCOME,
  MEDIAN_HOUSEHOLD_EXPENSES,
  MEDIAN_INDIVIDUAL_EXPENSES,
  EFFECTIVE_TAX_RATES
} from '../utils/baselineData'
import {
  calculatePersonalizedPolicyImpacts,
  calculateScenarioImpact,
  getApplicablePolicies,
  getIndirectBenefitPolicies
} from '../utils/policyImpactCalculator'

/**
 * Interactive Household Budget Calculator
 * Allows users to input their specific situation and see personalized budget analysis
 */
function InteractiveBudgetCalculator() {
  // User inputs
  const [state, setState] = useState('National Average')
  const [income, setIncome] = useState(75000)
  const [householdSize, setHouseholdSize] = useState(2)
  const [numChildren, setNumChildren] = useState(0)
  const [numAdults, setNumAdults] = useState(2)
  const [hasStudentLoans, setHasStudentLoans] = useState(false)
  const [studentLoanBalance, setStudentLoanBalance] = useState(37000)
  const [hasChildcare, setHasChildcare] = useState(false)
  const [employmentStatus, setEmploymentStatus] = useState('full-time')
  const [housingType, setHousingType] = useState('rent')

  // Policy comparison state
  const [showPolicyComparison, setShowPolicyComparison] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState('comprehensive')

  // State-specific cost adjustments and median incomes
  // Data sources: BEA Regional Price Parities, Tax Foundation, MIT Living Wage Calculator, Census Bureau ACS 2022
  const stateData = {
    'National Average': {
      housing: 1.0,
      overall: 1.0,
      tax: 0.18,
      medicaidExpansion: true,
      medianHouseholdIncome: 74580,
      medianIndividualIncome: 44000
    },

    // States (alphabetical)
    'Alabama': { housing: 0.72, overall: 0.86, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 56929, medianIndividualIncome: 35200 },
    'Alaska': { housing: 1.15, overall: 1.06, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 86370, medianIndividualIncome: 52800 },
    'Arizona': { housing: 0.95, overall: 0.94, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 72581, medianIndividualIncome: 42500 },
    'Arkansas': { housing: 0.69, overall: 0.85, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 52123, medianIndividualIncome: 33100 },
    'California': { housing: 1.65, overall: 1.15, tax: 0.21, medicaidExpansion: true, medianHouseholdIncome: 91905, medianIndividualIncome: 54200 },
    'Colorado': { housing: 1.30, overall: 1.05, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 87598, medianIndividualIncome: 52000 },
    'Connecticut': { housing: 1.25, overall: 1.08, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 90213, medianIndividualIncome: 54800 },
    'Delaware': { housing: 0.98, overall: 0.99, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 79325, medianIndividualIncome: 47500 },
    'Florida': { housing: 1.05, overall: 0.98, tax: 0.15, medicaidExpansion: false, medianHouseholdIncome: 67106, medianIndividualIncome: 40200 },
    'Georgia': { housing: 0.90, overall: 0.92, tax: 0.17, medicaidExpansion: false, medianHouseholdIncome: 71355, medianIndividualIncome: 42000 },
    'Hawaii': { housing: 1.75, overall: 1.18, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 94814, medianIndividualIncome: 56000 },
    'Idaho': { housing: 0.92, overall: 0.93, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 70214, medianIndividualIncome: 41200 },
    'Illinois': { housing: 1.10, overall: 1.02, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 79253, medianIndividualIncome: 47000 },
    'Indiana': { housing: 0.76, overall: 0.88, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 67173, medianIndividualIncome: 39800 },
    'Iowa': { housing: 0.73, overall: 0.89, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 70571, medianIndividualIncome: 41500 },
    'Kansas': { housing: 0.74, overall: 0.88, tax: 0.17, medicaidExpansion: false, medianHouseholdIncome: 69747, medianIndividualIncome: 41000 },
    'Kentucky': { housing: 0.74, overall: 0.87, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 60183, medianIndividualIncome: 36500 },
    'Louisiana': { housing: 0.78, overall: 0.89, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 57206, medianIndividualIncome: 35000 },
    'Maine': { housing: 0.95, overall: 0.97, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 68251, medianIndividualIncome: 40500 },
    'Maryland': { housing: 1.35, overall: 1.09, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 98461, medianIndividualIncome: 58500 },
    'Massachusetts': { housing: 1.45, overall: 1.10, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 96505, medianIndividualIncome: 57500 },
    'Michigan': { housing: 0.78, overall: 0.89, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 68505, medianIndividualIncome: 40500 },
    'Minnesota': { housing: 0.95, overall: 0.97, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 84313, medianIndividualIncome: 50000 },
    'Mississippi': { housing: 0.68, overall: 0.84, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 52985, medianIndividualIncome: 32500 },
    'Missouri': { housing: 0.76, overall: 0.88, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 65920, medianIndividualIncome: 39200 },
    'Montana': { housing: 0.91, overall: 0.95, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 66341, medianIndividualIncome: 39500 },
    'Nebraska': { housing: 0.78, overall: 0.90, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 71722, medianIndividualIncome: 42200 },
    'Nevada': { housing: 1.05, overall: 0.98, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 71646, medianIndividualIncome: 42500 },
    'New Hampshire': { housing: 1.18, overall: 1.05, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 90845, medianIndividualIncome: 54000 },
    'New Jersey': { housing: 1.38, overall: 1.10, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 97126, medianIndividualIncome: 58000 },
    'New Mexico': { housing: 0.82, overall: 0.91, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 58722, medianIndividualIncome: 35800 },
    'New York': { housing: 1.55, overall: 1.12, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 81386, medianIndividualIncome: 48500 },
    'North Carolina': { housing: 0.88, overall: 0.91, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 66186, medianIndividualIncome: 39500 },
    'North Dakota': { housing: 0.82, overall: 0.93, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 73959, medianIndividualIncome: 43800 },
    'Ohio': { housing: 0.75, overall: 0.88, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 66990, medianIndividualIncome: 39800 },
    'Oklahoma': { housing: 0.72, overall: 0.86, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 61364, medianIndividualIncome: 37000 },
    'Oregon': { housing: 1.25, overall: 1.04, tax: 0.20, medicaidExpansion: true, medianHouseholdIncome: 76362, medianIndividualIncome: 45500 },
    'Pennsylvania': { housing: 0.85, overall: 0.92, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 73170, medianIndividualIncome: 43500 },
    'Rhode Island': { housing: 1.15, overall: 1.03, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 81370, medianIndividualIncome: 48500 },
    'South Carolina': { housing: 0.82, overall: 0.89, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 63623, medianIndividualIncome: 38200 },
    'South Dakota': { housing: 0.80, overall: 0.91, tax: 0.14, medicaidExpansion: false, medianHouseholdIncome: 69457, medianIndividualIncome: 41000 },
    'Tennessee': { housing: 0.81, overall: 0.89, tax: 0.15, medicaidExpansion: false, medianHouseholdIncome: 64035, medianIndividualIncome: 38500 },
    'Texas': { housing: 0.95, overall: 0.95, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 73035, medianIndividualIncome: 43500 },
    'Utah': { housing: 1.05, overall: 0.98, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 86833, medianIndividualIncome: 51500 },
    'Vermont': { housing: 1.08, overall: 1.02, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 74014, medianIndividualIncome: 44000 },
    'Virginia': { housing: 1.12, overall: 1.02, tax: 0.18, medicaidExpansion: true, medianHouseholdIncome: 87249, medianIndividualIncome: 52000 },
    'Washington': { housing: 1.35, overall: 1.08, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 90955, medianIndividualIncome: 54500 },
    'West Virginia': { housing: 0.70, overall: 0.85, tax: 0.17, medicaidExpansion: true, medianHouseholdIncome: 54329, medianIndividualIncome: 33500 },
    'Wisconsin': { housing: 0.85, overall: 0.92, tax: 0.19, medicaidExpansion: true, medianHouseholdIncome: 72458, medianIndividualIncome: 42800 },
    'Wyoming': { housing: 0.88, overall: 0.94, tax: 0.13, medicaidExpansion: false, medianHouseholdIncome: 72495, medianIndividualIncome: 43000 },

    // U.S. Territories
    'Puerto Rico': { housing: 0.75, overall: 0.90, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 23324, medianIndividualIncome: 15800 },
    'U.S. Virgin Islands': { housing: 1.20, overall: 1.10, tax: 0.16, medicaidExpansion: false, medianHouseholdIncome: 44800, medianIndividualIncome: 28500 },
    'Guam': { housing: 1.30, overall: 1.12, tax: 0.16, medicaidExpansion: true, medianHouseholdIncome: 60000, medianIndividualIncome: 37000 },
    'Northern Mariana Islands': { housing: 1.15, overall: 1.05, tax: 0.15, medicaidExpansion: true, medianHouseholdIncome: 42500, medianIndividualIncome: 27000 },
    'American Samoa': { housing: 0.95, overall: 0.98, tax: 0.14, medicaidExpansion: false, medianHouseholdIncome: 28539, medianIndividualIncome: 19000 },

    // District of Columbia
    'Washington, D.C.': { housing: 1.60, overall: 1.14, tax: 0.21, medicaidExpansion: true, medianHouseholdIncome: 101722, medianIndividualIncome: 60500 },
  }

  const stateInfo = stateData[state] || stateData['National Average']

  // Determine if household is individual or multi-person (needed for income percentile)
  const isIndividual = numAdults === 1 && numChildren === 0

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
    if (ratio < 0.25) return 10   //
    if (ratio < 0.35) return 15   //
    if (ratio < 0.45) return 20   // Low income
    if (ratio < 0.55) return 25   //
    if (ratio < 0.65) return 30   //
    if (ratio < 0.75) return 35   // Below median
    if (ratio < 0.85) return 40   //
    if (ratio < 0.95) return 45   //
    if (ratio < 1.05) return 50   // At median (±5%)
    if (ratio < 1.15) return 55   //
    if (ratio < 1.25) return 60   // Above median
    if (ratio < 1.40) return 65   //
    if (ratio < 1.55) return 70   //
    if (ratio < 1.75) return 75   // Upper middle
    if (ratio < 2.00) return 80   //
    if (ratio < 2.30) return 85   // High income
    if (ratio < 2.70) return 90   //
    if (ratio < 3.20) return 92   // Very high income
    if (ratio < 3.80) return 94   //
    if (ratio < 4.50) return 96   // Top 5%
    if (ratio < 5.50) return 97   //
    if (ratio < 7.00) return 98   // Top 2%
    if (ratio < 10.0) return 99   // Top 1%
    return 99                     // Top 1% (capped at 99)
  }, [income, stateMedianIncome])

  // Calculate tax burden - individuals have lower effective tax rate
  const baseEffectiveTaxRate = isIndividual ? EFFECTIVE_TAX_RATES.individual : EFFECTIVE_TAX_RATES.household
  const effectiveTaxRate = Math.max(stateInfo.tax, baseEffectiveTaxRate) // Use higher of state or federal
  const annualTaxes = income * effectiveTaxRate
  const afterTaxIncome = income - annualTaxes
  const monthlyAfterTax = afterTaxIncome / 12

  // Calculate expenses with state adjustments
  // Use individual baselines for single adults, household baselines for families
  const baseExpenses = isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES : MEDIAN_HOUSEHOLD_EXPENSES

  // Housing: use appropriate baseline, scale down for homeowners
  const housingCost = Math.round(baseExpenses.housing * stateInfo.housing * (housingType === 'own' ? 0.85 : 1.0))

  // Transportation: scale based on adults (children don't typically drive/commute)
  const transportationBase = isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES.transportation : MEDIAN_HOUSEHOLD_EXPENSES.transportation
  const transportationCost = Math.round(transportationBase * stateInfo.overall * Math.min(numAdults / (isIndividual ? 1 : 2), 1.5))

  // Food: scale based on household size
  const foodBase = isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES.food : MEDIAN_HOUSEHOLD_EXPENSES.food
  const foodCost = Math.round(foodBase * (householdSize / (isIndividual ? 1 : 2.5)))

  // Healthcare: scale based on number of adults
  const healthcareBase = isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES.healthcare : MEDIAN_HOUSEHOLD_EXPENSES.healthcare
  const healthcareCost = Math.round(healthcareBase * (numAdults / (isIndividual ? 1 : 2)) * stateInfo.overall)

  // Insurance: scale based on adults
  const insuranceBase = isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES.insurance : MEDIAN_HOUSEHOLD_EXPENSES.insurance
  const insuranceCost = Math.round(insuranceBase * (numAdults / (isIndividual ? 1 : 2)) * stateInfo.overall)

  // Entertainment: scale based on total household size (everyone participates)
  const entertainmentCost = isIndividual
    ? 0 // Individual baseline doesn't include entertainment separately
    : Math.round(MEDIAN_HOUSEHOLD_EXPENSES.entertainment * (householdSize / 2.5) * stateInfo.overall)

  // Other expenses: scale based on household size
  const otherBase = isIndividual ? MEDIAN_INDIVIDUAL_EXPENSES.other : MEDIAN_HOUSEHOLD_EXPENSES.other
  const otherCost = Math.round(otherBase * (householdSize / (isIndividual ? 1 : 2.5)) * stateInfo.overall)

  // Additional costs
  const childcareCost = hasChildcare && numChildren > 0 ? Math.round(950 * numChildren * stateInfo.overall) : 0
  const studentLoanPayment = hasStudentLoans ? Math.round((studentLoanBalance / 120)) : 0 // 10-year repayment

  const totalExpenses = housingCost + transportationCost + foodCost + healthcareCost +
                        insuranceCost + entertainmentCost + otherCost + childcareCost + studentLoanPayment

  const disposableIncome = monthlyAfterTax - totalExpenses
  const disposablePercent = ((disposableIncome / monthlyAfterTax) * 100).toFixed(1)

  // Calculate government benefits eligibility
  const calculateBenefits = () => {
    const benefits = {
      snap: 0,
      eitc: 0,
      ctc: 0,
      medicaid: 0,
      housingVoucher: 0,
      childcareSubsidy: 0,
      schoolLunch: 0
    }

    const monthlyIncome = income / 12
    const fpl = 1215 + (householdSize - 1) * 425 // Approximate 2024 Federal Poverty Level

    // SNAP (food stamps) - up to 200% FPL
    if (monthlyIncome < fpl * 2) {
      const maxSNAP = 200 * householdSize
      const ratio = 1 - (monthlyIncome / (fpl * 2))
      benefits.snap = Math.round(maxSNAP * ratio)
    }

    // EITC - varies by income and children
    if (income < 60000) {
      if (numChildren === 0 && income < 17640) {
        benefits.eitc = Math.round((600 - (income / 17640 * 600)) / 12)
      } else if (numChildren === 1 && income < 46560) {
        benefits.eitc = Math.round((3995 - ((income - 20000) / 26560 * 3995)) / 12)
      } else if (numChildren === 2 && income < 52918) {
        benefits.eitc = Math.round((6604 - ((income - 20000) / 32918 * 6604)) / 12)
      } else if (numChildren >= 3 && income < 56838) {
        benefits.eitc = Math.round((7430 - ((income - 20000) / 36838 * 7430)) / 12)
      }
    }

    // Child Tax Credit - $2000 per child
    if (numChildren > 0 && income < 200000) {
      benefits.ctc = Math.round((2000 * numChildren) / 12)
    }

    // Medicaid - up to 138% FPL in expansion states, 100% FPL in non-expansion states
    const medicaidThreshold = stateInfo.medicaidExpansion ? 1.38 : 1.0
    if (monthlyIncome < fpl * medicaidThreshold) {
      benefits.medicaid = Math.round(600 * numAdults) // Value of coverage
    }

    // Housing voucher - up to 50% AMI (very limited availability)
    if (monthlyIncome < MEDIAN_INCOME.household / 12 * 0.5) {
      const tentativeRent = Math.min(housingCost, baseHousing * 1.5)
      const affordableRent = monthlyIncome * 0.3
      benefits.housingVoucher = Math.max(0, Math.round(tentativeRent - affordableRent))
    }

    // Childcare subsidy - varies by state, up to 200% FPL typically
    if (hasChildcare && monthlyIncome < fpl * 2) {
      const subsidyRate = 1 - (monthlyIncome / (fpl * 2))
      benefits.childcareSubsidy = Math.round(childcareCost * subsidyRate * 0.5) // 50% avg subsidy
    }

    // Free/reduced school lunch
    if (numChildren > 0 && monthlyIncome < fpl * 1.85) {
      benefits.schoolLunch = Math.round(75 * numChildren)
    }

    return benefits
  }

  const benefits = calculateBenefits()
  const totalBenefits = Object.values(benefits).reduce((sum, val) => sum + val, 0)
  const effectiveIncome = monthlyAfterTax + totalBenefits
  const netDisposable = effectiveIncome - totalExpenses

  // Calculate policy impacts
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

  const policyImpacts = useMemo(() =>
    calculatePersonalizedPolicyImpacts(householdData),
    [income, numChildren, numAdults, hasStudentLoans, studentLoanBalance, studentLoanPayment, hasChildcare, childcareCost, housingCost, healthcareCost, state]
  )

  const scenarioImpact = useMemo(() =>
    calculateScenarioImpact(householdData, selectedScenario),
    [income, numChildren, numAdults, hasStudentLoans, studentLoanBalance, studentLoanPayment, hasChildcare, childcareCost, housingCost, healthcareCost, state, selectedScenario]
  )

  const applicablePolicies = useMemo(() =>
    getApplicablePolicies(householdData),
    [income, numChildren, numAdults, hasStudentLoans, studentLoanBalance, studentLoanPayment, hasChildcare, childcareCost, housingCost, healthcareCost, state]
  )

  const indirectBenefitPolicies = useMemo(() =>
    getIndirectBenefitPolicies(householdData),
    [income, numChildren, numAdults, hasStudentLoans, studentLoanBalance, studentLoanPayment, hasChildcare, childcareCost, housingCost, healthcareCost, state]
  )

  // Calculate disposable income with policy impacts
  const disposableWithPolicies = scenarioImpact ? netDisposable + scenarioImpact.totalMonthlyImpact : netDisposable

  // Expense breakdown chart
  const expenseData = {
    labels: ['Housing', 'Transportation', 'Food', 'Healthcare', 'Insurance', 'Entertainment', 'Other',
             ...(childcareCost > 0 ? ['Childcare'] : []),
             ...(studentLoanPayment > 0 ? ['Student Loans'] : [])],
    datasets: [{
      data: [housingCost, transportationCost, foodCost, healthcareCost, insuranceCost, entertainmentCost, otherCost,
             ...(childcareCost > 0 ? [childcareCost] : []),
             ...(studentLoanPayment > 0 ? [studentLoanPayment] : [])],
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#feca57', '#ff6b6b', '#ee5a6f']
    }]
  }

  // Income allocation chart
  const incomeData = {
    labels: ['Taxes', 'Expenses', 'Disposable Income'],
    datasets: [{
      data: [annualTaxes / 12, totalExpenses, Math.max(0, disposableIncome)],
      backgroundColor: ['#ef4444', '#f59e0b', '#22c55e']
    }]
  }

  return (
    <div>
      <div className="widget">
        <h2>Interactive Household Budget Calculator</h2>
        <p className="widget-description">
          Input your household details to see a personalized budget analysis with expense breakdowns,
          government benefits eligibility, and financial recommendations.
        </p>

        {/* Input Section */}
        <div style={{
          background: '#f9fafb',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{marginTop: 0, marginBottom: '1.5rem', color: '#1e40af'}}>Your Household Information</h3>

          {/* State Selection */}
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151'}}>
              State/Territory
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                background: 'white'
              }}
            >
              {Object.keys(stateData).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div style={{fontSize: '0.85rem', color: '#666', marginTop: '0.25rem'}}>
              Cost of living adjustment: {state === 'National Average' ? 'Baseline' : `${((stateInfo.overall - 1) * 100).toFixed(0)}% ${stateInfo.overall > 1 ? 'higher' : 'lower'} than national average`}
            </div>
          </div>

          {/* Income */}
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151'}}>
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

          {/* Household Composition */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151'}}>
                Adults
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={numAdults}
                onChange={(e) => {
                  const adults = parseInt(e.target.value)
                  setNumAdults(adults)
                  setHouseholdSize(adults + numChildren)
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151'}}>
                Children
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={numChildren}
                onChange={(e) => {
                  const children = parseInt(e.target.value)
                  setNumChildren(children)
                  setHouseholdSize(numAdults + children)
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151'}}>
                Total Household Size
              </label>
              <div style={{
                padding: '0.75rem',
                background: '#e0e7ff',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#1e40af',
                textAlign: 'center'
              }}>
                {householdSize} {householdSize === 1 ? 'person' : 'people'}
              </div>
            </div>
          </div>

          {/* Housing Type */}
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151'}}>
              Housing Type
            </label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                background: 'white'
              }}
            >
              <option value="rent">Renting</option>
              <option value="own">Own with mortgage</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'flex', alignItems: 'center', marginBottom: '0.75rem', cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={hasChildcare}
                onChange={(e) => setHasChildcare(e.target.checked)}
                style={{marginRight: '0.5rem', width: '18px', height: '18px'}}
              />
              <span style={{fontWeight: 'bold', color: '#374151'}}>
                Need childcare for young children
              </span>
            </label>

            <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={hasStudentLoans}
                onChange={(e) => setHasStudentLoans(e.target.checked)}
                style={{marginRight: '0.5rem', width: '18px', height: '18px'}}
              />
              <span style={{fontWeight: 'bold', color: '#374151'}}>
                Have student loan debt
              </span>
            </label>

            {hasStudentLoans && (
              <div style={{marginTop: '0.75rem', marginLeft: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem', color: '#666'}}>
                  Student Loan Balance: ${studentLoanBalance.toLocaleString()}
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

        {/* Results Section */}
        <div style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1rem', color: '#1e40af'}}>Your Budget Analysis</h3>

          {/* Summary Cards */}
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Gross Annual Income</div>
              <div className="metric-value">${income.toLocaleString()}</div>
              <div className="metric-change">{incomePercentile}th percentile</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">After-Tax Income</div>
              <div className="metric-value">${monthlyAfterTax.toLocaleString()}/mo</div>
              <div className="metric-change">{(effectiveTaxRate * 100).toFixed(1)}% tax rate</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Monthly Expenses</div>
              <div className="metric-value">${totalExpenses.toLocaleString()}</div>
              <div className="metric-change">{((totalExpenses / monthlyAfterTax) * 100).toFixed(0)}% of income</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Disposable Income</div>
              <div className="metric-value" style={{color: disposableIncome > 0 ? '#22c55e' : '#ef4444'}}>
                ${disposableIncome.toLocaleString()}/mo
              </div>
              <div className={`metric-change ${disposableIncome > 0 ? 'positive' : 'negative'}`}>
                {disposablePercent}% remaining
              </div>
            </div>
          </div>

          {/* Government Benefits */}
          {totalBenefits > 0 && (
            <div style={{marginTop: '2rem'}}>
              <h4 style={{marginBottom: '1rem', color: '#1e40af'}}>Estimated Government Benefits Eligibility</h4>
              <div className="metric-grid">
                {benefits.snap > 0 && (
                  <div className="metric-card" style={{background: '#f0fdf4', border: '1px solid #86efac'}}>
                    <div className="metric-label">SNAP (Food Assistance)</div>
                    <div className="metric-value" style={{color: '#166534'}}>~${benefits.snap}/mo</div>
                    <div className="metric-change">Estimated benefit</div>
                  </div>
                )}

                {benefits.eitc > 0 && (
                  <div className="metric-card" style={{background: '#f0fdf4', border: '1px solid #86efac'}}>
                    <div className="metric-label">EITC (Tax Credit)</div>
                    <div className="metric-value" style={{color: '#166534'}}>~${benefits.eitc}/mo</div>
                    <div className="metric-change">Annual refund divided by 12</div>
                  </div>
                )}

                {benefits.ctc > 0 && (
                  <div className="metric-card" style={{background: '#f0fdf4', border: '1px solid #86efac'}}>
                    <div className="metric-label">Child Tax Credit</div>
                    <div className="metric-value" style={{color: '#166534'}}>~${benefits.ctc}/mo</div>
                    <div className="metric-change">{numChildren} {numChildren === 1 ? 'child' : 'children'}</div>
                  </div>
                )}

                {benefits.medicaid > 0 && (
                  <div className="metric-card" style={{background: '#f0fdf4', border: '1px solid #86efac'}}>
                    <div className="metric-label">Medicaid</div>
                    <div className="metric-value" style={{color: '#166534'}}>~${benefits.medicaid}/mo</div>
                    <div className="metric-change">Healthcare coverage value</div>
                  </div>
                )}

                {benefits.housingVoucher > 0 && (
                  <div className="metric-card" style={{background: '#f0fdf4', border: '1px solid #86efac'}}>
                    <div className="metric-label">Housing Voucher</div>
                    <div className="metric-value" style={{color: '#166534'}}>~${benefits.housingVoucher}/mo</div>
                    <div className="metric-change">If available (long waitlist)</div>
                  </div>
                )}

                {benefits.childcareSubsidy > 0 && (
                  <div className="metric-card" style={{background: '#f0fdf4', border: '1px solid #86efac'}}>
                    <div className="metric-label">Childcare Subsidy</div>
                    <div className="metric-value" style={{color: '#166534'}}>~${benefits.childcareSubsidy}/mo</div>
                    <div className="metric-change">If available in your state</div>
                  </div>
                )}

                {benefits.schoolLunch > 0 && (
                  <div className="metric-card" style={{background: '#f0fdf4', border: '1px solid #86efac'}}>
                    <div className="metric-label">Free/Reduced School Lunch</div>
                    <div className="metric-value" style={{color: '#166534'}}>~${benefits.schoolLunch}/mo</div>
                    <div className="metric-change">Value of meals</div>
                  </div>
                )}

                <div className="metric-card" style={{background: '#1e3a8a', color: 'white'}}>
                  <div className="metric-label" style={{color: 'white'}}>Total Estimated Benefits</div>
                  <div className="metric-value" style={{color: '#fbbf24', fontSize: '1.5rem'}}>
                    ${totalBenefits}/mo
                  </div>
                  <div className="metric-change" style={{color: '#fde68a'}}>
                    +{((totalBenefits / monthlyAfterTax) * 100).toFixed(0)}% income boost
                  </div>
                </div>
              </div>

              <div style={{marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderLeft: '4px solid #fbbf24', borderRadius: '4px'}}>
                <strong>Note:</strong> These are estimates. Actual benefits depend on many factors including assets, state programs, and availability.
                Many programs have waiting lists or limited funding. Visit benefits.gov to check actual eligibility.
              </div>
            </div>
          )}

          {/* Charts */}
          <div style={{marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem'}}>
            <div className="chart-container">
              <h4 style={{marginBottom: '1rem'}}>Monthly Expense Breakdown</h4>
              <Doughnut
                data={expenseData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || ''
                          const value = context.parsed || 0
                          const percent = ((value / totalExpenses) * 100).toFixed(1)
                          return `${label}: $${value.toLocaleString()} (${percent}%)`
                        }
                      }
                    }
                  }
                }}
              />
            </div>

            <div className="chart-container">
              <h4 style={{marginBottom: '1rem'}}>Monthly Income Allocation</h4>
              <Doughnut
                data={incomeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || ''
                          const value = context.parsed || 0
                          return `${label}: $${value.toLocaleString()}/mo`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Recommendations */}
          <div style={{marginTop: '2rem'}}>
            <h4 style={{marginBottom: '1rem', color: '#1e40af'}}>Financial Insights & Recommendations</h4>

            {disposableIncome < 0 && (
              <div style={{padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px', marginBottom: '1rem'}}>
                <strong style={{color: '#dc2626'}}>⚠️ Budget Deficit Warning</strong>
                <p style={{margin: '0.5rem 0 0 0'}}>
                  Your expenses exceed your income by ${Math.abs(disposableIncome).toLocaleString()}/month.
                  Consider reducing expenses or exploring government assistance programs above.
                </p>
              </div>
            )}

            {housingCost / monthlyAfterTax > 0.30 && (
              <div style={{padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px', marginBottom: '1rem'}}>
                <strong style={{color: '#dc2626'}}>🏠 Housing Cost Burden</strong>
                <p style={{margin: '0.5rem 0 0 0'}}>
                  Your housing costs are {((housingCost / monthlyAfterTax) * 100).toFixed(0)}% of income (above the recommended 30% threshold).
                  You may qualify for housing assistance or should consider more affordable housing options.
                </p>
              </div>
            )}

            {disposableIncome > 0 && disposableIncome < monthlyAfterTax * 0.10 && (
              <div style={{padding: '1rem', background: '#fef3c7', borderLeft: '4px solid #fbbf24', borderRadius: '4px', marginBottom: '1rem'}}>
                <strong style={{color: '#92400e'}}>💰 Limited Savings Capacity</strong>
                <p style={{margin: '0.5rem 0 0 0'}}>
                  You have only {disposablePercent}% disposable income. Consider reviewing expenses or exploring the government benefits above to increase your savings buffer.
                </p>
              </div>
            )}

            {disposableIncome >= monthlyAfterTax * 0.10 && disposableIncome < monthlyAfterTax * 0.20 && (
              <div style={{padding: '1rem', background: '#dbeafe', borderLeft: '4px solid #3b82f6', borderRadius: '4px', marginBottom: '1rem'}}>
                <strong style={{color: '#1e40af'}}>✅ Moderate Financial Health</strong>
                <p style={{margin: '0.5rem 0 0 0'}}>
                  You have {disposablePercent}% disposable income - enough to start building an emergency fund.
                  Target 3-6 months of expenses (${(totalExpenses * 3).toLocaleString()} - ${(totalExpenses * 6).toLocaleString()}).
                </p>
              </div>
            )}

            {disposableIncome >= monthlyAfterTax * 0.20 && (
              <div style={{padding: '1rem', background: '#f0fdf4', borderLeft: '4px solid #22c55e', borderRadius: '4px', marginBottom: '1rem'}}>
                <strong style={{color: '#166534'}}>🎉 Strong Financial Position</strong>
                <p style={{margin: '0.5rem 0 0 0'}}>
                  You have {disposablePercent}% disposable income - excellent! You can build emergency savings, invest for retirement,
                  and work toward other financial goals. Consider maxing out retirement contributions (401k, IRA).
                </p>
              </div>
            )}
          </div>

          {/* Policy Impact Analysis */}
          <div style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e5e7eb'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, color: '#1e40af'}}>💡 How Would Progressive Policies Help You?</h3>
              <button
                onClick={() => setShowPolicyComparison(!showPolicyComparison)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: showPolicyComparison ? '#3b82f6' : '#e0e7ff',
                  color: showPolicyComparison ? 'white' : '#1e40af',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                {showPolicyComparison ? '▼ Hide Analysis' : '▶ Show Analysis'}
              </button>
            </div>

            {showPolicyComparison && (
              <>
                <p style={{color: '#666', marginBottom: '2rem', fontSize: '0.95rem'}}>
                  See how progressive policy proposals would personally impact your household budget.
                  Analysis based on your specific income, household size, expenses, and state.
                  Data from Economic Policy Institute, Center on Budget and Policy Priorities, Center for American Progress, and others.
                </p>

                {/* Scenario Selector */}
                <div style={{marginBottom: '2rem'}}>
                  <h4 style={{marginBottom: '1rem', color: '#374151'}}>Choose a Policy Scenario</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    {['comprehensive', 'healthcare', 'workerSupport', 'housingFocus', 'familySupport'].map(scenarioId => {
                      const scenario = calculateScenarioImpact(householdData, scenarioId)
                      return (
                        <button
                          key={scenarioId}
                          onClick={() => setSelectedScenario(scenarioId)}
                          style={{
                            padding: '1rem',
                            border: selectedScenario === scenarioId ? '2px solid #3b82f6' : '1px solid #d1d5db',
                            borderRadius: '8px',
                            background: selectedScenario === scenarioId ? '#eff6ff' : 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.25rem'}}>
                            {scenario.name}
                          </div>
                          <div style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>
                            {scenario.description}
                          </div>
                          <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: scenario.totalMonthlyImpact > 0 ? '#22c55e' : '#666'}}>
                            {scenario.totalMonthlyImpact > 0 ? '+' : ''}${Math.round(scenario.totalMonthlyImpact)}/mo
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Before/After Comparison */}
                {scenarioImpact && (
                  <>
                    <div style={{marginBottom: '2rem'}}>
                      <h4 style={{marginBottom: '1rem', color: '#374151'}}>Your Budget: Current vs. With {scenarioImpact.name}</h4>
                      <div className="metric-grid">
                        <div className="metric-card">
                          <div className="metric-label">Current Disposable Income</div>
                          <div className="metric-value" style={{color: netDisposable > 0 ? '#666' : '#ef4444'}}>
                            ${netDisposable.toLocaleString()}/mo
                          </div>
                          <div className="metric-change">After taxes, expenses, benefits</div>
                        </div>

                        <div className="metric-card" style={{background: '#f0fdf4', border: '2px solid #22c55e'}}>
                          <div className="metric-label">With Policy Changes</div>
                          <div className="metric-value" style={{color: '#166534', fontSize: '1.75rem'}}>
                            ${Math.round(disposableWithPolicies).toLocaleString()}/mo
                          </div>
                          <div className="metric-change positive">
                            +${Math.round(scenarioImpact.totalMonthlyImpact)}/month increase
                          </div>
                        </div>

                        <div className="metric-card" style={{background: '#dbeafe'}}>
                          <div className="metric-label">Annual Impact</div>
                          <div className="metric-value" style={{color: '#1e40af'}}>
                            ${Math.round(scenarioImpact.totalMonthlyImpact * 12).toLocaleString()}/year
                          </div>
                          <div className="metric-change">Extra savings or spending power</div>
                        </div>

                        <div className="metric-card" style={{background: '#fef3c7'}}>
                          <div className="metric-label">Budget Impact</div>
                          <div className="metric-value" style={{color: '#92400e'}}>
                            {((scenarioImpact.totalMonthlyImpact / monthlyAfterTax) * 100).toFixed(1)}%
                          </div>
                          <div className="metric-change">Of your after-tax income</div>
                        </div>
                      </div>
                    </div>

                    {/* Policies That Apply to You */}
                    {scenarioImpact.applicablePolicies && scenarioImpact.applicablePolicies.length > 0 && (
                      <div style={{marginBottom: '2rem'}}>
                        <h4 style={{marginBottom: '1rem', color: '#166534'}}>
                          ✅ Policies That Would Directly Benefit You ({scenarioImpact.applicablePolicies.length})
                        </h4>
                        <div style={{display: 'grid', gap: '1rem'}}>
                          {scenarioImpact.applicablePolicies.map(policy => (
                            <div key={policy.id} style={{
                              padding: '1.25rem',
                              background: '#f0fdf4',
                              border: '1px solid #86efac',
                              borderRadius: '8px'
                            }}>
                              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <h5 style={{margin: 0, color: '#166534', fontSize: '1.05rem'}}>{policy.name}</h5>
                                <span style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#166534'}}>
                                  +${Math.round(policy.monthlyImpact)}/mo
                                </span>
                              </div>
                              <div style={{fontSize: '0.9rem', color: '#15803d', marginBottom: '0.5rem'}}>
                                <strong>Category:</strong> {policy.category}
                              </div>
                              <div style={{fontSize: '0.9rem', color: '#166534'}}>
                                💡 {policy.details}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Policies That Don't Apply But Have Indirect Benefits */}
                    {scenarioImpact.nonApplicablePolicies && scenarioImpact.nonApplicablePolicies.length > 0 && (
                      <div style={{marginBottom: '2rem'}}>
                        <h4 style={{marginBottom: '1rem', color: '#666'}}>
                          ℹ️ Policies With Indirect Community Benefits ({scenarioImpact.nonApplicablePolicies.length})
                        </h4>
                        <div style={{display: 'grid', gap: '1rem'}}>
                          {scenarioImpact.nonApplicablePolicies.map(policy => (
                            <div key={policy.id} style={{
                              padding: '1.25rem',
                              background: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}>
                              <div style={{marginBottom: '0.5rem'}}>
                                <h5 style={{margin: 0, color: '#374151', fontSize: '1rem'}}>{policy.name}</h5>
                                <div style={{fontSize: '0.85rem', color: '#666', fontStyle: 'italic', marginTop: '0.25rem'}}>
                                  {policy.details}
                                </div>
                              </div>
                              <div style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
                                <strong style={{color: '#374151'}}>Who benefits:</strong> {policy.beneficiaries}
                              </div>
                              {policy.indirectBenefits && policy.indirectBenefits.length > 0 && (
                                <div style={{marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb'}}>
                                  <strong style={{color: '#059669', fontSize: '0.85rem'}}>🌟 How this helps everyone:</strong>
                                  <ul style={{margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: '#666', fontSize: '0.85rem'}}>
                                    {policy.indirectBenefits.map((benefit, idx) => (
                                      <li key={idx} style={{marginBottom: '0.25rem'}}>{benefit}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Market Effects */}
                    {scenarioImpact.additionalImpact > 0 && (
                      <div style={{padding: '1rem', background: '#fef3c7', borderLeft: '4px solid #fbbf24', borderRadius: '4px', marginBottom: '2rem'}}>
                        <strong style={{color: '#92400e'}}>📊 Additional Market Effects</strong>
                        <p style={{margin: '0.5rem 0 0 0', color: '#92400e'}}>
                          Beyond direct benefits, this scenario includes approximately +${scenarioImpact.additionalImpact}/mo
                          from market effects like reduced rent from increased housing supply.
                        </p>
                      </div>
                    )}

                    {/* Data Sources */}
                    <div style={{
                      marginTop: '2rem',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: '#666'
                    }}>
                      <strong style={{color: '#374151'}}>Sources:</strong> {scenarioImpact.organizations.join(', ')}
                      <br/>
                      <em style={{fontSize: '0.8rem'}}>
                        Impact estimates are personalized to your household situation. Actual impacts may vary based on
                        implementation details, phase-in schedules, and other factors.
                      </em>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveBudgetCalculator
