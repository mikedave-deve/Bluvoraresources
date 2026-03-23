import { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JobCard from "../components/JobCard";
import { JOBS, CATEGORIES, TYPES, LOCATIONS } from "../data/jobs";

gsap.registerPlugin(ScrollTrigger);

/* ── Filter pill ────────────────────────────────────────────── */
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
        ${
          active
            ? "bg-brand-600 text-white shadow-sm"
            : "bg-white border border-slate-200 text-ink-soft hover:border-brand-300 hover:text-brand-700"
        }`}
    >
      {label}
    </button>
  );
}

/* ── Select dropdown ────────────────────────────────────────── */
function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none bg-white border border-slate-200 text-ink-soft text-sm
                   rounded-xl pl-4 pr-10 py-2.5 cursor-pointer outline-none
                   focus:border-brand-400 focus:ring-2 focus:ring-brand-100
                   transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === "All" ? `${label}: All` : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
    </div>
  );
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [location, setLocation] = useState("All");
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  /* Header entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".jobs-header-el",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.1,
        },
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  /* Grid entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".job-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  /* Filtered results */
  const filtered = useMemo(() => {
    return JOBS.filter((job) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = category === "All" || job.category === category;
      const matchType = type === "All" || job.type === type;
      const matchLocation = location === "All" || job.location === location;
      return matchSearch && matchCat && matchType && matchLocation;
    });
  }, [search, category, type, location]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setType("All");
    setLocation("All");
  };
  const hasFilters =
    search || category !== "All" || type !== "All" || location !== "All";

  return (
    <>
      {/* ── Page Hero ── */}
      <div
        ref={headerRef}
        className="bg-brand-950 relative overflow-hidden pt-28 pb-16"
      >
        {/* Dot texture */}
        <div className="absolute inset-0 dots opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 bg-mesh pointer-events-none" />

        <div className="section-container relative z-10">
          <span className="jobs-header-el section-eyebrow text-brand-400 block mb-2">
            Career Opportunities
          </span>
          <h1 className="jobs-header-el font-display text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Find Your Perfect Role
          </h1>
          <p className="jobs-header-el text-lg text-white/60 max-w-xl leading-relaxed mb-10">
            Explore {JOBS.length}+ opportunities across industries. New
            positions added daily.
          </p>

          {/* Search bar */}
          <div className="jobs-header-el max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-subtle" />
              <input
                type="text"
                placeholder="Search by title, company, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl text-ink bg-white shadow-card
                           border-0 outline-none text-sm placeholder:text-ink-subtle
                           focus:ring-2 focus:ring-brand-400 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div
        className="sticky top-16 lg:top-20 z-40 bg-white/95 backdrop-blur-md
                      border-b border-slate-100 shadow-sm"
      >
        <div className="section-container py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <FilterPill
                  key={cat}
                  label={cat}
                  active={category === cat}
                  onClick={() => setCategory(cat)}
                />
              ))}
            </div>

            <div className="flex-1" />

            {/* Dropdowns */}
            <FilterSelect
              label="Type"
              value={type}
              options={TYPES}
              onChange={setType}
            />
            <FilterSelect
              label="Location"
              value={location}
              options={LOCATIONS}
              onChange={setLocation}
            />

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-ink-muted hover:text-brand-600
                           underline underline-offset-2 transition-colors duration-150"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <section className="section-padding bg-surface-soft">
        <div className="section-container">
          {/* Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-ink-muted font-medium">
              Showing{" "}
              <span className="text-ink font-bold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "result" : "results"}
              {hasFilters && " for current filters"}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-brand-600 font-semibold hover:text-brand-800 transition-colors"
              >
                Reset filters →
              </button>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((job) => (
                <div key={job.id} className="job-item">
                  <JobCard job={job} featured={job.featured} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-2xl text-ink mb-2">
                No jobs found
              </h3>
              <p className="text-ink-muted text-sm mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 bg-brand-50 border-t border-brand-100">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-bold text-ink mb-3">
            Don't see the right fit?
          </h2>
          <p className="text-ink-muted mb-7 max-w-md mx-auto">
            Submit your resume and we'll reach out when a role matches your
            profile.
          </p>
          <a href="/submit-resume" className="btn-primary px-8 py-3">
            Submit Your Resume
          </a>
        </div>
      </section>
    </>
  );
}

/* ── Icon helpers ───────────────────────────────────────────── */
function Search({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function ChevronDown({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
