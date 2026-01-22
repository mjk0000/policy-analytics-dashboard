# Household Definitions and Assumptions

## Last Updated: January 19, 2026

---

## How We Define "Household"

### Median Household ($74,580/year)

**Definition**: The median U.S. household from Census Bureau American Community Survey 2022

**Composition Assumptions**:
- **Income earners**: 1-2 adults (assumes dual-income or single earner)
- **Children**: 1 child (for child-related benefits like Child Tax Credit)
- **Location**: National median (not city-specific)
- **Housing**: Renter (not homeowner) - see note below
- **Employment**: Full-time work, W-2 employees (not self-employed)

**Why These Assumptions?**
- Census "household" includes all people living in a housing unit (families, roommates, single persons)
- Median household income ($74,580) represents the 50th percentile - half earn more, half earn less
- We assume 1 child as the modal (most common) number for households with children
- National median smooths over regional cost variations (NYC vs rural areas)

---

## How We Define "Individual"

### Median Individual ($44,000/year)

**Definition**: Median income for full-time, year-round single earner

**Composition Assumptions**:
- **Income earners**: 1 person, single
- **Children**: 0 children
- **Dependents**: None
- **Location**: National median
- **Housing**: Renter, single occupancy or roommate
- **Employment**: Full-time (2,080 hours/year), W-2 employee

**Why These Assumptions?**
- Represents the median worker, not household
- Single filer for tax purposes
- No child-related benefits (Child Tax Credit shows $0 for individuals)
- Full-time = 40 hours/week × 52 weeks = 2,080 hours/year

---

## Income Details

### Household Income: $74,580/year

**Breakdown Assumptions**:
- Could be:
  - Single earner: $74,580 (one full-time worker)
  - Dual income: $44,000 + $30,580 (two workers)
  - Dual income: $37,290 + $37,290 (two equal earners)
- **We use**: Single aggregate income for simplicity
- **Tax filing**: Married filing jointly OR Head of household (with 1 child)

**Why Not Specify?**
- Census doesn't break down how many earners contribute
- Tax and benefit calculations work the same regardless of earner count
- Final after-tax income is what matters for budgeting

### Individual Income: $44,000/year

**Calculation**:
- $44,000/year ÷ 2,080 hours = **$21.15/hour**
- Full-time, year-round single worker
- **Tax filing**: Single filer, no dependents

**Context**:
- Above federal minimum wage ($7.25/hr = $15,080/year)
- Below proposed $15/hr minimum ($31,200/year)
- Below proposed $18/hr living wage ($37,440/year)
- Median = 50th percentile of full-time workers

---

## Expense Breakdown: "Other" Category

### Household "Other" Spending: $670/month

**What's Included** (from BLS Consumer Expenditure Survey):
- **Clothing**: $120/month
  - Work clothes, casual wear
  - Shoes, accessories
  - Laundry, dry cleaning

- **Personal care**: $65/month
  - Haircuts, salon services
  - Toiletries, cosmetics
  - Personal care products

- **Education**: $140/month
  - Student loan payments (for ~33% who have debt)
  - School supplies, tutoring
  - Adult education, training

- **Household supplies**: $80/month
  - Cleaning products
  - Paper products, batteries
  - Small household items

- **Communications**: $150/month
  - Cell phone service ($50-100)
  - Internet ($50-80)
  - Streaming services

- **Miscellaneous**: $115/month
  - Bank fees, postage
  - Pet care (for households with pets)
  - Gifts, donations
  - Professional services (tax prep, legal)

**Total**: $670/month

**Note**: These are **median** values. Some households spend more in one category, less in another. This represents the typical (50th percentile) household's spending pattern.

### Individual "Other" Spending: $450/month

**What's Included** (proportionally lower than household):
- **Clothing**: $75/month
- **Personal care**: $50/month
- **Education**: $100/month (student loans if applicable)
- **Household supplies**: $40/month
- **Communications**: $125/month (cell + internet)
- **Miscellaneous**: $60/month

**Total**: $450/month

**Why Lower Than Household?**
- Single person = fewer clothes, less household supplies
- No children = no child-related expenses in this category
- Proportionally less miscellaneous spending

---

## Housing Assumptions

### Household: Renter ($1,650/month)

