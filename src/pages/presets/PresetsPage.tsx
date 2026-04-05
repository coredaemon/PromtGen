import { useMemo, useState } from 'react'
import { BUILTIN_PRESETS } from '@/data/presets/presets'
import {
  PRESET_CATEGORIES,
  sortPresetGroupKeys,
} from '@/data/presets/categories'
import type { PresetDefinition } from '@/entities/prompt-template/types'
import { PresetGrid } from '@/features/template-catalog/PresetGrid'
import { PageHeader } from '@/shared/ui/PageHeader'
import { SearchInput } from '@/shared/ui/SearchInput'
import { CategoryFilter } from '@/shared/ui/CategoryFilter'
import { EmptyState } from '@/shared/ui/EmptyState'
import { SectionTitle } from '@/shared/ui/SectionTitle'
import {
  getFavoritePresetIds,
  setFavoritePresetIds,
} from '@/shared/storage/localPreferences'

export function PresetsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | 'all'>('all')
  const [favIds, setFavIds] = useState(() => new Set(getFavoritePresetIds()))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return BUILTIN_PRESETS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.group?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [query, category])

  const presetSections = useMemo(() => {
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
  }, [filtered])

  return (
    <div>
      <div className="mb-4 md:sticky md:top-[var(--sticky-toolbar-top)] md:z-30 md:-mx-8 md:mb-8 md:border-b md:border-[var(--border-soft)] md:bg-[var(--bg-app)]/90 md:px-8 md:py-4 md:backdrop-blur-[14px] dark:md:bg-[var(--bg-app)]/92">
        <PageHeader
          className="mb-4"
          title="Заготовки"
          description="Выберите сценарий — откроется редактор с предзаполненными полями."
        />

        <div className="flex flex-col gap-3">
          <SearchInput value={query} onChange={setQuery} id="presets-search" />
          <CategoryFilter
            categories={PRESET_CATEGORIES}
            value={category}
            onChange={setCategory}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description="Попробуйте другой запрос или сбросьте категорию."
        />
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
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
