import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 15000, suffix: '+', label: 'Jobs Placed',        icon: '' },
  { value: 850,   suffix: '+', label: 'Partner Companies',  icon: '' },
  { value: 98,    suffix: '%', label: 'Client Satisfaction',icon: '' },
  { value: 25,    suffix: '+', label: 'Years of Excellence', icon: '' },
]

function CountUp({ value, suffix }) {
  const elRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: value,
      duration: 2.2,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        el.textContent =
          Math.round(obj.val).toLocaleString() + suffix
      },
    })

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => tween.play(),
    })

    return () => { tween.kill(); st.kill() }
  }, [value, suffix])

  return (
    <span ref={elRef} className="stat-number">
      0{suffix}
    </span>
  )
}

export default function StatsCounter() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stat-card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7,
          stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-brand-950 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 dots opacity-[0.04] pointer-events-none" />

      <div className="section-container">
        {/* Eyebrow */}
        <div className="text-center mb-14">
          <span className="section-eyebrow text-brand-400">By the Numbers</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mt-1">
            Proven Results,{' '}
            <span className="text-gradient-blue">Trusted Expertise</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, suffix, label, icon }) => (
            <div
              key={label}
              className="stat-card bg-white/5 border border-white/10 rounded-2xl
                         p-8 text-center hover:bg-white/10 transition-colors duration-300"
            >
              
              <div className="font-display text-4xl lg:text-5xl font-bold text-white mb-2">
                <CountUp value={value} suffix={suffix} />
              </div>
              <p className="text-sm font-medium text-white/55 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
