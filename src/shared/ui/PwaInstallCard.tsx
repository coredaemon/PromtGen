import { Download, X } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useInstallPrompt } from '@/shared/pwa/useInstallPrompt'

type Placement = 'home' | 'more' | 'settings'

type PwaInstallCardProps = {
  placement?: Placement
}

export function PwaInstallCard({ placement = 'home' }: PwaInstallCardProps) {
  const {
    shouldShowInstallCard,
    deferredPrompt,
    promptInstall,
    dismissInstallCard,
    isStandalone,
  } = useInstallPrompt()

  const showInSettings = placement === 'settings' && !isStandalone
  const showGated =
    placement !== 'settings' && shouldShowInstallCard && !isStandalone

  if (!showInSettings && !showGated) return null

  const canPrompt = Boolean(deferredPrompt)

  return (
    <div
      className={
        placement === 'settings'
          ? 'flex flex-col gap-3 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)]'
          : 'mb-6 flex flex-col gap-3 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between'
      }
    >
      <div>
        <p className="font-semibold text-[var(--text-1)]">
          Установить PromtGen
        </p>
        <p className="mt-1 text-[15px] leading-6 text-[var(--text-2)]">
          {canPrompt
            ? 'Быстрый доступ с экрана и работа без сети для сохранённых данных.'
            : 'В этом браузере установка через кнопку недоступна. Откройте меню браузера и выберите «Установить приложение» или «Добавить на главный экран».'}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {placement !== 'settings' ? (
          <button
            type="button"
            onClick={dismissInstallCard}
            className="inline-flex items-center gap-1 rounded-[12px] p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
            aria-label="Скрыть"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
        {canPrompt ? (
          <Button type="button" variant="primary" onClick={() => void promptInstall()}>
            <Download className="h-4 w-4" aria-hidden />
            Установить
          </Button>
        ) : null}
      </div>
    </div>
  )
}
