import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SearchHistoryProvider } from './context/SearchHistoryProvider'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'
import { Profile } from './pages/Profile'
import { Search } from './pages/Search'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <SearchHistoryProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="search" element={<Search />} />
            <Route path="history" element={<History />} />
            <Route path="user/:login" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SearchHistoryProvider>
    </BrowserRouter>
  )
}
