import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BUILTIN_PRESETS } from '@/data/presets/presets'
import { EMPTY_STATE_SUGGESTION_PRESET_IDS } from '@/data/presets/presetSearchMeta'
import {
  PRESET_CATEGORIES,
  sortPresetGroupKeys,
} from '@/data/presets/categories'
import type { PresetDefinition } from '@/entities/prompt-template/types'
import { PresetGrid } from '@/features/template-catalog/PresetGrid'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import {
  searchPresets,
  tokenizeQuery,
} from '@/shared/lib/presetSearch'
import { getSearchPlaceholderText } from '@/shared/lib/presetSearchPlaceholder'
import { PageHeader } from '@/shared/ui/PageHeader'
import { SearchInput } from '@/shared/ui/SearchInput'
import { CategoryFilter } from '@/shared/ui/CategoryFilter'
import { EmptyState } from '@/shared/ui/EmptyState'
import { SectionTitle } from '@/shared/ui/SectionTitle'
import {
  getFavoritePresetIds,
  incrementPresetsSearchVisit,
  pushPresetSearchHistory,
  setFavoritePresetIds,
} from '@/shared/storage/localPreferences'

function scrollResultsAnchorIntoView(el: HTMLElement | null) {
  requestAnimationFrame(() => {
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

export function PresetsPage() {
  const [visitSeed] = useState(() => incrementPresetsSearchVisit())
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | 'all'>('all')
  const [favIds, setFavIds] = useState(() => new Set(getFavoritePresetIds()))
  const resultsAnchorRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebouncedValue(query, 220)

  const searchPlaceholder = useMemo(
    () => getSearchPlaceholderText(visitSeed),
    [visitSeed],
  )

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (q.length >= 2) pushPresetSearchHistory(q)
  }, [debouncedQuery])

  const searchResult = useMemo(
    () => searchPresets(BUILTIN_PRESETS, debouncedQuery, category),
    [debouncedQuery, category],
  )

  const filtered = searchResult.items
  const hasSearchTokens = tokenizeQuery(debouncedQuery).length > 0
  const highlightTokens = hasSearchTokens
    ? searchResult.highlightTokens
    : []

  const presetSections = useMemo(() => {
    const qTokens = tokenizeQuery(debouncedQuery)
    if (qTokens.length > 0) {
      return [{ title: null as string | null, presets: filtered }]
    }
    const ungrouped: PresetDefinition[] = []
    const byGroup = new Map<string, PresetDefinition[]>()
    for (const p of filtered) {
      if (p.group) {
        const list = byGroup.get(p.group) ?? []
        list.push(p)
        byGroup.set(p.group, list)
      } else {
        ungrouped.push(p)
      }
    }
    const sections: { title: string | null; presets: PresetDefinition[] }[] =
      []
    if (ungrouped.length > 0) {
      sections.push({ title: null, presets: ungrouped })
    }
    for (const key of sortPresetGroupKeys([...byGroup.keys()])) {
      const list = byGroup.get(key)
      if (list?.length) {
        sections.push({ title: key, presets: list })
      }
    }
    return sections
  }, [filtered, debouncedQuery])

  const emptySuggestions = EMPTY_STATE_SUGGESTION_PRESET_IDS.map((id) =>
    BUILTIN_PRESETS.find((p) => p.id === id),
  ).filter((p): p is PresetDefinition => p !== undefined)

  function handleCategoryChange(next: string | 'all') {
    setCategory(next)
    scrollResultsAnchorIntoView(resultsAnchorRef.current)
  }

  return (
    <div>
      <div className="mb-3 md:mb-4">
        <PageHeader
          className="mb-3"
          title="Заготовки"
          description="Выберите сценарий — откроется редактор с предзаполненными полями."
        />

        <div className="flex flex-col gap-2">
          <SearchInput
            value={query}
            onChange={setQuery}
            id="presets-search"
            placeholder={searchPlaceholder}
          />
          <CategoryFilter
            categories={PRESET_CATEGORIES}
            value={category}
            onChange={handleCategoryChange}
          />
        </div>
      </div>

      <div
        ref={resultsAnchorRef}
        className="scroll-mt-[calc(var(--shell-stack-h)+8px)]"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col gap-6">
            <EmptyState
              title={
                hasSearchTokens
                  ? `Ничего не найдено по запросу «${debouncedQuery.trim()}»`
                  : 'Ничего не найдено'
              }
              description={
                hasSearchTokens
                  ? 'Попробуйте другие слова или сбросьте категорию. Ниже — похожие заготовки.'
                  : 'Попробуйте другой запрос или сбросьте категорию.'
              }
            />
            {hasSearchTokens ? (
              <div>
                <p className="mb-3 text-[15px] font-semibold text-[var(--text-1)]">
                  Посмотрите похожие заготовки
                </p>
                <ul className="flex flex-col gap-2">
                  {emptySuggestions.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/editor?preset=${encodeURIComponent(p.id)}`}
                        className="text-[15px] font-medium text-[var(--accent)] underline decoration-[var(--accent)]/35 underline-offset-2 transition-colors hover:decoration-[var(--accent)]"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {category !== 'all' ? (
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className="self-start rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-2.5 text-[14px] font-semibold text-[var(--text-1)] shadow-[var(--shadow-sm)] transition-[border-color,background-color] hover:border-[var(--border-strong)]"
              >
                Показать все категории
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {presetSections.map((sec, idx) => (
              <div key={sec.title ?? `ungrouped-${idx}`}>
                {sec.title ? (
                  <SectionTitle className="mb-4">{sec.title}</SectionTitle>
                ) : null}
                <PresetGrid
                  presets={sec.presets}
                  isFavorite={(id) => favIds.has(id)}
                  onFavoriteToggle={(id) => {
                    const next = new Set(favIds)
                    if (next.has(id)) next.delete(id)
                    else next.add(id)
                    setFavIds(next)
                    setFavoritePresetIds([...next])
                  }}
                  highlightTokens={highlightTokens}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
