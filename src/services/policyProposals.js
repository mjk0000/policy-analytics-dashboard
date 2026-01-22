/**
 * Policy Proposals Data Service
 *
 * Aggregates leading progressive policy proposals from:
 * - Economic Policy Institute (EPI)
 * - Center on Budget and Policy Priorities (CBPP)
 * - Center for American Progress (CAP)
 * - The Roosevelt Institute
 * - Demos
 * - Center for Law and Social Policy (CLASP)
 * - Brookings Institution
 * - Pew Research Center
 *
 * Each proposal includes:
 * - Description and source
 * - Impact calculations on median household/individual budgets
 * - Implementation timeline
 */

/**
 * Minimum Wage Proposals
 */
export const minimumWageProposals = [
  {
    id: 'epi_15_min_wage',
    name: '$15 Federal Minimum Wage',
    organization: 'Economic Policy Institute',
    currentValue: 7.25,
    proposedValue: 15.00,
    description: 'Raise federal minimum wage to $15/hour by 2025, then index to median wage growth',
    source: 'EPI - Why the U.S. Needs a $15 Minimum Wage',
    url: 'https://www.epi.org/publication/why-america-needs-a-15-minimum-wage/',
    timeline: 'Phase in over 5 years',
    calculateImpact: (currentIncome) => {
      const currentAnnual = 7.25 * 2080;
      const newAnnual = 15.00 * 2080;
      const increase = newAnnual - currentAnnual;
      return {
        annualIncrease: increase,
        monthlyIncrease: increase / 12,
        percentIncrease: ((15.00 - 7.25) / 7.25) * 100,
        affectedWorkers: 27_000_000, // EPI estimate
        note: 'Impacts 27 million workers directly, additional indirect benefits'
      };
    }
  },
  {
    id: 'epi_living_wage',
    name: 'Living Wage Standard',
    organization: 'Economic Policy Institute',
    currentValue: 7.25,
    proposedValue: 18.00,
    description: 'Set minimum wage at living wage level (~$18/hr for single adult, varies by location)',
    source: 'EPI - Family Budget Calculator',
    url: 'https://www.epi.org/resources/budget/',
    timeline: 'Immediate implementation with regional adjustments',
    calculateImpact: (currentIncome) => {
      const currentAnnual = 7.25 * 2080;
      const newAnnual = 18.00 * 2080;
      const increase = newAnnual - currentAnnual;
      return {
        annualIncrease: increase,
        monthlyIncrease: increase / 12,
        percentIncrease: ((18.00 - 7.25) / 7.25) * 100,
        affectedWorkers: 35_000_000,
        note: 'Ensures all workers can afford basic necessities'
      };
    }
  }
];

/**
 * Tax Policy Proposals
 */
export const taxProposals = [
  {
    id: 'cbpp_eitc_expansion',
    name: 'Expand Earned Income Tax Credit',
    organization: 'Center on Budget and Policy Priorities',
    description: 'Expand EITC for workers without children and increase credit amounts',
    source: 'CBPP - EITC and Child Tax Credit Promote Work',
    url: 'https://www.cbpp.org/research/federal-tax/the-earned-income-tax-credit',
    calculateImpact: (income) => {
      // EITC expansion would provide additional credit
      // For median income household: minimal impact
      // For low-income workers: significant boost
      if (income < 30000) {
        return {
          annualBenefit: 1500,
          monthlyBenefit: 125,
          note: 'Larger benefit for workers earning under $30k'
        };
      } else if (income < 50000) {
        return {
          annualBenefit: 800,
          monthlyBenefit: 67,
          note: 'Moderate benefit for workers earning $30k-$50k'
        };
      }
      return {
        annualBenefit: 0,
        monthlyBenefit: 0,
        note: 'Phases out above $50k income'
      };
    }
  },
  {
    id: 'cap_wealth_tax',
    name: 'Wealth Tax on Ultra-Rich',
    organization: 'Center for American Progress',
    description: '2% annual tax on net worth above $50M, 3% above $1B',
    source: 'CAP - Ending Special Tax Treatment for the Very Wealthy',
    url: 'https://www.americanprogress.org/',
    calculateImpact: (income, netWorth) => {
      // Would not affect median household (net worth $192,900)
      // Revenue could fund social programs
      return {
        directImpact: 0,
        estimatedRevenue: 200_000_000_000, // $200B annually
        note: 'No direct tax increase for households under $50M net worth. Revenue funds social programs.'
      };
    }
  },
  {
    id: 'roosevelt_progressive_tax',
    name: 'Progressive Income Tax Reform',
    organization: 'The Roosevelt Institute',
    description: 'Restore top marginal rates to 70% for income over $10M, close capital gains loopholes',
    source: 'Roosevelt Institute - Tax Reform for Progressive Revenue',
    url: 'https://rooseveltinstitute.org/',
    calculateImpact: (income) => {
      if (income < 400000) {
        return {
          taxChange: 0,
          note: 'No tax increase for households earning under $400k',
          estimatedRevenue: 750_000_000_000 // $750B over 10 years
        };
      }
      return {
        taxChange: 'Higher rates only on income above $400k',
        note: 'Progressive brackets ensure only ultra-wealthy pay more'
      };
    }
  }
];

