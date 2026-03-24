import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatsCounter from "../components/StatsCounter";
import StaffSection from "../components/StaffSection";
import JobCard from "../components/JobCard";
import { JOBS } from "../data/jobs";


gsap.registerPlugin(ScrollTrigger);

/* ── Hero carousel data ─────────────────────────────────────── */
const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85",
    headline: "Find Your Next Great Opportunity",
    sub: "We connect ambitious professionals with industry-leading companies.",
    cta1: { label: "Browse Jobs", to: "/jobs" },
    cta2: { label: "Submit Resume", to: "/submit-resume" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=85",
    headline: "Talent That Drives Results",
    sub: "Our expert recruiters match the right candidates to the right roles — fast.",
    cta1: { label: "Hire Talent", to: "/#contact" },
    cta2: { label: "Learn More", to: "/about" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=85",
    headline: "Careers Built on Expertise",
    sub: "25+ years of staffing excellence across industries nationwide.",
    cta1: { label: "Our Story", to: "/about" },
    cta2: { label: "View Openings", to: "/jobs" },
  },
];

/* ── Services ───────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: "",
    title: "Direct Placement",
    desc: "Permanent placement solutions matching top candidates with full-time roles at leading organizations.",
  },
  {
    icon: "",
    title: "Contract Staffing",
    desc: "Flexible contract and temp-to-hire arrangements to scale your workforce on demand.",
  },
  {
    icon: "",
    title: "Executive Search",
    desc: "Confidential C-suite and VP-level recruitment for mission-critical leadership positions.",
  },
  {
    icon: "",
    title: "RPO Services",
    desc: "End-to-end recruitment process outsourcing to optimize your talent acquisition at scale.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   HeroCarousel
═══════════════════════════════════════════════════════════════ */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const autoRef = useRef(null);

  /* Auto-advance every 5s */
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % SLIDES.length;
      });
    }, 5000);
    return () => clearInterval(autoRef.current);
  }, []);

  /* Text entrance animation on slide change */
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      [headRef.current, subRef.current, ctaRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power3.out" },
    );
    return () => tl.kill();
  }, [current]);

  function goTo(idx) {
    clearInterval(autoRef.current);
    setPrev(current);
    setCurrent(idx);
  }

  return (
    <section
      className="relative  overflow-hidden"
      style={{ minHeight: "calc(100svh)" }}
    >
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 2 : 1,
          }}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Centered overlay — darker center-bottom for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/60 via-brand-950/65 to-brand-950/80" />
        </div>
      ))}

      {/* Content — fully centered vertically and horizontally */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-32">
        <div className="section-container">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Eyebrow pill */}
            <span
              className="inline-block text-xs font-semibold tracking-[0.22em] uppercase
                             text-brand-300 mb-7 border border-brand-400/40 rounded-full px-5 py-2
                             font-body"
            >
              Premier Staffing &amp; Recruitment
            </span>

            {/* Headline — Playfair Display, generous and elegant */}
            <h1
              ref={headRef}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-7"
              style={{ lineHeight: "1.06", letterSpacing: "-0.025em" }}
            >
              {SLIDES[current].headline}
            </h1>

            {/* Sub — DM Sans, comfortable reading width */}
            <p
              ref={subRef}
              className="text-lg sm:text-xl text-white/75 mb-11 max-w-xl mx-auto"
              style={{ lineHeight: "1.7", letterSpacing: "-0.005em" }}
            >
              {SLIDES[current].sub}
            </p>

            {/* CTAs — centered row */}
            <div ref={ctaRef} className="flex flex-wrap justify-center gap-4">
              <Link
                to={SLIDES[current].cta1.to}
                className="btn-primary px-9 py-4 text-base"
              >
                {SLIDES[current].cta1.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={SLIDES[current].cta2.to}
                className="btn-white px-9 py-4 text-base"
              >
                {SLIDES[current].cta2.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators — centered bottom */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 right-10 z-10 hidden lg:flex flex-col items-center gap-2">
        <span className="text-xs text-white/40 tracking-widest uppercase rotate-90 origin-center font-body">
          Scroll
        </span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/60 animate-[slideDown_1.6s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ServicesSection
═══════════════════════════════════════════════════════════════ */
function ServicesSection() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left: copy */}
          <div>
            <span className="section-eyebrow">What We Do</span>
            <h2 className="section-title mt-1 mb-5">
              Staffing Solutions{" "}
              <span className="text-gradient-blue">Built for You</span>
            </h2>
            <p className="section-subtitle mb-8">
              Whether you're a hiring manager seeking exceptional talent or a
              professional exploring your next step, Bluvora provides tailored
              workforce solutions at every level.
            </p>
            <Link to="/about" className="btn-outline">
              Learn About Our Approach <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="service-card card p-6 group cursor-default"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3
                  className="font-display font-bold text-lg text-ink mb-2
                               group-hover:text-brand-700 transition-colors duration-200"
                >
                  {title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FeaturedJobs
═══════════════════════════════════════════════════════════════ */
function FeaturedJobs() {
  const ref = useRef(null);
  const featured = JOBS.filter((j) => j.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-job-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding bg-surface-soft">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-eyebrow">Hot Roles</span>
            <h2 className="section-title mt-1">Featured Opportunities</h2>
          </div>
          <Link to="/jobs" className="btn-outline flex-shrink-0">
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((job) => (
            <div key={job.id} className="featured-job-card">
              <JobCard job={job} featured />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AboutBanner
═══════════════════════════════════════════════════════════════ */
function AboutBanner() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-content",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        },
      );
      gsap.fromTo(
        ".about-image",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="about-content">
            <span className="section-eyebrow">About Bluvora</span>
            <h2 className="section-title mt-1 mb-5">
              A Partner You Can{" "}
              <span className="text-gradient-blue">Count On</span>
            </h2>
            <p className="text-ink-muted leading-relaxed mb-5">
              Founded in 1999, Bluvora Resources has grown from a boutique
              staffing firm into one of America's most trusted recruitment
              partners. We operate across technology, finance, healthcare, and
              operations — with a singular focus on quality over quantity.
            </p>
            <p className="text-ink-muted leading-relaxed mb-8">
              Our team of 120+ specialized recruiters bring deep industry
              knowledge and a personal touch to every search. We don't just fill
              seats — we build careers and strengthen organizations.
            </p>
            <div className="divider" />
            <Link to="/about" className="btn-primary">
              Our Full Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: image collage */}
          <div className="about-image relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                alt="Team meeting"
                loading="lazy"
                className="rounded-2xl object-cover h-52 w-full shadow-card"
              />
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80"
                alt="Professional workspace"
                loading="lazy"
                className="rounded-2xl object-cover h-52 w-full shadow-card mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80"
                alt="Diverse team"
                loading="lazy"
                className="rounded-2xl object-cover h-44 w-full shadow-card -mt-4"
              />
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&q=80"
                alt="Office collaboration"
                loading="lazy"
                className="rounded-2xl object-cover h-44 w-full shadow-card mt-4"
              />
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-4 left-6 bg-brand-700 text-white
                            rounded-2xl px-5 py-4 shadow-blue-glow"
            >
              <p className="font-display font-bold text-3xl leading-none">
                25+
              </p>
              <p className="text-xs text-brand-200 mt-1">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CTABanner
═══════════════════════════════════════════════════════════════ */
function CTABanner() {
  return (
    <section className="py-20 bg-brand-700 relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-brand-600/40 pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-brand-800/40 pointer-events-none" />

      <div className="section-container relative z-10 text-center">
        <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5">
          Ready to Take the Next Step?
        </h2>
        <p className="text-brand-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Whether you're searching for top talent or your dream career, our team
          is here to guide you every step of the way.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/jobs" className="btn-white px-8 py-4 text-base">
            Browse Open Roles
          </Link>
          <Link
            to="/submit-resume"
            className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full
                       text-base hover:bg-white hover:text-brand-700 transition-all duration-300
                       inline-flex items-center gap-2"
          >
            Submit Your Resume
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RecognitionSection
═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   RecognitionSection
═══════════════════════════════════════════════════════════════ */
function RecognitionSection() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".recognition-content",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        }
      );

      gsap.fromTo(
        ".recognition-image",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding bg-surface-soft">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div className="recognition-content">
            <span className="section-eyebrow">Employee Excellence</span>

            <h2 className="section-title mt-1 mb-5">
              Award-Winning{" "}
              <span className="text-gradient-blue">
                Recognition Program
              </span>
            </h2>

            <p className="text-ink-muted leading-relaxed mb-5">
              We proudly recognize and reward outstanding team members through
              our award-winning employee recognition program. This initiative is
              designed to identify individuals with exceptional potential and
              performance.
            </p>

            <p className="text-ink-muted leading-relaxed mb-8">
              Top performers gain access to career growth opportunities,
              advancement pathways, and exclusive incentives — ensuring that
              excellence is always seen, valued, and rewarded.
            </p>

            <div className="divider" />

            <Link to="/submit-resume" className="btn-primary">
              Join Our Team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Image */}
          <div className="recognition-image relative">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80"
              alt="Employee recognition and teamwork"
              loading="lazy"
              className="rounded-2xl object-cover w-full h-[420px] shadow-card"
            />

            {/* Floating badge */}
            <div
              className="absolute -bottom-4 left-6 bg-brand-700 text-white
                         rounded-2xl px-5 py-4 shadow-blue-glow"
            >
              <p className="font-display font-bold text-2xl leading-none">
                Top Talent
              </p>
              <p className="text-xs text-brand-200 mt-1">
                Recognized & Rewarded
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TestimonialsSection — auto-advancing GSAP carousel
═══════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    quote:
      "Bluvora placed me in my dream role within three weeks. Their team took the time to truly understand what I was looking for — not just the job title, but the culture and growth potential.",
    name: "Danielle Okafor",
    title: "Senior Product Manager, Nexlify Corp",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
  },
  {
    quote:
      "As a hiring manager, I’ve worked with many staffing firms. Bluvora stands apart — every candidate they sent was genuinely qualified and culturally aligned. We hired three through them in one quarter.",
    name: "James Whitfield",
    title: "VP of Engineering, BuildCo Infrastructure",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    quote:
      "I was nervous about changing industries. The recruiter at Bluvora guided me through every step, coached me for interviews, and negotiated a salary 20% above what I expected.",
    name: "Sofia Reyes",
    title: "Financial Analyst, Summit Capital Group",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  },
  {
    quote:
      "The team is incredibly responsive and professional. They filled a critical ICU nursing role in under two weeks during our busiest season. We now use Bluvora exclusively.",
    name: "Dr. Marcus Webb",
    title: "Chief Nursing Officer, Greenfield Medical Center",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80",
  },
  {
    quote:
      "What sets Bluvora apart is the personal attention. I never felt like a number — they remembered details from our first call months later and kept checking in even after my placement.",
    name: "Priya Anand",
    title: "Marketing Director, BrightEdge Media",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80",
  },
];

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const slideRef = useRef(null);
  const autoRef = useRef(null);
  const sectionRef = useRef(null);

  /* Auto-advance every 5s */
  useEffect(() => {
    autoRef.current = setInterval(() => advance(1), 5500);
    return () => clearInterval(autoRef.current);
  }, [current]);

  /* Section entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function animateSlide(dir, nextIdx) {
    if (animating || !slideRef.current) return;
    setAnimating(true);
    gsap.to(slideRef.current, {
      opacity: 0,
      x: dir * -40,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setCurrent(nextIdx);
        gsap.fromTo(
          slideRef.current,
          { opacity: 0, x: dir * 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: "power3.out",
            onComplete: () => setAnimating(false),
          },
        );
      },
    });
  }

  function advance(dir) {
    clearInterval(autoRef.current);
    const next = (current + dir + TESTIMONIALS.length) % TESTIMONIALS.length;
    animateSlide(dir, next);
  }

  const t = TESTIMONIALS[current];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-brand-950 relative overflow-hidden"
    >
      {/* Subtle texture */}
      <div className="absolute inset-0 dots opacity-[0.035] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="testimonial-header text-center mb-16">
          <span className="section-eyebrow text-brand-400">Client Voices</span>
          <h2
            className="font-display text-4xl lg:text-5xl font-bold text-white mt-1"
            style={{ letterSpacing: "-0.02em", lineHeight: "1.1" }}
          >
            What Our Clients Say
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          {/* Slide */}
          <div ref={slideRef} className="text-center">
            {/* Large quote mark */}
            <div
              className="font-display text-8xl leading-none text-brand-700 mb-4 select-none"
              aria-hidden="true"
            >
              "
            </div>

            {/* Quote */}
            <blockquote
              className="font-display text-xl sm:text-2xl text-white/90 italic mb-10"
              style={{ lineHeight: "1.55", letterSpacing: "-0.01em" }}
            >
              {t.quote}
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center justify-center gap-4">
              {/* Avatar initials */}
              <div className="w-12 h-12 rounded-full border-2 border-brand-500 overflow-hidden flex-shrink-0">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-white text-sm">
                  {t.name}
                </p>
                <p className="font-body text-brand-400 text-xs mt-0.5">
                  {t.title}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            {/* Prev */}
            <button
              onClick={() => advance(-1)}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-white/20 text-white/60
                         hover:border-brand-500 hover:text-white hover:bg-brand-700
                         flex items-center justify-center transition-all duration-200"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    clearInterval(autoRef.current);
                    animateSlide(i > current ? 1 : -1, i);
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2 bg-brand-500"
                      : "w-2 h-2 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => advance(1)}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-white/20 text-white/60
                         hover:border-brand-500 hover:text-white hover:bg-brand-700
                         flex items-center justify-center transition-all duration-200"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Inline arrow icon ──────────────────────────────────────── */
function ArrowRight({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Home (export)
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <HeroCarousel />
      <ServicesSection />
      <FeaturedJobs />
      <StatsCounter />
      <AboutBanner />
      <StaffSection />
      <RecognitionSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}
