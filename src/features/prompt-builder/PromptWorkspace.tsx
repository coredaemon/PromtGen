import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ClipboardCopy } from 'lucide-react'
import type { PromptFields } from '@/entities/prompt-template/types'
import { PromptFieldTextarea } from '@/features/prompt-builder/PromptFieldTextarea'
import { PromptModeSwitch } from '@/features/prompt-builder/PromptModeSwitch'
import { PromptPreview } from '@/features/prompt-preview/PromptPreview'
import { copyToClipboard } from '@/shared/lib/clipboard'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Button } from '@/shared/ui/Button'
import type { ReactNode } from 'react'

type PromptWorkspaceProps = {
  advanced: boolean
  onAdvancedChange: (v: boolean) => void
  fields: PromptFields
  onFieldsChange: (next: PromptFields) => void
  builtPrompt: string
  actions: ReactNode
  meta?: ReactNode
}

export function PromptWorkspace({
  advanced,
  onAdvancedChange,
  fields,
  onFieldsChange,
  builtPrompt,
  actions,
  meta,
}: PromptWorkspaceProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [hasScrolledDown, setHasScrolledDown] = useState(false)
  const [promptFieldFocused, setPromptFieldFocused] = useState(false)
  const fieldsColumnRef = useRef<HTMLDivElement>(null)
  const isLg = useMediaQuery('(min-width: 1024px)')

  const hasFieldContent = useMemo(
    () =>
      Object.values(fields).some(
        (v) => typeof v === 'string' && v.trim().length > 0,
      ),
    [fields],
  )

  const showMobileFab =
    Boolean(builtPrompt.trim()) || hasFieldContent || hasScrolledDown

  const showMobileFabBar =
    !isLg && showMobileFab && !promptFieldFocused

  useLayoutEffect(() => {
    if (isLg) return
    const root = fieldsColumnRef.current
    if (!root) return

    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLTextAreaElement && root.contains(e.target)) {
        setPromptFieldFocused(true)
      }
    }
    const onFocusOut = () => {
      requestAnimationFrame(() => {
        const a = document.activeElement
        if (!(a instanceof HTMLTextAreaElement && root.contains(a))) {
          setPromptFieldFocused(false)
        }
      })
    }

    root.addEventListener('focusin', onFocusIn)
    root.addEventListener('focusout', onFocusOut)
    return () => {
      root.removeEventListener('focusin', onFocusIn)
      root.removeEventListener('focusout', onFocusOut)
    }
  }, [isLg])

  useEffect(() => {
    if (isLg) return
    const onScroll = () => {
      if (window.scrollY > 32) setHasScrolledDown(true)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLg])

  const set =
    (key: keyof PromptFields) => (value: string) =>
      onFieldsChange({ ...fields, [key]: value })

  useEffect(() => {
    if (!previewOpen || isLg) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [previewOpen, isLg])

  const onSheetCopy = async () => {
    const ok = await copyToClipboard(builtPrompt)
    if (!ok) {
      toast.error('Не удалось скопировать')
      return
    }
    toast.success('Промт скопирован')
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <PromptModeSwitch advanced={advanced} onChange={onAdvancedChange} />
        <div className="min-w-0 w-full flex-1 lg:flex lg:max-w-[min(100%,42rem)] lg:justify-end">
          {actions}
        </div>
      </div>

      {meta}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div
          ref={fieldsColumnRef}
          className={
            isLg
              ? 'flex min-w-0 flex-col gap-5 lg:col-span-7 lg:pb-0'
              : [
                  'flex min-w-0 flex-col gap-5 lg:col-span-7 lg:pb-0',
                  showMobileFabBar
                    ? 'pb-[calc(68px+12px+44px+16px+env(safe-area-inset-bottom,0px))]'
                    : 'pb-8',
                ].join(' ')
          }
        >
          <PromptFieldTextarea
            id="field-role"
            label="Роль"
            value={fields.role}
            onChange={set('role')}
            placeholder="Например: ты — редактор и стилист"
          />
          <PromptFieldTextarea
            id="field-task"
            label="Задача"
            value={fields.task}
            onChange={set('task')}
            placeholder="Что нужно сделать модели"
          />
          <PromptFieldTextarea
            id="field-context"
            label="Контекст"
            value={fields.context}
            onChange={set('context')}
            placeholder="Факты, вводный текст, ограничения предметной области"
            rows={5}
          />
          <PromptFieldTextarea
            id="field-output"
            label="Формат ответа"
            value={fields.outputFormat}
            onChange={set('outputFormat')}
            placeholder="Структура, списки, тон ответа"
          />

          {advanced ? (
            <>
              <PromptFieldTextarea
                id="field-constraints"
                label="Ограничения"
                value={fields.constraints}
                onChange={set('constraints')}
              />
              <PromptFieldTextarea
                id="field-negative"
                label="Что нельзя делать"
                value={fields.negativeConstraints}
                onChange={set('negativeConstraints')}
              />
              <PromptFieldTextarea
                id="field-tone"
                label="Тон"
                value={fields.tone}
                onChange={set('tone')}
              />
              <PromptFieldTextarea
                id="field-style"
                label="Стиль"
                value={fields.style}
                onChange={set('style')}
              />
              <PromptFieldTextarea
                id="field-length"
                label="Длина ответа"
                value={fields.length}
                onChange={set('length')}
              />
              <PromptFieldTextarea
                id="field-examples"
                label="Примеры"
                value={fields.examples}
                onChange={set('examples')}
                rows={5}
              />
              <PromptFieldTextarea
                id="field-extra"
                label="Дополнительные инструкции"
                value={fields.additionalInstructions}
                onChange={set('additionalInstructions')}
                rows={4}
              />
            </>
          ) : null}
        </div>

        {isLg ? (
          <div className="lg:col-span-5">
            <div
              className="lg:sticky lg:max-h-[calc(100vh-140px)]"
              style={{ top: 'var(--preview-sticky-top)' }}
            >
              <PromptPreview text={builtPrompt} />
            </div>
          </div>
        ) : null}
      </div>

      {showMobileFabBar ? (
        <div
          className="pointer-events-none fixed inset-x-4 z-[45] flex justify-center"
          style={{
            bottom: 'calc(68px + 12px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <button
            type="button"
            className="pointer-events-auto flex h-11 w-full max-w-none items-center justify-center rounded-[14px] border border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[14px] font-semibold leading-5 text-[var(--accent)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,transform] duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.99]"
            onClick={() => setPreviewOpen(true)}
          >
            Показать итог
          </button>
        </div>
      ) : null}

      {!isLg && previewOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-sheet-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(18,32,51,0.18)] backdrop-blur-[2px] transition-opacity duration-[220ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] dark:bg-[rgba(0,0,0,0.48)]"
            aria-label="Закрыть предпросмотр"
            onClick={() => setPreviewOpen(false)}
          />
          <div
            className="relative z-10 flex w-full max-h-[min(82vh,calc(100dvh-16px))] flex-col rounded-t-[24px] border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-[var(--shadow-lg)] transition-transform duration-[220ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              height: 'min(72vh, calc(100dvh - env(safe-area-inset-bottom, 0px) - 24px))',
              marginBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <div className="flex shrink-0 flex-col border-b border-[var(--border-soft)] px-5 pb-5 pt-5">
              <div
                className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-[999px] bg-[var(--border-strong)]"
                aria-hidden
              />
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2
                  id="preview-sheet-title"
                  className="text-base font-semibold text-[var(--text-1)]"
                >
                  Итоговый промт
                </h2>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => void onSheetCopy()}
                  className="h-11 min-h-[44px] w-full shrink-0 justify-center sm:w-auto"
                >
                  <ClipboardCopy className="h-4 w-4 shrink-0" aria-hidden />
                  Копировать
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-5 pt-2">
              <pre className="font-sans whitespace-pre-wrap break-words text-[15px] leading-[26px] text-[var(--text-1)]">
                {builtPrompt.trim()
                  ? builtPrompt
                  : 'Заполните поля выше — здесь появится итоговый промт.'}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
