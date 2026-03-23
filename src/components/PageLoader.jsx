import BluvoraLogo from './Logo'

export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <BluvoraLogo height={44} />
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
