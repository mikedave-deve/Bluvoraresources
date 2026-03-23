
export default function BluvoraLogo({
  variant = 'full',
  color = 'color',
  height = 40,
}) {
  const isWhite = color === 'white'
  const primary  = isWhite ? '#ffffff' : '#1d4ed8'
  const secondary= isWhite ? 'rgba(255,255,255,0.65)' : '#60a5fa'
  const text     = isWhite ? '#ffffff' : '#0f2255'

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 40 40"
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Bluvora Resources logo mark"
      >
        {/* Abstract connection / growth mark — two arcs forming a "B" shape */}
        <rect width="40" height="40" rx="10" fill={primary} />

        {/* Left vertical bar */}
        <rect x="10" y="10" width="5" height="20" rx="2.5" fill="white" />

        {/* Top arc */}
        <path
          d="M15 10 h7 a5 5 0 0 1 0 10 h-7"
          stroke="white" strokeWidth="5" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Bottom arc — slightly larger */}
        <path
          d="M15 20 h8 a6 6 0 0 1 0 10 h-8"
          stroke={secondary} strokeWidth="5" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    )
  }

  // Full horizontal lockup
  return (
    <svg
      viewBox="0 0 200 40"
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bluvora Resources"
    >
      {/* ── Mark ── */}
      <rect width="40" height="40" rx="10" fill={primary} />
      <rect x="10" y="10" width="5" height="20" rx="2.5" fill="white" />
      <path
        d="M15 10 h7 a5 5 0 0 1 0 10 h-7"
        stroke="white" strokeWidth="5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M15 20 h8 a6 6 0 0 1 0 10 h-8"
        stroke={secondary} strokeWidth="5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── Wordmark ── */}
      <text
        x="50"
        y="26"
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="30"
        fill={text}
        letterSpacing="-0.3"
      >
        Bluvora
      </text>
      <text
        x="50"
        y="36"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontWeight="600"
        fontSize="12"
        fill={isWhite ? 'rgba(255,255,255,0.65)' : '#64748b'}
        letterSpacing="2"
      >
        RESOURCES
      </text>
    </svg>
  )
}
