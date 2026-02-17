import React, { useState } from 'react'
import './App.css'
import BudgetOverview from './components/BudgetOverview'
import HousingAffordability from './components/HousingAffordability'
import WageAnalysis from './components/WageAnalysis'
import TaxBurden from './components/TaxBurden'
import TransportationCosts from './components/TransportationCosts'
import PolicyComparison from './components/PolicyComparison'
import NationalEconomy from './components/NationalEconomy'
import FoodCosts from './components/FoodCosts'
import HealthcareCosts from './components/HealthcareCosts'
import ChildcareEducation from './components/ChildcareEducation'
import WealthInequality from './components/WealthInequality'
import AffordabilityStressTest from './components/AffordabilityStressTest'
import ResearchLibrary from './components/ResearchLibrary'
import { usePolicyData, useDerivedMetrics } from './hooks/usePolicyData'

function App() {
  const [activeTab, setActiveTab] = useState('budget')
  const { data, loading, error, lastUpdated, refresh } = usePolicyData()
  const metrics = useDerivedMetrics(data)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Policy Analytics Dashboard</h1>
        <p className="subtitle">Affordability & Cost of Living Analysis - US Federal Data</p>
        {lastUpdated && (
          <p className="data-info">
            Data updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString()}
            <button className="refresh-btn" onClick={refresh} disabled={loading}>
              {loading ? '↻ Loading...' : '↻ Refresh Data'}
            </button>
          </p>
        )}
      </header>

      {error && (
        <div className="error-banner">
          Error loading data: {error}. Some features may show sample data.
        </div>
      )}

      {/* Grouped navigation — two logical sections for easier scanning */}
      <nav className="tab-nav">
        {/* Section 1: Dashboard & Tools */}
        <div className="tab-group">
          <span className="tab-group-label">Dashboard</span>
          {[
            { id: 'budget',     label: 'Budget Overview' },
            { id: 'calculator', label: 'Stress Test' },
            { id: 'economy',    label: 'National Economy' },
            { id: 'policy',     label: 'Policy Comparison' },
            { id: 'research',   label: 'Research Library' },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={activeTab === id ? 'active' : ''}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="tab-group-divider" aria-hidden="true" />

        {/* Section 2: Policy Sectors */}
        <div className="tab-group">
          <span className="tab-group-label">Policy Sectors</span>
          {[
            { id: 'housing',       label: 'Housing' },
            { id: 'wages',         label: 'Wages' },
            { id: 'taxes',         label: 'Taxes' },
            { id: 'transportation',label: 'Transportation' },
            { id: 'food',          label: 'Food & Groceries' },
            { id: 'healthcare',    label: 'Healthcare' },
            { id: 'childcare',     label: 'Childcare & Education' },
            { id: 'wealth',        label: 'Wealth & Inequality' },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={activeTab === id ? 'active' : ''}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="app-main">
        {loading && !data.income ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading federal policy data from Census Bureau, BLS, HUD...</p>
          </div>
        ) : (
          <>
            {activeTab === 'budget' && <BudgetOverview data={data} metrics={metrics} />}
            {activeTab === 'calculator' && <AffordabilityStressTest />}
            {activeTab === 'economy' && <NationalEconomy />}
            {activeTab === 'policy' && <PolicyComparison data={data} metrics={metrics} />}
            {activeTab === 'housing' && <HousingAffordability data={data} metrics={metrics} />}
            {activeTab === 'wages' && <WageAnalysis data={data} metrics={metrics} />}
            {activeTab === 'taxes' && <TaxBurden data={data} metrics={metrics} />}
            {activeTab === 'transportation' && <TransportationCosts data={data} metrics={metrics} />}
            {activeTab === 'food' && <FoodCosts data={data} metrics={metrics} />}
            {activeTab === 'healthcare' && <HealthcareCosts data={data} metrics={metrics} />}
            {activeTab === 'childcare' && <ChildcareEducation data={data} metrics={metrics} />}
            {activeTab === 'wealth' && <WealthInequality data={data} metrics={metrics} />}
            {activeTab === 'research' && <ResearchLibrary />}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Policy Analytics Dashboard - Built for evidence-based policy analysis</p>
        <p className="data-sources">
          Data sources: U.S. Census Bureau, Bureau of Labor Statistics, HUD, Department of Labor
          <br/>
          Policy research: EPI, CBPP, CAP, Roosevelt Institute, Demos, CLASP, Brookings, Pew Research
          <br/>
          <em style={{fontSize: '0.85rem', color: '#999'}}>
            Independent educational tool. Not affiliated with EPI, MIT, or any research institution.
          </em>
        </p>
      </footer>
    </div>
  )
}

export default App
