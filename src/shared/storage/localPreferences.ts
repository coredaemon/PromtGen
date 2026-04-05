const FAV_PRESETS = 'promtgen-favorite-preset-ids-v1'
const RECENT = 'promtgen-recent-v1'
const ONBOARDING = 'promtgen-onboarding-dismissed-v1'

export type RecentItem =
  | { kind: 'preset'; id: string }
  | { kind: 'user'; id: string }

export function getFavoritePresetIds(): string[] {
  try {
    const raw = localStorage.getItem(FAV_PRESETS)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

export function setFavoritePresetIds(ids: string[]): void {
  localStorage.setItem(FAV_PRESETS, JSON.stringify(ids))
}

export function toggleFavoritePreset(presetId: string): boolean {
  const ids = new Set(getFavoritePresetIds())
  if (ids.has(presetId)) {
    ids.delete(presetId)
  } else {
    ids.add(presetId)
  }
  const next = [...ids]
  setFavoritePresetIds(next)
  return ids.has(presetId)
}

export function isFavoritePreset(presetId: string): boolean {
  return getFavoritePresetIds().includes(presetId)
}

const MAX_RECENT = 12

export function getRecentItems(): RecentItem[] {
  try {
    const raw = localStorage.getItem(RECENT)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const out: RecentItem[] = []
    for (const item of parsed) {
      if (
        item &&
        typeof item === 'object' &&
        'kind' in item &&
        'id' in item &&
        (item.kind === 'preset' || item.kind === 'user') &&
        typeof item.id === 'string'
      ) {
        out.push({ kind: item.kind, id: item.id })
      }
    }
    return out
  } catch {
    return []
  }
}

export function pushRecentItem(item: RecentItem): void {
  const prev = getRecentItems().filter(
    (x) => !(x.kind === item.kind && x.id === item.id),
  )
  const next = [item, ...prev].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT, JSON.stringify(next))
}

export function isOnboardingDismissed(): boolean {
  return localStorage.getItem(ONBOARDING) === '1'
}

export function dismissOnboarding(): void {
  localStorage.setItem(ONBOARDING, '1')
}
