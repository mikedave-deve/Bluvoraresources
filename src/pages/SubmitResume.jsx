import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

/* ── Accepted file types ───────────────────────────────────── */
const ACCEPT = '.pdf,.doc,.docx'
const MAX_MB = 5

/* ═══════════════════════════════════════════════════════════════
   DropZone
═══════════════════════════════════════════════════════════════ */
function DropZone({ file, onFile, error }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback(e => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFile(dropped)
  }, [onFile])

  const handleDragOver  = e => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = ()  => setDragging(false)
  const handleChange    = e   => { if (e.target.files[0]) onFile(e.target.files[0]) }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
                    transition-all duration-200
                    ${dragging
                      ? 'border-brand-500 bg-brand-50 scale-[1.01]'
                      : error
                        ? 'border-red-300 bg-red-50'
                        : file
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 bg-surface-soft hover:border-brand-300 hover:bg-brand-50'
                    }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={handleChange}
          className="sr-only"
          aria-label="Upload resume"
        />

        {file ? (
          /* File selected */
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-semibold text-ink">{file.name}</p>
            <p className="text-xs text-ink-muted">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onFile(null) }}
              className="text-xs text-red-500 hover:text-red-700 font-medium mt-1"
            >
              Remove file
            </button>
          </div>
        ) : (
          /* Idle state */
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center
              ${dragging ? 'bg-brand-100' : 'bg-slate-100'}`}>
              <Upload className={`w-6 h-6 ${dragging ? 'text-brand-600' : 'text-ink-subtle'}`} />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">
                {dragging ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-xs text-ink-muted mt-1">
                or <span className="text-brand-600 font-semibold">click to browse</span>
              </p>
            </div>
            <p className="text-xs text-ink-subtle">PDF, DOC, DOCX · Max {MAX_MB}MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SuccessScreen
═══════════════════════════════════════════════════════════════ */
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
      {/* Animated check */}
      <div ref={circleRef} className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8">
        <div ref={checkRef}>
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
      </div>

      <div ref={textRef}>
        <h2 className="font-display text-3xl font-bold text-ink mb-3">
          Resume Submitted!
        </h2>
        <p className="text-ink-muted text-base leading-relaxed mb-2 max-w-sm">
          Thank you for reaching out to Bluvora Resources. Our team will review
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

/* ═══════════════════════════════════════════════════════════════
   SubmitResume (main export)
═══════════════════════════════════════════════════════════════ */
export default function SubmitResume() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    category: '', message: '',
  })
  const [file,     setFile]     = useState(null)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const headerRef = useRef(null)
  const formRef   = useRef(null)

  /* Header animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.resume-header-el',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
      )
    }, headerRef)
    return () => ctx.revert()
  }, [])

  /* Form entrance */
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

  const handleFile = selected => {
    if (!selected) { setFile(null); return }
    if (selected.size > MAX_MB * 1024 * 1024) {
      setErrors(e => ({ ...e, file: `File must be under ${MAX_MB}MB` }))
      return
    }
    setErrors(e => ({ ...e, file: undefined }))
    setFile(selected)
  }

  /* Validation */
  function validate() {
    const e = {}
    if (!form.firstName.trim())  e.firstName = 'First name is required'
    if (!form.lastName.trim())   e.lastName  = 'Last name is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!file)                   e.file      = 'Please upload your resume'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      // Build multipart/form-data — Multer expects the file under the "resume" field
      const formData = new FormData()
      formData.append('firstName', form.firstName)
      formData.append('lastName',  form.lastName)
      formData.append('email',     form.email)
      formData.append('phone',     form.phone)
      formData.append('category',  form.category)
      formData.append('message',   form.message)
      formData.append('resume',    file)   // key must match upload.single('resume')

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resume`,
        {
          method: 'POST',
          body:   formData,
          // Do NOT set Content-Type — browser sets it with the boundary automatically
        }
      )
      const data = await res.json()

      if (!res.ok) {
        if (data.errors?.length) {
          const fieldErrors = {}
          data.errors.forEach(({ field, message }) => { fieldErrors[field] = message })
          setErrors(fieldErrors)
        } else {
          setErrors({ _server: data.message || 'Submission failed. Please try again.' })
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
    setForm({ firstName: '', lastName: '', email: '', phone: '', category: '', message: '' })
    setFile(null)
    setErrors({})
  }

  return (
    <>
      {/* ── Page Hero ── */}
      <div ref={headerRef} className="bg-gradient-to-br from-brand-900 to-brand-950 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 dots opacity-[0.04] pointer-events-none" />
        <div className="section-container relative z-10 text-center">
          <span className="resume-header-el section-eyebrow text-brand-400 block mb-2">
            Join Our Network
          </span>
          <h1 className="resume-header-el font-display text-5xl lg:text-6xl font-bold text-white mb-4">
            Submit Your Resume
          </h1>
          <p className="resume-header-el text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
            Take the first step toward your next opportunity. Our recruiters
            review every submission personally.
          </p>
        </div>
      </div>

      {/* ── Form section ── */}
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

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <FormField
                    label="First Name" required
                    name="firstName" value={form.firstName}
                    onChange={handleChange} error={errors.firstName}
                    placeholder="Alexandra"
                  />
                  <FormField
                    label="Last Name" required
                    name="lastName" value={form.lastName}
                    onChange={handleChange} error={errors.lastName}
                    placeholder="Mercer"
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <FormField
                    label="Email Address" required type="email"
                    name="email" value={form.email}
                    onChange={handleChange} error={errors.email}
                    placeholder="you@example.com"
                  />
                  <FormField
                    label="Phone Number" type="tel"
                    name="phone" value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Category */}
                <div className="mb-5">
                  <label className="form-label">
                    Industry / Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="form-input appearance-none pr-10"
                    >
                      <option value="">Select an industry…</option>
                      {['Technology', 'Finance', 'Healthcare', 'Marketing',
                        'Operations', 'Human Resources', 'Engineering', 'Sales', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
                  </div>
                </div>

                {/* Resume upload */}
                <div className="mb-5">
                  <label className="form-label">
                    Resume / CV <span className="text-red-500">*</span>
                  </label>
                  <DropZone file={file} onFile={handleFile} error={errors.file} />
                </div>

                {/* Message */}
                <div className="mb-8">
                  <label className="form-label" htmlFor="message">
                    Cover Note <span className="text-ink-subtle font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your experience, or the type of role you're looking for…"
                    className="form-input resize-none"
                  />
                </div>

                {/* Server error banner */}
                {errors._server && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3
                                  text-sm text-red-700 font-medium mb-2">
                    {errors._server}
                  </div>
                )}

                {/* Submit */}
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

          {/* Trust badges */}
          {!success && (
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: '🔒', label: 'Secure & Private',   sub: 'Your data stays with us' },
                { icon: '⚡', label: 'Fast Response',       sub: '2–3 business days' },
                { icon: '🤝', label: 'Personal Review',     sub: 'Every resume is read' },
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

/* ── FormField helper ───────────────────────────────────────── */
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

/* ── Icons ──────────────────────────────────────────────────── */
function Upload({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}
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
