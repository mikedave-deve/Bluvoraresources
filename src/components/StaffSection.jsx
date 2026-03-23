import { useRef } from 'react'
import { gsap } from 'gsap'

const STAFF = [
  {
    name:        'Alexandra Mercer',
    title:       'CEO & Founder',
    description: 'With 20+ years in executive search, Alexandra built Bluvora to bridge the gap between exceptional talent and transformational opportunities.',
    image:       'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
    linkedin:    '#',
  },
  {
    name:        'Marcus Chen',
    title:       'VP of Technology Staffing',
    description: 'Former engineering lead turned recruiter, Marcus specializes in placing top-tier tech talent across Fortune 500 companies and high-growth startups.',
    image:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    linkedin:    '#',
  },
  {
    name:        'Priya Sharma',
    title:       'Director of Client Relations',
    description: 'Priya ensures every client partnership exceeds expectations, managing relationships with over 200 leading organizations across diverse industries.',
    image:       'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&q=80',
    linkedin:    '#',
  },
]

function StaffCard({ person }) {
  const cardRef    = useRef(null)
  const overlayRef = useRef(null)
  const textRef    = useRef(null)

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    gsap.to(textRef.current,    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
    gsap.to(cardRef.current,    { y: -6, duration: 0.35, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' })
    gsap.to(textRef.current,    { y: 12, opacity: 0, duration: 0.3, ease: 'power2.in' })
    gsap.to(cardRef.current,    { y: 0,  duration: 0.3, ease: 'power2.in' })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden shadow-card cursor-pointer group"
    >
      {/* Photo */}
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={person.image}
          alt={person.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-105"
        />
      </div>

      {/* Hover overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/60 to-transparent"
        style={{ opacity: 0 }}
      >
        <div
          ref={textRef}
          className="absolute bottom-0 left-0 right-0 p-6"
          style={{ opacity: 0, transform: 'translateY(12px)' }}
        >
         
        </div>
      </div>

      {/* Always-visible name plate */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
        <h3 className="font-display font-bold text-white text-xl leading-tight">
          {person.name}
        </h3>
        <p className="text-brand-300 text-sm font-medium mt-0.5">{person.title}</p>
      </div>
    </div>
  )
}

export default function StaffSection() {
  return (
    <section className="section-padding bg-surface-soft">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Our Leadership</span>
          <h2 className="section-title mt-1">Meet Our Team</h2>
          <p className="section-subtitle mx-auto mt-4">
            Experienced professionals dedicated to connecting you with the right opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STAFF.map(person => (
            <StaffCard key={person.name} person={person} />
          ))}
        </div>
      </div>
    </section>
  )
}
