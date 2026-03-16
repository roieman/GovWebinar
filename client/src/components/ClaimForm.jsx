import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { claimTypes, commonFields } from '../data/formFields'
import SearchableSelect from './SearchableSelect'

export default function ClaimForm({ type, initialData, claimId }) {
  const navigate = useNavigate()
  const typeConfig = claimTypes[type]
  const isEdit = !!claimId
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState(() => {
    if (!initialData) return {}
    const { claimantName, idNumber, phone, email, details } = initialData
    return { claimantName, idNumber, phone, email, ...details }
  })
  const [status, setStatus] = useState(initialData?.status || 'new')
  const [submitting, setSubmitting] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setPendingFiles(prev => [...prev, ...files])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])
    e.target.value = ''
  }

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index])
    setPendingFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const { claimantName, idNumber, phone, email, ...details } = formData
    const body = { type, claimantName, idNumber, phone, email, details, status }

    try {
      const url = isEdit ? `/api/claims/${claimId}` : '/api/claims'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        const saved = await res.json()
        // Upload pending photos
        if (pendingFiles.length > 0) {
          const fd = new FormData()
          pendingFiles.forEach(f => fd.append('photos', f))
          await fetch(`/api/claims/${saved._id}/photos`, { method: 'POST', body: fd })
        }
        navigate('/')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field) => {
    const baseClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"

    if (field.type === 'searchable') {
      return (
        <SearchableSelect
          options={field.options}
          value={formData[field.name] || ''}
          onChange={(val) => handleChange(field.name, val)}
          required={field.required}
        />
      )
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          className={baseClass + " resize-none h-24"}
          required={field.required}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <select
          className={baseClass}
          required={field.required}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          <option value="">בחר...</option>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={field.type}
        className={baseClass}
        required={field.required}
        value={formData[field.name] || ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-l from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            פרטים אישיים
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {commonFields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      {/* Type-specific fields */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-l from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-xl">{typeConfig.icon}</span>
            פרטי תביעת {typeConfig.label}
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {typeConfig.fields.map(field => (
            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      {/* Photo upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-l from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            תמונות לתיעוד הנזק
          </h3>
        </div>
        <div className="p-6">
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-full h-28 object-cover rounded-lg border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1.5 left-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
          >
            <svg className="w-10 h-10 mx-auto text-slate-300 group-hover:text-blue-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <span className="text-slate-500 group-hover:text-blue-600 font-medium transition-colors">לחץ להעלאת תמונות</span>
            <span className="block text-xs text-slate-400 mt-1">JPG, PNG עד 10 תמונות</span>
          </button>
        </div>
      </div>

      {/* Status (edit only) */}
      {isEdit && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-l from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">סטטוס תביעה</h3>
          </div>
          <div className="p-6">
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'new', label: 'חדשה', style: 'border-blue-300 bg-blue-50 text-blue-700', active: 'ring-2 ring-blue-500 bg-blue-100' },
                { value: 'in_review', label: 'בבדיקה', style: 'border-yellow-300 bg-yellow-50 text-yellow-700', active: 'ring-2 ring-yellow-500 bg-yellow-100' },
                { value: 'approved', label: 'אושרה', style: 'border-green-300 bg-green-50 text-green-700', active: 'ring-2 ring-green-500 bg-green-100' },
                { value: 'rejected', label: 'נדחתה', style: 'border-red-300 bg-red-50 text-red-700', active: 'ring-2 ring-red-500 bg-red-100' },
              ].map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`px-5 py-2.5 rounded-lg border font-medium transition-all ${s.style} ${status === s.value ? s.active : 'opacity-60 hover:opacity-100'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-l from-blue-900 to-blue-800 text-white py-3.5 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
      >
        {submitting ? 'שומר...' : isEdit ? 'עדכון תביעה' : 'הגשת תביעה'}
      </button>
    </form>
  )
}
