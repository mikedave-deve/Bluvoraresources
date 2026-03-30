import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const API_BASE = (import.meta.env.VITE_API_URL || 'https://bluvoraresources-backend-z3m8.vercel.app').replace(/\/+$/, '')

const JOB_POSITIONS = [
  'General Application',
  'Administrative Assistant',
  'Customer Service Representative',
  'Data Entry Specialist',
  'Warehouse Associate',
  'Production Technician',
  'Forklift Operator',
  'Quality Control Inspector',
  'Human Resources Coordinator',
  'Accounting Clerk',
  'IT Support Specialist',
  'Marketing Coordinator',
  'Sales Representative',
  'Operations Manager',
  'Project Manager',
  'Other',
]

/* ══════════════════════════════════════════════════════════════
   SuccessScreen
══════════════════════════════════════════════════════════════ */
function SuccessScreen({ onReset }) {
  const circleRef = useRef(null)
  const checkRef  = useRef(null)
  const textRef   = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(circleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )
    .fromTo(checkRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' },
      '-=0.2'
    )
    .fromTo(textRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out' },
      '-=0.1'
    )
  }, [])

  return (
    <div className="flex flex-col items-center text-center py-16 px-8">
      <div ref={circleRef} className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8">
        <div ref={checkRef}>
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
      </div>
      <div ref={textRef}>
        <h2 className="font-display text-3xl font-bold text-ink mb-3">
          Application Submitted!
        </h2>
        <p className="text-ink-muted text-base leading-relaxed mb-2 max-w-sm">
          Thank you for applying to Bluvora Resources. Our team will review
          your application and be in touch within 2–3 business days.
        </p>
        <p className="text-ink-muted text-sm mb-10">
          Check your email for a confirmation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={onReset} className="btn-outline">
            Submit Another
          </button>
          <Link to="/jobs" className="btn-primary">
            Browse Open Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   FormField helper
══════════════════════════════════════════════════════════════ */
function FormField({ label, name, value, onChange, error, placeholder, type = 'text', required }) {
  return (
    <div>
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name} name={name} type={type}
        value={value} onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
      />
      {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ApplyNow (main export)
══════════════════════════════════════════════════════════════ */
export default function ApplyNow() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    position: '',
    additionalInfo: '',
    availability: '',
    workDuration: '',
    message: '',
  })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const headerRef = useRef(null)
  const formRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.apply-header-el',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
      )
    }, headerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (success) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3 }
      )
    })
    return () => ctx.revert()
  }, [success])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.fullName.trim())      e.fullName     = 'Full name is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.phone.trim())         e.phone        = 'Phone number is required'
    if (!form.dob)                  e.dob          = 'Date of birth is required'
    if (!form.address.trim())       e.address      = 'Home address is required'
    if (!form.position)             e.position     = 'Please select a job position'
    if (!form.availability)         e.availability = 'Please select your availability'
    return e
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/apply`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:       form.fullName,
          email:          form.email,
          phone:          form.phone,
          dob:            form.dob,
          address:        form.address,
          position:       form.position,
          availability:   form.availability,
          workDuration:   form.workDuration,
          additionalInfo: form.additionalInfo,
          message:        form.message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Surface per-field server validation errors if returned
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors = {}
          data.errors.forEach(e => { fieldErrors[e.field] = e.message })
          setErrors(fieldErrors)
        } else {
          setErrors({ _server: data.message || 'Something went wrong. Please try again.' })
        }
        return
      }

      setSuccess(true)
    } catch {
      setErrors({ _server: 'Network error. Please check your connection and try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    setForm({
      fullName: '', email: '', phone: '', dob: '', address: '',
      position: '', additionalInfo: '', availability: '', workDuration: '', message: '',
    })
    setErrors({})
  }

  return (
    <>
      {/* ── Hero header ───────────────────────────────────── */}
      <div ref={headerRef} className="bg-gradient-to-br from-brand-900 to-brand-950 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 dots opacity-[0.04] pointer-events-none" />
        <div className="section-container relative z-10 text-center">
          <span className="apply-header-el section-eyebrow text-brand-400 block mb-2">
            Start Your Journey
          </span>
          <h1 className="apply-header-el font-display text-5xl lg:text-6xl font-bold text-white mb-4">
            Apply Now
          </h1>
          <p className="apply-header-el text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
            Take the first step toward your next opportunity. Fill out the form
            below and our recruiters will review your application personally.
          </p>
        </div>
      </div>

      {/* ── Form section ──────────────────────────────────── */}
      <section className="section-padding bg-surface-soft">
        <div className="section-container max-w-3xl">
          <div ref={formRef} className="bg-white rounded-3xl shadow-card-hover overflow-hidden">

            {success ? (
              <SuccessScreen onReset={handleReset} />
            ) : (
              <form onSubmit={handleSubmit} noValidate className="p-8 lg:p-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-1">
                  Your Information
                </h2>
                <p className="text-sm text-ink-muted mb-8">
                  Fields marked <span className="text-red-500">*</span> are required.
                </p>

                {/* ── Personal details ── */}
                <div className="mb-6">
                  <FormField
                    label="Full Name" required
                    name="fullName" value={form.fullName}
                    onChange={handleChange} error={errors.fullName}
                    placeholder="e.g. Alexandra Mercer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <FormField
                    label="Email Address" required type="email"
                    name="email" value={form.email}
                    onChange={handleChange} error={errors.email}
                    placeholder="you@example.com"
                  />
                  <FormField
                    label="Phone Number" required type="tel"
                    name="phone" value={form.phone}
                    onChange={handleChange} error={errors.phone}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="dob" className="form-label">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dob" name="dob" type="date"
                      value={form.dob} onChange={handleChange}
                      className={`form-input ${errors.dob ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    />
                    {errors.dob && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.dob}</p>}
                  </div>

                  {/* ── Job Position dropdown ── */}
                  <div>
                    <label htmlFor="position" className="form-label">
                      Job Position <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="position"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        className={`form-input appearance-none pr-10 ${errors.position ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                      >
                        <option value="">Select a position…</option>
                        {JOB_POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
                    </div>
                    {errors.position && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.position}</p>}
                  </div>
                </div>

                {/* ── Home Address ── */}
                <div className="mb-5">
                  <label htmlFor="address" className="form-label">
                    Home Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address" name="address" type="text"
                    value={form.address} onChange={handleChange}
                    placeholder="123 Main St, City, State, ZIP"
                    className={`form-input ${errors.address ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.address}</p>}
                </div>

                {/* ── Additional Information ── */}
                <div className="mb-5">
                  <label htmlFor="additionalInfo" className="form-label">
                    Additional Information{' '}
                    <span className="text-ink-subtle font-normal">(optional)</span>
                  </label>
                  <input
                    id="additionalInfo" name="additionalInfo" type="text"
                    value={form.additionalInfo} onChange={handleChange}
                    placeholder="Certifications, languages spoken, special skills…"
                    className="form-input"
                  />
                </div>

                {/* ── Availability & Work Duration ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  {/* Availability */}
                  <div>
                    <label className="form-label">
                      Availability <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      {['Full-time', 'Part-time'].map(opt => (
                        <label
                          key={opt}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer
                            transition-all duration-200 text-sm font-semibold
                            ${form.availability === opt
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-slate-200 bg-surface-soft text-ink-soft hover:border-brand-300'
                            }`}
                        >
                          <input
                            type="radio"
                            name="availability"
                            value={opt}
                            checked={form.availability === opt}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {errors.availability && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.availability}</p>}
                  </div>

                  {/* Work Duration */}
                  <div>
                    <label htmlFor="workDuration" className="form-label">
                      Work Duration{' '}
                      <span className="text-ink-subtle font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <select
                        id="workDuration"
                        name="workDuration"
                        value={form.workDuration}
                        onChange={handleChange}
                        className="form-input appearance-none pr-10"
                      >
                        <option value="">Select duration…</option>
                        <option value="temporary">Temporary / Contract</option>
                        <option value="seasonal">Seasonal</option>
                        <option value="permanent">Permanent</option>
                        <option value="flexible">Open / Flexible</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* ── Message ── */}
                <div className="mb-8">
                  <label htmlFor="message" className="form-label">
                    Message{' '}
                    <span className="text-ink-subtle font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your experience, or anything else you'd like us to know…"
                    className="form-input resize-none"
                  />
                </div>

                {errors._server && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3
                                  text-sm text-red-700 font-medium mb-6">
                    {errors._server}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-base
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-ink-subtle mt-4">
                  By submitting, you agree to our{' '}
                  <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>.
                  We never share your data without consent.
                </p>
              </form>
            )}
          </div>

          {!success && (
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: '🔒', label: 'Secure & Private',  sub: 'Your data stays with us' },
                { icon: '⚡', label: 'Fast Response',      sub: '2–3 business days' },
                { icon: '👤', label: 'Personal Review',    sub: 'Every application is read' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-card">
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className="text-xs font-bold text-ink">{label}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* ── Icons ──────────────────────────────────────────────────── */
function CheckCircle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}
function ArrowRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
function Spinner({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}
