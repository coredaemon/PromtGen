import { BUILTIN_PRESETS } from '@/data/presets/presets'
import type { PresetDefinition } from '@/entities/prompt-template/types'
import { mergePresetForSearch } from '@/shared/lib/presetSearch'
import {
  getFavoritePresetIds,
  getPresetSearchHistory,
  getRecentItems,
  normalizeSearchHistoryItem,
} from '@/shared/storage/localPreferences'

/** Длинные названия заготовок режем по словам; отдельные термины — короче. */
const MAX_PHRASE_LEN = 40
const TITLE_WORDS_FALLBACK = 4

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 1779033703
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function shuffleInPlace<T>(arr: T[], rng: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

/** Короткая подсказка из длинного названия (те же заготовки, что в каталоге). */
function titleSearchHints(title: string): string[] {
  const t = title.trim()
  if (t.length < 2) return []
  if (t.length <= MAX_PHRASE_LEN) return [t]
  const words = t.split(/\s+/).filter(Boolean)
  const short = words.slice(0, TITLE_WORDS_FALLBACK).join(' ')
  if (short.length >= 2 && short.length <= MAX_PHRASE_LEN) return [short]
  const fewer = words.slice(0, 3).join(' ')
  if (fewer.length >= 2 && fewer.length <= MAX_PHRASE_LEN) return [fewer]
  return []
}

/**
 * Строки, по которым реально ищется заготовка (как после mergePresetForSearch в поиске).
 */
function collectCandidatesFromPreset(merged: PresetDefinition): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  const push = (raw: string) => {
    const d = raw.trim()
    if (d.length < 2 || d.length > MAX_PHRASE_LEN) return
    const k = normalizeSearchHistoryItem(d)
    if (seen.has(k)) return
    seen.add(k)
    out.push(d)
  }

  for (const h of titleSearchHints(merged.title)) push(h)
  for (const x of merged.searchTerms ?? []) push(x)
  for (const x of merged.phrases ?? []) push(x)
  for (const x of merged.useCases ?? []) push(x)
  for (const x of merged.tags ?? []) push(x)

  return out
}

/** Первое вхождение по порядку в каталоге — каноническое написание. */
function buildCanonicalMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const p of BUILTIN_PRESETS) {
    const merged = mergePresetForSearch(p)
    for (const c of collectCandidatesFromPreset(merged)) {
      const k = normalizeSearchHistoryItem(c)
      if (!map.has(k)) map.set(k, c)
    }
  }
  return map
}

let canonicalMapCache: Map<string, string> | null = null

function getCanonicalMap(): Map<string, string> {
  if (!canonicalMapCache) canonicalMapCache = buildCanonicalMap()
  return canonicalMapCache
}

function pickFromPreset(
  id: string,
  visitSeed: number,
  canonical: Map<string, string>,
): string[] {
  const p = BUILTIN_PRESETS.find((x) => x.id === id)
  if (!p) return []
  const merged = mergePresetForSearch(p)
  const candidates = collectCandidatesFromPreset(merged)
  if (candidates.length === 0) return []

  const rng = mulberry32((visitSeed ^ hashString(id)) >>> 0)
  const pool = [...candidates]
  shuffleInPlace(pool, rng)
  const take = Math.min(2, pool.length)
  const picked: string[] = []
  for (let i = 0; i < take; i++) {
    const display = pool[i]!
    const k = normalizeSearchHistoryItem(display)
    const canon = canonical.get(k) ?? display
    picked.push(canon)
  }
  return picked
}

function uniqueOrdered(keys: string[], canonical: Map<string, string>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of keys) {
    const k = normalizeSearchHistoryItem(raw)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(canonical.get(k) ?? raw)
  }
  return out
}

function historyMatchesCanonical(
  history: string[],
  canonical: Map<string, string>,
): string[] {
  const out: string[] = []
  const keys = new Set(canonical.keys())
  for (const h of history) {
    const t = h.trim()
    if (t.length < 2 || t.length > MAX_PHRASE_LEN) continue
    const k = normalizeSearchHistoryItem(t)
    if (keys.has(k)) {
      const c = canonical.get(k)
      if (c) out.push(c)
    }
  }
  return out
}

const TARGET_COUNT = 4

/**
 * Placeholder для поиска заготовок: только строки из каталога (названия, теги,
 * searchTerms/phrases/useCases после merge с meta), плюс персонализация.
 */
export function getSearchPlaceholderText(visitSeed: number): string {
  const canonical = getCanonicalMap()
  if (canonical.size === 0) {
    return 'Например: поиск по названию или словам из карточки'
  }

  const globalList = [...canonical.values()]
  const rng = mulberry32(visitSeed >>> 0)

  const fav = getFavoritePresetIds()
  const recentPresetIds = getRecentItems()
    .filter((x) => x.kind === 'preset')
    .map((x) => x.id)
    .slice(0, 8)
  const priorityIds = [...new Set([...fav, ...recentPresetIds])]

  const priorityPicks: string[] = []
  for (const id of priorityIds) {
    priorityPicks.push(...pickFromPreset(id, visitSeed, canonical))
  }

  const fromHistory = historyMatchesCanonical(
    getPresetSearchHistory(),
    canonical,
  )

  let merged = uniqueOrdered(
    [...priorityPicks, ...fromHistory],
    canonical,
  )

  if (merged.length < TARGET_COUNT) {
    const used = new Set(merged.map((x) => normalizeSearchHistoryItem(x)))
    const rest = globalList.filter((x) => !used.has(normalizeSearchHistoryItem(x)))
    shuffleInPlace(rest, rng)
    for (const x of rest) {
      if (merged.length >= TARGET_COUNT) break
      merged.push(x)
    }
  }

  if (merged.length < TARGET_COUNT && globalList.length > 0) {
    const fill = [...globalList]
    shuffleInPlace(fill, rng)
    merged = uniqueOrdered([...merged, ...fill], canonical).slice(
      0,
      TARGET_COUNT,
    )
  }

  const terms = merged.slice(0, TARGET_COUNT)
  return `Например: ${terms.join(', ')}`
}
