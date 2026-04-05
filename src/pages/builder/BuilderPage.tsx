import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom'
import { createNewTemplate } from '@/entities/prompt-template/factory'
import type { PromptFields } from '@/entities/prompt-template/types'
import { emptyPromptFields } from '@/entities/prompt-template/types'
import { useSettings } from '@/app/hooks/useSettings'
import { loadSettings } from '@/entities/settings/types'
import { buildPrompt } from '@/shared/lib/buildPrompt'
import { copyToClipboard } from '@/shared/lib/clipboard'
import {
  addHistoryEntry,
  putTemplate,
} from '@/shared/storage/idb'
import { pushRecentItem } from '@/shared/storage/localPreferences'
import { ActionBar } from '@/features/template-actions/ActionBar'
import { PromptWorkspace } from '@/features/prompt-builder/PromptWorkspace'
import { PageHeader } from '@/shared/ui/PageHeader'
import { templateDraftFingerprint } from '@/shared/pwa/templateFingerprint'
import { usePwaDraft } from '@/shared/pwa/usePwaDraft'

type BuilderLocationState = {
  fields?: PromptFields
  title?: string
}

export function BuilderPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { settings } = useSettings()
  const { setDraftDirty } = usePwaDraft()
  const [advanced, setAdvanced] = useState(false)
  const [template, setTemplate] = useState(() => {
    const st = location.state as BuilderLocationState | null
    if (st?.fields) {
      return createNewTemplate({
        title: st.title ?? 'Из редактора',
        fields: { ...emptyPromptFields(), ...st.fields },
      })
    }
    return createNewTemplate({
      title: 'Новый промт',
      fields: {
        ...emptyPromptFields(),
        outputFormat: loadSettings().defaultOutputFormat,
      },
    })
  })

  const savedFingerprint = useRef(templateDraftFingerprint(template))

  useEffect(() => {
    const st = location.state as BuilderLocationState | null
    if (st?.fields) {
      void navigate('/builder', { replace: true, state: null })
    }
  }, [location.state, navigate])

  useEffect(() => {
    setDraftDirty(
      templateDraftFingerprint(template) !== savedFingerprint.current,
    )
  }, [template, setDraftDirty])

  useEffect(() => () => setDraftDirty(false), [setDraftDirty])

  const built = useMemo(() => buildPrompt(template.fields), [template.fields])

  const onCopy = useCallback(async () => {
    const ok = await copyToClipboard(built)
    if (!ok) {
      toast.error('Не удалось скопировать')
      return
    }
    toast.success('Промт скопирован')
    const id = crypto.randomUUID()
    await addHistoryEntry({
      id,
      title: template.title || 'Свободный режим',
      result: built,
      createdAt: new Date().toISOString(),
    })
  }, [built, template.title])

  const onSave = useCallback(async () => {
    await putTemplate(template)
    savedFingerprint.current = templateDraftFingerprint(template)
    setDraftDirty(false)
    pushRecentItem({ kind: 'user', id: template.id })
    toast.success('Шаблон сохранён')
    void navigate(`/editor/${template.id}`)
  }, [navigate, template, setDraftDirty])

  const onClear = useCallback(() => {
    const next = createNewTemplate({
      title: 'Новый промт',
      fields: {
        ...emptyPromptFields(),
        outputFormat: settings.defaultOutputFormat,
      },
    })
    savedFingerprint.current = templateDraftFingerprint(next)
    setTemplate(next)
    setDraftDirty(false)
  }, [settings.defaultOutputFormat, setDraftDirty])

  return (
    <div>
      <PageHeader
        title="Свободный режим"
        description="Заполните блоки — справа показывается итоговый текст. Сохраните как шаблон, когда будет готово."
      />

      <div className="mb-6 flex flex-col gap-2">
        <label
          htmlFor="builder-title"
          className="text-sm font-medium text-slate-800 dark:text-slate-200"
        >
          Название
        </label>
        <input
          id="builder-title"
          value={template.title}
          onChange={(e) =>
            setTemplate((t) => ({ ...t, title: e.target.value }))
          }
          className="input-focus h-12 w-full rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-1)] dark:bg-[var(--surface-2)]"
        />
      </div>

      <PromptWorkspace
        advanced={advanced}
        onAdvancedChange={setAdvanced}
        fields={template.fields}
        onFieldsChange={(fields) =>
          setTemplate((t) => ({ ...t, fields, updatedAt: new Date().toISOString() }))
        }
        builtPrompt={built}
        actions={
          <ActionBar
            onCopy={() => void onCopy()}
            onSave={() => void onSave()}
            onClear={onClear}
          />
        }
      />
    </div>
  )
}
