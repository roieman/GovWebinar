import { useState, useRef, useEffect } from 'react'

export default function SearchableSelect({ options, value, onChange, placeholder = 'בחר...', required }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (opt) => {
    onChange(opt)
    setSearch('')
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <div
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white cursor-pointer flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <input
            autoFocus
            type="text"
            className="w-full outline-none bg-transparent text-slate-900 placeholder-slate-400"
            placeholder="הקלד לחיפוש..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={value ? 'text-slate-900' : 'text-slate-400'}>
            {value || placeholder}
          </span>
        )}
        <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 mr-2 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {/* Hidden input for form validation */}
      {required && <input tabIndex={-1} className="absolute opacity-0 h-0 w-0" value={value || ''} required onChange={() => {}} />}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400">לא נמצאו תוצאות</div>
          ) : (
            filtered.map(opt => (
              <button
                type="button"
                key={opt}
                className={`w-full text-right px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${opt === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
