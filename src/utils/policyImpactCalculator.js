/**
 * Policy Impact Calculator
 *
 * Calculates personalized policy impacts based on household characteristics
 * Used by InteractiveBudgetCalculator to show how policies affect specific households
 */

/**
 * Calculate personalized impact of individual policies
 * @param {Object} household - User's household data
 * @param {number} household.income - Annual income
 * @param {number} household.monthlyAfterTax - Monthly after-tax income
 * @param {number} household.numChildren - Number of children
 * @param {number} household.numAdults - Number of adults
 * @param {boolean} household.hasStudentLoans - Has student debt
 * @param {number} household.studentLoanBalance - Student loan balance
 * @param {number} household.studentLoanPayment - Monthly student loan payment
 * @param {boolean} household.hasChildcare - Needs childcare
 * @param {number} household.childcareCost - Monthly childcare cost
 * @param {number} household.housingCost - Monthly housing cost
 * @param {number} household.healthcareCost - Monthly healthcare cost
 * @param {number} household.transportationCost - Monthly transportation cost
 * @param {string} household.state - State of residence
 * @param {Object} household.stateInfo - State cost multipliers and income data
 * @returns {Object} Personalized policy impacts
 */
export function calculatePersonalizedPolicyImpacts(household) {
  const monthlyIncome = household.income / 12
  const fpl = 1215 + ((household.numAdults + household.numChildren) - 1) * 425 // Federal Poverty Level

  const impacts = {}

  // Medicare for All
  const currentHealthcareCost = household.healthcareCost
  const m4aTax = household.income * 0.04 / 12 // 4% payroll tax
  impacts.medicare4all = {
    id: 'medicare4all',
    name: 'Medicare for All',
    category: 'Healthcare',
    monthlyImpact: currentHealthcareCost - m4aTax,
    applies: true,
    details: `Eliminates $${currentHealthcareCost}/mo healthcare costs, adds $${Math.round(m4aTax)}/mo payroll tax`,
    beneficiaries: 'All households'
  }

  // $15 Minimum Wage
  const isMinWageWorker = household.income < 31200 // Full-time at $15/hr
  const minWageImpact = isMinWageWorker ? ((15.00 * 2080) - household.income) / 12 : 0
  impacts.minimum15 = {
    id: 'minimum15',
    name: '$15 Minimum Wage',
    category: 'Wages',
    monthlyImpact: minWageImpact,
    applies: isMinWageWorker,
    details: isMinWageWorker
      ? `Raises income from $${Math.round(household.income/12)}/mo to $${Math.round(15 * 2080 / 12)}/mo`
      : 'Your income is already above $15/hr minimum wage',
    beneficiaries: isMinWageWorker ? 'You!' : '27 million workers earning less than $15/hr',
    indirectBenefits: !isMinWageWorker ? ['Wage pressure increases bargaining power 2-5%', 'Consumer stimulus boosts local economy', 'Reduced safety net costs benefit taxpayers'] : null
  }

  // Expanded Child Tax Credit
  const ctcIncrease = household.numChildren > 0 && household.income < 200000 ? (3000 - 2000) * household.numChildren / 12 : 0
  impacts.childTaxCredit = {
    id: 'childTaxCredit',
    name: 'Expanded Child Tax Credit',
    category: 'Family Support',
    monthlyImpact: ctcIncrease,
    applies: household.numChildren > 0 && household.income < 200000,
    details: household.numChildren > 0
      ? `$1,000/year increase per child ($${Math.round(ctcIncrease)}/mo for ${household.numChildren} ${household.numChildren === 1 ? 'child' : 'children'})`
      : 'No children in household',
    beneficiaries: household.numChildren > 0 ? 'You!' : 'Families with children under 18'
  }

  // Universal Housing Vouchers
  const housingVoucherEligible = monthlyIncome < (74580 * 0.50 / 12) // 50% of median
  const voucherAmount = housingVoucherEligible ? Math.max(0, household.housingCost - (monthlyIncome * 0.30)) : 0
  impacts.housingVoucher = {
    id: 'housingVoucher',
    name: 'Universal Housing Vouchers',
    category: 'Housing',
    monthlyImpact: voucherAmount,
    applies: housingVoucherEligible,
    details: housingVoucherEligible
      ? `Reduces rent from $${household.housingCost} to $${Math.round(monthlyIncome * 0.30)}/mo (30% of income)`
      : `Not eligible (income above 50% median threshold of $${Math.round(74580 * 0.50 / 12)}/mo)`,
    beneficiaries: housingVoucherEligible ? 'You!' : 'Households earning below 50% area median income',
    indirectBenefits: !housingVoucherEligible ? ['Reduced homelessness improves community safety', 'Stable housing stock benefits property values', 'Lower emergency costs save taxpayer money'] : null
  }

  // Expanded EITC
  const eitcEligible = household.income < 60000
  let eitcIncrease = 0
  if (eitcEligible) {
    if (household.numChildren === 0 && household.income < 17640) {
      eitcIncrease = Math.round((600 - (household.income / 17640 * 600)) / 12 * 0.5) // 50% increase
    } else if (household.numChildren === 1 && household.income < 46560) {
      eitcIncrease = Math.round((3995 - ((household.income - 20000) / 26560 * 3995)) / 12 * 0.3)
    } else if (household.numChildren >= 2 && household.income < 52918) {
      eitcIncrease = Math.round((6604 - ((household.income - 20000) / 32918 * 6604)) / 12 * 0.3)
    }
  }
  impacts.expandedEITC = {
    id: 'expandedEITC',
    name: 'Expanded EITC',
    category: 'Tax Credits',
    monthlyImpact: eitcIncrease,
    applies: eitcIncrease > 0,
    details: eitcIncrease > 0
      ? `Expanded EITC increases credit by ~30-50%`
      : 'Income above EITC threshold or minimal benefit at your income level',
    beneficiaries: eitcIncrease > 0 ? 'You!' : 'Low-to-moderate income workers (phases out around $60k)',
    indirectBenefits: eitcIncrease === 0 ? ['Encourages employment, reducing welfare dependency', 'Recipients spend 100% of refund, creating jobs', 'Most effective anti-poverty program'] : null
  }

  // Universal Pre-K & Childcare
  const childcareImpact = household.hasChildcare && household.numChildren > 0 ? household.childcareCost : 0
  impacts.freeChildcare = {
    id: 'freeChildcare',
    name: 'Universal Pre-K & Childcare',
    category: 'Childcare',
    monthlyImpact: childcareImpact,
    applies: household.hasChildcare && household.numChildren > 0,
    details: household.hasChildcare && household.numChildren > 0
      ? `Eliminates $${household.childcareCost}/mo childcare costs`
      : household.numChildren > 0 ? 'No young children in paid childcare' : 'No children in household',
    beneficiaries: household.hasChildcare ? 'You!' : 'Families with children 0-5 in childcare',
    indirectBenefits: !household.hasChildcare ? ['Enables parents to work full-time', 'Quality pre-K improves child outcomes', 'Reduces gender wage gap'] : null
  }

  // Student Debt Cancellation
  const debtCancellation = household.hasStudentLoans ? household.studentLoanPayment : 0
  impacts.studentDebt = {
    id: 'studentDebt',
    name: 'Student Debt Cancellation',
    category: 'Education',
    monthlyImpact: debtCancellation,
    applies: household.hasStudentLoans,
    details: household.hasStudentLoans
      ? `Cancels $${household.studentLoanBalance.toLocaleString()} debt, freeing $${household.studentLoanPayment}/mo`
      : 'No student loan debt',
    beneficiaries: household.hasStudentLoans ? 'You!' : '43 million borrowers (~1/3 of households)',
    indirectBenefits: !household.hasStudentLoans ? ['$17B/month freed for economy, creates jobs', 'Enables homeownership, stabilizes housing market', 'Debt-free graduates start businesses'] : null
  }

  // Fare-Free Public Transit
  // Estimate 10% use transit regularly nationally, 45% in urban areas
  const usesTransit = false // We don't have this data, so assume no direct benefit
  const transitImpact = 0 // Would be $120/mo if user indicated they use transit
  impacts.freeTransit = {
    id: 'freeTransit',
    name: 'Fare-Free Public Transit',
    category: 'Transportation',
    monthlyImpact: transitImpact,
    applies: usesTransit,
    details: 'Impact varies by transit usage (avg $120/mo for regular users)',
    beneficiaries: '10% of US households (45% in major cities)',
    indirectBenefits: ['Reduced congestion saves time and fuel', 'Lower emissions improve air quality', 'Better transit increases property values']
  }

  // Universal Basic Income
  impacts.universalBasicIncome = {
    id: 'universalBasicIncome',
    name: 'Universal Basic Income (UBI)',
    category: 'Income Support',
    monthlyImpact: 1000 * household.numAdults,
    applies: true,
    details: `$1,000/month per adult (${household.numAdults} ${household.numAdults === 1 ? 'adult' : 'adults'})`,
    beneficiaries: 'All adults'
  }

  // Expanded SNAP Benefits
  const snapEligible = monthlyIncome < fpl * 1.85 // 185% FPL
  const snapIncrease = snapEligible ? 137 : 0 // Average increase per participating household
  impacts.expandedSNAP = {
    id: 'expandedSNAP',
    name: 'Expanded SNAP Benefits',
    category: 'Food Security',
    monthlyImpact: snapIncrease,
    applies: snapEligible,
    details: snapEligible
      ? `Increases SNAP benefits to reach USDA Moderate Food Plan level`
      : `Not eligible (income above 185% FPL threshold of $${Math.round(fpl * 1.85)}/mo)`,
    beneficiaries: snapEligible ? 'You!' : '42 million SNAP participants (13% of population)',
    indirectBenefits: !snapEligible ? ['Better nutrition improves child health', 'Every $1 in SNAP generates $1.50-$1.80 economic activity', 'Supports agricultural sector'] : null
  }

  // State Renter's Tax Credit
  const isRenter = true // Assume renter (we could add this to household data)
  const rentersCredit = isRenter && monthlyIncome < (74580 / 12) ? 150 : 0
  impacts.rentersCredit = {
    id: 'rentersCredit',
    name: "State Renter's Tax Credits",
    category: 'State/Local',
    monthlyImpact: rentersCredit,
    applies: rentersCredit > 0,
    details: rentersCredit > 0
      ? `Refundable tax credit for renters (currently only 6 states offer)`
      : 'Either homeowner or income above threshold',
    beneficiaries: rentersCredit > 0 ? 'You!' : 'Renters earning under area median income',
    indirectBenefits: rentersCredit === 0 ? ['Reduces homeowner/renter wealth gap', 'Helps cover rent increases', 'More local spending'] : null
  }

  // Free College Tuition (state programs)
  const hasCollegeStudents = false // We don't have this data
  const collegeSavings = hasCollegeStudents ? 800 : 0
  impacts.freeCollegeTuition = {
    id: 'freeCollegeTuition',
    name: 'State Free College Programs',
    category: 'State/Local',
    monthlyImpact: collegeSavings,
    applies: hasCollegeStudents,
    details: hasCollegeStudents
      ? `Free tuition at public colleges`
      : 'No college students in household (~8% of households affected)',
    beneficiaries: hasCollegeStudents ? 'You!' : 'Families with students in public higher education',
    indirectBenefits: !hasCollegeStudents ? ['Higher graduation rates boost state economy', 'Graduates avoid $40k debt burden', 'Educated workers stay in-state'] : null
  }

  // Municipal Broadband
  impacts.municipalBroadband = {
    id: 'municipalBroadband',
    name: 'Municipal Broadband Programs',
    category: 'State/Local',
    monthlyImpact: 40,
    applies: true,
    details: `City-run fiber at $40-50/mo vs $80-100 from private ISPs`,
    beneficiaries: 'All households (currently restricted in 20 states)'
  }

  return impacts
}

