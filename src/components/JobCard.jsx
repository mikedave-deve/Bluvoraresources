import { Link } from 'react-router-dom'

const TYPE_COLORS = {
  'Full-time': 'badge-blue',
  'Part-time': 'badge-orange',
  'Contract':  'badge-green',
}

export default function JobCard({ job, featured = false }) {
  const { title, company, location, type, category, salary, posted, tags } = job

  return (
    <article
      className={`card group p-6 flex flex-col gap-4 ${
        featured ? 'ring-2 ring-brand-200 ring-offset-1' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={TYPE_COLORS[type] || 'badge-blue'}>{type}</span>
            {featured && (
              <span className="badge bg-amber-100 text-amber-700">Featured</span>
            )}
          </div>
          <h3 className="font-display font-bold text-lg text-ink leading-snug
                         group-hover:text-brand-700 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-ink-muted mt-0.5">{company}</p>
        </div>

       
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" /> {salary}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {posted}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            className="text-xs bg-surface-muted text-ink-muted
                       px-2.5 py-1 rounded-full border border-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="pt-1 mt-auto">
        <Link
          to="/submit-resume"
          className="btn-primary w-full justify-center text-xs py-2.5"
        >
          Apply Now
        </Link>
      </div>
    </article>
  )
}

/* ── Micro-icons (inline SVG to avoid extra dep) ────────────── */
function MapPin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function DollarSign({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  )
}
function Clock({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function getCategoryIcon(category) {
  const map = {
    Technology:      '',
    Finance:         '',
    Marketing:       '',
    Healthcare:      '',
    Operations:      '',
    'Human Resources':'',
    Sales:           '',
    Engineering:     '',
  }
  return map[category] || ''
}
