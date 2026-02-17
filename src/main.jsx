import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Register Chart.js elements once, before any component renders
import './utils/chartConfig'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
