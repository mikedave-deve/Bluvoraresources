import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StaffSection from '../components/StaffSection'

gsap.registerPlugin(ScrollTrigger)

/* ── Values data ────────────────────────────────────────────── */
const VALUES = [
  {
    icon: '',
    title: 'Precision Matching',
    desc: 'We go beyond qualifications — we understand culture fit, ambition, and long-term potential to make placements that last.',
  },
  {
    icon: '',
    title: 'Integrity Always',
    desc: 'Honest advice, transparent processes, and genuine advocacy for both candidates and employers. No shortcuts.',
  },
  {
    icon: '',
    title: 'Diversity & Inclusion',
    desc: 'We actively champion equitable hiring practices and build diverse talent pipelines across every industry we serve.',
  },
  {
    icon: '',
    title: 'Innovation-Driven',
    desc: 'Leveraging the latest technology and market intelligence to stay ahead of workforce trends and talent demands.',
  },
  {
    icon: '',
    title: 'Proven Results',
    desc: 'Our success is measured by yours — sustained placements, strong retention rates, and satisfied partners.',
  },
  {
    icon: '',
    title: 'People First',
    desc: 'Behind every resume is a person with a story. We treat every candidate and client with genuine care and respect.',
  },
]

/* ── Timeline ───────────────────────────────────────────────── */
const TIMELINE = [
  { year: '1999', title: 'Founded',           desc: 'Alexandra Mercer opens Bluvora Resources in Chicago with a team of 3.' },
  { year: '2005', title: 'National Expansion', desc: 'Offices open in New York, Los Angeles, and Houston.' },
  { year: '2010', title: '5,000 Placements',  desc: 'Milestone of 5,000 successful placements across healthcare, finance, and tech.' },
  { year: '2016', title: 'Tech Practice',     desc: 'Launch of our dedicated Technology & Engineering staffing division.' },
  { year: '2020', title: 'Virtual Hiring',    desc: 'Pioneered remote recruiting workflows during global disruption.' },
  { year: '2024', title: '15,000+ Placed',    desc: 'Celebrated 25 years of staffing excellence and 15,000+ career placements.' },
]

/* ── Industry sectors ───────────────────────────────────────── */
const SECTORS = [
  'Technology & Engineering',
  'Finance & Accounting',
  'Healthcare & Life Sciences',
  'Marketing & Communications',
  'Operations & Supply Chain',
  'Human Resources',
  'Sales & Business Development',
  'Executive Leadership',
]