/**
 * Calculate combined impact of policy scenarios
 * @param {Object} household - User's household data
 * @param {string} scenarioId - Scenario identifier
 * @returns {Object} Scenario impact details
 */
export function calculateScenarioImpact(household, scenarioId) {
  const impacts = calculatePersonalizedPolicyImpacts(household)

  const scenarios = {
    comprehensive: {
      name: 'Comprehensive Progressive Agenda',
      description: 'Medicare for All + Child Tax Credit + Student Debt Cancellation + Universal Pre-K + Free Transit',
      policies: ['medicare4all', 'childTaxCredit', 'studentDebt', 'freeChildcare', 'freeTransit'],
      organizations: ['EPI', 'CBPP', 'CAP', 'Roosevelt']
    },
    housingFocus: {
      name: 'Housing Justice Package',
      description: 'Universal vouchers + public housing investment + rent stabilization',
      policies: ['housingVoucher', 'rentersCredit'],
      organizations: ['CBPP', 'CAP', 'Demos'],
      additionalImpact: 150 // Market rent reduction from increased supply
    },
    workerSupport: {
      name: 'Economic Security Platform',
      description: 'Living wage ($18/hr) + expanded EITC + child allowance + improved ACA',
      policies: ['minimum15', 'expandedEITC', 'childTaxCredit'],
      organizations: ['EPI', 'CBPP', 'CAP']
    },
    healthcare: {
      name: 'Universal Healthcare',
      description: 'Medicare for All - eliminate premiums, deductibles, copays',
      policies: ['medicare4all'],
      organizations: ['CAP', 'EPI']
    },
    familySupport: {
      name: 'Family Support Package',
      description: 'Expanded CTC + Universal childcare + Free college + Expanded SNAP',
      policies: ['childTaxCredit', 'freeChildcare', 'freeCollegeTuition', 'expandedSNAP'],
      organizations: ['CBPP', 'CLASP', 'CAP']
    }
  }

  const scenario = scenarios[scenarioId]
  if (!scenario) return null

  let totalImpact = 0
  const applicablePolicies = []
  const nonApplicablePolicies = []

  scenario.policies.forEach(policyId => {
    const policy = impacts[policyId]
    if (policy) {
      totalImpact += policy.monthlyImpact
      if (policy.applies && policy.monthlyImpact > 0) {
        applicablePolicies.push(policy)
      } else {
        nonApplicablePolicies.push(policy)
      }
    }
  })

  // Add any additional impact (like market effects)
  if (scenario.additionalImpact) {
    totalImpact += scenario.additionalImpact
  }

  return {
    ...scenario,
    totalMonthlyImpact: totalImpact,
    applicablePolicies,
    nonApplicablePolicies,
    additionalImpact: scenario.additionalImpact || 0
  }
}

/**
 * Get all policies that apply to a household
 * @param {Object} household - User's household data
 * @returns {Array} Array of applicable policies sorted by impact
 */
export function getApplicablePolicies(household) {
  const impacts = calculatePersonalizedPolicyImpacts(household)

  return Object.values(impacts)
    .filter(policy => policy.applies && policy.monthlyImpact > 0)
    .sort((a, b) => b.monthlyImpact - a.monthlyImpact)
}

/**
 * Get all policies that don't apply but have indirect benefits
 * @param {Object} household - User's household data
 * @returns {Array} Array of non-applicable policies with indirect benefits
 */
export function getIndirectBenefitPolicies(household) {
  const impacts = calculatePersonalizedPolicyImpacts(household)

  return Object.values(impacts)
    .filter(policy => (!policy.applies || policy.monthlyImpact === 0) && policy.indirectBenefits)
}
