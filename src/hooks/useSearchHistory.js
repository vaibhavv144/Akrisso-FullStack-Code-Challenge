import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'github-dev-search-history'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore quota errors */
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function useSearchHistory() {
  const [items, setItems] = useState(() => load())

  useEffect(() => {
    save(items)
  }, [items])

  const addEntry = useCallback((entry) => {
      const now = Date.now()
      setItems((prev) => {
        const last = prev[0]
        if (
          last &&
          last.query === entry.query &&
          last.success === entry.success &&
          now - new Date(last.createdAt).getTime() < 1500
        ) {
          return prev
        }
        const id = makeId()
        const createdAt = new Date().toISOString()
        const row = {
          id,
          createdAt,
          favourite: false,
          query: entry.query,
          success: entry.success,
          errorMessage: entry.errorMessage,
          totalCount: entry.totalCount,
          sampleUsers: entry.sampleUsers,
        }
        return [row, ...prev]
      })
      return null
    },
    []
  )

  const removeEntry = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const toggleFavourite = useCallback((id) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, favourite: !x.favourite } : x))
    )
  }, [])

  return {
    items,
    addEntry,
    removeEntry,
    toggleFavourite,
  }
}
