import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className || 'mb-8'}`}
    >
      <div>
        <h1 className="text-[28px] font-bold leading-[34px] tracking-tight text-[var(--text-1)] md:text-[32px] md:leading-10">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-base leading-[26px] text-[var(--text-2)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
