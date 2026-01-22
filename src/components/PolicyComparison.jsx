import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  minimumWageProposals,
  taxProposals,
  housingProposals,
  healthcareProposals,
  childcareProposals,
  educationProposals,
  transportationProposals,
  getPolicyResources
} from '../services/policyProposals';
import {
  CURRENT_BASELINE,
  MEDIAN_INCOME,
  MEDIAN_HOUSEHOLD_EXPENSES,
  MEDIAN_INDIVIDUAL_EXPENSES
} from '../utils/baselineData';

/**
 * Policy Comparison Widget
 * Compare current outcomes vs. progressive policy proposals
 *
 * Data sources: EPI, CBPP, CAP, Roosevelt Institute, Demos, CLASP, Brookings, Pew
 */
function PolicyComparison({ data, metrics }) {
  const [selectedScenario, setSelectedScenario] = useState('comprehensive');
  const [viewMode, setViewMode] = useState('scenarios'); // 'scenarios' or 'individual'

  // Use live Census data if available, otherwise use baseline constants
  const medianIncome = data?.income?.medianHouseholdIncome || MEDIAN_INCOME.household;
  const individualIncome = MEDIAN_INCOME.individual;

  // Current situation (baseline) - using shared constants from baselineData.js
  // This ensures consistency with BudgetOverview and prevents drift
  const household = CURRENT_BASELINE.household;
  const individual = CURRENT_BASELINE.individual;

  const current = {
    householdMonthlyAfterTax: household.monthlyAfterTax,
    individualMonthlyAfterTax: individual.monthlyAfterTax,
    householdExpenses: household.totalExpenses,
    individualExpenses: individual.totalExpenses,
    householdDisposable: household.disposableIncome,
    individualDisposable: individual.disposableIncome,
    housingCost: MEDIAN_HOUSEHOLD_EXPENSES.housing,
    healthcareCost: MEDIAN_HOUSEHOLD_EXPENSES.healthcare,
    transportationCost: MEDIAN_HOUSEHOLD_EXPENSES.transportation
  };

  // Calculate impacts for different policy scenarios
  const scenarios = {
    comprehensive: {
      name: 'Comprehensive Progressive Agenda',
      description: 'Medicare for All, Child Tax Credit, Student Debt Cancellation, Universal Pre-K, Free Transit (if applicable)',
      organizations: ['EPI', 'CBPP', 'CAP', 'Roosevelt'],
      impacts: {
        // Healthcare savings (eliminate premiums/costs, add 4% tax)
        healthcareSavings: 380 - (medianIncome * 0.04 / 12), // $380 - $248 = $132/month

        // Child tax credit (assume 1 child scenario)
        childTaxCredit: 1000 / 12, // $83/month increase (from $2k to $3k)

        // Student debt cancellation (33% of households affected)
        studentDebtRelief: 280 * 0.33, // $92/month average across all households

        // Universal childcare (12% of households with young children)
        childcareSavings: 950 * 0.12, // $114/month average across all households

        // Free transit (10% use regularly)
        transitSavings: 120 * 0.10, // $12/month average across all households

        // Total for median household
        medianHouseholdBenefit: (380 - (medianIncome * 0.04 / 12)) + (1000 / 12) + (280 * 0.33) + (950 * 0.12) + (120 * 0.10),

        // Total for individual
        individualBenefit: (300 - (individualIncome * 0.04 / 12)) + (280 * 0.33) + (120 * 0.10) // Healthcare + student debt + transit
      }
    },

    housingFocus: {
      name: 'Housing Justice Package',
      description: 'Universal vouchers, public housing investment, rent stabilization',
      organizations: ['CBPP', 'CAP', 'Demos'],
      impacts: {
        // Rent reduction from increased supply
        marketRentReduction: 150, // $150/month from increased supply

        // Rent stabilization (cap at 3% vs current 5-6%)
        rentStabilizationSavings: 1650 * 0.02 / 12, // ~$3/month (compounds over time)

        // Total
        medianHouseholdBenefit: 150,
        individualBenefit: 120 // Proportional reduction for individual
      }
    },

    workerSupport: {
      name: 'Economic Security Platform',
      description: 'Living wage ($18/hr), expanded EITC, child allowance, improved ACA',
      organizations: ['EPI', 'CBPP', 'CAP'],
      impacts: {
        // Living wage impact (for those at minimum wage)
        livingWageIncrease: ((18.00 * 2080) - (7.25 * 2080)) / 12, // +$1,864/month for min wage workers

        // Healthcare (ACA improvements - cap at 8.5%)
        healthcareSavings: Math.max(0, 380 - (medianIncome * 0.085 / 12)), // $380 - $528 = already under cap

        // Child allowance
        childAllowance: 3000 / 12,

        // EITC (minimal at median income)
        eitc: 0,

        medianHouseholdBenefit: 250, // Child allowance mainly
        individualBenefit: 0 // No children, above EITC threshold
      }
    },

    healthcare: {
      name: 'Universal Healthcare',
      description: 'Medicare for All - eliminate premiums, deductibles, copays',
      organizations: ['CAP', 'EPI', 'Multiple'],
      impacts: {
        // Current: $380/month out of pocket
        // New: 4% payroll tax
        medianHouseholdBenefit: 380 - (medianIncome * 0.04 / 12), // $380 - $248 = $132/month
        individualBenefit: 300 - (individualIncome * 0.04 / 12) // $300 - $147 = $153/month
      }
    }
  };

  const selected = scenarios[selectedScenario];

  // Individual policy options with detailed impact calculations
  const individualPolicies = [
    {
      id: 'medicare4all',
      name: 'Medicare for All',
      category: 'Healthcare',
      organization: 'CAP, EPI',
      description: 'Single-payer universal healthcare eliminating all premiums, deductibles, and copays',
      currentCost: { household: 380, individual: 300 },
      proposedTax: 0.04, // 4% payroll tax
      householdImpact: 380 - (medianIncome * 0.04 / 12),
      individualImpact: 300 - (individualIncome * 0.04 / 12),
      beneficiaries: 'All households',
      note: 'Savings increase for those with high medical costs or employer-sponsored insurance'
    },
    {
      id: 'minimum15',
      name: '$15 Minimum Wage',
      category: 'Wages',
      organization: 'EPI, NELP',
      description: 'Raise federal minimum wage from $7.25 to $15/hour',
      currentWage: 7.25,
      proposedWage: 15.00,
      householdImpact: 0, // Median household already above
      individualImpact: 0, // Median individual already above
      minWageWorkerImpact: ((15.00 * 2080) - (7.25 * 2080)) / 12,
      beneficiaries: '27 million workers currently at or below $15/hr',
      note: 'Impact shown for minimum wage workers (+$1,342/month). Median earners see indirect benefits through increased bargaining power.',
      nonBudgetaryBenefits: [
        'Wage pressure: Median earners gain 2-5% bargaining power as wage floor rises',
        'Consumer stimulus: Low-wage workers spend raises locally, boosting economy',
        'Reduced safety net costs: Fewer workers need SNAP, Medicaid, housing assistance'
      ]
    },
    {
      id: 'childTaxCredit',
      name: 'Expanded Child Tax Credit',
      category: 'Family Support',
      organization: 'CBPP, CAP',
      description: 'Permanent $3,000/year per child tax credit (fully refundable)',
      currentCredit: 2000,
      proposedCredit: 3000,
      householdImpact: (3000 - 2000) / 12, // Assumes 1 child
      individualImpact: 0, // No children
      beneficiaries: 'Families with children under 18',
      note: 'Assumes 1 child for household. Scales with number of children. Fully refundable means benefits reach families with no tax liability.'
    },
    {
      id: 'housingVoucher',
      name: 'Universal Housing Vouchers',
      category: 'Housing',
      organization: 'CBPP, CAP',
      description: 'Section 8 vouchers for all households below 50% area median income',
      eligibilityThreshold: 0.50, // 50% of median
      voucherAmount: Math.max(0, 1650 - (medianIncome * 0.50 * 0.30 / 12)), // 30% of income
      householdImpact: 0, // Median household not eligible (at 100% of median)
      individualImpact: 0, // Median individual not eligible
      lowIncomeImpact: 550, // Typical voucher value for eligible households
      beneficiaries: 'Households earning below $37,290 (50% median)',
      note: 'Median earners not eligible. Low-income households save ~$550/month on average.',
      nonBudgetaryBenefits: [
        'Reduced homelessness: Fewer unsheltered neighbors improves community safety',
        'Property values: Stable housing stock benefits homeowners and renters',
        'Lower emergency costs: Housed populations use less ER, police (taxpayer savings)'
      ]
    },
    {
      id: 'expandedEITC',
      name: 'Expanded EITC',
      category: 'Tax Credits',
      organization: 'CBPP, EPI',
      description: 'Expand Earned Income Tax Credit for childless workers and larger families',
      householdImpact: 0, // Phases out at median income
      individualImpact: 0, // Phases out for childless workers above ~$20k
      lowIncomeImpact: 150, // Average increase for beneficiaries
      beneficiaries: 'Low-to-moderate income workers (phases out around $60k for families)',
      note: 'Median earners receive minimal benefit. Primary impact for households earning $20-50k.',
      nonBudgetaryBenefits: [
        'Work incentives: Encourages employment over welfare, reducing long-term dependency',
        'Economic stimulus: Recipients spend nearly 100% of refund, creating jobs',
        'Poverty reduction: Most effective anti-poverty program (taxpayer savings long-term)'
      ]
    },
    {
      id: 'freeChildcare',
      name: 'Universal Pre-K & Childcare',
      category: 'Childcare',
      organization: 'CLASP, CAP',
      description: 'Free universal pre-K and subsidized childcare for families earning under 150% median',
      currentCost: 800, // Typical childcare cost for families using it
      proposedCost: 0, // Free for median household
      householdImpact: 0, // Base impact (only ~12% have young children in care)
      individualImpact: 0, // No children
      conditionalImpact: {
        condition: 'families with children 0-5 in childcare',
        percentage: 12,
        impact: 600
      },
      beneficiaries: 'Families with children 0-5 years old, earning under ~$110k',
      note: 'Only ~12% of median households have young children in paid childcare. For those families: +$600/month savings.',
      nonBudgetaryBenefits: [
        'Labor force participation: Enables parents (esp. mothers) to work full-time',
        'Child outcomes: Quality pre-K improves test scores, reduces special ed costs',
        'Gender equity: Reduces gender wage gap, competitive labor market benefits all'
      ]
    },
    {
      id: 'studentDebt',
      name: 'Student Debt Cancellation',
      category: 'Education',
      organization: 'Roosevelt Institute, Demos',
      description: '$50,000 student debt cancellation per borrower',
      medianDebt: 37000,
      cancellationAmount: 50000,
      medianPayment: 400, // Median monthly payment
      householdImpact: 0, // Base impact (only ~33% have student debt)
      individualImpact: 0, // Base impact (only ~33% have student debt)
      conditionalImpact: {
        condition: 'households with student loan borrowers',
        percentage: 33,
        householdImpact: 200,
        individualImpact: 400
      },
      beneficiaries: '43 million borrowers (~1/3 of households)',
      note: 'Only ~33% of median households have student debt. For borrowers: +$200-400/month in freed cash flow.',
      nonBudgetaryBenefits: [
        'Consumer spending: $17B/month freed for economy, creates jobs for all workers',
        'Homeownership: Borrowers can save for down payments, stabilizes housing market',
        'Entrepreneurship: Debt-free graduates start businesses, drive innovation'
      ]
    },
    {
      id: 'freeTransit',
      name: 'Fare-Free Public Transit',
      category: 'Transportation',
      organization: 'Brookings, Transit Center',
      description: 'Eliminate fares for all public transit',
      currentCost: 120, // Monthly transit pass
      proposedCost: 0,
      householdImpact: 0, // Base impact (only ~10% nationally, 45% urban use transit regularly)
      individualImpact: 0, // Base impact (only ~10% nationally, 45% urban use transit regularly)
      conditionalImpact: {
        condition: 'regular public transit users',
        percentage: 10, // Nationally (~45% in major urban areas)
        impact: 120
      },
      beneficiaries: 'Public transit users (~10% nationally, 45% of major urban households)',
      note: 'Only ~10% of US households use transit regularly (45% in major cities). For transit users: +$120/month savings.',
      nonBudgetaryBenefits: [
        'Reduced congestion: Mode shift from driving saves time, fuel for all drivers',
        'Environmental: Lower emissions improve air quality, climate benefits for all',
        'Urban development: Better transit access increases property values, amenities'
      ]
    },
    {
      id: 'universalBasicIncome',
      name: 'Universal Basic Income (UBI)',
      category: 'Income Support',
      organization: 'Roosevelt Institute, Economic Security Project',
      description: '$1,000/month unconditional cash transfer to all adults',
      monthlyBenefit: 1000,
      householdImpact: 2000, // 2 adults
      individualImpact: 1000,
      beneficiaries: 'All adults',
      note: 'Assumes 2 adults per household. Funded via wealth tax, carbon tax, or VAT.',
      nonBudgetaryBenefits: [
        'Eliminates poverty instantly: Sets income floor, removes means-testing stigma',
        'Entrepreneurship: Risk-free to start businesses, pursue education',
        'Care work: Values unpaid caregiving, eldercare, community service'
      ]
    },
    {
      id: 'expandedSNAP',
      name: 'Expanded SNAP Benefits',
      category: 'Food Security',
      organization: 'CBPP, Feeding America',
      description: 'Increase SNAP benefits to cover USDA Moderate Food Plan ($1,540/mo for family of 4)',
      currentBenefit: 343, // Average monthly household benefit
      proposedBenefit: 480, // To reach moderate plan level
      householdImpact: 0, // Median household not eligible
      individualImpact: 0,
      lowIncomeImpact: 137, // Increase per participating household
      beneficiaries: '42 million SNAP participants (13% of population)',
      note: 'Median earners not eligible. Low-income households receive +$137/month on average.',
      nonBudgetaryBenefits: [
        'Child nutrition: Better food access improves health, test scores, reduces medical costs',
        'Economic multiplier: Every $1 in SNAP generates $1.50-$1.80 in economic activity',
        'Farmer support: Increased food purchases support agricultural sector'
      ]
    },
    {
      id: 'stateEITC',
      name: 'State EITC Expansion',
      category: 'State/Local',
      organization: 'State Policy Network',
      description: 'Expand state-level Earned Income Tax Credits to match 50% of federal EITC (currently 29 states have state EITCs)',
      currentStates: 29,
      proposedStates: 50,
      householdImpact: 0, // Median household phases out
      individualImpact: 0,
      lowIncomeImpact: 150, // Average additional state EITC
      beneficiaries: 'Low-to-moderate income workers in all states',
      note: 'Median earners not eligible. Would provide $150-500/year additional support to working families.',
      nonBudgetaryBenefits: [
        'State revenue: Working families spend locally, supporting state businesses and sales tax',
        'Federal leverage: State EITCs leverage federal spending, maximizing anti-poverty impact',
        'Work incentives: State EITCs strengthen employment rewards without federal action'
      ]
    },
    {
      id: 'stateChildTaxCredit',
      name: 'State Child Tax Credits',
      category: 'State/Local',
      organization: 'State Tax Policy',
      description: 'State child tax credits ranging from $200-$1,000 per child (12 states + DC currently offer)',
      currentStates: 13,
      proposedStates: 50,
      householdImpact: 500 / 12, // Average $500/year = $42/month for families with children
      individualImpact: 0,
      beneficiaries: 'Families with children in participating states',
      note: 'Currently only 13 jurisdictions offer. Averages $500/year per child ($42/month).',
      nonBudgetaryBenefits: [
        'Child poverty: Direct reduction in child poverty and material hardship',
        'State competitiveness: Attracts and retains young families, workforce development',
        'Local economy: Parents spend on child needs locally (clothing, activities, healthcare)'
      ]
    },
    {
      id: 'propertyTaxRelief',
      name: 'Expanded Property Tax Relief',
      category: 'State/Local',
      organization: 'Local Government',
      description: 'Expand homestead exemptions, circuit breakers, and property tax freezes for seniors and low-income homeowners',
      currentRelief: 'Varies by locality',
      householdImpact: 100, // Average relief for qualifying households
      individualImpact: 50,
      beneficiaries: 'Homeowners, especially seniors and low-income households',
      note: 'Highly variable by locality. Average relief $1,200/year for participating households.',
      nonBudgetaryBenefits: [
        'Prevents displacement: Keeps long-term residents in gentrifying neighborhoods',
        'Senior aging in place: Reduces need for institutional care (Medicaid savings)',
        'Neighborhood stability: Stable ownership improves schools, safety, civic engagement'
      ]
    },
    {
      id: 'freeCollegeTuition',
      name: 'State Free College Programs',
      category: 'State/Local',
      organization: 'State Higher Ed',
      description: 'Free tuition at public colleges for families earning under $125k (NY model) or universal free community college',
      householdImpact: 0, // Only affects households with college students
      individualImpact: 0,
      conditionalImpact: {
        condition: 'households with college students',
        percentage: 8,
        impact: 800 // Average monthly tuition savings
      },
      beneficiaries: 'Families with students in public higher education',
      note: 'Only ~8% of households have college students. For those families: +$800/month savings (free tuition).',
      nonBudgetaryBenefits: [
        'Workforce development: Higher graduation rates increase state productivity and tax base',
        'Reduced student debt: Graduates start careers without $40k debt burden',
        'Brain retention: Educated workers stay in-state, supporting local economy'
      ]
    },
    {
      id: 'localTransitSubsidy',
      name: 'Local Transit Fare Subsidies',
      category: 'State/Local',
      organization: 'Local Transit Agencies',
      description: 'Free or reduced transit fares for seniors, students, low-income residents (many cities already implement)',
      currentCoverage: '40% of major cities',
      proposedCoverage: '100% of cities with transit',
      householdImpact: 0, // Only benefits transit users
      individualImpact: 0,
      conditionalImpact: {
        condition: 'qualifying transit users (seniors, students, low-income)',
        percentage: 15,
        impact: 100
      },
      beneficiaries: 'Seniors, students, low-income transit riders',
      note: '~15% of households qualify for reduced fares. Saves $100/month for qualifying riders.',
      nonBudgetaryBenefits: [
        'Senior mobility: Enables medical appointments, social connection, aging in place',
        'Student access: Supports school attendance, after-school jobs, educational equity',
        'Transit ridership: Higher ridership improves service frequency, benefits all riders'
      ]
    },
    {
      id: 'rentersCredit',
      name: "State Renter's Tax Credits",
      category: 'State/Local',
      organization: 'State Housing Policy',
      description: "Refundable tax credits for renters (similar to homeowner mortgage deduction) - MN, CA, VT models",
      currentStates: 6,
      proposedStates: 50,
      householdImpact: 150, // Average monthly credit for renters
      individualImpact: 100,
      beneficiaries: 'Renters earning under area median income',
      note: "Only 6 states currently offer. Averages $1,800/year credit ($150/month) for qualifying renters.",
      nonBudgetaryBenefits: [
        'Housing equity: Reduces homeowner/renter wealth gap and tax treatment disparity',
        'Rent stability: Extra income helps cover rent increases, reduces displacement',
        'Economic parity: Renters have more disposable income to spend locally'
      ]
    },
    {
      id: 'stateChildcareSubsidy',
      name: 'Expanded State Childcare Subsidies',
      category: 'State/Local',
      organization: 'State CCDF Programs',
      description: 'Expand income eligibility to 200% FPL and cover 85% of provider costs (MA, VT models)',
      currentEligibility: '150% FPL',
      proposedEligibility: '200% FPL',
      householdImpact: 0, // Only families with young children in care
      individualImpact: 0,
      conditionalImpact: {
        condition: 'low-to-moderate income families with children 0-5',
        percentage: 8,
        impact: 650
      },
      beneficiaries: 'Families earning under ~$50k with young children',
      note: 'Expands eligibility to more working families. Current program only reaches 15% of eligible children.',
      nonBudgetaryBenefits: [
        'Workforce participation: Mothers can work full-time, increasing state tax revenue',
        'Provider wages: Higher reimbursement rates improve childcare worker pay, quality',
        'Gender equity: Removes childcare barrier that disproportionately affects women'
      ]
    },
    {
      id: 'municipalBroadband',
      name: 'Municipal Broadband Programs',
      category: 'State/Local',
      organization: 'Local Governments',
      description: 'City-run fiber internet at $40-50/month (vs $80-100 from private ISPs) - Chattanooga, Lafayette models',
      currentCities: 'Limited (20 states restrict municipal broadband)',
      householdImpact: 40, // Average monthly savings
      individualImpact: 30,
      beneficiaries: 'All households in participating municipalities',
      note: 'Saves $40-50/month vs private ISPs. Currently restricted in 20 states by telecom lobbying.',
      nonBudgetaryBenefits: [
        'Remote work: High-speed internet enables work-from-home, expands job opportunities',
        'Business development: Attracts tech startups, remote workers, economic development',
        'Education: Students have homework access, telehealth, online services for all'
      ]
    }
  ];

  // Calculate new disposable income under selected scenario
  const projectedHouseholdDisposable = current.householdDisposable + selected.impacts.medianHouseholdBenefit;
  const projectedIndividualDisposable = current.individualDisposable + selected.impacts.individualBenefit;

  // Chart comparing current vs projected
  const comparisonChart = {
    labels: ['Current', 'With Policy Changes'],
    datasets: [
      {
        label: 'Median Household',
        data: [current.householdDisposable, projectedHouseholdDisposable],
        backgroundColor: ['#ef4444', '#22c55e'],
        borderColor: ['#dc2626', '#16a34a'],
        borderWidth: 2
      },
      {
        label: 'Median Individual',
        data: [current.individualDisposable, projectedIndividualDisposable],
        backgroundColor: ['#f87171', '#86efac'],
        borderColor: ['#ef4444', '#22c55e'],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Disposable Income: Current vs. Projected'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}/month`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="widget">
        <h2>Policy Comparison: Current vs. Progressive Proposals</h2>
        <p className="widget-description">
          Compare current economic outcomes with projected impacts of leading progressive policy proposals
          from organizations like Economic Policy Institute, Center on Budget and Policy Priorities,
          Center for American Progress, Roosevelt Institute, Demos, CLASP, and Brookings Institution.
        </p>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '1rem'
        }}>
          <button
            onClick={() => setViewMode('scenarios')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderBottom: viewMode === 'scenarios' ? '3px solid #3b82f6' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: viewMode === 'scenarios' ? 'bold' : 'normal',
              color: viewMode === 'scenarios' ? '#1e40af' : '#666',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            📦 Policy Packages
          </button>
          <button
            onClick={() => setViewMode('individual')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderBottom: viewMode === 'individual' ? '3px solid #3b82f6' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: viewMode === 'individual' ? 'bold' : 'normal',
              color: viewMode === 'individual' ? '#1e40af' : '#666',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            🔍 Individual Policies
          </button>
        </div>

        {/* Scenario View */}
        {viewMode === 'scenarios' && (
          <>
            {/* Scenario Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Select Policy Scenario</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {Object.entries(scenarios).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => setSelectedScenario(key)}
                style={{
                  padding: '1rem',
                  border: selectedScenario === key ? '2px solid #3b82f6' : '1px solid #ddd',
                  borderRadius: '8px',
                  background: selectedScenario === key ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e40af' }}>
                  {scenario.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                  {scenario.description}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                  Source: {scenario.organizations.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current vs Projected Comparison */}
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Household - Current</div>
            <div className="metric-value">${current.householdDisposable}/mo</div>
            <div className="metric-change negative">Disposable income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Household - Projected</div>
            <div className="metric-value" style={{ color: '#22c55e', fontWeight: 'bold' }}>
              ${Math.round(projectedHouseholdDisposable)}/mo
            </div>
            <div className="metric-change positive">
              +${Math.round(selected.impacts.medianHouseholdBenefit)}/month
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Individual - Current</div>
            <div className="metric-value">${current.individualDisposable}/mo</div>
            <div className="metric-change negative">Disposable income (deficit)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Individual - Projected</div>
            <div className="metric-value" style={{
              color: projectedIndividualDisposable > 0 ? '#22c55e' : '#ef4444',
              fontWeight: 'bold'
            }}>
              ${Math.round(projectedIndividualDisposable)}/mo
            </div>
            <div className={`metric-change ${selected.impacts.individualBenefit > 0 ? 'positive' : ''}`}>
              {selected.impacts.individualBenefit > 0 ? '+' : ''}${Math.round(selected.impacts.individualBenefit)}/month
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: '400px', marginTop: '2rem' }}>
          <Bar data={comparisonChart} options={chartOptions} />
        </div>

        {/* Policy Details */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Policy Details: {selected.name}</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{selected.description}</p>

          <div style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ marginBottom: '1rem' }}>Impact Breakdown</h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {Object.entries(selected.impacts).map(([key, value]) => {
                if (key.includes('Benefit') || key.includes('Savings') || key.includes('Increase')) {
                  const label = key.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      background: 'white',
                      borderRadius: '4px'
                    }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 'bold', color: '#1e40af' }}>
                        ${Math.round(value)}/month
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
          </>
        )}

        {/* Individual Policies View */}
        {viewMode === 'individual' && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>Individual Policy Impact Analysis</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              See the projected impact of each progressive policy proposal on median household and individual disposable income.
              Note: Many policies target specific populations (low-income, families with children, transit users, etc.), so not all policies benefit all households.
            </p>

            {/* Group policies by category */}
            {['Healthcare', 'Wages', 'Family Support', 'Housing', 'Tax Credits', 'Childcare', 'Education', 'Transportation', 'Food Security', 'Income Support', 'State/Local'].map(category => {
              const categoryPolicies = individualPolicies.filter(p => p.category === category);
              if (categoryPolicies.length === 0) return null;

              return (
                <div key={category} style={{ marginBottom: '2.5rem' }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    marginBottom: '1rem',
                    color: '#1e40af',
                    borderBottom: '2px solid #dbeafe',
                    paddingBottom: '0.5rem'
                  }}>
                    {category}
                  </h4>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {categoryPolicies.map(policy => (
                      <div key={policy.id} style={{
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: 'white'
                      }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <h5 style={{ margin: 0, color: '#1e40af', fontSize: '1.05rem' }}>
                              {policy.name}
                            </h5>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                              {policy.description}
                            </p>
                          </div>
                          <span style={{
                            fontSize: '0.8rem',
                            color: '#fff',
                            background: '#3b82f6',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '12px',
                            whiteSpace: 'nowrap'
                          }}>
                            {policy.organization}
                          </span>
                        </div>

                        {/* Impact Cards */}
                        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                          <div className="metric-card">
                            <div className="metric-label">Median Household Impact</div>
                            <div className="metric-value" style={{
                              color: policy.householdImpact > 0 ? '#22c55e' : policy.householdImpact < 0 ? '#ef4444' : '#666'
                            }}>
                              {policy.householdImpact > 0 ? '+' : ''}${Math.round(policy.householdImpact)}/mo
                            </div>
                            <div className="metric-change">
                              New disposable: ${Math.round(current.householdDisposable + policy.householdImpact)}/mo
                            </div>
                          </div>

                          <div className="metric-card">
                            <div className="metric-label">Median Individual Impact</div>
                            <div className="metric-value" style={{
                              color: policy.individualImpact > 0 ? '#22c55e' : policy.individualImpact < 0 ? '#ef4444' : '#666'
                            }}>
                              {policy.individualImpact > 0 ? '+' : ''}${Math.round(policy.individualImpact)}/mo
                            </div>
                            <div className="metric-change">
                              New disposable: ${Math.round(current.individualDisposable + policy.individualImpact)}/mo
                            </div>
                          </div>

                          {/* Show special impacts if they exist */}
                          {policy.minWageWorkerImpact && (
                            <div className="metric-card" style={{ background: '#fef3c7', border: '1px solid #fbbf24' }}>
                              <div className="metric-label">Min. Wage Worker Impact</div>
                              <div className="metric-value" style={{ color: '#92400e' }}>
                                +${Math.round(policy.minWageWorkerImpact)}/mo
                              </div>
                              <div className="metric-change" style={{ color: '#92400e' }}>
                                From $7.25 → ${policy.proposedWage}/hr
                              </div>
                            </div>
                          )}

                          {policy.lowIncomeImpact && (
                            <div className="metric-card" style={{ background: '#fef3c7', border: '1px solid #fbbf24' }}>
                              <div className="metric-label">Low-Income Impact</div>
                              <div className="metric-value" style={{ color: '#92400e' }}>
                                +${Math.round(policy.lowIncomeImpact)}/mo
                              </div>
                              <div className="metric-change" style={{ color: '#92400e' }}>
                                For eligible households
                              </div>
                            </div>
                          )}

                          {/* Conditional Impact Card */}
                          {policy.conditionalImpact && (
                            <div className="metric-card" style={{ background: '#dbeafe', border: '1px solid #60a5fa' }}>
                              <div className="metric-label" style={{ fontSize: '0.85rem' }}>
                                {policy.conditionalImpact.condition.charAt(0).toUpperCase() + policy.conditionalImpact.condition.slice(1)}
                              </div>
                              <div className="metric-value" style={{ color: '#1e40af' }}>
                                +${Math.round(policy.conditionalImpact.impact)}/mo
                              </div>
                              <div className="metric-change" style={{ color: '#1e40af' }}>
                                ~{policy.conditionalImpact.percentage}% of households
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Beneficiaries and Notes */}
                        <div style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: '#f9fafb',
                          borderRadius: '6px',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#374151' }}>Who benefits:</strong>{' '}
                            <span style={{ color: '#666' }}>{policy.beneficiaries}</span>
                          </div>
                          <div style={{ color: '#666', fontStyle: 'italic', marginBottom: policy.nonBudgetaryBenefits ? '0.75rem' : 0 }}>
                            💡 {policy.note}
                          </div>

                          {/* Non-Budgetary Benefits */}
                          {policy.nonBudgetaryBenefits && policy.nonBudgetaryBenefits.length > 0 && (
                            <div style={{
                              marginTop: '0.75rem',
                              paddingTop: '0.75rem',
                              borderTop: '1px solid #e5e7eb'
                            }}>
                              <strong style={{ color: '#059669', fontSize: '0.9rem' }}>🌟 Indirect Benefits (All Households):</strong>
                              <ul style={{
                                margin: '0.5rem 0 0 0',
                                paddingLeft: '1.25rem',
                                color: '#666'
                              }}>
                                {policy.nonBudgetaryBenefits.map((benefit, idx) => (
                                  <li key={idx} style={{ marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Original detailed proposals section (kept for reference) */}
      <div className="widget">
        <h2>Progressive Policy Proposals by Category</h2>
        <p className="widget-description">
          Detailed proposals from leading progressive research organizations
        </p>

        {/* Minimum Wage */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Minimum Wage Proposals</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {minimumWageProposals.map(proposal => {
              const impact = proposal.calculateImpact(medianIncome);
              return (
                <div key={proposal.id} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: '#1e40af' }}>{proposal.name}</h4>
                    <span style={{
                      fontSize: '0.85rem',
                      color: '#fff',
                      background: '#3b82f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px'
                    }}>
                      {proposal.organization}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {proposal.description}
                  </p>
                  <div style={{
                    background: '#f0fdf4',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #86efac'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                      Impact: ${proposal.currentValue} → ${proposal.proposedValue}/hour
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#15803d' }}>
                      +${Math.round(impact.monthlyIncrease)}/month (+{Math.round(impact.percentIncrease)}%)
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '0.5rem' }}>
                      {impact.note}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.75rem' }}>
                    Source: <a href={proposal.url} target="_blank" rel="noopener noreferrer">{proposal.source}</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Housing */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Housing Policy Proposals</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {housingProposals.map(proposal => {
              return (
                <div key={proposal.id} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: '#1e40af' }}>{proposal.name}</h4>
                    <span style={{
                      fontSize: '0.85rem',
                      color: '#fff',
                      background: '#8b5cf6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px'
                    }}>
                      {proposal.organization}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {proposal.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.75rem' }}>
                    Source: <a href={proposal.url} target="_blank" rel="noopener noreferrer">{proposal.source}</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Healthcare */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Healthcare Policy Proposals</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {healthcareProposals.map(proposal => {
              const impact = proposal.calculateImpact(medianIncome, current.healthcareCost);
              return (
                <div key={proposal.id} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: '#1e40af' }}>{proposal.name}</h4>
                    <span style={{
                      fontSize: '0.85rem',
                      color: '#fff',
                      background: '#ec4899',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px'
                    }}>
                      {proposal.organization}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {proposal.description}
                  </p>
                  <div style={{
                    background: '#f0fdf4',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #86efac'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                      Projected Savings: ${Math.round(impact.monthlySavings)}/month
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                      {impact.note}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.75rem' }}>
                    Source: <a href={proposal.url} target="_blank" rel="noopener noreferrer">{proposal.source}</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education & Student Debt */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Education & Student Debt Proposals</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {educationProposals.map(proposal => {
              return (
                <div key={proposal.id} style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, color: '#1e40af' }}>{proposal.name}</h4>
                    <span style={{
                      fontSize: '0.85rem',
                      color: '#fff',
                      background: '#f59e0b',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px'
                    }}>
                      {proposal.organization}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {proposal.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.75rem' }}>
                    Source: <a href={proposal.url} target="_blank" rel="noopener noreferrer">{proposal.source}</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Research Organizations */}
      <div className="widget">
        <h2>Policy Research Organizations</h2>
        <p className="widget-description">
          Leading progressive organizations conducting research and advocating for policy change
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {getPolicyResources().organizations.map(org => (
            <div key={org.name} style={{
              padding: '1.25rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>
                <a href={org.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {org.name} →
                </a>
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                {org.focus}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Note */}
      <div className="widget">
        <h3>Methodology & Data Sources</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
          Policy proposals and impact estimates are based on published research from the listed organizations.
          Calculations use median household income ($74,580) and median individual income ($44,000) as baseline.
          Actual impacts vary by household composition, income level, location, and specific policy implementation.
          <br/><br/>
          <strong>Organizations Referenced:</strong>
          <ul style={{ marginTop: '0.5rem' }}>
            <li>Economic Policy Institute (EPI) - Labor and wage policy research</li>
            <li>Center on Budget and Policy Priorities (CBPP) - Federal budget and safety net analysis</li>
            <li>Center for American Progress (CAP) - Progressive policy research</li>
            <li>The Roosevelt Institute - Economic power and structural reform</li>
            <li>Demos - Racial and economic justice policy</li>
            <li>Center for Law and Social Policy (CLASP) - Low-income family policy</li>
            <li>Brookings Institution - Independent policy research</li>
            <li>Pew Research Center - Data and social trends analysis</li>
          </ul>
          <br/>
          Impact calculations are simplified projections for illustrative purposes. Actual policy impacts
          depend on implementation details, phase-in schedules, and interaction effects between policies.
        </p>
      </div>
    </div>
  );
}

export default PolicyComparison;
