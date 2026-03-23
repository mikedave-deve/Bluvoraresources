import { Link } from 'react-router-dom'
import BluvoraLogo from './Logo'

const LINKS = {
  Company:   [
    { label: 'Home',          to: '/' },
    { label: 'About Us',      to: '/about' },
    { label: 'Meet Our Team', to: '/about#team' },
  ],
  'For Talent': [
    { label: 'Browse Jobs',   to: '/jobs' },
    { label: 'Submit Resume', to: '/submit-resume' },
  ],
  'For Employers': [
    { label: 'Contact Us', to: '/contact' },
  ],
}

const SOCIALS = [
  { label: 'LinkedIn', href: '#', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )},
  { label: 'Twitter', href: '#', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { label: 'Facebook', href: '#', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )},
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-950 text-white">
      {/* Main footer */}
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand col */}
          <div className="lg:col-span-2 space-y-5">
            <BluvoraLogo height={38} />
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Connecting exceptional talent with leading organizations across
              industries. Your career journey starts here.
            </p>

            {/* Contact info */}
            <div className="space-y-2 pt-1">
              <a
                href="mailto:info@bluvoraresources.com"
                className="flex items-center gap-2.5 text-sm text-white/65 hover:text-white
                           transition-colors duration-150 group"
              >
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center
                                 group-hover:bg-brand-600 transition-colors duration-200 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                info@bluvoraresources.com
              </a>
              <a
                href="tel:+18005550199"
                className="flex items-center gap-2.5 text-sm text-white/65 hover:text-white
                           transition-colors duration-150 group"
              >
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center
                                 group-hover:bg-brand-600 transition-colors duration-200 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </span>
                +1 (800) 555-0199
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                             text-white/70 hover:bg-brand-600 hover:text-white transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-white/65 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-5">
              Stay Updated
            </h4>
            <p className="text-sm text-white/60 mb-4">
              Get new job alerts and industry insights.
            </p>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 text-white text-sm
                           rounded-xl px-4 py-2.5 placeholder:text-white/40
                           focus:outline-none focus:border-brand-400 transition-colors duration-200"
              />
              <button
                type="submit"
                className="btn-primary justify-center bg-brand-500 hover:bg-brand-400 text-sm py-2.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {year} Bluvora Resources. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
