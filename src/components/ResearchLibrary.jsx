import React, { useState, useEffect } from 'react'

/**
 * ResearchLibrary Component
 *
 * Manages academic and institutional research related to affordability,
 * cost of living, and quality of life policy issues.
 *
 * Features:
 * - Add research entries with full citation details
 * - Search and filter by topic, institution, year
 * - Tag research by policy area (housing, wages, healthcare, etc.)
 * - Export research library as JSON
 * - Import existing research collections
 * - Link research to specific dashboard metrics
 */

function ResearchLibrary() {
  // Load research from localStorage or initialize empty
  const [research, setResearch] = useState(() => {
    const saved = localStorage.getItem('policyResearchLibrary')
    return saved ? JSON.parse(saved) : []
  })

  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTopic, setFilterTopic] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc') // date-desc, date-asc, title

  // Form state for adding new research
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    institution: '',
    year: new Date().getFullYear(),
    publicationType: 'report', // report, paper, brief, working-paper
    url: '',
    doi: '',
    policyAreas: [], // housing, wages, healthcare, taxes, transportation, food, childcare, wealth
    keyFindings: '',
    methodology: '',
    dataSource: '',
    relevantMetrics: '', // Which dashboard metrics does this inform?
    notes: ''
  })

  // Policy area options (matching dashboard tabs)
  const policyAreas = [
    'Housing Affordability',
    'Wage Analysis',
    'Tax Policy',
    'Transportation',
    'Food Security',
    'Healthcare Costs',
    'Childcare & Education',
    'Wealth Inequality',
    'Overall Cost of Living',
    'Quality of Life Metrics'
  ]

  // Save to localStorage whenever research changes
  useEffect(() => {
    localStorage.setItem('policyResearchLibrary', JSON.stringify(research))
  }, [research])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle policy area checkbox changes
  const handlePolicyAreaChange = (area) => {
    setFormData(prev => ({
      ...prev,
      policyAreas: prev.policyAreas.includes(area)
        ? prev.policyAreas.filter(a => a !== area)
        : [...prev.policyAreas, area]
    }))
  }

  // Add new research entry
  const handleSubmit = (e) => {
    e.preventDefault()

    const newEntry = {
      id: Date.now(),
      ...formData,
      dateAdded: new Date().toISOString()
    }

    setResearch(prev => [newEntry, ...prev])

    // Reset form
    setFormData({
      title: '',
      authors: '',
      institution: '',
      year: new Date().getFullYear(),
      publicationType: 'report',
      url: '',
      doi: '',
      policyAreas: [],
      keyFindings: '',
      methodology: '',
      dataSource: '',
      relevantMetrics: '',
      notes: ''
    })

    setShowForm(false)
  }

  // Delete research entry
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this research entry?')) {
      setResearch(prev => prev.filter(item => item.id !== id))
    }
  }

  // Export research library as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(research, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `research-library-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  // Import research library from JSON
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result)
          if (Array.isArray(imported)) {
            setResearch(prev => [...imported, ...prev])
            alert(`Successfully imported ${imported.length} research entries`)
          } else {
            alert('Invalid file format. Please upload a valid research library JSON file.')
          }
        } catch (error) {
          alert('Error reading file: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

  // Filter and sort research
  const filteredResearch = research
    .filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keyFindings.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTopic = filterTopic === 'all' ||
        item.policyAreas.includes(filterTopic)

      return matchesSearch && matchesTopic
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return b.year - a.year
      if (sortBy === 'date-asc') return a.year - b.year
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })

  return (
    <div className="research-library">
      <div className="widget-header">
        <h2>📚 Research Library</h2>
        <p className="widget-description">
          Academic and institutional research on affordability, cost of living, and quality of life policy issues
        </p>
      </div>

      {/* Action Bar */}
      <div className="research-actions">
        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Research'}
        </button>

        <button
          className="secondary-btn"
          onClick={handleExport}
          disabled={research.length === 0}
        >
          ⬇ Export Library
        </button>

        <label className="import-btn">
          ⬆ Import Library
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>

        <div className="research-stats">
          <strong>{research.length}</strong> research entries
        </div>
      </div>

      {/* Add Research Form */}
      {showForm && (
        <form className="research-form" onSubmit={handleSubmit}>
          <h3>Add Research Entry</h3>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., The Cost of Unaffordable Housing in Major U.S. Cities"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Authors *</label>
              <input
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
                placeholder="e.g., Jane Smith, John Doe"
              />
            </div>

            <div className="form-group">
              <label>Institution *</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                required
                placeholder="e.g., Economic Policy Institute"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className="form-group">
              <label>Publication Type</label>
              <select
                name="publicationType"
                value={formData.publicationType}
                onChange={handleInputChange}
              >
                <option value="report">Research Report</option>
                <option value="paper">Academic Paper</option>
                <option value="brief">Policy Brief</option>
                <option value="working-paper">Working Paper</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label>DOI (if available)</label>
              <input
                type="text"
                name="doi"
                value={formData.doi}
                onChange={handleInputChange}
                placeholder="10.1234/example"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Policy Areas (select all that apply)</label>
            <div className="checkbox-grid">
              {policyAreas.map(area => (
                <label key={area} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.policyAreas.includes(area)}
                    onChange={() => handlePolicyAreaChange(area)}
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Key Findings *</label>
            <textarea
              name="keyFindings"
              value={formData.keyFindings}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Summarize the main findings and conclusions..."
            />
          </div>

          <div className="form-group">
            <label>Methodology</label>
            <textarea
              name="methodology"
              value={formData.methodology}
              onChange={handleInputChange}
              rows="3"
              placeholder="Brief description of research methods used..."
            />
          </div>

          <div className="form-group">
            <label>Data Source</label>
            <input
              type="text"
              name="dataSource"
              value={formData.dataSource}
              onChange={handleInputChange}
              placeholder="e.g., Census Bureau ACS, BLS CPI, HUD Fair Market Rents"
            />
          </div>

          <div className="form-group">
            <label>Relevant Dashboard Metrics</label>
            <input
              type="text"
              name="relevantMetrics"
              value={formData.relevantMetrics}
              onChange={handleInputChange}
              placeholder="e.g., Rent burden, median income, housing cost index"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="2"
              placeholder="Additional notes or context..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Save Research Entry
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search and Filter Bar */}
      <div className="research-filters">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search research by title, author, institution, or findings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
        >
          <option value="all">All Policy Areas</option>
          {policyAreas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="title">By Title (A-Z)</option>
        </select>
      </div>

      {/* Research List */}
      <div className="research-list">
        {filteredResearch.length === 0 ? (
          <div className="empty-state">
            <p>📖 No research entries found.</p>
            {research.length === 0 ? (
              <p>Click "Add Research" to start building your library.</p>
            ) : (
              <p>Try adjusting your search or filter criteria.</p>
            )}
          </div>
        ) : (
          filteredResearch.map(item => (
            <div key={item.id} className="research-card">
              <div className="research-header">
                <h3>{item.title}</h3>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="Delete entry"
                >
                  ✕
                </button>
              </div>

              <div className="research-meta">
                <span className="authors">{item.authors}</span>
                <span className="institution">{item.institution}</span>
                <span className="year">({item.year})</span>
                <span className="pub-type">{item.publicationType}</span>
              </div>

              {item.policyAreas.length > 0 && (
                <div className="policy-tags">
                  {item.policyAreas.map(area => (
                    <span key={area} className="policy-tag">{area}</span>
                  ))}
                </div>
              )}

              <div className="research-content">
                <div className="research-section">
                  <strong>Key Findings:</strong>
                  <p>{item.keyFindings}</p>
                </div>

                {item.methodology && (
                  <div className="research-section">
                    <strong>Methodology:</strong>
                    <p>{item.methodology}</p>
                  </div>
                )}

                {item.dataSource && (
                  <div className="research-section">
                    <strong>Data Source:</strong>
                    <p>{item.dataSource}</p>
                  </div>
                )}

                {item.relevantMetrics && (
                  <div className="research-section">
                    <strong>Dashboard Metrics:</strong>
                    <p>{item.relevantMetrics}</p>
                  </div>
                )}

                {item.notes && (
                  <div className="research-section">
                    <strong>Notes:</strong>
                    <p>{item.notes}</p>
                  </div>
                )}
              </div>

              <div className="research-footer">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="research-link"
                  >
                    🔗 View Full Research
                  </a>
                )}
                {item.doi && (
                  <a
                    href={`https://doi.org/${item.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="research-link"
                  >
                    📄 DOI: {item.doi}
                  </a>
                )}
                <span className="date-added">
                  Added: {new Date(item.dateAdded).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sample Research Suggestions */}
      {research.length === 0 && (
        <div className="sample-suggestions">
          <h3>💡 Suggested Research Sources</h3>
          <ul>
            <li><strong>Economic Policy Institute (EPI)</strong> - Living wage calculators, income inequality research</li>
            <li><strong>Center on Budget and Policy Priorities (CBPP)</strong> - Tax policy, safety net programs</li>
            <li><strong>Urban Institute</strong> - Housing policy, healthcare costs, social policy research</li>
            <li><strong>Brookings Institution</strong> - Economic mobility, workforce development</li>
            <li><strong>MIT Living Wage Calculator</strong> - Geographic cost of living calculations</li>
            <li><strong>Joint Center for Housing Studies (Harvard)</strong> - Housing affordability research</li>
            <li><strong>Kaiser Family Foundation</strong> - Healthcare costs and coverage</li>
            <li><strong>National Low Income Housing Coalition</strong> - Housing affordability gap analysis</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ResearchLibrary
