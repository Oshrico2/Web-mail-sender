// The Talpiot mark redrawn as vector: gold arch over three peaks.
export default function BrandMark({ className, title }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
    >
      <defs>
        <linearGradient id="tlp-gold" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#F0D383" />
          <stop offset="1" stopColor="#B87A30" />
        </linearGradient>
      </defs>
      <path d="M17 24a15 15 0 0 1 30 0" fill="none" stroke="url(#tlp-gold)" strokeWidth="5" />
      <path d="M9 56 21 30l5 10" fill="none" stroke="#C9CBC6" strokeWidth="4" strokeLinejoin="round" />
      <path d="M38 40l5-10 12 26" fill="none" stroke="#C9CBC6" strokeWidth="4" strokeLinejoin="round" />
      <path d="M19 56 32 26l13 30" fill="none" stroke="url(#tlp-gold)" strokeWidth="5.5" strokeLinejoin="round" />
    </svg>
  );
}
