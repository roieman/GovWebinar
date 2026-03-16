import { useState } from 'react'
import { Link } from 'react-router-dom'
import { claimTypes } from '../data/formFields'
import ClaimForm from '../components/ClaimForm'

const colorMap = {
  blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100',
  emerald: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100',
  amber: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100',
  red: 'border-red-200 bg-gradient-to-br from-red-50 to-white hover:border-red-400 hover:shadow-lg hover:shadow-red-100',
}

const selectedColorMap = {
  blue: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/30 shadow-lg shadow-blue-100',
  emerald: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-100',
  amber: 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/30 shadow-lg shadow-amber-100',
  red: 'border-red-500 bg-red-50 ring-2 ring-red-500/30 shadow-lg shadow-red-100',
}

export default function NewClaim() {
  const [selectedType, setSelectedType] = useState(null)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          חזרה
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">תביעה חדשה</h1>
          <p className="text-sm text-slate-400">מלא את הפרטים להגשת תביעת פיצויים</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
          <h2 className="text-lg font-bold text-slate-800">בחר סוג תביעה</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(claimTypes).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 ${
                selectedType === key ? selectedColorMap[config.color] : colorMap[config.color]
              }`}
            >
              <span className="text-4xl block mb-3">{config.icon}</span>
              <span className="font-bold text-slate-800 block">{config.label}</span>
              <span className="text-xs text-slate-400 block mt-1">
                {config.fields.length} שדות
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedType && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="text-lg font-bold text-slate-800">מלא פרטים</h2>
          </div>
          <ClaimForm type={selectedType} />
        </div>
      )}
    </div>
  )
}
