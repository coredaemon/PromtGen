import type { PresetDefinition } from '@/entities/prompt-template/types'
import { PresetCard } from '@/features/template-catalog/PresetCard'

type PresetGridProps = {
  presets: PresetDefinition[]
  isFavorite: (id: string) => boolean
  onFavoriteToggle: (id: string) => void
  highlightTokens?: string[]
}

export function PresetGrid({
  presets,
  isFavorite,
  onFavoriteToggle,
  highlightTokens,
}: PresetGridProps) {
  if (presets.length === 0) {
    return null
  }
  return (
    <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-5">
      {presets.map((p) => (
        <PresetCard
          key={p.id}
          preset={p}
          favorite={isFavorite(p.id)}
          onFavoriteToggle={() => onFavoriteToggle(p.id)}
          highlightTokens={highlightTokens}
        />
      ))}
    </div>
  )
}
