import { useContext } from 'react'
import { SearchHistoryContext } from '../context/searchHistoryContext'

export function useSearchHistoryContext() {
  const ctx = useContext(SearchHistoryContext)
  if (!ctx) {
    throw new Error('useSearchHistoryContext must be used within SearchHistoryProvider')
  }
  return ctx
}
