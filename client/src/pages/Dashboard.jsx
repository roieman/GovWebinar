import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ClaimCard from '../components/ClaimCard'
import StatsBar from '../components/StatsBar'
import SearchBar from '../components/SearchBar'
import { claimTypes } from '../data/formFields'

const PAGE_SIZE = 30

const typeFilters = [
  { key: 'all', label: 'הכל' },
  ...Object.entries(claimTypes).map(([key, val]) => ({ key, label: val.label, icon: val.icon }))
]

export default function Dashboard() {
  const [claims, setClaims] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchClaims = useCallback((pageNum, append = false) => {
    const typeParam = filter !== 'all' ? `&type=${filter}` : ''
    const url = `/api/claims?page=${pageNum}&limit=${PAGE_SIZE}${typeParam}`

    if (append) setLoadingMore(true)
    else setLoading(true)

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (append) {
          setClaims(prev => [...prev, ...data.claims])
        } else {
          setClaims(data.claims)
        }
        setTotal(data.total)
        setPage(pageNum)
      })
      .catch(() => { if (!append) setClaims([]); })
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }, [filter])

  // Reset and fetch page 1 when filter changes
  useEffect(() => {
    if (searchResults) return
    fetchClaims(1, false)
  }, [filter, searchResults, fetchClaims])

  const handleLoadMore = () => {
    fetchClaims(page + 1, true)
  }

  const handleFilterChange = (key) => {
    if (searchResults) {
      // If search is active, apply type filter client-side
      setFilter(key)
      return
    }
    setFilter(key)
  }

  const handleFilterResults = (results, query) => {
    if (results === null) {
      setSearchResults(null)
      setSearchQuery('')
    } else {
      setSearchResults(results)
      setSearchQuery(query)
    }
  }

  const displayClaims = searchResults !== null ? searchResults : claims

  // When search is active, apply type filter on top of search results
  const filteredClaims = searchResults !== null && filter !== 'all'
    ? displayClaims.filter(c => c.type === filter)
    : displayClaims

  const hasMore = searchResults === null && claims.length < total

  // Count to display
  const displayTotal = searchResults !== null
    ? filteredClaims.length
    : total

  return (
    <div>
      <StatsBar />
      <SearchBar onFilterResults={handleFilterResults} />

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          {searchResults !== null ? 'תוצאות חיפוש' : 'רשימת תביעות'}
        </h2>
        <span className="text-sm text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
          {searchResults === null && claims.length < total
            ? `${claims.length} מתוך ${total} תביעות`
            : `${displayTotal} תביעות`
          }
        </span>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {typeFilters.map(f => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              filter === f.key
                ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {f.icon && <span className="ml-1.5">{f.icon}</span>}
            {f.label}
          </button>
        ))}
      </div>

      {loading && !searchResults ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">טוען תביעות...</p>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <svg className="w-16 h-16 mx-auto text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          {searchResults !== null ? (
            <>
              <p className="text-slate-500 text-lg font-medium mb-2">לא נמצאו תוצאות</p>
              <p className="text-slate-400 text-sm">נסה מילות חיפוש אחרות</p>
            </>
          ) : (
            <>
              <p className="text-slate-500 text-lg font-medium mb-2">אין תביעות עדיין</p>
              <p className="text-slate-400 text-sm mb-6">התחל על ידי הגשת תביעה חדשה</p>
              <Link
                to="/new"
                className="inline-block bg-gradient-to-l from-blue-900 to-blue-800 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-800 hover:to-blue-700 transition-all shadow-lg shadow-blue-900/20"
              >
                + הגשת תביעה חדשה
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClaims.map(claim => (
              <ClaimCard key={claim._id} claim={claim} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    טוען...
                  </>
                ) : (
                  <>
                    טען עוד ({total - claims.length} נותרו)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