/**
 * Housing Policy Proposals
 */
export const housingProposals = [
  {
    id: 'cbpp_housing_vouchers',
    name: 'Universal Housing Vouchers',
    organization: 'Center on Budget and Policy Priorities',
    description: 'Expand Section 8 vouchers to all eligible families (income below 50% area median)',
    source: 'CBPP - Housing Vouchers Work',
    url: 'https://www.cbpp.org/research/housing',
    calculateImpact: (income, rent, medianIncome) => {
      // If paying more than 30% of income on rent
      const affordableRent = (income * 0.82 * 0.30) / 12; // 30% of after-tax
      if (rent > affordableRent && income < medianIncome * 0.5) {
        const voucherAmount = rent - affordableRent;
        return {
          monthlyBenefit: voucherAmount,
          annualBenefit: voucherAmount * 12,
          note: `Reduces rent burden to 30% of income for eligible households`,
          eligibleHouseholds: 10_700_000 // CBPP estimate
        };
      }
      return {
        monthlyBenefit: 0,
        note: 'Not eligible (income above 50% area median or rent already affordable)'
      };
    }
  },
  {
    id: 'cap_social_housing',
    name: 'Public Housing Investment',
    organization: 'Center for American Progress',
    description: 'Invest $70B annually in public housing construction and renovation',
    source: 'CAP - A Marshall Plan for Housing',
    url: 'https://www.americanprogress.org/',
    calculateImpact: () => {
      return {
        unitsCreated: 500_000, // Per year
        medianRentReduction: 150, // Market pressure reduces rents
        note: 'Indirect benefit: increased supply reduces market rents by ~$150/month over 5 years',
        timeline: '10-year program creating 5 million units'
      };
    }
  },
  {
    id: 'demos_rent_control',
    name: 'National Rent Stabilization',
    organization: 'Demos',
    description: 'Cap annual rent increases at 3% or inflation rate, whichever is lower',
    source: 'Demos - A National Renter Agenda',
    url: 'https://www.demos.org/',
    calculateImpact: (currentRent) => {
      // Assume current rent inflation is ~5-6% annually
      const currentIncrease = currentRent * 0.05;
      const cappedIncrease = currentRent * 0.03;
      const savings = currentIncrease - cappedIncrease;
      return {
        annualSavings: savings * 12,
        monthlySavings: savings,
        note: 'Protects renters from excessive annual increases',
        affectedRenters: 44_000_000 // Total US renters
      };
    }
  }
];

/**
 * Healthcare Policy Proposals
 */
