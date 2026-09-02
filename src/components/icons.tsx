interface IconProps {
  className?: string
}

function Svg({ children, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconHome({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </Svg>
  )
}

export function IconValue({ className }: IconProps) {
  // Echo "crystal" — a gem with a resonance pulse.
  return (
    <Svg className={className}>
      <path d="M12 3l5 5-5 13L7 8l5-5z" />
      <path d="M7 8h10" />
      <path d="M12 3v5" />
      <path d="M12 8v13" />
    </Svg>
  )
}

export function IconProbability({ className }: IconProps) {
  // Donut chart for roll probability.
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12V3" />
      <path d="M12 12l7 4.8" />
    </Svg>
  )
}

export function IconResources({ className }: IconProps) {
  // An Echo XP tube / resource cylinder.
  return (
    <Svg className={className}>
      <path d="M5 5c0-1.66 3.13-3 7-3s7 1.34 7 3v14c0 1.66-3.13 3-7 3s-7-1.34-7-3V5z" />
      <path d="M5 5c0 1.66 3.13 3 7 3s7-1.34 7-3" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </Svg>
  )
}
