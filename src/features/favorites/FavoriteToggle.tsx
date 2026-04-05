import { Star } from 'lucide-react'

type FavoriteToggleProps = {
  active: boolean
  onToggle: () => void
  label?: string
  className?: string
}

export function FavoriteToggle({
  active,
  onToggle,
  label = 'Избранное',
  className = '',
}: FavoriteToggleProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className={
        active
          ? `inline-flex h-10 items-center gap-2 rounded-[999px] border border-transparent bg-[var(--accent-soft)] px-4 text-sm font-semibold leading-5 text-[var(--accent)] transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] ${className}`
          : `inline-flex h-10 items-center gap-2 rounded-[999px] border border-[var(--border-soft)] bg-transparent px-4 text-sm font-semibold leading-5 text-[var(--text-2)] transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] ${className}`
      }
      aria-pressed={active}
      aria-label={label}
    >
      <Star
        className={`h-4 w-4 shrink-0 ${active ? 'fill-current text-[var(--accent)]' : ''}`}
        aria-hidden
      />
      {label}
    </button>
  )
}