export const healthcareProposals = [
  {
    id: 'cap_medicare_for_all',
    name: 'Medicare for All',
    organization: 'Center for American Progress / Multiple',
    description: 'Single-payer universal healthcare, eliminates premiums and most out-of-pocket costs',
    source: 'Multiple progressive organizations support versions of M4A',
    url: 'https://www.americanprogress.org/',
    calculateImpact: (income, currentHealthcareCost) => {
      // Eliminates most healthcare costs, replaces with ~4% payroll tax
      const newTax = income * 0.04;
      const currentCost = currentHealthcareCost * 12; // Monthly to annual
      const savings = currentCost - newTax;
      return {
        currentAnnualCost: currentCost,
        newAnnualCost: newTax,
        annualSavings: savings,
        monthlySavings: savings / 12,
        note: 'Eliminates premiums, deductibles, copays. Funded by 4% income tax.'
      };
    }
  },
  {
    id: 'cbpp_aca_expansion',
    name: 'Expand and Improve ACA',
    organization: 'Center on Budget and Policy Priorities',
    description: 'Increase subsidies, add public option, cap premiums at 8.5% of income',
    source: 'CBPP - ACA Advances Health Equity',
    url: 'https://www.cbpp.org/research/health',
    calculateImpact: (income, currentHealthcareCost) => {
      const cappedCost = (income * 0.085) / 12; // 8.5% cap
      if (currentHealthcareCost > cappedCost) {
        const savings = currentHealthcareCost - cappedCost;
        return {
          monthlySavings: savings,
          annualSavings: savings * 12,
          note: 'Premium capped at 8.5% of income, subsidies cover difference'
        };
      }
      return {
        monthlySavings: 0,
        note: 'Already paying less than 8.5% of income'
      };
    }
  }
];

/**
 * Childcare & Family Policy Proposals
 */
export const childcareProposals = [
  {
    id: 'clasp_universal_childcare',
    name: 'Universal Child Care & Pre-K',
    organization: 'Center for Law and Social Policy',
    description: 'Free universal pre-K, subsidized childcare capped at 7% of income',
    source: 'CLASP - Child Care for All',
    url: 'https://www.clasp.org/',
    calculateImpact: (income, hasChildren = false) => {
      if (!hasChildren) {
        return {
          benefit: 0,
          note: 'Benefit applies to families with young children'
        };
      }
      // Average childcare cost is ~$1,200/month
      const currentCost = 1200;
      const cappedCost = (income * 0.07) / 12;
      const savings = currentCost - cappedCost;
      return {
        monthlySavings: savings,
        annualSavings: savings * 12,
        note: 'For families with children under 5. Childcare capped at 7% of income.',
        averageCurrentCost: currentCost
      };
    }
  },
  {
    id: 'cap_child_allowance',
    name: 'Permanent Child Tax Credit',
    organization: 'Center for American Progress',
    description: 'Make expanded CTC permanent: $3,600/child under 6, $3,000/child 6-17',
    source: 'CAP - Expanded Child Tax Credit',
    url: 'https://www.americanprogress.org/',
    calculateImpact: (childrenUnder6 = 0, childrenOver6 = 0) => {
      const benefit = (childrenUnder6 * 3600) + (childrenOver6 * 3000);
      return {
        annualBenefit: benefit,
        monthlyBenefit: benefit / 12,
        note: 'Fully refundable, monthly payments available',
        impactOnChildPoverty: '40% reduction in child poverty (CBPP analysis)'
      };
    }
  }
];

/**
 * Student Debt & Education Proposals
 */
export const educationProposals = [
  {
    id: 'demos_free_college',
    name: 'Debt-Free College',
    organization: 'Demos',
    description: 'Free tuition at public colleges, expand Pell Grants for living expenses',
    source: 'Demos - The Affordable College Compact',
    url: 'https://www.demos.org/',
    calculateImpact: (hasStudentDebt = false, studentDebtAmount = 0) => {
      return {
        futureGenerationsBenefit: 'Eliminates tuition costs ($10k-$20k/year)',
        currentDebtHolders: 'Does not cancel existing debt',
        note: 'Prevents future student debt, does not address current $1.7T in existing debt'
      };
    }
  },
  {
    id: 'roosevelt_debt_cancellation',
    name: 'Student Debt Cancellation',
    organization: 'The Roosevelt Institute',
    description: 'Cancel $50,000 in student debt per borrower',
    source: 'Roosevelt Institute - Student Debt Cancellation',
    url: 'https://rooseveltinstitute.org/',
    calculateImpact: (studentDebtAmount = 0, monthlyPayment = 0) => {
      const cancelled = Math.min(studentDebtAmount, 50000);
      if (cancelled === 0) {
        return {
          benefit: 0,
          note: 'No student debt to cancel'
        };
      }
      // Assume 10-year repayment at 5% interest
      const monthsRemaining = cancelled / (monthlyPayment || 1);
      return {
        debtCancelled: cancelled,
        monthlyPaymentEliminated: monthlyPayment,
        annualSavings: monthlyPayment * 12,
        note: `Cancels up to $50k in student debt, eliminates monthly payment`,
        totalBorrowers: 43_000_000
      };
    }
  }
];

