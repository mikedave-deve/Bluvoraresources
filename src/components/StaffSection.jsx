import { useRef } from "react";
import { gsap } from "gsap";
import CEO from "../assets/CEONELSONGONZALEZ.jpeg";
import HIRINGMANAGER from "../assets/ANNGELIACRUZ.jpeg";
import SUPERVISOR from "../assets/ROBERTLINDERMAN.jpeg";
import HR from "../assets/1st blu.jpeg";
import CRM from "../assets/2nd blu.jpeg";
import CV from "../assets/3rd blu.jpeg";

const STAFF = [
  {
    name: "NELSON GONZALEZ",
    title: "CEO & FOUNDER",
    description:
      "With 20+ years in executive search,  Nelson built Bluvora to bridge the gap between exceptional talent and transformational opportunities.",
    image: CEO,
    linkedin: "#",
  },
  {
    name: "ANNGELIA CRUZ",
    title: "HIRING MANAGER",
    description:
      "Former engineering lead turned recruiter, Angelina specializes in placing top-tier tech talent across Fortune 500 companies and high-growth startups.",
    image: HIRINGMANAGER,
    linkedin: "#",
  },
  {
    name: "ROBERT LINDERMAN",
    title: "SUPERVISOR",
    description:
      "Robert ensures every client partnership exceeds expectations, managing relationships with over 200 leading organizations across diverse industries.",
    image: SUPERVISOR,
    linkedin: "#",
  },
  {
    name: "KATHERINE STRATMAN",
    title: "TALENT ACQUISITION SPECIALIST",
    description:
      "Katherine brings 8 years of recruiting expertise, with a passion for matching candidates with roles where they can truly thrive and grow.",
    image: HR,
    linkedin: "#",
  },
  {
    name: "CORY GUINTA",
    title: "CLIENT RELATIONS MANAGER",
    description:
      "Cory cultivates lasting partnerships with our employer network, ensuring every client receives tailored staffing solutions that drive results.",
    image: CRM,
    linkedin: "#",
  },
  {
    name: "SARAH BRUNE",
    title: "COMPANY VENDOR",
    description:
      "Sarah supports company operations by supplying essential products or services, ensuring quality, reliability, and timely delivery to meet organizational needs.",
    image: CV,
    linkedin: "#",
  },
];

function StaffCard({ person }) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(textRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(cardRef.current, { y: -6, duration: 0.35, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(textRef.current, {
      y: 12,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: "power2.in" });
  };

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
          style={{ opacity: 0, transform: "translateY(12px)" }}
        ></div>
      </div>

      {/* Always-visible name plate */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
        <h3 className="font-display font-bold text-white text-xl leading-tight">
          {person.name}
        </h3>
        <p className="text-brand-300 text-sm font-medium mt-0.5">
          {person.title}
        </p>
      </div>
    </div>
  );
}

function EmployeeOfTheMonth() {
  const employee = STAFF[4]; // CORY GUINTA — Admin Assistant
  const ceo = STAFF[0]; // NELSON GONZALEZ

  return (
    <div className="mt-24 max-w-5xl mx-auto">
      {/* Section label */}
      <div className="text-center mb-12">
        <span className="section-eyebrow">Recognition</span>
        <h2 className="section-title mt-1">Employee of the Month</h2>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900 to-brand-950 shadow-card-hover">
        {/* Dot texture overlay */}
        <div className="absolute inset-0 dots opacity-[0.05] pointer-events-none" />

        {/* Gold accent ring top-left */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* ── Left: Photo ─────────────────────────────────── */}
          <div className="relative">
            {/* Gold badge ribbon */}
            <div
              className="absolute top-6 left-6 z-20 flex items-center gap-2
                            bg-amber-400 text-amber-950 text-xs font-bold
                            tracking-widest uppercase px-4 py-2 rounded-full shadow-lg"
            >
              <StarIcon className="w-3.5 h-3.5" />
              Employee of the Month
            </div>

            <div className="aspect-[3/4] lg:aspect-auto lg:h-full min-h-[420px] overflow-hidden">
              <img
                src={employee.image}
                alt={employee.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Gradient fade into right panel on desktop */}
            <div
              className="hidden lg:block absolute inset-y-0 right-0 w-24
                            bg-gradient-to-r from-transparent to-brand-900"
            />
          </div>

          {/* ── Right: Content ──────────────────────────────── */}
          <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
            {/* Trophy icon */}
            <div
              className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30
                            flex items-center justify-center mb-8"
            >
              <TrophyIcon className="w-7 h-7 text-amber-400" />
            </div>

            <h3 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-1">
              {employee.name}
            </h3>
            <p className="text-brand-300 text-sm font-semibold tracking-widest uppercase mb-6">
              {employee.title}
            </p>

            {/* Divider */}
            <div className="w-12 h-0.5 bg-amber-400 rounded-full mb-8" />

            {/* CEO Quote */}
            <div className="relative">
              <QuoteIcon className="absolute -top-2 -left-1 w-8 h-8 text-brand-600 opacity-60" />
              <blockquote className="pl-6 text-white/80 text-base leading-relaxed italic font-body mb-8">
                Cory exemplifies everything we stand for at Bluvora —
                reliability, heart, and an unwavering commitment to our clients
                and candidates alike. Every day, she shows up with energy that
                lifts the entire team. It is an honor to recognize her this
                month.
              </blockquote>
            </div>

            {/* CEO Attribution */}
            <div className="flex items-center gap-4 mt-auto">
              <img
                src={ceo.image}
                alt={ceo.name}
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-brand-500 shadow-blue-glow"
              />
              <div>
                <p className="text-white text-sm font-bold font-display">
                  {ceo.name}
                </p>
                <p className="text-brand-400 text-xs font-semibold tracking-wide uppercase">
                  {ceo.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffSection() {
  return (
    <section className="section-padding bg-surface-soft">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Our Leadership</span>
          <h2 className="section-title mt-1">Meet Our Team</h2>
          <p className="section-subtitle mx-auto mt-4">
            Experienced professionals dedicated to connecting you with the right
            opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STAFF.map((person) => (
            <StaffCard key={person.name} person={person} />
          ))}
        </div>

        <EmployeeOfTheMonth />
      </div>
    </section>
  );
}

/* ── Icons ───────────────────────────────────────────────────── */
function StarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function TrophyIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}
function QuoteIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.3 4C6.6 5.5 4 9 4 13.5c0 2.6 1.5 4.5 3.5 4.5 1.8 0 3-1.3 3-3.1 0-1.7-1.1-2.9-2.8-2.9-.3 0-.6 0-.9.1.3-2.2 1.8-4.1 4.5-5.3L11.3 4zm8.5 0c-4.7 1.5-7.3 5-7.3 9.5 0 2.6 1.5 4.5 3.5 4.5 1.8 0 3-1.3 3-3.1 0-1.7-1.1-2.9-2.8-2.9-.3 0-.6 0-.9.1.3-2.2 1.8-4.1 4.5-5.3L19.8 4z" />
    </svg>
  );
}
