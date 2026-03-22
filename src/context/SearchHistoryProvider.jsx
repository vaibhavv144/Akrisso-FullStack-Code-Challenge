import { SearchHistoryContext } from './searchHistoryContext'
import { useSearchHistory } from '../hooks/useSearchHistory'

export function SearchHistoryProvider({ children }) {
  const value = useSearchHistory()
  return (
    <SearchHistoryContext.Provider value={value}>
      {children}
    </SearchHistoryContext.Provider>
  )
}
