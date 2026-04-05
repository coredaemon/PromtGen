type SectionTitleProps = {
  children: string
  /** Override bottom margin (default mb-4 = 16px) */
  className?: string
  /** Default is semibold; `medium` matches section labels that should sit lighter on mobile home. */
  weight?: 'semibold' | 'medium'
}

export function SectionTitle({
  children,
  className,
  weight = 'semibold',
}: SectionTitleProps) {
  const fontClass = weight === 'medium' ? 'font-medium' : 'font-semibold'
  return (
    <h2
      className={`text-[20px] ${fontClass} leading-7 tracking-tight text-[var(--text-1)] ${className ?? 'mb-4'}`}
    >
      {children}
    </h2>
  )
}