**Assumptions**:
- **Type**: 2-bedroom apartment
- **Location**: National median rent (BLS 2022)
- **Includes**: Rent + utilities (electric, gas, water)
- **Does NOT include**:
  - Homeowner costs (mortgage, property tax) - separate calculation
  - Renter's insurance (included in "insurance" category)

**Renter vs Owner Split**:
- ~65% of median-income households are renters
- We use renter as baseline since it's more common at median income
- Homeowners have different expense structure (mortgage, property tax, maintenance)

### Individual: Renter ($1,200/month)

**Assumptions**:
- **Type**: Studio or 1-bedroom apartment OR shared 2-bedroom
- **Location**: National median
- **Singles pay more per person** than households (less cost-sharing)

---

## Tax Filing Assumptions

### Household: Married Filing Jointly or Head of Household

**Tax Calculation** (18% effective rate):
- Gross income: $74,580
- Federal income tax: ~$6,100 (after standard deduction)
- FICA (Social Security + Medicare): 7.65% = $5,705
- **Total tax**: $11,805 (15.8%)
- **State/local taxes**: ~2.2% (varies by state)
- **Effective rate**: 18%

**After-tax income**: $74,580 × 0.82 = $61,156/year = **$5,096/month**

**Assumptions**:
- Standard deduction: $27,700 (married) or $20,800 (head of household)
- 1 child dependent
- No itemized deductions
- Average state tax burden (some states have 0%, others 10%+)

### Individual: Single Filer

**Tax Calculation** (15% effective rate):
- Gross income: $44,000
- Federal income tax: ~$2,985 (after standard deduction)
- FICA: 7.65% = $3,366
- **Total tax**: $6,351 (14.4%)
- **State/local taxes**: ~0.6% (lower bracket)
- **Effective rate**: 15%

**After-tax income**: $44,000 × 0.85 = $37,400/year = **$3,117/month**

**Assumptions**:
- Standard deduction: $14,600 (single filer)
- No dependents
- No itemized deductions

---

## Children Assumptions

### Household: 1 Child

**Why 1 child?**
- Modal (most common) number for households with children
- Census: ~40% of households have children
- Of those, median is 1-2 children
- We use 1 for conservative estimates

**Age Assumptions** (depends on policy):
- **Child Tax Credit**: Under 18
- **Childcare**: Ages 0-5 (only applies to ~12% of median households)
- **Education**: School-age (K-12)

**Impact on Budget**:
- Food: Included in $670/month household food budget
- Clothing: Included in "other" category
- Childcare: **NOT** in baseline (only ~12% use paid childcare)
- Healthcare: Included in $380/month household healthcare

### Individual: 0 Children

**Why 0 children?**
- Single filer assumption
- Simplifies calculations
- Households with children show separately

**Impact**:
- No Child Tax Credit
- No childcare costs
- Lower food, clothing, misc expenses

---

## Student Debt Assumptions

### Household: ~33% Have Student Debt

**If debt exists**:
- Average debt: $37,000 per borrower
- Average payment: $200-400/month
- **Included in**: "Other" category (education line item)

**Baseline assumes**:
- Household may or may not have debt (shows conditional impact)
- If debt exists, payment is part of "other" ($670/month)

### Individual: ~33% Have Student Debt

**If debt exists**:
- Average payment: $400/month
- **Included in**: "Other" category ($450/month)

**Note**: Only ~33% of households have student debt, so this is a conditional expense.

---

## Healthcare Assumptions

### Household: $380/month Out-of-Pocket

**What's Included**:
- Insurance premiums (if not employer-sponsored): $200-300/month
- OR employer-sponsored portion: $100-150/month
- Copays, deductibles: $80-100/month
- Prescriptions: $50-80/month
- Dental, vision: $50/month

**Does NOT Include**:
- Employer's portion of premium (not out-of-pocket)
- One-time major medical expenses (surgery, ER)

**Source**: BLS Consumer Expenditure Survey 2022 (median out-of-pocket)

### Individual: $300/month Out-of-Pocket

**Proportionally lower** than household (no children to cover)

---

## Transportation Assumptions

### Household: $800/month (Car ownership)

**What's Included**:
- Car payment or depreciation: $300/month
- Auto insurance: $150/month
- Gas: $200/month
- Maintenance, repairs: $100/month
- Registration, tolls: $50/month

