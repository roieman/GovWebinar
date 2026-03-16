import { useState, useEffect } from 'react'
import { claimTypes } from '../data/formFields'

export default function StatsBar() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/claims/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => setStats(null))
  }, [])

  if (!stats) return null

  const typeCards = Object.entries(claimTypes).map(([key, config]) => ({
    key,
    label: config.label,
    icon: config.icon,
    count: stats.byType[key] || 0,
  }))

  const openCount = (stats.byStatus['new'] || 0) + (stats.byStatus['in_review'] || 0)
  const approvedCount = stats.byStatus['approved'] || 0
  const rejectedCount = stats.byStatus['rejected'] || 0

  const summaryCards = [
    { label: 'סה"כ תביעות', count: stats.total, color: 'from-blue-600 to-blue-700', textColor: 'text-white' },
    { label: 'פתוחות', count: openCount, color: 'from-amber-500 to-amber-600', textColor: 'text-white' },
    { label: 'אושרו', count: approvedCount, color: 'from-emerald-500 to-emerald-600', textColor: 'text-white' },
    { label: 'נדחו', count: rejectedCount, color: 'from-red-500 to-red-600', textColor: 'text-white' },
  ]

  return (
    <div className="mb-8 space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 shadow-lg`}>
            <p className={`text-4xl font-black ${card.textColor}`}>{card.count}</p>
            <p className="text-white/80 text-sm font-medium mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Type breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700">פילוח לפי סוג תביעה</h3>
          <span className="text-xs text-slate-400">{stats.total} תביעות</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {typeCards.map(t => {
            const pct = stats.total > 0 ? Math.round((t.count / stats.total) * 100) : 0
            return (
              <div key={t.key} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-xs font-medium text-slate-400">{pct}%</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{t.count}</p>
                <p className="text-xs text-slate-500 font-medium">{t.label}</p>
                <div className="mt-2 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
