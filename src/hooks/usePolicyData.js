import { useState, useEffect } from 'react';
import {
  fetchIncomeData,
  fetchCPIData,
  fetchHousingData,
  fetchLivingWageData,
  getFederalMinimumWage,
  calculateTaxBurden,
  getTransportationCosts,
  clearDataCache
} from '../services/dataService';

/**
 * Custom hook to fetch and manage policy data from federal sources
 * Handles loading states, errors, and data refreshing
 */
export function usePolicyData() {
  const [data, setData] = useState({
    income: null,
    cpi: null,
    housing: null,
    livingWage: null,
    minimumWage: null,
    transportation: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data sources in parallel for better performance
      const [income, cpi, housing, livingWage] = await Promise.all([
        fetchIncomeData(),
        fetchCPIData(),
        fetchHousingData(),
        fetchLivingWageData()
      ]);

      // Get static/calculated data
      const minimumWage = getFederalMinimumWage();
      const transportation = getTransportationCosts();

      setData({
        income,
        cpi,
        housing,
        livingWage,
        minimumWage,
        transportation
      });

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error loading policy data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const refresh = async () => {
    clearDataCache();
    await loadData();
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

/**
 * Hook for calculating derived metrics
 */
export function useDerivedMetrics(policyData) {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    if (!policyData.income || !policyData.livingWage) return;

    const medianIncome = policyData.income.medianHouseholdIncome;
    const livingWageHourly = policyData.livingWage.hourlyLivingWage;
    const minWageHourly = policyData.minimumWage.hourlyRate;

    // Calculate wage gap
    const wageGap = ((livingWageHourly - minWageHourly) / livingWageHourly) * 100;

    // Calculate tax burdens at different income levels
    const incomeLevels = [
      { label: '<$25k', income: 20000 },
      { label: '$25k-$50k', income: 37500 },
      { label: '$50k-$75k', income: 62500 },
      { label: '$75k-$100k', income: 87500 },
      { label: '$100k-$200k', income: 150000 },
      { label: '>$200k', income: 300000 }
    ];

    const taxBurdens = incomeLevels.map(level => ({
      ...level,
      ...calculateTaxBurden(level.income)
    }));

    // Calculate housing burden (assuming 30% threshold)
    const housingAffordabilityThreshold = 0.30;

    setMetrics({
      wageGap: Math.round(wageGap * 10) / 10,
      taxBurdens,
      housingAffordabilityThreshold,
      federalMinimumWageAnnual: minWageHourly * 2080,
      livingWageAnnual: livingWageHourly * 2080,
      medianIncome
    });
  }, [policyData]);

  return metrics;
}
