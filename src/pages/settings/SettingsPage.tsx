import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PwaInstallCard } from '@/shared/ui/PwaInstallCard'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Button } from '@/shared/ui/Button'
import { useSettings } from '@/app/hooks/useSettings'
import type { FontScale, ThemePreference } from '@/entities/settings/types'
import { DEFAULT_SETTINGS } from '@/entities/settings/types'
import { parseImportJson } from '@/entities/prompt-template/validation'
import { serializeExport } from '@/features/import-export/io'
import { listTemplates, putTemplate } from '@/shared/storage/idb'
import { resetAllUserData } from '@/shared/storage/reset'

export function SettingsPage() {
  const location = useLocation()
  const { settings, setSettings } = useSettings()
  const [resetOpen, setResetOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importOk, setImportOk] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onExport = useCallback(async () => {
    const templates = await listTemplates()
    const json = serializeExport(templates)
    const name = `promtgen-export-${new Date().toISOString().slice(0, 10)}.json`
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Экспорт сохранён')
  }, [])

  const onImportFile = useCallback(async (file: File) => {
    setImportError(null)
    setImportOk(null)
    const text = await file.text()
    const parsed = parseImportJson(text)
    if (!parsed.ok) {
      setImportError(parsed.error)
      toast.error(`Ошибка импорта: ${parsed.error}`)
      return
    }
    let n = 0
    for (const t of parsed.templates) {
      await putTemplate(t)
      n += 1
    }
    const msg = `Импортировано шаблонов: ${n}`
    setImportOk(msg)
    toast.success('Импорт выполнен')
  }, [])

  const selectClass =
    'input-focus h-12 w-full rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-1)] dark:bg-[var(--surface-2)]'

  useEffect(() => {
    if (location.hash !== '#settings-data') return
    requestAnimationFrame(() => {
      document.getElementById('settings-data')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [location.hash, location.key])

  return (
    <div>
      <PageHeader
        title="Настройки"
        description="Тема, размер текста, формат по умолчанию и резервные копии."
      />

      <PwaInstallCard placement="settings" />

      <div className="flex max-w-5xl flex-col gap-4 lg:gap-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <section className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)] md:p-6">
          <h2 className="text-[18px] font-semibold leading-[26px] text-[var(--text-1)]">
            Внешний вид
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold leading-5 text-[var(--text-1)]">
                Тема
              </span>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: e.target.value as ThemePreference,
                  })
                }
                className={selectClass}
              >
                <option value="system">Как в системе</option>
                <option value="light">Светлая</option>
                <option value="dark">Тёмная</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold leading-5 text-[var(--text-1)]">
                Размер текста
              </span>
              <select
                value={settings.fontScale}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    fontScale: e.target.value as FontScale,
                  })
                }
                className={selectClass}
              >
                <option value="sm">Меньше</option>
                <option value="md">Обычный</option>
                <option value="lg">Крупнее</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)] md:p-6">
          <h2 className="text-[18px] font-semibold leading-[26px] text-[var(--text-1)]">
            Редактор
          </h2>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-[14px] font-semibold leading-5 text-[var(--text-1)]">
              Формат ответа по умолчанию
            </span>
            <span className="text-[13px] leading-[18px] text-[var(--text-3)]">
              Подставляется в новые шаблоны, если поле пустое.
            </span>
            <textarea
              value={settings.defaultOutputFormat}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultOutputFormat: e.target.value,
                })
              }
              rows={3}
              className="input-focus mt-1.5 min-h-[96px] w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3.5 text-base text-[var(--text-1)] dark:bg-[var(--surface-2)]"
            />
          </label>
        </section>
        </div>

        <section
          id="settings-data"
          className="scroll-mt-24 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)] md:p-6"
        >
          <h2 className="text-[18px] font-semibold leading-[26px] text-[var(--text-1)]">
            Данные
          </h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="primary"
              onClick={() => void onExport()}
              className="h-10 min-h-[40px] w-full rounded-[12px] text-[14px] font-semibold leading-5 sm:w-auto"
            >
              Экспорт шаблонов (JSON)
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
              className="h-10 min-h-[40px] w-full rounded-[12px] text-[14px] font-semibold leading-5 sm:w-auto"
            >
              Импорт из JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) void onImportFile(f)
              }}
            />
          </div>
          {importError ? (
            <p className="mt-4 text-[13px] text-[var(--danger)]">{importError}</p>
          ) : null}
          {importOk ? (
            <p className="mt-4 text-[13px] text-[var(--success)]">{importOk}</p>
          ) : null}
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="mt-4 text-sm font-semibold text-[var(--danger)] transition-opacity hover:opacity-90"
          >
            Сбросить локальные данные
          </button>
          <ConfirmDialog
            open={resetOpen}
            title="Сбросить все данные?"
            description="Будут удалены сохранённые шаблоны, история и настройки в этом браузере. Заготовки приложения останутся."
            confirmLabel="Сбросить"
            tone="danger"
            onCancel={() => setResetOpen(false)}
            onConfirm={async () => {
              await resetAllUserData()
              setSettings({ ...DEFAULT_SETTINGS })
              setResetOpen(false)
              window.location.reload()
            }}
          />
        </section>
      </div>
    </div>
  )
}
