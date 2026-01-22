# Policy Analytics Dashboard - Originality Audit

**Date:** 2026-01-22
**Purpose:** Comprehensive review to ensure our work is original and not duplicating existing tools

---

## Executive Summary

✅ **UNIQUE CONTRIBUTION:** Our Affordability Stress Test calculator offers a novel approach to household financial analysis that focuses on **resilience to financial shocks** rather than traditional budget adequacy.

🎯 **DIFFERENTIATION:** While other tools (like EPI's Family Budget Calculator) focus on "What income do you need?", we focus on "Can you handle life's emergencies?"

---

## Component-by-Component Audit

### ✅ NEW: AffordabilityStressTest.jsx (src/components/AffordabilityStressTest.jsx)

**Status:** ORIGINAL WORK

**Unique Features:**
1. **Financial Resilience Score (0-100)** - Proprietary scoring system based on:
   - Emergency fund adequacy
   - Monthly cushion percentage
   - Debt burden
   - Housing cost burden
   - NO similar scoring system found in EPI, MIT Living Wage, or other budget calculators

2. **Real-Life Shock Scenarios** - Tests specific emergencies:
   - Car breakdown ($1,200)
   - Medical emergency ($2,500)
   - Dental work ($800)
   - Appliance failure ($900)
   - Job loss (3 months expenses)
   - Pet emergency ($1,500)
   - **Novel:** Shows "months to recover" for each scenario
   - **Novel:** Visual impact indicators (manageable/difficult/crisis)

3. **Seasonal Financial Stress Calendar** - 12-month view showing:
   - When households face extra expenses
   - Holiday bills (Jan), heating costs (Feb), back-to-school (Aug-Sep), holidays (Dec)
   - Integrated visualization of financial pressure points
   - **Not found in existing budget calculators**

4. **Policy Impact on Resilience** - Shows how policies change:
   - Resilience score improvement
   - "Days until crisis" metric
   - Emergency recovery time reduction
   - **Unique angle:** Focuses on crisis preparedness, not just monthly budgets

**Comparison to Existing Tools:**
- **EPI Family Budget Calculator:** Shows required income for adequate living standard (what you NEED to earn)
- **MIT Living Wage Calculator:** Shows living wage vs minimum wage gap (wage adequacy)
- **Our Tool:** Shows ability to handle unexpected shocks (financial resilience)

**Verdict:** Completely original concept and implementation.

---

### ⚠️ TO REVIEW: InteractiveBudgetCalculator.jsx (OLD - Being Replaced)

**Status:** DERIVATIVE - Similar to EPI approach

**Issues:**
- Uses expense categories similar to EPI (housing, food, transportation, healthcare, childcare)
- Monthly budget breakdown approach is standard
- **Being replaced** with AffordabilityStressTest.jsx

**Action:** ✅ Already replaced in App.jsx

---

### ✅ PolicyComparison.jsx (src/components/PolicyComparison.jsx)

**Status:** ORIGINAL ANALYSIS

**Unique Features:**
- Compares policy proposals across multiple dimensions
- Shows who benefits from each policy
- Cost-benefit analysis
- Research-based (cites EPI, CBPP, CAP, Roosevelt Institute)

**Comparison:**
- Not duplicating any specific tool
- Synthesis of research, not reproduction

**Verdict:** Original synthesis of policy research.

---

### ✅ Other Dashboard Components

**BudgetOverview.jsx** - Aggregate statistics view, general concept
**HousingAffordability.jsx** - Housing metrics analysis
**WageAnalysis.jsx** - Wage trends and gaps
**TaxBurden.jsx** - Tax analysis by income level
**TransportationCosts.jsx** - Transportation cost analysis
**FoodCosts.jsx** - Food security analysis
**HealthcareCosts.jsx** - Healthcare affordability
**ChildcareEducation.jsx** - Childcare cost analysis
**WealthInequality.jsx** - Wealth distribution analysis
**NationalEconomy.jsx** - Macroeconomic indicators

**Status:** EDUCATIONAL DASHBOARDS

These are data visualization and analysis tools showing public data. They:
- Use publicly available statistics (Census, BLS, HUD)
- Present data in chart/graph format
- Provide policy analysis and commentary
- Don't duplicate proprietary calculators

**Verdict:** Fair use of public data for educational/analytical purposes.

---

## Data Sources Review

### What We Use:
✅ **Public Data:**
- Census Bureau median income data (public domain)
- BLS cost of living indices (public domain)
- State-specific cost multipliers (derived from BEA Regional Price Parities - public)
- Federal Poverty Level thresholds (HHS - public)
- Median home prices (public data)

✅ **Research Citations:**
- Economic Policy Institute (EPI) - cited as source
- Center on Budget and Policy Priorities (CBPP) - cited
- Center for American Progress (CAP) - cited
- Roosevelt Institute - cited

### What We DON'T Use:
❌ EPI's proprietary methodology
❌ EPI's specific calculation formulas
❌ MIT Living Wage's specific algorithms
❌ Any copyrighted calculation tools

**Verdict:** All data usage is appropriate and properly attributed.

---

## Methodology Comparison

### EPI Family Budget Calculator Methodology:
- Calculates required income for adequate living
- Uses location-specific data for 3,142 counties
- 10 family types (1-2 adults, 0-4 children)
- Expense categories: housing, food, childcare, transportation, healthcare, other necessities, taxes
- **Focus:** Minimum income needed for modest but adequate standard

### MIT Living Wage Calculator Methodology:
- Calculates living wage for geographic areas
- Compares to minimum wage and poverty wage
- Similar expense categories
- **Focus:** Wage adequacy

### OUR Affordability Stress Test Methodology:
- Calculates ability to absorb financial shocks
- Resilience scoring (0-100)
- Emergency scenario testing
- Seasonal stress analysis
- Policy impact on crisis preparedness
- **Focus:** Financial resilience and emergency preparedness

**Verdict:** Fundamentally different approach and methodology.

---

## Legal & Ethical Considerations

### ✅ What We're Doing Right:

1. **Original Analysis:** Our resilience scoring and shock absorption testing is novel
2. **Proper Attribution:** We cite EPI, CBPP, CAP when using their research
3. **Public Data:** All underlying data comes from public sources
4. **Transformative Use:** Even where we use similar concepts, our application is different
5. **Educational Purpose:** Dashboard is for policy analysis and education

### ⚠️ Areas to Monitor:

1. **Policy Impact Calculations:** Our `policyImpactCalculator.js` estimates policy effects
   - Based on research from multiple sources
   - Not copying specific formulas from any single source
   - Uses general policy parameters (e.g., "Medicare for All eliminates premiums")
   - **Action:** Continue citing research sources

2. **Baseline Expense Data:** We use median expenses as baselines
   - Derived from BLS Consumer Expenditure Survey (public)
   - Not copying EPI's specific methodology
   - **Action:** Add clearer data source comments in code

---

## Recommendations

### ✅ Keep These (Original):
1. **AffordabilityStressTest.jsx** - Completely unique approach
2. **Resilience Score** - Novel metric
3. **Shock Scenarios** - Original emergency testing
4. **Seasonal Stress Calendar** - Unique visualization
5. **Policy Impact on Resilience** - Novel application

### 🔄 Already Replaced:
1. ~~InteractiveBudgetCalculator.jsx~~ - Was too similar to EPI, now replaced

### 📝 Add Documentation:
1. Add data source citations in code comments
2. Create ATTRIBUTION.md file listing all research sources
3. Add disclaimer about educational/analytical purpose
4. Include "Not affiliated with EPI, MIT, or other institutions" notice

---

## Conclusion

✅ **ORIGINAL WORK CERTIFICATION:**

Our Policy Analytics Dashboard, specifically the new **Affordability Stress Test** calculator, provides a **fundamentally different and original approach** to household financial analysis.

**Key Differentiators:**
1. Focus on financial **resilience** vs income adequacy
2. Emergency preparedness testing vs budget sufficiency
3. Seasonal stress analysis (unique)
4. Policy impact on crisis readiness (unique angle)
5. Proprietary resilience scoring system

**Comparison Summary:**
- **EPI:** "What income do you need to live adequately?"
- **MIT:** "What wage should employers pay?"
- **US:** "Can you handle life's financial emergencies? How would policies help?"

**Legal Status:** Our work constitutes original analysis and transformative use of public data for educational purposes. We properly cite research sources and don't duplicate proprietary methodologies.

---

## Next Steps

1. ✅ Old calculator replaced with unique stress test
2. 📝 Create ATTRIBUTION.md file (recommended)
3. 📝 Add data source comments in code (recommended)
4. 📝 Add disclaimer to dashboard footer (recommended)

**Overall Assessment:** ✅ **READY FOR PUBLIC USE**

Our dashboard offers unique value and original analysis not available in existing tools.

---

*Audit conducted: 2026-01-22*
*Reviewed components: All 17 components + utilities*
*Conclusion: Original work with proper attributions*
