export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-8 w-8 animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="url(#spinner-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="spinner-gradient" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
