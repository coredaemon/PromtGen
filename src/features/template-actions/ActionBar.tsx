import { ClipboardCopy, Eraser, GitBranch, Save, Wand2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'

type ActionBarProps = {
  onCopy: () => void
  onSave?: () => void
  onDuplicate?: () => void
  onClear?: () => void
  onOpenInBuilder?: () => void
  extra?: ReactNode
  disabledSave?: boolean
}

export function ActionBar({
  onCopy,
  onSave,
  onDuplicate,
  onClear,
  onOpenInBuilder,
  extra,
  disabledSave,
}: ActionBarProps) {
  const hasSecondaryRow = onOpenInBuilder || onClear

  return (
    <>
      {/* Mobile: ТЗ — Copy+Save, затем Duplicate / Open, Clear текстом */}
      <div className="flex w-full min-w-0 flex-col gap-2.5 lg:hidden">
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="primary"
            size="lg"
            onClick={onCopy}
            className="min-h-[44px] w-full shadow-[var(--shadow-sm)]"
          >
            <ClipboardCopy className="h-4 w-4 shrink-0" aria-hidden />
            Копировать
          </Button>
          {onSave ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={onSave}
              disabled={disabledSave}
              className="min-h-[44px] w-full"
            >
              <Save className="h-4 w-4 shrink-0" aria-hidden />
              Сохранить
            </Button>
          ) : (
            <span className="min-h-[44px]" aria-hidden />
          )}
        </div>
        {onDuplicate || onOpenInBuilder ? (
          <div className="flex flex-col gap-2.5">
            {onDuplicate ? (
              <Button
                variant="ghost"
                size="md"
                onClick={onDuplicate}
                className="h-10 min-h-10 w-full justify-center font-medium"
              >
                <GitBranch className="h-4 w-4 shrink-0" aria-hidden />
                Дублировать
              </Button>
            ) : null}
            {onOpenInBuilder ? (
              <Button
                variant="ghost"
                size="md"
                onClick={onOpenInBuilder}
                className="h-10 min-h-10 w-full justify-center font-medium"
              >
                <Wand2 className="h-4 w-4 shrink-0" aria-hidden />
                Открыть в конструкторе
              </Button>
            ) : null}
          </div>
        ) : null}
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="mt-3 text-left text-sm font-medium leading-5 text-[var(--danger)] transition-opacity hover:opacity-90"
          >
            Очистить
          </button>
        ) : null}
        {extra ? <div className="flex flex-wrap gap-2">{extra}</div> : null}
      </div>

      {/* Desktop */}
      <div className="hidden w-full min-w-0 flex-col gap-3 lg:flex lg:max-w-none lg:flex-row lg:flex-wrap lg:items-center lg:justify-end lg:gap-x-3 lg:gap-y-2">
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={onCopy}
            className="min-w-[9rem] shadow-[var(--shadow-sm)]"
          >
            <ClipboardCopy className="h-4 w-4 shrink-0" aria-hidden />
            Копировать промт
          </Button>
          {onSave ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={onSave}
              disabled={disabledSave}
            >
              <Save className="h-4 w-4 shrink-0" aria-hidden />
              Сохранить
            </Button>
          ) : null}
          {onDuplicate ? (
            <Button variant="secondary" size="lg" onClick={onDuplicate}>
              <GitBranch className="h-4 w-4 shrink-0" aria-hidden />
              Дублировать
            </Button>
          ) : null}
        </div>

        {hasSecondaryRow ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-soft)] pt-3 lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0">
            {onOpenInBuilder ? (
              <Button variant="ghost" size="lg" onClick={onOpenInBuilder}>
                <Wand2 className="h-4 w-4 shrink-0" aria-hidden />
                Открыть в конструкторе
              </Button>
            ) : null}
            {onClear ? (
              <Button variant="dangerGhost" size="lg" onClick={onClear}>
                <Eraser className="h-4 w-4 shrink-0" aria-hidden />
                Очистить
              </Button>
            ) : null}
            {extra ? (
              <span className="inline-flex items-center gap-1">{extra}</span>
            ) : null}
          </div>
        ) : extra ? (
          <div className="inline-flex items-center gap-1">{extra}</div>
        ) : null}
      </div>
    </>
  )
}