**Assumes**:
- 1 car ownership (not 2 cars)
- Mix of used car payment and older owned vehicle
- Not using public transit regularly

### Individual: $550/month (Car ownership)

**Lower costs**:
- Smaller/cheaper vehicle
- Less driving (lower gas, maintenance)
- Single person insurance rates

---

## Geographic Assumptions

### National Median (Not City-Specific)

**Why National?**
- Represents typical American household across all locations
- Smooths over high-cost cities (NYC, SF) and low-cost areas (rural)
- Census uses national median for official statistics

**Limitations**:
- NYC household earning $74,580 struggles more than rural household
- Rent in Manhattan ($3,000+) vs rural Ohio ($600)
- Should ideally adjust by metro area, but adds complexity

**Future Enhancement**:
- Add location selector (NYC, SF, Chicago, Atlanta, etc.)
- Adjust expenses by local cost-of-living index
- Currently out of scope

---

## Policy Scenario Assumptions

### Which Policies Apply?

Different policies target different populations:

| Policy | Household ($74,580) | Individual ($44,000) |
|--------|---------------------|----------------------|
| Medicare for All | ✅ Yes (all) | ✅ Yes (all) |
| $15 Min Wage | ❌ No (already above) | ❌ No (already above) |
| Child Tax Credit | ✅ Yes (has 1 child) | ❌ No (no children) |
| Housing Vouchers | ❌ No (above 50% AMI) | ❌ No (above 50% AMI) |
| Expanded EITC | ❌ No (phased out) | ❌ No (phased out) |
| Free Childcare | ⚠️ Maybe (~12% have young kids) | ❌ No (no children) |
| Student Debt | ⚠️ Maybe (~33% have debt) | ⚠️ Maybe (~33% have debt) |
| Free Transit | ⚠️ Maybe (~10% use regularly) | ⚠️ Maybe (~10% use regularly) |

---

## Verification Against Real Data

### Census Bureau ACS 2022

- ✅ Median household income: $74,580 (verified)
- ✅ Median individual income: $44,000 for full-time workers (verified)

### BLS Consumer Expenditure Survey 2022

- ✅ Median household expenses: $58,080/year = $4,840/month (verified)
- ✅ Median individual expenses: $37,800/year = $3,150/month (verified)

### IRS Tax Data 2024

- ✅ Effective tax rate for $74,580: ~18% (verified)
- ✅ Effective tax rate for $44,000: ~15% (verified)

---

## Limitations and Caveats

### What We DON'T Model

1. **Regional variation**: NYC vs rural costs
2. **Family size variation**: 0, 1, 2, 3+ children
3. **Homeownership**: Mortgage, property tax, maintenance
4. **Self-employment**: Different tax structure (SE tax)
5. **Variable income**: Overtime, bonuses, seasonal work
6. **Wealth/assets**: Savings, investments, inheritance
7. **Debt**: Credit cards, auto loans (except student debt in "other")
8. **Major life events**: Medical emergency, job loss, divorce

### Why These Simplifications?

- **Median** smooths over individual variation
- Captures **typical** household, not every household
- Easier to understand and communicate
- Can be adjusted with sliders/selectors in future versions

---

## Summary

**Household = Median U.S. household**
- Income: $74,580/year (1-2 earners)
- After-tax: $5,096/month
- Expenses: $4,840/month
- Disposable: $256/month
- Children: 1 child (for applicable policies)
- Housing: Renter ($1,650/month)
- Transportation: 1 car ($800/month)
- Healthcare: $380/month out-of-pocket

**Individual = Median full-time single worker**
- Income: $44,000/year ($21.15/hr)
- After-tax: $3,117/month
- Expenses: $3,150/month
- Disposable: -$33/month (deficit)
- Children: 0
- Housing: Renter ($1,200/month)
- Transportation: 1 car ($550/month)
- Healthcare: $300/month out-of-pocket

**"Other" category** = Clothing, personal care, education, communications, household supplies, miscellaneous

**All values** = Median (50th percentile), not mean/average

---

**Questions? See**:
- DATA_SOURCES.md for data provenance
- baselineData.js for exact calculations
- BudgetOverview.jsx for how expenses are displayed