/* ═══════════════════════════════════════════════════════════════
   About Page
═══════════════════════════════════════════════════════════════ */
export default function About() {
  const headerRef   = useRef(null)
  const valuesRef   = useRef(null)
  const timelineRef = useRef(null)
  const sectorsRef  = useRef(null)

  /* Header */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-hero-el',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      )
    }, headerRef)
    return () => ctx.revert()
  }, [])

  /* Values */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.value-card',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: valuesRef.current, start: 'top 80%', once: true },
        }
      )
    }, valuesRef)
    return () => ctx.revert()
  }, [])

  /* Timeline */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.timeline-item',
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: timelineRef.current, start: 'top 78%', once: true },
        }
      )
    }, timelineRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ── Hero ── */}
      <div
        ref={headerRef}
        className="relative overflow-hidden pt-28 pb-0 bg-brand-950"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/70 to-brand-950" />
        </div>

        <div className="section-container relative z-10 text-center pb-24">
          <span className="about-hero-el section-eyebrow text-brand-400 block mb-3">
            Our Story
          </span>
          <h1 className="about-hero-el font-display text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05]">
            Built on Trust.<br />
            <span className="text-gradient-blue">Driven by People.</span>
          </h1>
          <p className="about-hero-el text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
            For over 25 years, Bluvora Resources has connected extraordinary
            talent with organizations that shape industries — with a commitment
            to quality, integrity, and lasting impact.
          </p>
          <div className="about-hero-el flex flex-wrap justify-center gap-4">
            <Link to="/jobs" className="btn-primary px-8 py-4 text-base">
              Browse Opportunities
            </Link>
            <Link
              to="/submit-resume"
              className="border-2 border-white/30 text-white font-semibold px-8 py-4
                         rounded-full text-base hover:bg-white hover:text-brand-700
                         transition-all duration-300"
            >
              Submit Resume
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mission strip ── */}
      <section className="bg-brand-700 py-14">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Our Mission',  text: 'To elevate careers and strengthen organizations through purposeful, expert-led staffing.' },
              { label: 'Our Vision',   text: 'A world where every professional finds meaningful work, and every company builds exceptional teams.' },
              { label: 'Our Promise',  text: 'We treat every placement as if it were our own career — with precision, integrity, and genuine care.' },
            ].map(({ label, text }) => (
              <div key={label} className="px-4">
                <h3 className="font-display font-bold text-white text-xl mb-3">{label}</h3>
                <p className="text-brand-200 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story section ── */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: image grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80"
                  alt="Team collaboration"
                  loading="lazy"
                  className="rounded-2xl object-cover h-56 w-full shadow-card"
                />
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"
                  alt="Business meeting"
                  loading="lazy"
                  className="rounded-2xl object-cover h-56 w-full shadow-card mt-10"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-6 left-8 bg-white rounded-2xl px-6 py-5 shadow-card-hover">
                <p className="font-display font-bold text-3xl text-brand-700 leading-none">25+</p>
                <p className="text-xs text-ink-muted mt-1 font-medium">Years of Excellence</p>
              </div>
            </div>

            {/* Right: copy */}
            <div>
              <span className="section-eyebrow">Our Background</span>
              <h2 className="section-title mt-1 mb-5">
                Two Decades of{' '}
                <span className="text-gradient-blue">Connecting Talent</span>
              </h2>
              <div className="space-y-4 text-ink-muted leading-relaxed text-[15px]">
                <p>
                  Founded in 1999 by Alexandra Mercer, Bluvora Resources began as a
                  boutique firm with a singular belief: that exceptional staffing
                  requires exceptional relationships. From a small Chicago office,
                  we've grown into a nationally recognized recruitment partner with
                  120+ industry specialists.
                </p>
                <p>
                  We serve clients across technology, finance, healthcare, marketing,
                  and operations — bringing a consultative approach that goes far
                  beyond matching keywords on a resume.
                </p>
                <p>
                  Our recruiters average 12+ years of experience. Many are former
                  industry professionals who bring firsthand expertise to every
                  search, understanding not just the role — but the culture, team,
                  and trajectory that makes a placement truly succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section ref={valuesRef} className="section-padding bg-surface-soft">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-eyebrow">What We Stand For</span>
            <h2 className="section-title mt-1">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="value-card card p-7 group"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-display font-bold text-lg text-ink mb-2
                               group-hover:text-brand-700 transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section ref={timelineRef} className="section-padding bg-brand-950">
        <div className="section-container max-w-4xl">
          <div className="text-center mb-14">
            <span className="section-eyebrow text-brand-400">Milestones</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mt-1">
              Our Journey
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-brand-800
                            lg:-translate-x-px hidden sm:block" />

            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`timeline-item relative flex gap-6 lg:gap-0 sm:items-center
                    ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Year bubble */}
                  <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex-shrink-0
                                  z-10 w-12 h-12 rounded-full bg-brand-600 border-4 border-brand-950
                                  flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white leading-none text-center">
                      {item.year}
                    </span>
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 sm:w-5/12 lg:w-[45%] ml-4 sm:ml-0
                    ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:ml-auto'}`}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5
                                    hover:bg-white/10 transition-colors duration-200">
                      <span className="text-xs font-bold text-brand-400 tracking-widest uppercase">
                        {item.year}
                      </span>
                      <h3 className="font-display font-bold text-white text-lg mt-1 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section ref={sectorsRef} className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-eyebrow">Specializations</span>
              <h2 className="section-title mt-1 mb-5">
                Industries We{' '}
                <span className="text-gradient-blue">Serve</span>
              </h2>
              <p className="section-subtitle mb-8">
                Our specialized practice areas allow us to deliver deep domain
                expertise in every search — not a one-size-fits-all approach.
              </p>
              <Link to="/jobs" className="btn-primary">
                View Open Roles
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTORS.map(sector => (
                <div
                  key={sector}
                  className="flex items-center gap-3 bg-surface-soft border border-slate-100
                             rounded-xl px-5 py-4 hover:border-brand-300 hover:bg-brand-50
                             transition-all duration-200 group"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0
                                   group-hover:scale-125 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-ink">{sector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <div id="team">
        <StaffSection />
      </div>

      {/* ── CTA ── */}
      <section className="py-20 bg-brand-700">
        <div className="section-container text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-brand-200 text-lg mb-10 max-w-lg mx-auto">
            Whether you're hiring or seeking your next role, our team is ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/jobs"          className="btn-white px-8 py-4 text-base">Browse Jobs</Link>
            <Link to="/submit-resume" className="border-2 border-white/30 text-white font-semibold
                                                  px-8 py-4 rounded-full text-base
                                                  hover:bg-white hover:text-brand-700
                                                  transition-all duration-300">
              Submit Resume
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
