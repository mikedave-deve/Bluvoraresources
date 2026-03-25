import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const CONTACT_EMAIL = 'info@bluvoraresources.com'
const CONTACT_PHONE = '+1 (712) 326-6711'
const CONTACT_PHONE_RAW = '+17123266711'

/* ── API base — strips any accidental trailing slash ─────── */
const API_BASE = (import.meta.env.VITE_API_URL || 'https://bluvoraresources-backend-z3m8.vercel.app').replace(/\/+$/, '')

const INFO_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email Us',
    value: CONTACT_EMAIL,
    href:  `mailto:${CONTACT_EMAIL}`,
    note:  'We reply within 1 business day',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: 'Call Us',
    value: CONTACT_PHONE,
    href:  `tel:${CONTACT_PHONE_RAW}`,
    note:  'Mon–Fri, 8 AM – 6 PM EST',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Our Office',
    value: '200 W Monroe St, Suite 1800',
    href:  'https://maps.google.com/?q=200+W+Monroe+St+Chicago+IL',
    note:  'Chicago, IL 60606',
  },
]

export default function Contact() {
  const headerRef = useRef(null)
  const formRef   = useRef(null)
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-hero-el',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
      )
    }, headerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.info-card',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.35 }
      )
      gsap.fromTo(
        formRef.current,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.4 }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.name.trim())                    e.name    = 'Name is required'
    if (!/\S+@\S+\.\S+/.test(form.email))    e.email   = 'Valid email is required'
    if (!form.message.trim())                 e.message = 'Message is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
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

      setSent(true)
    } catch {
      setErrors({ _server: 'Network error. Please check your connection and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div ref={headerRef} className="bg-brand-950 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 dots opacity-[0.04] pointer-events-none" />
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="section-container relative z-10 text-center">
          <span className="contact-hero-el section-eyebrow text-brand-400 block mb-2">
            Get In Touch
          </span>
          <h1 className="contact-hero-el font-display text-5xl lg:text-6xl font-bold text-white mb-4"
              style={{ letterSpacing: '-0.025em', lineHeight: '1.08' }}>
            Contact Us
          </h1>
          <p className="contact-hero-el text-lg text-white/60 max-w-lg mx-auto"
             style={{ lineHeight: '1.7' }}>
            Whether you're hiring or job-seeking, our team is ready to help.
            Reach out and we'll respond promptly.
          </p>
        </div>
      </div>

      <section className="section-padding bg-surface-soft">
        <div className="section-container">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {INFO_CARDS.map(({ icon, label, value, href, note }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="info-card card p-8 flex flex-col items-center text-center group
                           hover:border-brand-200 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100
                                flex items-center justify-center text-brand-600 mb-5
                                group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600
                                transition-all duration-300">
                  {icon}
                </div>
                <h3 className="font-display font-semibold text-ink text-lg mb-1
                               group-hover:text-brand-700 transition-colors duration-200">
                  {label}
                </h3>
                <p className="font-body font-semibold text-brand-600 text-sm mb-1 break-all">
                  {value}
                </p>
                <p className="font-body text-xs text-ink-muted">{note}</p>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">

            <div className="lg:col-span-2 space-y-8">
              <div>
                <span className="section-eyebrow block">Direct Contact</span>
                <h2 className="section-title mb-4">
                  Reach Us <span className="text-gradient-blue">Directly</span>
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Prefer to connect right away? Use the links below — both open
                  your email app or phone dialer instantly.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3 font-body">
                  Email
                </p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center
                                  text-brand-700 group-hover:bg-brand-600 group-hover:text-white
                                  transition-all duration-200 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <span className="font-body font-semibold text-brand-600 hover:text-brand-800
                                   text-sm break-all transition-colors duration-150 underline
                                   underline-offset-2 decoration-brand-300">
                    {CONTACT_EMAIL}
                  </span>
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3 font-body">
                  Phone
                </p>
                <a href={`tel:${CONTACT_PHONE_RAW}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center
                                  text-brand-700 group-hover:bg-brand-600 group-hover:text-white
                                  transition-all duration-200 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                  <span className="font-body font-semibold text-brand-600 hover:text-brand-800
                                   text-sm transition-colors duration-150 underline
                                   underline-offset-2 decoration-brand-300">
                    {CONTACT_PHONE}
                  </span>
                </a>
                <p className="font-body text-xs text-ink-muted mt-3 ml-[52px]">
                  Mon–Fri, 8 AM – 6 PM EST
                </p>
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6">
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  <span className="font-semibold text-ink">Response time:</span> We
                  aim to respond to all inquiries within one business day. For urgent
                  staffing needs, please call directly.
                </p>
              </div>
            </div>

            <div ref={formRef} className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-card-hover p-8 lg:p-10">
                {sent ? (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                           className="w-8 h-8 text-emerald-500">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-ink mb-2">Message Sent!</h3>
                    <p className="font-body text-ink-muted text-sm max-w-xs">
                      Thanks for reaching out. We'll be in touch within one business day.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }}
                      className="btn-outline mt-8"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-2xl font-bold text-ink mb-1"
                        style={{ letterSpacing: '-0.015em' }}>
                      Send Us a Message
                    </h3>
                    <p className="font-body text-sm text-ink-muted mb-8">
                      Fill in the form and we'll get back to you shortly.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="form-label">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="name" name="name" type="text"
                            value={form.name} onChange={handleChange}
                            placeholder="Alexandra Mercer"
                            className={`form-input ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                          />
                          {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                          <label htmlFor="email" className="form-label">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="email" name="email" type="email"
                            value={form.email} onChange={handleChange}
                            placeholder="you@company.com"
                            className={`form-input ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                          />
                          {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <input
                          id="subject" name="subject" type="text"
                          value={form.subject} onChange={handleChange}
                          placeholder="e.g. Hiring inquiry, Job application, General question"
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="form-label">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message" name="message" rows={5}
                          value={form.message} onChange={handleChange}
                          placeholder="Tell us how we can help you…"
                          className={`form-input resize-none ${errors.message ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                        />
                        {errors.message && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.message}</p>}
                      </div>

                      {errors._server && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3
                                        text-sm text-red-700 font-medium">
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
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                 className="w-4 h-4">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}