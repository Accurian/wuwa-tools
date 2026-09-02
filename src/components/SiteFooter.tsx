import { href } from '../lib/paths'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-2 px-5 py-6 text-center text-xs text-faint sm:flex-row sm:justify-between sm:text-left">
        <p>
          Community calculators for{' '}
          <a
            href={href('')}
            className="text-muted transition-colors hover:text-gold"
          >
            Wuthering Waves
          </a>{' '}
          Echo planning.
        </p>
        <p>
          All client-side &middot; no data leaves your browser &middot; no tracking
        </p>
      </div>
    </footer>
  )
}
