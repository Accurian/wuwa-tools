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
  // Balance scale — weighing one Echo against another.
  return (
    <Svg className={className}>
      <path d="M12 4.5v14.5" />
      <path d="M6.5 19h11" />
      <path d="M4 6.5h16" />
      <path d="M4 6.5v3.2" />
      <path d="M2.3 9.7q1.7 2.9 3.4 0" />
      <path d="M20 6.5v3.2" />
      <path d="M18.3 9.7q1.7 2.9 3.4 0" />
    </Svg>
  )
}

export function IconProbability({ className }: IconProps) {
  // A die — the roll you're betting on.
  return (
    <Svg className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconResources({ className }: IconProps) {
  // Echo XP tube + Shell Credit coin — your stash at a glance.
  return (
    <Svg className={className}>
      <ellipse cx="8" cy="6.4" rx="4.2" ry="1.8" />
      <path d="M3.8 6.4v10.8a4.2 1.8 0 0 0 8.4 0V6.4" />
      <path d="M3.8 11.6a4.2 1.8 0 0 0 8.4 0" />
      <circle cx="17.4" cy="12" r="4" />
      <circle cx="17.4" cy="12" r="1.5" />
    </Svg>
  )
}

export function IconSun({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </Svg>
  )
}

export function IconMoon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </Svg>
  )
}

export function IconCheck({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Svg>
  )
}

export function IconEcho({ className }: IconProps) {
  // Four-point resonance spark — the brand mark.
  return (
    <Svg className={className}>
      <path d="M12 3c.6 4.4 1.6 5.4 6 6-4.4.6-5.4 1.6-6 6-.6-4.4-1.6-5.4-6-6 4.4-.6 5.4-1.6 6-6z" />
      <path d="M18.5 15.5c.3 2 .7 2.4 2.7 2.7-2 .3-2.4.7-2.7 2.7-.3-2-.7-2.4-2.7-2.7 2-.3 2.4-.7 2.7-2.7z" />
    </Svg>
  )
}
