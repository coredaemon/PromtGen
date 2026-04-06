import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { BUILTIN_PRESETS } from '@/data/presets/presets'
import type { HistoryEntry, PromptTemplate } from '@/entities/prompt-template/types'
import { createNewTemplate } from '@/entities/prompt-template/factory'
import { PageHeader } from '@/shared/ui/PageHeader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { SearchInput } from '@/shared/ui/SearchInput'
import { Button } from '@/shared/ui/Button'
import { buttonVisualClass } from '@/shared/ui/buttonStyles'
import {
  clearHistory,
  deleteHistoryEntry,
  deleteTemplate,
  listHistory,
  listTemplates,
  putTemplate,
} from '@/shared/storage/idb'
import { copyToClipboard } from '@/shared/lib/clipboard'
import { buildPrompt } from '@/shared/lib/buildPrompt'
import { normalizeText, tokenizeQuery } from '@/shared/lib/presetSearch'
import { getFavoritePresetIds } from '@/shared/storage/localPreferences'

type Tab = 'my' | 'favorites' | 'history'

export function LibraryPage() {
  const [tab, setTab] = useState<Tab>('my')
  const [query, setQuery] = useState('')
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [clearOpen, setClearOpen] = useState(false)

  const refresh = useCallback(async () => {
    const [t, h] = await Promise.all([listTemplates(), listHistory()])
    setTemplates(t)
    setHistory(h)
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const [t, h] = await Promise.all([listTemplates(), listHistory()])
      if (!cancelled) {
        setTemplates(t)
        setHistory(h)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredTemplates = useMemo(() => {
    let list = templates
    if (tab === 'favorites') {
      list = list.filter((t) => t.isFavorite)
    }
    const tokens = tokenizeQuery(query)
    if (tokens.length === 0) return list
    return list.filter((t) => {
      const blob = normalizeText(
        [t.title, t.description, t.category, ...t.tags].join(' '),
      )
      return tokens.every((tok) => blob.includes(tok))
    })
  }, [templates, tab, query])

  const favoritePresetIds = new Set(getFavoritePresetIds())
  const favoritePresets = BUILTIN_PRESETS.filter((p) =>
    favoritePresetIds.has(p.id),
  )

  const filteredHistory = useMemo(() => {
    const tokens = tokenizeQuery(query)
    if (tokens.length === 0) return history
    return history.filter((h) => {
      const blob = normalizeText(`${h.title} ${h.result}`)
      return tokens.every((tok) => blob.includes(tok))
    })
  }, [history, query])

  const tabBar = (
    <div className="inline-flex h-10 min-h-[40px] rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] p-1">
      {(
        [
          ['my', 'Мои шаблоны'],
          ['favorites', 'Избранное'],
          ['history', 'История'],
        ] as const
      ).map(([k, label]) => (
        <button
          key={k}
          type="button"
          onClick={() => setTab(k)}
          className={
            tab === k
              ? 'rounded-[10px] bg-[var(--surface-1)] px-3 py-1.5 text-[14px] font-medium leading-5 text-[var(--text-1)] shadow-[var(--shadow-sm)] dark:bg-[var(--surface-3)]'
              : 'rounded-[10px] px-3 py-1.5 text-[14px] font-medium leading-5 text-[var(--text-3)] transition-colors duration-[140ms] hover:text-[var(--text-2)]'
          }
        >
          {label}
        </button>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader
        className="mb-4"
        title="Библиотека"
        description="Свои шаблоны, избранное и история скопированных промтов."
      />

      <div className="mb-4 flex flex-col gap-3 md:mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-full overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabBar}
        </div>
        <div className="w-full lg:max-w-xs">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Поиск…"
            id="library-search"
          />
        </div>
      </div>

      {tab === 'history' ? (
        <>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="text-sm font-semibold text-[var(--danger)] transition-opacity hover:opacity-90"
            >
              Очистить историю
            </button>
          </div>
          <ConfirmDialog
            open={clearOpen}
            title="Очистить историю?"
            description="Все записи истории будут удалены. Шаблоны останутся."
            confirmLabel="Очистить"
            tone="danger"
            onCancel={() => setClearOpen(false)}
            onConfirm={async () => {
              await clearHistory()
              setClearOpen(false)
              await refresh()
              toast.success('История очищена')
            }}
          />
          {filteredHistory.length === 0 ? (
            <EmptyState
              compact
              title="История пуста"
              description="Копируйте промт из редактора — запись появится здесь."
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {filteredHistory.map((h) => (
                <li
                  key={h.id}
                  className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--text-1)]">{h.title}</p>
                      <p className="text-[13px] text-[var(--text-3)]">
                        {new Date(h.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                          const ok = await copyToClipboard(h.result)
                          if (ok) toast.success('Промт скопирован')
                          else toast.error('Не удалось скопировать')
                        }}
                      >
                        Копировать
                      </Button>
                      <Button
                        type="button"
                        variant="dangerGhost"
                        size="sm"
                        onClick={async () => {
                          await deleteHistoryEntry(h.id)
                          await refresh()
                          toast.success('Запись удалена')
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                  <pre className="font-mono mt-4 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] p-3 text-[13px] leading-relaxed text-[var(--text-2)]">
                    {h.result}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}

      {tab === 'favorites' ? (
        <>
          {favoritePresets.length === 0 && filteredTemplates.length === 0 ? (
            <EmptyState
              compact
              title="Нет избранного"
              description="Добавьте заготовки или шаблоны в избранное."
              action={
                <Link to="/presets" className={buttonVisualClass('primary', 'md')}>
                  Каталог
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-10">
              {favoritePresets.length > 0 ? (
                <section>
                  <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-[var(--text-3)]">
                    Заготовки
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {favoritePresets.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/editor?preset=${encodeURIComponent(p.id)}`}
                          className="block rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 py-4 text-[15px] font-medium text-[var(--text-1)] shadow-[var(--shadow-sm)] transition-[border-color] duration-[140ms] hover:border-[var(--border-strong)]"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {filteredTemplates.length > 0 ? (
                <section>
                  <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-[var(--text-3)]">
                    Мои шаблоны
                  </h3>
                  <TemplateList items={filteredTemplates} onRefresh={refresh} />
                </section>
              ) : favoritePresets.length > 0 ? null : (
                <EmptyState compact title="Нет совпадений" />
              )}
            </div>
          )}
        </>
      ) : null}

      {tab === 'my' ? (
        filteredTemplates.length === 0 ? (
          <EmptyState
            compact
            title="Пока нет шаблонов"
            description="Сохраните шаблон из редактора или конструктора."
            action={
              <Link to="/builder" className={buttonVisualClass('primary', 'md')}>
                Конструктор
              </Link>
            }
          />
        ) : (
          <TemplateList items={filteredTemplates} onRefresh={refresh} />
        )
      ) : null}
    </div>
  )
}

function TemplateList({
  items,
  onRefresh,
}: {
  items: PromptTemplate[]
  onRefresh: () => Promise<void>
}) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((t) => {
        const preview = buildPrompt(t.fields).trim()
        return (
          <li
            key={t.id}
            className="flex flex-col gap-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <Link
                to={`/editor/${t.id}`}
                className="text-[18px] font-semibold leading-[26px] text-[var(--text-1)] hover:text-[var(--accent)] hover:underline"
              >
                {t.title}
              </Link>
              <p className="mt-1 text-[13px] text-[var(--text-3)]">
                {t.category} · обновлён {new Date(t.updatedAt).toLocaleDateString()}
              </p>
              {preview ? (
                <p className="mt-3 line-clamp-2 text-[15px] leading-6 text-[var(--text-2)]">
                  {preview}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const dup = createNewTemplate({
                    title: `${t.title} (копия)`,
                    description: t.description,
                    category: t.category,
                    mode: 'custom',
                    isFavorite: false,
                    tags: [...t.tags],
                    fields: { ...t.fields },
                    sourcePresetId: t.sourcePresetId,
                  })
                  await putTemplate(dup)
                  await onRefresh()
                  toast.success('Копия создана')
                }}
              >
                Дублировать
              </Button>
              <Button
                type="button"
                variant="dangerGhost"
                size="sm"
                onClick={async () => {
                  await deleteTemplate(t.id)
                  await onRefresh()
                  toast.success('Шаблон удалён')
                }}
              >
                Удалить
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const ok = await copyToClipboard(buildPrompt(t.fields))
                  if (ok) toast.success('Промт скопирован')
                  else toast.error('Не удалось скопировать')
                }}
              >
                Копировать промт
              </Button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
