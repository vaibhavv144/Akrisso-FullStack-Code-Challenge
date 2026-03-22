import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchUsers } from '../api/github'
import { useSearchHistoryContext } from '../hooks/useSearchHistoryContext'

export function Search() {
  const [params, setParams] = useSearchParams()
  const qParam = params.get('q') ?? ''
  const [query, setQuery] = useState(qParam)
  const [loading, setLoading] = useState(!!qParam.trim())
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const { addEntry } = useSearchHistoryContext()

  useEffect(() => {
    setQuery(qParam)
  }, [qParam])

  useEffect(() => {
    const q = qParam.trim()
    if (!q) {
      setResults(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setResults(null)

    ;(async () => {
      const res = await searchUsers(q)
      if (cancelled) return

      if (res.ok && res.data) {
        const items = res.data.items || []
        setResults(items)
        addEntry({
          query: q,
          success: true,
          totalCount: res.data.total_count,
          sampleUsers: items.slice(0, 8).map((u) => ({
            login: u.login,
            avatar_url: u.avatar_url,
          })),
        })
      } else {
        setError(res.errorMessage || 'Search failed.')
        addEntry({
          query: q,
          success: false,
          errorMessage: res.errorMessage || 'Search failed.',
        })
      }
      if (!cancelled) setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [qParam, addEntry])

  function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    if (q) setParams({ q })
    else setParams({})
  }

  return (
    <div className="page search-page">
      <h1>Search GitHub users</h1>
      <p className="lede">
        Uses the public{' '}
        <a
          href="https://docs.github.com/en/rest/search/search#search-users"
          target="_blank"
          rel="noreferrer"
        >
          GitHub Search Users API
        </a>
        . Unauthenticated requests are rate-limited to 10 per minute.
      </p>

      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="user-search" className="sr-only">
          Search query
        </label>
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="user-search"
            type="search"
            className="search-input"
            placeholder="e.g. location:London tom"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Searching\u2026' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="banner error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          {error}
        </div>
      )}

      {loading && qParam.trim() && (
        <div className="loading-indicator" aria-live="polite">
          <span className="spinner" />
          Searching GitHub\u2026
        </div>
      )}

      {!loading && results && (
        <section className="results" aria-live="polite">
          <h2 className="results-heading">
            <span className="results-count">{results.length}</span>
            user{results.length === 1 ? '' : 's'} found
          </h2>
          {results.length === 0 ? (
            <p className="muted">No users match this query.</p>
          ) : (
            <ul className="user-list">
              {results.map((u) => (
                <li key={u.id} className="user-row">
                  <img
                    src={u.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    className="avatar"
                  />
                  <div className="user-meta">
                    <Link to={`/user/${encodeURIComponent(u.login)}`} className="user-login">
                      {u.login}
                    </Link>
                    {u.type && <span className="badge subtle">{u.type}</span>}
                  </div>
                  <Link
                    to={`/user/${encodeURIComponent(u.login)}`}
                    className="btn ghost small"
                  >
                    View profile
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
