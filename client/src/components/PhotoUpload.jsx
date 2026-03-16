import { useState } from 'react'

export default function PhotoUpload({ claimId, existingPhotos = [], onPhotosUpdated }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files.length) return

    setUploading(true)
    const formData = new FormData()
    for (const file of files) {
      formData.append('photos', file)
    }

    try {
      const res = await fetch(`/api/claims/${claimId}/photos`, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const updated = await res.json()
        onPhotosUpdated(updated.photos)
      }
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-l from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          תמונות ({existingPhotos.length})
        </h3>
      </div>
      <div className="p-6">
        {existingPhotos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {existingPhotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`תמונה ${i + 1}`}
                className="w-full h-32 object-cover rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2" />
              <span className="text-slate-500 font-medium">מעלה תמונות...</span>
            </>
          ) : (
            <>
              <svg className="w-10 h-10 text-slate-300 group-hover:text-blue-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <span className="text-slate-500 group-hover:text-blue-600 font-medium transition-colors">לחץ להעלאת תמונות נוספות</span>
              <span className="text-xs text-slate-400 mt-1">JPG, PNG עד 10 תמונות</span>
            </>
          )}
        </label>
      </div>
    </div>
  )
}
