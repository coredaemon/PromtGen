import { useMemo, useState } from 'react'
import { BUILTIN_PRESETS } from '@/data/presets/presets'
import { PRESET_CATEGORIES } from '@/data/presets/categories'
import { PresetGrid } from '@/features/template-catalog/PresetGrid'
import { PageHeader } from '@/shared/ui/PageHeader'
import { SearchInput } from '@/shared/ui/SearchInput'
import { CategoryFilter } from '@/shared/ui/CategoryFilter'
import { EmptyState } from '@/shared/ui/EmptyState'
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
        p.category.toLowerCase().includes(q)
      )
    })
  }, [query, category])

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
        <PresetGrid
          presets={filtered}
          isFavorite={(id) => favIds.has(id)}
          onFavoriteToggle={(id) => {
            const next = new Set(favIds)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            setFavIds(next)
            setFavoritePresetIds([...next])
          }}
        />
      )}
    </div>
  )
}