/**
 * Transportation Proposals
 */
export const transportationProposals = [
  {
    id: 'brookings_transit_investment',
    name: 'Expanded Public Transit',
    organization: 'Brookings Institution',
    description: 'Invest $100B annually in public transit infrastructure and operations',
    source: 'Brookings Metro - Transit Investment',
    url: 'https://www.brookings.edu/topic/transportation/',
    calculateImpact: (currentMode = 'car') => {
      if (currentMode === 'car') {
        // Assume 30% of car owners could switch to improved transit
        const carCost = 1015; // Monthly from our data
        const transitCost = 95;
        const savings = carCost - transitCost;
        return {
          potentialMonthlySavings: savings,
          potentialAnnualSavings: savings * 12,
          note: 'Savings if able to switch from car to public transit',
          likelihood: '30% of car owners gain viable transit option'
        };
      }
      return {
        benefit: 'Improved service, reliability, and coverage',
        note: 'Already using public transit - benefits from service improvements'
      };
    }
  }
];

/**
 * Aggregate all proposals
 */
export const allProposals = {
  minimumWage: minimumWageProposals,
  tax: taxProposals,
  housing: housingProposals,
  healthcare: healthcareProposals,
  childcare: childcareProposals,
  education: educationProposals,
  transportation: transportationProposals
};

/**
 * Calculate combined impact of a policy package
 */
export function calculatePolicyPackage(packageName, householdData) {
  const packages = {
    'Progressive Agenda': {
      description: 'Comprehensive progressive policy platform',
      policies: [
        'epi_15_min_wage',
        'cbpp_eitc_expansion',
        'cbpp_housing_vouchers',
        'cap_medicare_for_all',
        'clasp_universal_childcare',
        'roosevelt_debt_cancellation'
      ]
    },
    'Economic Security Platform': {
      description: 'Focus on income support and basic needs',
      policies: [
        'epi_living_wage',
        'cbpp_eitc_expansion',
        'cap_child_allowance',
        'cbpp_aca_expansion'
      ]
    },
    'Housing Justice Package': {
      description: 'Address housing affordability crisis',
      policies: [
        'cbpp_housing_vouchers',
        'cap_social_housing',
        'demos_rent_control'
      ]
    }
  };

  const selectedPackage = packages[packageName];
  if (!selectedPackage) return null;

  // Calculate impact for each policy in package
  // This is a simplified calculation - real implementation would need household-specific data
  return {
    name: packageName,
    description: selectedPackage.description,
    policies: selectedPackage.policies,
    estimatedImpact: 'Calculation based on household specifics'
  };
}

/**
 * Get policy research sources
 */
export function getPolicyResources() {
  return {
    organizations: [
      {
        name: 'Economic Policy Institute',
        url: 'https://www.epi.org/',
        focus: 'Economic analysis, wage policy, labor rights'
      },
      {
        name: 'Center on Budget and Policy Priorities',
        url: 'https://www.cbpp.org/',
        focus: 'Federal and state budget policy, safety net programs'
      },
      {
        name: 'Center for American Progress',
        url: 'https://www.americanprogress.org/',
        focus: 'Wide range of progressive policy issues'
      },
      {
        name: 'The Roosevelt Institute',
        url: 'https://rooseveltinstitute.org/',
        focus: 'Economic power, corporate accountability, democracy'
      },
      {
        name: 'Demos',
        url: 'https://www.demos.org/',
        focus: 'Racial and economic justice, democracy reform'
      },
      {
        name: 'Center for Law and Social Policy',
        url: 'https://www.clasp.org/',
        focus: 'Low-income families, childcare, workforce development'
      },
      {
        name: 'Brookings Institution',
        url: 'https://www.brookings.edu/',
        focus: 'Independent research across policy areas'
      },
      {
        name: 'Pew Research Center',
        url: 'https://www.pewresearch.org/',
        focus: 'Data and analysis on social trends'
      }
    ]
  };
}
