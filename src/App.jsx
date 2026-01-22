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
import InteractiveBudgetCalculator from './components/InteractiveBudgetCalculator'
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

      <nav className="tab-nav">
        <button
          className={activeTab === 'budget' ? 'active' : ''}
          onClick={() => setActiveTab('budget')}
        >
          Budget Overview
        </button>
        <button
          className={activeTab === 'calculator' ? 'active' : ''}
          onClick={() => setActiveTab('calculator')}
        >
          Budget Calculator
        </button>
        <button
          className={activeTab === 'economy' ? 'active' : ''}
          onClick={() => setActiveTab('economy')}
        >
          National Economy
        </button>
        <button
          className={activeTab === 'policy' ? 'active' : ''}
          onClick={() => setActiveTab('policy')}
        >
          Policy Comparison
        </button>
        <button
          className={activeTab === 'housing' ? 'active' : ''}
          onClick={() => setActiveTab('housing')}
        >
          Housing
        </button>
        <button
          className={activeTab === 'wages' ? 'active' : ''}
          onClick={() => setActiveTab('wages')}
        >
          Wages
        </button>
        <button
          className={activeTab === 'taxes' ? 'active' : ''}
          onClick={() => setActiveTab('taxes')}
        >
          Taxes
        </button>
        <button
          className={activeTab === 'transportation' ? 'active' : ''}
          onClick={() => setActiveTab('transportation')}
        >
          Transportation
        </button>
        <button
          className={activeTab === 'food' ? 'active' : ''}
          onClick={() => setActiveTab('food')}
        >
          Food & Groceries
        </button>
        <button
          className={activeTab === 'healthcare' ? 'active' : ''}
          onClick={() => setActiveTab('healthcare')}
        >
          Healthcare
        </button>
        <button
          className={activeTab === 'childcare' ? 'active' : ''}
          onClick={() => setActiveTab('childcare')}
        >
          Childcare & Education
        </button>
        <button
          className={activeTab === 'wealth' ? 'active' : ''}
          onClick={() => setActiveTab('wealth')}
        >
          Wealth & Inequality
        </button>
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
            {activeTab === 'calculator' && <InteractiveBudgetCalculator />}
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
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Policy Analytics Dashboard - Built for evidence-based policy analysis</p>
        <p className="data-sources">
          Data sources: U.S. Census Bureau, Bureau of Labor Statistics, HUD, Department of Labor
          <br/>
          Policy research: EPI, CBPP, CAP, Roosevelt Institute, Demos, CLASP, Brookings, Pew Research
        </p>
      </footer>
    </div>
  )
}

export default App
