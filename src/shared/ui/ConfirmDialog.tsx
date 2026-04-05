import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  tone = 'default',
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(7,17,31,0.45)] p-4 backdrop-blur-[2px] sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="max-h-[min(90dvh,520px)] w-full max-w-md overflow-y-auto rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-lg)] sm:p-6"
      >
        <h2
          id="confirm-title"
          className="text-lg font-semibold text-[var(--text-1)]"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[15px] leading-6 text-[var(--text-2)]">
            {description}
          </p>
        ) : null}
        {children}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          {tone === 'danger' ? (
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-11 min-h-[44px] w-full items-center justify-center rounded-[12px] border border-transparent bg-[var(--danger)] px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-[140ms] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:h-10 sm:min-h-10 sm:w-auto"
            >
              {confirmLabel}
            </button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              className="w-full sm:w-auto"
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
