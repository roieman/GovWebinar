import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { claimTypes } from '../data/formFields'
import ClaimForm from '../components/ClaimForm'
import PhotoUpload from '../components/PhotoUpload'

export default function EditClaim() {
  const { id } = useParams()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/claims/${id}`)
      .then(res => res.json())
      .then(setClaim)
      .catch(() => setClaim(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">טוען תביעה...</p>
      </div>
    )
  }

  if (!claim) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg font-medium mb-4">תביעה לא נמצאה</p>
        <Link to="/" className="text-blue-600 hover:underline">חזרה ללוח הבקרה</Link>
      </div>
    )
  }

  const typeInfo = claimTypes[claim.type] || {}

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          חזרה
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeInfo.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">עריכת תביעה</h1>
            <p className="text-sm text-slate-400">{claim.claimantName} — {typeInfo.label}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ClaimForm type={claim.type} initialData={claim} claimId={id} />
        <PhotoUpload
          claimId={id}
          existingPhotos={claim.photos || []}
          onPhotosUpdated={(photos) => setClaim(prev => ({ ...prev, photos }))}
        />
      </div>
    </div>
  )
}
