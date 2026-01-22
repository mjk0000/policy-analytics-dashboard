# Data Accuracy Audit - Findings & Fixes

## Issues Found

### 1. Housing Affordability Widget ⚠️
**Issue:** Affordable rent calculated from PRE-TAX income
- Line 36: `affordableRentMedian = (medianIncome * 0.30) / 12`
- Should use after-tax income since rent is paid with take-home pay

**Fix:**
```javascript
const afterTaxIncome = medianIncome * 0.82; // After 18% taxes
const affordableRentMedian = Math.round((afterTaxIncome * 0.30) / 12);
```

**Impact:** Currently shows $1,857/month affordable rent, should be ~$1,524/month

---

### 2. Transportation Widget - Terminology ✓
**Status:** MOSTLY CORRECT but uses "average" terminology
- AAA data is actually AVERAGE car costs, not median
- Should clarify this is "national average" not median
- Burden calculations correctly use median income

**Recommendation:** Add note that car costs are average (skewed by expensive vehicles)

---

### 3. Wage Analysis Widget ✓
**Status:** CORRECT
- Uses median household income correctly
- Living wage calculations are reasonable
- CPI data properly integrated

---

### 4. Tax Burden Widget ✓
**Status:** CORRECT
- Uses actual 2024 IRS brackets
- FICA rates accurate
- Calculations verified

---

### 5. Budget Overview Widget ✓
**Status:** FIXED (corrected in previous iteration)
- Now correctly uses after-tax income
- Median expenditures properly calculated
- Disposable income = after-tax income - expenses ✓

---

## Summary of Median vs Mean Issues

### Currently Using MEDIAN (Correct):
- ✅ Household income ($74,580)
- ✅ Individual income (~$44,000)
- ✅ Net worth ($192,900)
- ✅ Debt levels ($67,000)
- ✅ Budget expenses (BLS median values)

### Currently Using AVERAGE/MEAN (Should Note):
- ⚠️ Car ownership costs ($1,015/month) - AAA average, not median
  - Median is likely lower (~$800/month)
- ⚠️ Public transit costs ($95/month) - claimed as average
  - Actually reasonable for median monthly pass

### Currently Using SAMPLE DATA:
- ⚠️ Rent trends (lines 45-58 in HousingAffordability.jsx)
  - Currently hardcoded estimates
  - Should note as "illustrative" or pull from real source

---

## Critical Fix Needed

**Housing Affordability - Affordable Rent Calculation**

Current (WRONG):
- Affordable rent = 30% of PRE-TAX income
- $74,580 × 0.30 / 12 = $1,857/month

Correct (SHOULD BE):
- Affordable rent = 30% of AFTER-TAX income
- $74,580 × 0.82 × 0.30 / 12 = $1,524/month

This is a $333/month difference and significantly changes the housing affordability analysis!

---

## Recommended Actions

1. **Immediate Fix:** Housing affordable rent calculation
2. **Add disclaimers:** Note where we use average vs median
3. **Label sample data:** Make it clear when data is illustrative
4. **Consider adding:** Median car costs (lower than AAA average)

---

## Data Source Verification

### Verified Accurate:
- ✅ Census median income: $74,580 (2022 ACS)
- ✅ Federal minimum wage: $7.25
- ✅ Federal poverty level: $15,060 (2024)
- ✅ 2024 Tax brackets and FICA rates
- ✅ Federal Reserve net worth: $192,900 median

### Needs Source Citation:
- ⚠️ Rent trends - currently sample data
- ⚠️ Individual income $44,000 - reasonable estimate but should cite
- ⚠️ BLS Consumer Expenditure median values - should link to source

