import { Link } from 'react-router-dom'
import { claimTypes } from '../data/formFields'
import StatusBadge from './StatusBadge'

export default function ClaimCard({ claim }) {
  const typeInfo = claimTypes[claim.type] || {}

  return (
    <Link to={`/edit/${claim._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {typeInfo.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{claim.claimantName}</h3>
              <p className="text-xs text-slate-400 font-mono">ת.ז. {claim.idNumber}</p>
            </div>
          </div>
          <StatusBadge status={claim.status} />
        </div>
        <div className="border-t border-slate-100 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">סוג</span>
            <span className="font-semibold text-slate-700">{typeInfo.label}</span>
          </div>
          {(claim.details?.damageDescription || claim.details?.injuryDescription) && (
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {claim.details.damageDescription || claim.details.injuryDescription}
            </p>
          )}
          <div className="flex items-center justify-between pt-1">
            {claim.photos?.length > 0 && (
              <span className="text-xs text-blue-500 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {claim.photos.length} תמונות
              </span>
            )}
            <span className="text-xs text-slate-300 mr-auto">
              {new Date(claim.createdAt).toLocaleDateString('he-IL')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
