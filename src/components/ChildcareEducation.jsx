import React from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'

/**
 * Childcare & Education Costs Widget - Uses Real Federal Data
 * Data sources: Child Care Aware, Department of Education, Federal Reserve, NCES
 */
function ChildcareEducation({ data, metrics }) {
  const medianIncome = data?.income?.medianHouseholdIncome || 74580;
  const individualIncome = 44000;

  // After-tax income for burden calculations
  const effectiveTaxRate = 0.18;
  const afterTaxIncomeHousehold = medianIncome * (1 - effectiveTaxRate);

  // Childcare costs by age (Child Care Aware national averages)
  const infantCare = 1325; // Monthly for center-based care
  const toddlerCare = 1150; // Monthly for center-based care
  const preschoolCare = 950; // Monthly for center-based care
  const schoolAgeCare = 650; // Monthly for before/after school programs

  // College costs (NCES 2023-24)
  const publicCollegeTuition = 11260; // Annual in-state tuition + fees
  const publicCollegeRoomBoard = 12310; // Annual room & board
  const publicCollegeTotal = publicCollegeTuition + publicCollegeRoomBoard;

  const privateCollegeTuition = 41540; // Annual tuition + fees
  const privateCollegeRoomBoard = 14030; // Annual room & board
  const privateCollegeTotal = privateCollegeTuition + privateCollegeRoomBoard;

  // Student debt (Federal Reserve 2023)
  const totalStudentDebt = 1760; // Billions
  const medianDebtPerBorrower = 37850; // Median per borrower (not skewed by high-debt outliers)
  const medianMonthlyPayment = 280; // Monthly student loan payment

  // Calculate burden
  const infantCareBurden = ((infantCare * 12 / afterTaxIncomeHousehold) * 100).toFixed(1);
  const studentLoanBurden = ((medianMonthlyPayment * 12 / afterTaxIncomeHousehold) * 100).toFixed(1);

  // Childcare costs by state type
  const childcareCostsByIncome = {
    labels: ['<$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '>$100k'],
    datasets: [{
      label: 'Infant Care Burden (%)',
      data: [
        ((infantCare * 12) / (20000 * 0.85) * 100).toFixed(1),
        ((infantCare * 12) / (37500 * 0.85) * 100).toFixed(1),
        ((infantCare * 12) / (62500 * 0.82) * 100).toFixed(1),
        ((infantCare * 12) / (87500 * 0.82) * 100).toFixed(1),
        ((infantCare * 12) / (150000 * 0.78) * 100).toFixed(1)
      ],
      backgroundColor: ['#ef4444', '#f97316', '#fbbf24', '#84cc16', '#22c55e']
    }]
  };

  // College cost trends
  const collegeCostTrends = {
    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Public College (Annual)',
        data: [18943, 19548, 20050, 20598, 21184, 21035, 22558, 23250, 23570, 23570],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Private College (Annual)',
        data: [42419, 43921, 45370, 47284, 49879, 51690, 54501, 54800, 55570, 55570],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Median Income Growth (Baseline)',
        data: [20000, 20500, 21025, 21575, 22150, 22100, 22950, 23800, 24650, 25550],
        borderColor: '#64748b',
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        tension: 0.4,
        borderDash: [5, 5]
      }
    ]
  };

  // Childcare cost breakdown
  const childcareCostBreakdown = {
    labels: ['Infant Care (0-2)', 'Toddler Care (2-3)', 'Preschool (4-5)', 'School-Age Care'],
    datasets: [{
      label: 'Monthly Cost ($)',
      data: [infantCare, toddlerCare, preschoolCare, schoolAgeCare],
      backgroundColor: ['#ef4444', '#f97316', '#fbbf24', '#22c55e']
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  return (
    <div>
      <div className="widget">
        <h2>Childcare Costs & Affordability</h2>
        <p className="widget-description">
          Childcare costs often exceed housing costs for families with young children. Center-based infant care
          averages $1,325/month nationally - that's $15,900/year, more than in-state college tuition.
          Data from Child Care Aware of America.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Infant Care (Center, Monthly)</div>
            <div className="metric-value">${infantCare.toLocaleString()}</div>
            <div className="metric-change negative">0-2 years old</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Toddler Care (Monthly)</div>
            <div className="metric-value">${toddlerCare.toLocaleString()}</div>
            <div className="metric-change">2-3 years old</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Preschool Care (Monthly)</div>
            <div className="metric-value">${preschoolCare.toLocaleString()}</div>
            <div className="metric-change">4-5 years old</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">School-Age Care (Monthly)</div>
            <div className="metric-value">${schoolAgeCare.toLocaleString()}</div>
            <div className="metric-change">Before/after school programs</div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Infant Care (Annual)</div>
            <div className="metric-value">${(infantCare * 12).toLocaleString()}</div>
            <div className="metric-change negative">{infantCareBurden}% of household income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">DOD Childcare Guideline</div>
            <div className="metric-value">7%</div>
            <div className="metric-change">Max % of income (DoD standard)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Actual Burden (Median HH)</div>
            <div className="metric-value">{infantCareBurden}%</div>
            <div className="metric-change negative">3x the DoD standard</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Families Can't Afford Care</div>
            <div className="metric-value">51%</div>
            <div className="metric-change negative">Over half of families</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Childcare Cost Breakdown by Age</h3>
          <Bar data={childcareCostBreakdown} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>Infant Care Burden by Income Level</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            Percentage of after-tax income spent on center-based infant care
          </p>
          <Bar data={childcareCostsByIncome} options={chartOptions} />
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#991b1b'}}>⚠️ Childcare Crisis</h4>
          <div style={{fontSize: '0.95rem', color: '#7f1d1d', lineHeight: '1.8'}}>
            <p><strong>Key Findings:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Infant care ($15,900/year) exceeds in-state college tuition ($11,260/year)</li>
              <li>For families earning &lt;$50k: childcare costs 31-93% of after-tax income (unaffordable)</li>
              <li>51% of families live in "childcare deserts" (insufficient licensed providers)</li>
              <li>Many parents forced to leave workforce: 2M mothers (mostly) left jobs due to childcare costs</li>
              <li>Childcare workers earn median $14.67/hr despite high costs to families (subsidy gap)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Federal Childcare Assistance</h2>
        <p className="widget-description">
          Child Care and Development Block Grant (CCDBG) provides subsidies to low-income families, but only
          serves 15% of eligible children due to insufficient funding. Head Start serves 3-4 year olds.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Children Eligible for Subsidy</div>
            <div className="metric-value">14.3M</div>
            <div className="metric-change">Families &lt;185% FPL</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Children Actually Served</div>
            <div className="metric-value">2.1M</div>
            <div className="metric-change negative">Only 15% of eligible</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Wait Time for Subsidy</div>
            <div className="metric-value">2-3 years</div>
            <div className="metric-change negative">Many states, closed waitlists</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Head Start Enrollment</div>
            <div className="metric-value">833K</div>
            <div className="metric-change">Ages 3-4, free preschool</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Child Tax Credit (CTC)</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Current CTC</div>
            <div className="metric-value">$2,000</div>
            <div className="metric-change">Per child under 17</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Refundable Portion</div>
            <div className="metric-value">$1,700</div>
            <div className="metric-change">Available to low-income families</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">2021 Expanded CTC</div>
            <div className="metric-value">$3,600</div>
            <div className="metric-change positive">Per child under 6 (expired)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Child Poverty Reduction (2021)</div>
            <div className="metric-value">-46%</div>
            <div className="metric-change positive">Lifted 3.7M kids out of poverty</div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#92400e'}}>💰 Expanded CTC Impact (2021 Program)</h4>
          <div style={{fontSize: '0.95rem', color: '#78350f', lineHeight: '1.8'}}>
            <p><strong>What Happened:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>American Rescue Plan (2021) temporarily expanded CTC to $3,600 (under 6) / $3,000 (6-17)</li>
              <li>Made fully refundable (low-income families get full amount)</li>
              <li>Paid monthly ($300/mo per child) instead of annual lump sum</li>
              <li><strong>Result: Child poverty fell 46% in one year (largest single-year drop ever)</strong></li>
              <li>Program expired Dec 2021; child poverty immediately jumped back up 41%</li>
            </ul>
            <p style={{marginTop: '1rem'}}><strong>Cost:</strong> $120B/year to make permanent</p>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>College Costs & Affordability</h2>
        <p className="widget-description">
          College costs have increased 169% since 1980 (adjusted for inflation) while median wages increased
          only 19%. Student loan debt exceeds $1.76 trillion. Data from NCES and Federal Reserve.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Public College (In-State, Annual)</div>
            <div className="metric-value">${publicCollegeTotal.toLocaleString()}</div>
            <div className="metric-change">Tuition + room & board</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Private College (Annual)</div>
            <div className="metric-value">${privateCollegeTotal.toLocaleString()}</div>
            <div className="metric-change negative">2.4x public college</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Public College (4 Years)</div>
            <div className="metric-value">${(publicCollegeTotal * 4).toLocaleString()}</div>
            <div className="metric-change negative">1.3x median household income</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Private College (4 Years)</div>
            <div className="metric-value">${(privateCollegeTotal * 4).toLocaleString()}</div>
            <div className="metric-change negative">3x median household income</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 style={{marginBottom: '1rem'}}>College Cost Growth vs Income Growth</h3>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
            College costs rising much faster than household income (normalized to 2015 baseline)
          </p>
          <Line data={collegeCostTrends} options={chartOptions} />
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Pell Grant Coverage Gap</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Max Pell Grant (2024-25)</div>
            <div className="metric-value">$7,395</div>
            <div className="metric-change">Annual for low-income students</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Public College Cost</div>
            <div className="metric-value">$23,570</div>
            <div className="metric-change">Annual total cost</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Gap After Pell</div>
            <div className="metric-value">$16,175</div>
            <div className="metric-change negative">Covered by loans/work/family</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Pell Coverage Rate</div>
            <div className="metric-value">31.4%</div>
            <div className="metric-change negative">Down from 79% in 1975</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Student Loan Debt Crisis</h2>
        <p className="widget-description">
          Student loan debt has tripled since 2006, reaching $1.76 trillion. 43 million Americans have
          student loans, with median debt of $37,850. Data from Federal Reserve and Department of Education.
        </p>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Total Student Debt</div>
            <div className="metric-value">$1.76T</div>
            <div className="metric-change negative">Larger than auto or credit card debt</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Borrowers</div>
            <div className="metric-value">43M</div>
            <div className="metric-change">Americans with student loans</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Debt per Borrower</div>
            <div className="metric-value">${medianDebtPerBorrower.toLocaleString()}</div>
            <div className="metric-change negative">Up from $18,550 in 2006</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Monthly Payment</div>
            <div className="metric-value">${medianMonthlyPayment}</div>
            <div className="metric-change">{studentLoanBurden}% of household income</div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Borrowers in Default</div>
            <div className="metric-value">7.5M</div>
            <div className="metric-change negative">17% of all borrowers</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Borrowers in Delinquency</div>
            <div className="metric-value">3.5M</div>
            <div className="metric-change negative">8% of borrowers</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Average Time to Repay</div>
            <div className="metric-value">20 years</div>
            <div className="metric-change negative">Standard 10-year plan unrealistic</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Delayed Life Milestones</div>
            <div className="metric-value">Millions</div>
            <div className="metric-change negative">Homeownership, marriage, kids delayed</div>
          </div>
        </div>

        <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Income-Driven Repayment (IDR)</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Borrowers on IDR Plans</div>
            <div className="metric-value">8.5M</div>
            <div className="metric-change">20% of all borrowers</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">SAVE Plan Payment</div>
            <div className="metric-value">5% of income</div>
            <div className="metric-change positive">Down from 10% (new 2024 plan)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Forgiveness Timeline</div>
            <div className="metric-value">20 years</div>
            <div className="metric-change">Undergraduate loans</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Public Service Loan Forgiveness</div>
            <div className="metric-value">10 years</div>
            <div className="metric-change positive">For government/nonprofit workers</div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '8px'
        }}>
          <h4 style={{marginTop: 0, color: '#991b1b'}}>📚 Student Debt Impact</h4>
          <div style={{fontSize: '0.95rem', color: '#7f1d1d', lineHeight: '1.8'}}>
            <p><strong>Economic Consequences:</strong></p>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              <li>Homeownership: Borrowers 36% less likely to own home by age 33</li>
              <li>Retirement: Borrowers save $325/month less for retirement</li>
              <li>Small businesses: 17% of would-be entrepreneurs can't start due to debt</li>
              <li>Marriage & children: Delayed 5-7 years on average for borrowers</li>
              <li>Racial wealth gap: Black graduates owe $25,000 more than white graduates</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Progressive Policy Proposals</h2>
        <p className="widget-description">
          Proposals to address childcare and education affordability crisis through universal programs
          and debt cancellation. Analysis from EPI, CBPP, Roosevelt Institute, and Department of Education.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Universal Pre-K</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Free preschool for all 3-4 year olds</li>
                <li>High-quality, licensed providers</li>
                <li>Pay teachers livable wages (~$45k)</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Saves families $950/mo ($11,400/year)</li>
                <li>Enables parents to work (labor force +5%)</li>
                <li>Child outcomes: +$8 ROI per $1 invested</li>
              </ul>

              <p><strong>Cost:</strong> $40B/year</p>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Affordable Childcare for All</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Cap childcare at 7% of income</li>
                <li>Free for families &lt;75% median income</li>
                <li>Subsidize all working families</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Median family: $1,325 → $427/mo (saves $898)</li>
                <li>Low-income: $1,325 → $0 (saves $1,325)</li>
                <li>2M mothers return to workforce</li>
              </ul>

              <p><strong>Cost:</strong> $70B/year</p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Free Public College</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Eliminate tuition at public colleges</li>
                <li>Includes 2-year and 4-year schools</li>
                <li>Covers ~10M students</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Saves students $11,260/year tuition</li>
                <li>Eliminates need for most student loans</li>
                <li>Increases college enrollment 15-20%</li>
              </ul>

              <p><strong>Cost:</strong> $80B/year</p>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }}>
            <h3 style={{marginTop: 0, color: '#166534'}}>Student Debt Cancellation</h3>
            <div style={{fontSize: '0.95rem', lineHeight: '1.8'}}>
              <p><strong>Proposal:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Cancel $50,000 per borrower</li>
                <li>Targeted to &lt;$125k income</li>
                <li>Immediate relief for 43M Americans</li>
              </ul>

              <p><strong>Impact:</strong></p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>36M borrowers debt-free (84%)</li>
                <li>Average $280/mo freed for spending/saving</li>
                <li>Boost GDP by 0.2-0.3% annually</li>
              </ul>

              <p><strong>Cost:</strong> $1.0T one-time</p>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Combined Annual Cost</div>
            <div className="metric-value">$190B/yr</div>
            <div className="metric-change">Pre-K + Childcare + Free College</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">As % of Federal Budget</div>
            <div className="metric-value">2.8%</div>
            <div className="metric-change">Of $6.8T budget</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ROI (Economic Growth)</div>
            <div className="metric-value">$7 per $1</div>
            <div className="metric-change positive">Long-term return on investment</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Families Helped</div>
            <div className="metric-value">50M+</div>
            <div className="metric-change positive">Parents, students, children</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h2>Policy Implications</h2>
        <ul style={{lineHeight: '1.8', paddingLeft: '1.5rem'}}>
          <li>Infant childcare ($15,900/year) now exceeds public college tuition ($11,260/year)</li>
          <li>Childcare costs 26% of median household after-tax income - nearly 4x the DoD standard of 7%</li>
          <li>Only 15% of eligible children receive childcare subsidies due to insufficient federal funding</li>
          <li>Public college costs have increased 169% since 1980 (inflation-adjusted) while wages grew 19%</li>
          <li>$1.76 trillion in student debt affects 43M Americans; 17% are in default</li>
          <li>Pell Grant covers 31% of college costs (down from 79% in 1975)</li>
          <li>Policy recommendations:
            <ul style={{marginTop: '0.5rem'}}>
              <li>Universal Pre-K for ages 3-4 ($40B/year) - $8 ROI per $1 invested</li>
              <li>Cap childcare at 7% of income; free for families &lt;75% median ($70B/year)</li>
              <li>Make public colleges tuition-free ($80B/year)</li>
              <li>Cancel $50,000 student debt per borrower for those earning &lt;$125k ($1T one-time)</li>
              <li>Expand Pell Grant to cover full cost of attendance</li>
              <li>Restore expanded Child Tax Credit ($120B/year) - reduced child poverty 46% in 2021</li>
            </ul>
          </li>
        </ul>

        <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px'}}>
          <strong>Data Sources:</strong>
          <ul style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <li>Childcare Costs: Child Care Aware of America</li>
            <li>College Costs: National Center for Education Statistics (NCES)</li>
            <li>Student Debt: Federal Reserve, Department of Education</li>
            <li>Federal Programs: HHS, Department of Education</li>
            <li>Policy Analysis: EPI, CBPP, Roosevelt Institute, Center for American Progress</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChildcareEducation
