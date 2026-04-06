const FAV_PRESETS = 'promtgen-favorite-preset-ids-v1'
const RECENT = 'promtgen-recent-v1'
const ONBOARDING = 'promtgen-onboarding-dismissed-v1'
const PRESET_SEARCH_HISTORY = 'promtgen-preset-search-history-v1'
const PRESETS_SEARCH_VISIT = 'promtgen-presets-search-placeholder-visit-v1'

const MAX_SEARCH_HISTORY = 8

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

export function getPresetSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(PRESET_SEARCH_HISTORY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

/** Сохраняет запрос в историю (дедупликация, лимит). */
export function pushPresetSearchHistory(query: string): void {
  const q = query.trim()
  if (q.length < 2) return
  const n = normalizeSearchHistoryItem(q)
  const prev = getPresetSearchHistory().filter((x) => normalizeSearchHistoryItem(x) !== n)
  const next = [q, ...prev].slice(0, MAX_SEARCH_HISTORY)
  localStorage.setItem(PRESET_SEARCH_HISTORY, JSON.stringify(next))
}

/** Нормализация для сравнения запросов и терминов из meta. */
export function normalizeSearchHistoryItem(s: string): string {
  return s.trim().toLowerCase().replace(/ё/g, 'е')
}

/** Увеличивает счётчик заходов на страницу заготовок и возвращает новое значение (seed для placeholder). */
export function incrementPresetsSearchVisit(): number {
  try {
    const raw = localStorage.getItem(PRESETS_SEARCH_VISIT)
    const prev = raw ? parseInt(raw, 10) : 0
    const next = Number.isFinite(prev) ? prev + 1 : 1
    localStorage.setItem(PRESETS_SEARCH_VISIT, String(next))
    return next
  } catch {
    return 1
  }
}
