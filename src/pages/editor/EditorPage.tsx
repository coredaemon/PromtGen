import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BUILTIN_PRESETS, getPresetById } from '@/data/presets/presets'
import { PRESET_CATEGORIES } from '@/data/presets/categories'
import { getRelatedPresets } from '@/shared/lib/presetSearch'
import { createNewTemplate, templateFromPreset } from '@/entities/prompt-template/factory'
import { emptyPromptFields } from '@/entities/prompt-template/types'
import type { PromptTemplate } from '@/entities/prompt-template/types'
import { loadSettings } from '@/entities/settings/types'
import { buildPrompt } from '@/shared/lib/buildPrompt'
import { copyToClipboard } from '@/shared/lib/clipboard'
import {
  addHistoryEntry,
  getTemplate,
  putTemplate,
} from '@/shared/storage/idb'
import { pushRecentItem } from '@/shared/storage/localPreferences'
import { buttonVisualClass } from '@/shared/ui/buttonStyles'
import { FavoriteToggle } from '@/features/favorites/FavoriteToggle'
import { ActionBar } from '@/features/template-actions/ActionBar'
import { PromptWorkspace } from '@/features/prompt-builder/PromptWorkspace'
import { PageHeader } from '@/shared/ui/PageHeader'
import { templateDraftFingerprint } from '@/shared/pwa/templateFingerprint'
import { usePwaDraft } from '@/shared/pwa/usePwaDraft'

