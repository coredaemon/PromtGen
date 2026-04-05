export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dangerGhost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 min-h-[36px] px-3.5 text-sm',
  md: 'h-10 min-h-10 px-4 text-sm md:min-h-[40px]',
  lg: 'h-11 min-h-[44px] px-4 text-sm',
}

export const variantClass: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)] disabled:opacity-50',
  secondary:
    'border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text-1)] hover:bg-[var(--surface-3)] active:bg-[var(--surface-4)] disabled:opacity-50',
  ghost:
    'border border-transparent bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]',
  dangerGhost:
    'border border-transparent bg-transparent text-[var(--danger)] hover:bg-[var(--surface-2)]',
}

const baseButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold leading-5 transition-[background-color,border-color,color,box-shadow,transform] duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:pointer-events-none'

export function buttonVisualClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className = '',
) {
  return [baseButtonClass, sizeClass[size], variantClass[variant], className].join(
    ' ',
  )
}
