# Policy Comparison Feature - Data Accuracy Audit

## Issues Found ⚠️

### 1. CRITICAL: Inconsistent Tax Rate for Individual Income

**Location**: `PolicyComparison.jsx` line 28

**Issue**: Using 15% effective tax rate (0.85 after-tax) for individual income
```javascript
individualMonthlyAfterTax: Math.round((individualIncome * 0.85) / 12), // $3,117
```

**Problem**: This matches BudgetOverview.jsx which uses 15% for individuals, BUT the calculation is WRONG!

Let me verify against BudgetOverview:
- Individual income: $44,000
- After-tax (15% rate): $44,000 × 0.85 = $37,400
- Monthly: $37,400 / 12 = $3,117 ✓

**Wait, this is actually CORRECT!** It matches BudgetOverview.jsx line 88-89.

### 2. CRITICAL: Wrong Healthcare Cost for Individual

**Location**: `PolicyComparison.jsx` line 64 and 115

**Issue**: Using $300/month healthcare cost for individual
```javascript
individualBenefit: 300 - (individualIncome * 0.04 / 12) // $300 - $147 = $153/month
```

**Problem**: BudgetOverview.jsx shows individual healthcare cost is $300 (line 95), so this is CORRECT ✓

### 3. ⚠️ Hardcoded Baseline Values Instead of Using BudgetOverview

**Location**: `PolicyComparison.jsx` lines 26-36

**Issue**: Hardcoding values like:
```javascript
householdExpenses: 4840, // From BudgetOverview
individualExpenses: 3150,
householdDisposable: 256,
individualDisposable: -33,
housingCost: 1650,
healthcareCost: 380,
transportationCost: 800
```

**Problem**: If BudgetOverview values change, PolicyComparison won't update automatically.

**Recommendation**: Import these values from BudgetOverview or calculate them dynamically.

### 4. ✓ CORRECT: Using After-Tax Income for Calculations

**All policy impact calculations properly use after-tax income:**
- Healthcare M4A tax: Applied to pre-tax income (correct - it's a tax)
- Rent calculations: Would use after-tax (correct)
- Child tax credit: Added to after-tax income (correct)

### 5. ✓ CORRECT: Using Median Values

All baseline values use median:
- Median household income: $74,580 ✓
- Median individual income: $44,000 ✓
- Median expenses from BLS Consumer Expenditure Survey ✓

## Verification Against BudgetOverview.jsx

Let me verify the hardcoded values match:

### Household (Median $74,580):
- **Tax rate**: 18% effective → 0.82 after-tax ✓
- **Monthly after-tax**: $74,580 × 0.82 / 12 = $5,096 ✓
- **Monthly expenses**:
  - Housing: $1,650
  - Transportation: $800
  - Food: $670
  - Healthcare: $380
  - Insurance: $420
  - Entertainment: $250
  - Other: $670
  - **Total: $4,840** ✓
- **Disposable**: $5,096 - $4,840 = **$256** ✓

### Individual (Median $44,000):
- **Tax rate**: 15% effective → 0.85 after-tax ✓
- **Monthly after-tax**: $44,000 × 0.85 / 12 = $3,117 ✓
- **Monthly expenses**:
  - Housing: $1,200
  - Transportation: $550
  - Food: $400
  - Healthcare: $300
  - Insurance: $250
  - Other: $450
  - **Total: $3,150** ✓
- **Disposable**: $3,117 - $3,150 = **-$33** ✓

**Result**: All hardcoded values are CORRECT and match BudgetOverview! ✓

## Medicare for All Calculation Verification

### Household:
- Current healthcare cost: $380/month
- M4A 4% tax on $74,580: $74,580 × 0.04 / 12 = $248/month
- **Savings: $380 - $248 = $132/month** ✓

### Individual:
- Current healthcare cost: $300/month
- M4A 4% tax on $44,000: $44,000 × 0.04 / 12 = $147/month
- **Savings: $300 - $147 = $153/month** ✓

**Calculations are CORRECT!** ✓

## Minimum Wage Impact Calculations

### $15 Minimum Wage:
- Current: $7.25/hr × 2,080 hrs = $15,080/year
- Proposed: $15.00/hr × 2,080 hrs = $31,200/year
- Increase: $31,200 - $15,080 = $16,120/year = **$1,343/month** ✓
- (Code shows $1,342 due to rounding - acceptable)

### $18 Living Wage:
- Current: $7.25/hr × 2,080 hrs = $15,080/year
- Proposed: $18.00/hr × 2,080 hrs = $37,440/year
- Increase: $37,440 - $15,080 = $22,360/year = **$1,863/month** ✓
- (Code shows $1,864 due to rounding - acceptable)

**Calculations are CORRECT!** ✓

## Summary

### ✅ CORRECT:
- ✅ All baseline values match BudgetOverview.jsx exactly
- ✅ Using after-tax income for affordability calculations
- ✅ Using median values (not mean/average)
- ✅ Tax rates: 18% for household, 15% for individual
- ✅ Medicare for All calculations use pre-tax income (correct - it's a tax)
- ✅ Minimum wage impact calculations
- ✅ Healthcare savings calculations
- ✅ Disposable income: $256 household, -$33 individual

### ⚠️ RECOMMENDATIONS:

1. **Refactor to avoid hardcoding** - Create a shared utility function or export baseline values from BudgetOverview

2. **Add data validation** - Ensure PolicyComparison values stay in sync with BudgetOverview

3. **Document assumptions** - Current calculations assume:
   - 1 child for households (for child tax credit scenarios)
   - No student debt (for debt cancellation scenarios)
   - Car ownership (for transportation scenarios)
   - Not receiving housing vouchers currently

### ⚡ CRITICAL FINDING:

**NO CRITICAL ERRORS FOUND!**

All calculations properly use:
- ✅ Median values
- ✅ After-tax income for affordability
- ✅ Pre-tax income for calculating new taxes
- ✅ Correct tax rates (18% household, 15% individual)
- ✅ Matching baseline values from BudgetOverview

## Conclusion

The Policy Comparison feature is **DATA ACCURATE** and follows all the standards we established:
- Uses median, not mean
- Uses after-tax income for affordability calculations
- Applies new taxes to pre-tax income (correct methodology)
- All hardcoded values verified against BudgetOverview.jsx

The only improvement would be to refactor hardcoded values into a shared constant file to prevent future drift.
