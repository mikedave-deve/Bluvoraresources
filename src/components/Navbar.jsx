import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import BluvoraLogo from './Logo'

const NAV_LINKS = [
  { label: 'Home',          to: '/' },
  { label: 'Jobs',          to: '/jobs' },
   { label: 'Submit Resume',          to: '/submit-resume' },
  { label: 'About',         to: '/about' },
  { label: 'Contact',       to: '/contact' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const navRef    = useRef(null)
  const mobileRef = useRef(null)
  const location  = useLocation()

  /* ── Close mobile menu on route change ─── */
  useEffect(() => { setMenuOpen(false) }, [location])

  /* ── Scroll detection ─────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Entrance animation ───────────────── */
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0,   opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  /* ── Mobile menu GSAP slide ───────────── */
  useEffect(() => {
    if (!mobileRef.current) return
    if (menuOpen) {
      gsap.fromTo(
        mobileRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
      )
    } else {
      gsap.to(mobileRef.current, {
        height: 0, opacity: 0, duration: 0.25, ease: 'power2.in',
      })
    }
  }, [menuOpen])

  const isHeroPage = ['/', '/about'].includes(location.pathname)
  const transparent = isHeroPage && !scrolled && !menuOpen

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <BluvoraLogo
              height={36}
              
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-600'
                      : transparent
                        ? 'text-white/90 hover:text-white'
                        : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/jobs" className={transparent ? 'btn-white' : 'btn-primary'}>
              Find Jobs
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-lg
              transition-colors duration-200 ${transparent ? 'text-white' : 'text-ink'}`}
          >
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileRef}
        className="lg:hidden overflow-hidden bg-white border-t border-slate-100"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="section-container py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-semibold rounded-xl transition-colors duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-soft hover:bg-surface-muted hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 pb-1">
            <Link to="/jobs" className="btn-primary w-full justify-center">
              Find Jobs
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
