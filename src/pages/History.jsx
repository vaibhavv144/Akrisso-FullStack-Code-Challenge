import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchHistoryContext } from '../hooks/useSearchHistoryContext'

function sortItems(items, mode) {
  const copy = [...items]
  if (mode === 'newest') {
    copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (mode === 'oldest') {
    copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else {
    copy.sort((a, b) =>
      a.query.localeCompare(b.query, undefined, { sensitivity: 'base' })
    )
  }
  return copy
}

export function History() {
  const { items, removeEntry, toggleFavourite } = useSearchHistoryContext()
  const [sortMode, setSortMode] = useState('newest')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'favourites') return items.filter((i) => i.favourite)
    if (filter === 'successful') return items.filter((i) => i.success)
    if (filter === 'failed') return items.filter((i) => !i.success)
    return items
  }, [items, filter])

  const rows = useMemo(
    () => sortItems(filtered, sortMode),
    [filtered, sortMode]
  )

  const favCount = items.filter((i) => i.favourite).length

  return (
    <div className="page history-page">
      <h1>Search history</h1>
      <p className="lede">
        Past searches are saved in your browser. Star your favourites for quick access.
      </p>

      <div className="toolbar">
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            className={`filter-tab fav-tab ${filter === 'favourites' ? 'active' : ''}`}
            onClick={() => setFilter('favourites')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Favourites ({favCount})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'successful' ? 'active' : ''}`}
            onClick={() => setFilter('successful')}
          >
            Successful
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'failed' ? 'active' : ''}`}
            onClick={() => setFilter('failed')}
          >
            Failed
          </button>
        </div>

        <div className="toolbar-right">
          <label htmlFor="sort-history" className="toolbar-label">
            Sort
          </label>
          <select
            id="sort-history"
            className="select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name (A{'\u2013'}Z)</option>
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="muted empty-hint">
          {filter === 'all'
            ? <>No searches yet. <Link to="/search">Try a search</Link> to get started.</>
            : <>No {filter} searches found.</>
          }
        </p>
      ) : (
        <ul className="history-list">
          {rows.map((row) => (
            <li key={row.id} className={`history-card ${row.favourite ? 'history-card--fav' : ''}`}>
              <div className="history-top">
                <button
                  type="button"
                  className={`fav-btn ${row.favourite ? 'on' : ''}`}
                  onClick={() => toggleFavourite(row.id)}
                  aria-pressed={row.favourite}
                  title={row.favourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                  {row.favourite ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  )}
                </button>
                <div className="history-query">
                  <Link to={`/search?q=${encodeURIComponent(row.query)}`}>
                    {row.query}
                  </Link>
                </div>
                <span
                  className={`status-pill ${row.success ? 'ok' : 'bad'}`}
                >
                  {row.success ? 'Success' : 'Failed'}
                </span>
              </div>

              <div className="history-meta">
                <time dateTime={row.createdAt}>
                  {new Date(row.createdAt).toLocaleString()}
                </time>
                {row.success && row.totalCount != null && (
                  <span>{row.totalCount.toLocaleString()} total matches</span>
                )}
                {!row.success && row.errorMessage && (
                  <span className="error-inline">{row.errorMessage}</span>
                )}
              </div>

              {row.success && row.sampleUsers?.length > 0 && (
                <div className="sample-users">
                  <span className="sample-label">Open profile</span>
                  <ul className="chip-list">
                    {row.sampleUsers.map((u) => (
                      <li key={u.login}>
                        <Link
                          to={`/user/${encodeURIComponent(u.login)}`}
                          className="chip"
                        >
                          <img src={u.avatar_url} alt="" width={20} height={20} />
                          {u.login}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="history-actions">
                <button
                  type="button"
                  className="btn danger ghost small"
                  onClick={() => removeEntry(row.id)}
                >
                  Clear from history
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
