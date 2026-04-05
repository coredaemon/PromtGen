import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  /** Компактнее по вертикали (библиотека и т.п.) */
  compact?: boolean
}

export function EmptyState({
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={
        compact
          ? 'flex min-h-[220px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[var(--border-soft)] bg-[var(--surface-1)] p-5 text-center shadow-[var(--shadow-sm)] md:min-h-[260px] md:px-6 md:py-10'
          : 'flex flex-col items-center justify-center rounded-[18px] border border-dashed border-[var(--border-soft)] bg-[var(--surface-1)] px-6 py-12 text-center shadow-[var(--shadow-sm)]'
      }
    >
      <div
        className={
          compact
            ? 'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[var(--surface-2)] text-[var(--text-3)]'
            : 'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--text-3)]'
        }
      >
        <Inbox className="h-6 w-6" aria-hidden />
      </div>
      <p className="text-base font-semibold text-[var(--text-1)]">{title}</p>
      {description ? (
        <p className="mt-2 max-w-md text-[15px] leading-6 text-[var(--text-2)]">
          {description}
        </p>
      ) : null}
      {action ? (
        <div
          className={
            compact
              ? 'mt-4 [&_a]:inline-flex [&_a]:h-10 [&_a]:min-h-[40px] [&_a]:items-center [&_a]:justify-center [&_a]:rounded-[12px] [&_a]:px-4 [&_a]:text-[14px] [&_a]:font-semibold'
              : 'mt-4'
          }
        >
          {action}
        </div>
      ) : null}
    </div>
  )
}