export function EditorPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const presetParam = searchParams.get('preset')
  const navigate = useNavigate()
  const { setDraftDirty } = usePwaDraft()

  const [advanced, setAdvanced] = useState(false)
  const [template, setTemplate] = useState<PromptTemplate | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const savedFingerprint = useRef<string | null>(null)
  const loadGen = useRef(0)

  useEffect(() => {
    loadGen.current += 1
    const gen = loadGen.current
    let cancelled = false
    async function run() {
      if (id) {
        const t = await getTemplate(id)
        if (cancelled || gen !== loadGen.current) return
        if (!t) {
          setLoadError('Шаблон не найден')
          setTemplate(null)
          savedFingerprint.current = null
          setDraftDirty(false)
          return
        }
        setLoadError(null)
        const fp = templateDraftFingerprint(t)
        savedFingerprint.current = fp
        setTemplate(t)
        setDraftDirty(false)
        return
      }
      if (presetParam) {
        const p = getPresetById(presetParam)
        if (cancelled || gen !== loadGen.current) return
        if (!p) {
          setLoadError('Заготовка не найдена')
          setTemplate(null)
          savedFingerprint.current = null
          setDraftDirty(false)
          return
        }
        setLoadError(null)
        const next = templateFromPreset(p.id, p)
        savedFingerprint.current = templateDraftFingerprint(next)
        setTemplate(next)
        setDraftDirty(false)
        return
      }
      if (cancelled || gen !== loadGen.current) return
      setLoadError(null)
      const next = createNewTemplate({
        title: 'Новый шаблон',
        fields: {
          ...emptyPromptFields(),
          outputFormat: loadSettings().defaultOutputFormat,
        },
      })
      savedFingerprint.current = templateDraftFingerprint(next)
      setTemplate(next)
      setDraftDirty(false)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [id, presetParam, setDraftDirty])

  useEffect(() => {
    if (!template) return
    if (presetParam && !id) {
      pushRecentItem({ kind: 'preset', id: presetParam })
    } else if (id) {
      pushRecentItem({ kind: 'user', id })
    }
  }, [template, id, presetParam])

  useEffect(() => {
    if (!template || savedFingerprint.current === null) {
      setDraftDirty(false)
      return
    }
    setDraftDirty(
      templateDraftFingerprint(template) !== savedFingerprint.current,
    )
  }, [template, setDraftDirty])

  useEffect(() => () => setDraftDirty(false), [setDraftDirty])

  const built = useMemo(
    () => (template ? buildPrompt(template.fields) : ''),
    [template],
  )

  const relatedPresets = useMemo(() => {
    const pid = template?.sourcePresetId
    if (!pid) return []
    return getRelatedPresets(pid, BUILTIN_PRESETS, 4)
  }, [template?.sourcePresetId])

  const onCopy = useCallback(async () => {
    if (!template) return
    const ok = await copyToClipboard(built)
    if (!ok) {
      toast.error('Не удалось скопировать')
      return
    }
    toast.success('Промт скопирован')
    await addHistoryEntry({
      id: crypto.randomUUID(),
      templateId: template.id,
      title: template.title,
      result: built,
      createdAt: new Date().toISOString(),
    })
  }, [built, template])

  const onSave = useCallback(async () => {
    if (!template) return
    const toSave: PromptTemplate = {
      ...template,
      mode: 'custom',
      updatedAt: new Date().toISOString(),
    }
    await putTemplate(toSave)
    const fp = templateDraftFingerprint(toSave)
    savedFingerprint.current = fp
    setTemplate(toSave)
    setDraftDirty(false)
    pushRecentItem({ kind: 'user', id: toSave.id })
    toast.success('Шаблон сохранён')
    if (!id || id !== toSave.id) {
      void navigate(`/editor/${toSave.id}`, { replace: true })
    }
  }, [id, navigate, template, setDraftDirty])

  const onDuplicate = useCallback(async () => {
    if (!template) return
    const dup = createNewTemplate({
      title: `${template.title} (копия)`,
      description: template.description,
      category: template.category,
      mode: 'custom',
      isFavorite: false,
      tags: [...template.tags],
      fields: { ...template.fields },
      sourcePresetId: template.sourcePresetId,
    })
    await putTemplate(dup)
    pushRecentItem({ kind: 'user', id: dup.id })
    toast.success('Копия шаблона создана')
    void navigate(`/editor/${dup.id}`)
  }, [navigate, template])

  const onClear = useCallback(() => {
    const next = createNewTemplate({
      title: 'Новый шаблон',
      fields: {
        ...emptyPromptFields(),
        outputFormat: loadSettings().defaultOutputFormat,
      },
    })
    savedFingerprint.current = templateDraftFingerprint(next)
    setTemplate(next)
    setDraftDirty(false)
    void navigate('/editor', { replace: true })
  }, [navigate, setDraftDirty])

  const onOpenInBuilder = useCallback(() => {
    if (!template) return
    void navigate('/builder', {
      state: { fields: template.fields, title: template.title },
    })
  }, [navigate, template])

  const toggleFavorite = useCallback(async () => {
    if (!template) return
    const next = { ...template, isFavorite: !template.isFavorite }
    await putTemplate(next)
    savedFingerprint.current = templateDraftFingerprint(next)
    setTemplate(next)
    setDraftDirty(false)
  }, [template, setDraftDirty])

  if (loadError) {
    return (
      <div>
        <PageHeader title="Ошибка" description={loadError} />
        <button
          type="button"
          onClick={() => void navigate('/presets')}
          className={buttonVisualClass('primary', 'md')}
        >
          К заготовкам
        </button>
      </div>
    )
  }

  if (!template) {
    return (
      <p className="text-slate-600 dark:text-slate-400">Загрузка…</p>
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:mb-8 md:gap-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <h1 className="text-[28px] font-bold leading-[34px] tracking-tight text-[var(--text-1)] md:text-[32px] md:leading-10">
            Редактор
          </h1>
          <FavoriteToggle
            active={template.isFavorite}
            onToggle={() => void toggleFavorite()}
            label={template.isFavorite ? 'В избранном' : 'В избранное'}
          />
        </div>
        <p className="max-w-2xl text-base leading-[26px] text-[var(--text-2)]">
          Меняйте поля, смотрите предпросмотр, копируйте или сохраняйте в
          библиотеку.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="ed-title" className="text-[14px] font-semibold leading-5 text-[var(--text-1)]">
            Название
          </label>
          <input
            id="ed-title"
            value={template.title}
            onChange={(e) =>
              setTemplate((t) => (t ? { ...t, title: e.target.value } : t))
            }
            className="input-focus h-12 w-full rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-1)] dark:bg-[var(--surface-2)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="ed-cat" className="text-[14px] font-semibold leading-5 text-[var(--text-1)]">
            Категория
          </label>
          <input
            id="ed-cat"
            value={template.category}
            onChange={(e) =>
              setTemplate((t) => (t ? { ...t, category: e.target.value } : t))
            }
            list="preset-categories"
            className="input-focus h-12 w-full rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-1)] dark:bg-[var(--surface-2)]"
          />
          <datalist id="preset-categories">
            {PRESET_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="ed-desc" className="text-[14px] font-semibold leading-5 text-[var(--text-1)]">
            Описание
          </label>
          <textarea
            id="ed-desc"
            value={template.description}
            onChange={(e) =>
              setTemplate((t) => (t ? { ...t, description: e.target.value } : t))
            }
            rows={2}
            className="input-focus mt-2 min-h-[112px] w-full resize-y rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3.5 text-base text-[var(--text-1)] dark:bg-[var(--surface-2)]"
          />
        </div>
      </div>

      {relatedPresets.length > 0 ? (
        <section className="mb-8 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)] md:p-6">
          <h2 className="mb-4 text-[15px] font-semibold leading-5 text-[var(--text-1)]">
            Похожие заготовки
          </h2>
          <ul className="flex flex-col gap-3">
            {relatedPresets.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/editor?preset=${encodeURIComponent(p.id)}`}
                  className="group flex items-start justify-between gap-3 rounded-[12px] border border-transparent px-1 py-1 transition-[border-color,background-color] hover:border-[var(--border-soft)] hover:bg-[var(--surface-2)]"
                >
                  <div>
                    <div className="text-[12px] font-semibold uppercase leading-4 tracking-[0.02em] text-[var(--text-3)]">
                      {p.category}
                    </div>
                    <div className="mt-1 text-[16px] font-semibold leading-6 text-[var(--text-1)] group-hover:text-[var(--accent)]">
                      {p.title}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-5 text-[var(--text-2)]">
                      {p.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-1 h-5 w-5 shrink-0 text-[var(--text-3)] group-hover:text-[var(--accent)]"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <PromptWorkspace
        advanced={advanced}
        onAdvancedChange={setAdvanced}
        fields={template.fields}
        onFieldsChange={(fields) =>
          setTemplate((t) => (t ? { ...t, fields } : t))
        }
        builtPrompt={built}
        actions={
          <ActionBar
            onCopy={() => void onCopy()}
            onSave={() => void onSave()}
            onDuplicate={() => void onDuplicate()}
            onClear={onClear}
            onOpenInBuilder={onOpenInBuilder}
          />
        }
      />
    </div>
  )
}
