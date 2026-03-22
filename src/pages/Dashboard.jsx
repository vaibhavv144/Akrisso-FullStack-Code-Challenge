import { Link } from 'react-router-dom'
import { useSearchHistoryContext } from '../hooks/useSearchHistoryContext'

export function Dashboard() {
  const { items } = useSearchHistoryContext()

  const totalSearches = items.length
  const successful = items.filter((i) => i.success).length
  const favourites = items.filter((i) => i.favourite).length

  return (
    <div className="page dashboard">
      <div className="dashboard-hero">
        <span className="dashboard-tag">// GITHUB EXPLORER V1.0</span>
        <div className="hero-titles">
          <h1>Explore</h1>
          <span className="hero-line-stroke">GitHub</span>
          <span className="hero-line-solid">Profiles</span>
        </div>
        <p className="dashboard-lede">
          Search, track, and explore public GitHub profiles with full history of your past lookups.
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-number">{totalSearches}</span>
          <span className="stat-name">Total Searches</span>
        </div>
        <div className="stat-box">
          <span className="stat-number stat-number--ok">{successful}</span>
          <span className="stat-name">Successful</span>
        </div>
        <div className="stat-box">
          <span className="stat-number stat-number--fav">{favourites}</span>
          <span className="stat-name">Favourites</span>
        </div>
      </div>

      <div className="card-grid">
        <Link to="/search" className="dash-card">
          <div className="dash-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h2>Search Users</h2>
          <p>Look up any GitHub username and view their full public profile.</p>
          <div className="dash-card-footer">
            <svg className="dash-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </Link>
        <Link to="/history" className="dash-card">
          <div className="dash-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2>Search History</h2>
          <p>Browse all past lookups and sort results.</p>
          <div className="dash-card-footer">
            <svg className="dash-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  )
}
