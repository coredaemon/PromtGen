import { useState } from 'react'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Button } from '@/shared/ui/Button'
import { usePwaDraft } from '@/shared/pwa/usePwaDraft'
import { usePwaUpdate } from '@/shared/pwa/usePwaUpdate'

export function PwaUpdateToast() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { needRefresh, updateServiceWorker, dismissUpdate } = usePwaUpdate()
  const { draftDirty } = usePwaDraft()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!needRefresh) return null

  const bottom = isDesktop
    ? '24px'
    : 'calc(68px + 12px + env(safe-area-inset-bottom, 0px))'

  const runUpdate = () => {
    void updateServiceWorker(true)
  }

  const onUpdateClick = () => {
    if (draftDirty) {
      setConfirmOpen(true)
      return
    }
    runUpdate()
  }

  return (
    <>
      <div
        className="fixed left-1/2 z-[100] w-[min(100vw-24px,400px)] -translate-x-1/2 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4 shadow-[var(--shadow-lg)]"
        style={{ bottom }}
        role="status"
      >
        <p className="text-sm font-semibold text-[var(--text-1)]">
          Доступна новая версия
        </p>
        <p className="mt-1 text-[13px] leading-5 text-[var(--text-2)]">
          Обновите приложение, чтобы получить последние исправления.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="primary" onClick={onUpdateClick}>
            Обновить
          </Button>
          <Button type="button" variant="ghost" onClick={dismissUpdate}>
            Позже
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Сохранить изменения?"
        description="У вас есть несохранённый ввод. После обновления страница перезагрузится — сначала сохраните шаблон, если нужно."
        confirmLabel="Обновить всё равно"
        cancelLabel="Отмена"
        tone="default"
        onConfirm={() => {
          setConfirmOpen(false)
          runUpdate()
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
