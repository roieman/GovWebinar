import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { claimTypes } from '../data/formFields'
import StatusBadge from './StatusBadge'

export default function SearchBar({ onFilterResults }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchTime, setSearchTime] = useState(null)
  const [activeFilter, setActiveFilter] = useState('')
  const ref = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const doSearch = (q) => {
    if (!q.trim()) {
      setResults([])
      setOpen(false)
      setSearchTime(null)
      return Promise.resolve([])
    }
    setLoading(true)
    const start = performance.now()
    return fetch(`/api/claims/search?q=${encodeURIComponent(q.trim())}`)
      .then(res => res.json())
      .then(data => {
        const elapsed = performance.now() - start
        setSearchTime(Math.round(elapsed))
        setResults(data)
        setOpen(true)
        setLoading(false)
        return data
      })
      .catch(() => { setResults([]); setLoading(false); return [] })
  }

  // Live preview with debounce
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      setSearchTime(null)
      return
    }
    timerRef.current = setTimeout(() => doSearch(query), 300)
    return () => clearTimeout(timerRef.current)
  }, [query])

  const handleApplyFilter = () => {
    if (!query.trim()) {
      clearFilter()
      return
    }
    setOpen(false)
    setActiveFilter(query.trim())
    doSearch(query).then(data => onFilterResults(data, query.trim()))
  }

  const clearFilter = () => {
    setQuery('')
    setResults([])
    setOpen(false)
    setSearchTime(null)
    setActiveFilter('')
    onFilterResults(null, '')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApplyFilter()
    }
  }

  return (
    <div className="relative mb-6" ref={ref}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder='חיפוש תביעות — שם, ת.ז., עיר, רחוב, לוחית רישוי, תיאור נזק...'
            className="w-full pr-12 pl-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && !activeFilter && setOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {loading && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
        </div>
        <button
          onClick={handleApplyFilter}
          className="px-6 py-3.5 bg-gradient-to-l from-blue-900 to-blue-800 text-white rounded-2xl font-bold text-sm hover:from-blue-800 hover:to-blue-700 transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          סנן
        </button>
      </div>

      {/* Active filter indicator */}
      {activeFilter && (
        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            מסנן לפי: "{activeFilter}"
            <button onClick={clearFilter} className="hover:text-blue-600 transition-colors mr-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {searchTime !== null && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Atlas Search — {searchTime}ms
            </span>
          )}
        </div>
      )}

      {/* Dropdown preview */}
      {open && !activeFilter && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {results.length} תוצאות עבור "<span className="font-semibold text-slate-700">{query}</span>"
            </span>
            <div className="flex items-center gap-3">
              {searchTime !== null && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {searchTime}ms
                </span>
              )}
              {results.length > 0 && (
                <button
                  onClick={handleApplyFilter}
                  className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                >
                  סנן תוצאות ↵
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-400 text-sm">לא נמצאו תוצאות</div>
            ) : (
              results.slice(0, 8).map(claim => {
                const typeInfo = claimTypes[claim.type] || {}
                return (
                  <Link
                    key={claim._id}
                    to={`/edit/${claim._id}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 transition-colors"
                    onClick={() => { setOpen(false); setQuery('') }}
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {typeInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{claim.claimantName}</span>
                        <span className="text-xs text-slate-400 font-mono">ת.ז. {claim.idNumber}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {claim.details?.city && `${claim.details.city}`}
                        {claim.details?.street && `, ${claim.details.street}`}
                        {claim.details?.businessName && ` — ${claim.details.businessName}`}
                        {claim.details?.licensePlate && ` — ${claim.details.licensePlate}`}
                        {claim.details?.damageDescription && ` — ${claim.details.damageDescription}`}
                        {claim.details?.injuryDescription && ` — ${claim.details.injuryDescription}`}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={claim.status} />
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          {results.length > 8 && (
            <button
              onClick={handleApplyFilter}
              className="w-full px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-center text-sm text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
            >
              הצג את כל {results.length} התוצאות בתצוגת כרטיסים
            </button>
          )}

          {results.length > 0 && results.length <= 8 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-center">
              <span className="text-[10px] text-slate-400">Powered by MongoDB Atlas Search (Lucene)</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
