import { statusLabels } from '../data/formFields'

const statusStyles = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  in_review: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

const statusDots = {
  new: 'bg-blue-500',
  in_review: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status] || ''}`} />
      {statusLabels[status] || status}
    </span>
  )
}
