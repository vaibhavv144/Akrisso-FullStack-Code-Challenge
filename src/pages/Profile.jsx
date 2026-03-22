import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUser } from '../api/github'

export function Profile() {
  const { login } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      setUser(null)
      const res = await getUser(login || '')
      if (cancelled) return
      if (res.ok && res.data) setUser(res.data)
      else setError(res.errorMessage || 'Could not load user.')
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [login])

  if (loading) {
    return (
      <div className="page profile-page">
        <div className="loading-indicator">
          <span className="spinner" />
          Loading profile\u2026
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="page profile-page">
        <div className="banner error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          {error || 'User not found.'}
        </div>
        <p>
          <Link to="/search">Back to search</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page profile-page">
      <div className="profile-header">
        <img
          src={user.avatar_url}
          alt=""
          width={120}
          height={120}
          className="profile-avatar"
        />
        <div>
          <h1>{user.name || user.login}</h1>
          <p className="profile-login">
            <a href={user.html_url} target="_blank" rel="noreferrer">
              @{user.login}
            </a>
            {user.type && <span className="badge subtle">{user.type}</span>}
          </p>
        </div>
      </div>

      {user.bio && <p className="profile-bio">{user.bio}</p>}

      <div className="profile-details">
        {user.company && (
          <span className="profile-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
              <path d="M10 6h4" />
              <path d="M10 10h4" />
              <path d="M10 14h4" />
              <path d="M10 18h4" />
            </svg>
            {user.company}
          </span>
        )}
        {user.location && (
          <span className="profile-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {user.location}
          </span>
        )}
        {user.blog && (
          <span className="profile-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}>
              {user.blog}
            </a>
          </span>
        )}
      </div>

      <div className="profile-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Public repos</span>
          <span className="stat-value">{user.public_repos}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Followers</span>
          <span className="stat-value">{user.followers}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Following</span>
          <span className="stat-value">{user.following}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Joined</span>
          <span className="stat-value">
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString(undefined, {
                  dateStyle: 'medium',
                })
              : '\u2014'}
          </span>
        </div>
      </div>

      <div className="profile-back">
        <Link to="/search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Search
        </Link>
        <Link to="/history">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          History
        </Link>
      </div>
    </div>
  )
}
