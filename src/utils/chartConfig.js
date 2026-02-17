/**
 * Centralized Chart.js Configuration
 *
 * This file is the single place where Chart.js elements are registered,
 * and where shared chart options and colors are defined.
 *
 * Import this file once (in main.jsx) and Chart.js is ready for all components.
 * Components can also import the shared options/colors directly from here.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// ── Register ALL Chart.js elements once, globally ──────────────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,   // Required for Doughnut / Pie charts
  Title,
  Tooltip,
  Legend,
  Filler        // Required for area-fill on line charts
);

// ── Brand / theme colors ────────────────────────────────────────────────────
export const CHART_COLORS = {
  primary:    '#667eea',
  secondary:  '#764ba2',
  success:    '#22c55e',
  danger:     '#ef4444',
  warning:    '#f97316',
  yellow:     '#eab308',
  info:       '#4facfe',
  teal:       '#10b981',
  pink:       '#f093fb',
  peach:      '#fad0c4',

  // Semi-transparent versions for fills
  primaryAlpha:   'rgba(102, 126, 234, 0.1)',
  successAlpha:   'rgba(34, 197, 94, 0.1)',
  dangerAlpha:    'rgba(239, 68, 68, 0.1)',
  warningAlpha:   'rgba(249, 115, 22, 0.1)',
};

// Ordered palette for multi-series bar / doughnut charts
export const PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.pink,
  CHART_COLORS.info,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.yellow,
];

// ── Shared chart option presets ─────────────────────────────────────────────

/**
 * Standard options for bar and line charts
 * Usage: <Bar options={BAR_OPTIONS} ... />
 */
export const BAR_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: 'top' }
  },
  scales: {
    y: { beginAtZero: true }
  }
};

/**
 * Same as BAR_OPTIONS but y-axis is capped at 100 (for percentage charts)
 */
export const PERCENT_BAR_OPTIONS = {
  ...BAR_OPTIONS,
  scales: {
    y: { beginAtZero: true, max: 100 }
  }
};

/**
 * Options for Doughnut / Pie charts
 */
export const PIE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: 'right' }
  }
};

/**
 * Options for line charts – identical to BAR_OPTIONS but exported
 * separately so it's easy to add line-specific settings later.
 */
export const LINE_OPTIONS = { ...BAR_OPTIONS };
