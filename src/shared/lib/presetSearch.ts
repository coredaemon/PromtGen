import type { PresetDefinition } from '@/entities/prompt-template/types'
import { PRESET_SEARCH_META } from '@/data/presets/presetSearchMeta'

/** Полная фраза (подстрока запроса в поле). */
const FP_TITLE = 200
const FP_PHRASES_LAYER = 180
const FP_DESC = 100
const FP_SEARCH_TERMS = 160

/** Токен в title: начало / вхождение / всё название = один токен. */
const W_TOK_TITLE_FULL = 100
const W_TOK_TITLE_START = 60
const W_TOK_TITLE_CONTAINS = 40

/** Токен в остальных полях. */
const W_TOK_DESC = 15
const W_TOK_PHRASE = 25
const W_TOK_SEARCH_TERM = 30
const W_TAG = 25
const W_CATEGORY = 15
const W_GROUP = 12
const W_SEARCH_GROUP = 14

const EXACT_TITLE_BONUS = 300

const BONUS_2_WORDS = 20
const BONUS_3_WORDS = 50
const BONUS_ALL_WORDS = 100

/** Минимальная длина запроса для бонуса «полная фраза». */
const MIN_FULL_PHRASE_LEN = 2

/** Множитель при нечётком совпадении слова. */
const FUZZY_FACTOR = 0.82

const YO = /ё/gi

export function normalizeText(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(YO, 'е')
    .replace(/\s+/g, ' ')
}

export function tokenizeQuery(query: string): string[] {
  const n = normalizeText(query)
  if (!n) return []
  return n.split(/\s+/).filter((t) => t.length > 0)
}

export function mergePresetForSearch(p: PresetDefinition): PresetDefinition {
  const extra = PRESET_SEARCH_META[p.id]
  return extra ? { ...p, ...extra } : p
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => 0),
  )
  for (let i = 0; i <= m; i++) dp[i]![0] = i
  for (let j = 0; j <= n; j++) dp[0]![j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost,
      )
    }
  }
  return dp[m]![n]!
}

function fuzzyTokenInText(hay: string, token: string): boolean {
  if (token.length < 4) return false
  const words = hay.split(/[^\p{L}\p{N}]+/gu).filter((w) => w.length >= 3)
  for (const w of words) {
    const nw = normalizeText(w)
    if (nw.length < 3) continue
    if (Math.abs(nw.length - token.length) > 1) continue
    if (levenshtein(token, nw) <= 1) return true
  }
  return false
}

function scoreTokenInTitle(nTitle: string, token: string): number {
  if (!token) return 0
  if (nTitle === token) return W_TOK_TITLE_FULL
  if (nTitle.startsWith(token + ' ') || (nTitle.length > token.length && nTitle.startsWith(token))) {
    return W_TOK_TITLE_START
  }
  const firstWord = nTitle.split(/\s+/)[0] ?? ''
  if (firstWord.startsWith(token) && token.length >= 2) return W_TOK_TITLE_START
  if (nTitle.includes(token)) return W_TOK_TITLE_CONTAINS
  if (fuzzyTokenInText(nTitle, token)) {
    return Math.floor(W_TOK_TITLE_CONTAINS * FUZZY_FACTOR)
  }
  return 0
}

function scoreTokenInPlain(hay: string, token: string, weight: number): number {
  if (!token) return 0
  if (hay.includes(token)) return weight
  if (fuzzyTokenInText(hay, token)) return Math.floor(weight * FUZZY_FACTOR)
  return 0
}

function lifePhrasesBlob(p: PresetDefinition): string {
  const lines = [...(p.phrases ?? []), ...(p.useCases ?? [])]
  return lines.map(normalizeText).join(' ')
}

/** Сумма весов по полям для одного токена (не max). */
function sumScoreForToken(p: PresetDefinition, token: string): number {
  const nTitle = normalizeText(p.title)
  const nDesc = normalizeText(p.description)
  const nCat = normalizeText(p.category)
  const nGroup = p.group ? normalizeText(p.group) : ''
  const nSearchGroup = p.searchGroup ? normalizeText(p.searchGroup) : ''

  const terms = (p.searchTerms ?? []).map(normalizeText).join(' ')
  const life = lifePhrasesBlob(p)
  const tags = (p.tags ?? []).map(normalizeText).join(' ')

  let sum = 0
  sum += scoreTokenInTitle(nTitle, token)
  sum += scoreTokenInPlain(nDesc, token, W_TOK_DESC)
  sum += scoreTokenInPlain(terms, token, W_TOK_SEARCH_TERM)
  sum += scoreTokenInPlain(life, token, W_TOK_PHRASE)
  sum += scoreTokenInPlain(tags, token, W_TAG)
  sum += scoreTokenInPlain(nCat, token, W_CATEGORY)
  sum += scoreTokenInPlain(nGroup, token, W_GROUP)
  sum += scoreTokenInPlain(nSearchGroup, token, W_SEARCH_GROUP)
  return sum
}

/** Есть ли нормализованная полная фраза в одном из целевых полей. */
export function fullPhraseHit(p: PresetDefinition, fullQ: string): boolean {
  if (fullQ.length < MIN_FULL_PHRASE_LEN) return false
  const nTitle = normalizeText(p.title)
  const nDesc = normalizeText(p.description)
  const terms = (p.searchTerms ?? []).map(normalizeText).join(' ')
  const life = lifePhrasesBlob(p)
  return (
    nTitle.includes(fullQ) ||
    nDesc.includes(fullQ) ||
    terms.includes(fullQ) ||
    life.includes(fullQ)
  )
}

function fullPhraseScore(p: PresetDefinition, fullQ: string): number {
  if (fullQ.length < MIN_FULL_PHRASE_LEN) return 0
  let s = 0
  const nTitle = normalizeText(p.title)
  const nDesc = normalizeText(p.description)
  const terms = (p.searchTerms ?? []).map(normalizeText).join(' ')
  const life = lifePhrasesBlob(p)
  if (nTitle.includes(fullQ)) s += FP_TITLE
  if (life.includes(fullQ)) s += FP_PHRASES_LAYER
  if (nDesc.includes(fullQ)) s += FP_DESC
  if (terms.includes(fullQ)) s += FP_SEARCH_TERMS
  return s
}

function multiWordBonus(matched: number, total: number): number {
  if (total < 2) return 0
  if (matched === total) return BONUS_ALL_WORDS
  if (matched >= 3) return BONUS_3_WORDS
  if (matched === 2) return BONUS_2_WORDS
  return 0
}

/**
 * Пресет кандидат в выдачу: полная фраза в целевом поле или хотя бы одно слово запроса.
 * Сужение «одно слабое слово на длинном запросе» делает isWeakMatchExcluded.
 */
function presetSearchIncluded(
  p: PresetDefinition,
  tokens: string[],
  fullQ: string,
): boolean {
  if (tokens.length === 0) return true
  if (fullPhraseHit(p, fullQ)) return true
  return tokens.some((t) => sumScoreForToken(p, t) > 0)
}

/** Длинный запрос, одно слабое слово, без полной фразы — отбрасываем. */
function isWeakMatchExcluded(
  tokens: string[],
  fullQ: string,
  matchedCount: number,
  p: PresetDefinition,
): boolean {
  if (tokens.length < 3) return false
  if (matchedCount !== 1) return false
  if (fullPhraseHit(p, fullQ)) return false
  return true
}

export type PresetSearchScoreDetail = {
  score: number
  matchedTokensCount: number
}

/**
 * Детальный скоринг (сумма по токенам, бонусы за фразу и число слов).
 * Не применяет слабый фильтр — его вызывает searchPresets.
 */
export function scorePresetDetailed(
  p: PresetDefinition,
  tokens: string[],
  rawNormalized: string,
): PresetSearchScoreDetail {
  const fullQ = rawNormalized.replace(/\s+/g, ' ').trim()
  const nTitle = normalizeText(p.title)

  let sum = fullPhraseScore(p, fullQ)
  if (nTitle === fullQ) {
    sum += EXACT_TITLE_BONUS
  }

  let matchedTokensCount = 0
  for (const token of tokens) {
    const part = sumScoreForToken(p, token)
    sum += part
    if (part > 0) matchedTokensCount += 1
  }

  sum += multiWordBonus(matchedTokensCount, tokens.length)

  const pr = p.priority ?? 0
  sum += pr * 0.4

  return { score: sum, matchedTokensCount }
}

export function scorePreset(
  p: PresetDefinition,
  tokens: string[],
  rawNormalized: string,
): number {
  return scorePresetDetailed(p, tokens, rawNormalized).score
}

export type SearchPresetsResult = {
  items: PresetDefinition[]
  scores: Map<string, number>
  /** Токены для подсветки (нормализованные). */
  highlightTokens: string[]
  /** Сколько токенов запроса дали ненулевой вклад (по id пресета). */
  matchedTokensByPresetId: Map<string, number>
}

export function searchPresets(
  presets: PresetDefinition[],
  query: string,
  category: string | 'all',
): SearchPresetsResult {
  const merged = presets.map(mergePresetForSearch)
  const inCategory =
    category === 'all'
      ? merged
      : merged.filter((p) => p.category === category)

  const rawN = normalizeText(query)
  const tokens = tokenizeQuery(query)

  if (tokens.length === 0) {
    return {
      items: inCategory,
      scores: new Map(),
      highlightTokens: [],
      matchedTokensByPresetId: new Map(),
    }
  }

  const matched: { p: PresetDefinition; score: number; matchedTokens: number }[] = []
  for (const p of inCategory) {
    if (!presetSearchIncluded(p, tokens, rawN)) continue
    const detail = scorePresetDetailed(p, tokens, rawN)
    if (isWeakMatchExcluded(tokens, rawN, detail.matchedTokensCount, p)) continue
    matched.push({
      p,
      score: detail.score,
      matchedTokens: detail.matchedTokensCount,
    })
  }
  matched.sort((a, b) => b.score - a.score)

  const scores = new Map<string, number>()
  const matchedTokensByPresetId = new Map<string, number>()
  for (const { p, score, matchedTokens } of matched) {
    scores.set(p.id, score)
    matchedTokensByPresetId.set(p.id, matchedTokens)
  }

  return {
    items: matched.map((m) => m.p),
    scores,
    highlightTokens: tokens,
    matchedTokensByPresetId,
  }
}

export function getRelatedPresets(
  presetId: string,
  presets: PresetDefinition[],
  limit = 4,
): PresetDefinition[] {
  const base = presets.find((p) => p.id === presetId)
  if (!base) return []
  const merged = mergePresetForSearch(base)
  const out: PresetDefinition[] = []
  const seen = new Set<string>([presetId])

  if (merged.relatedPresetIds?.length) {
    for (const rid of merged.relatedPresetIds) {
      if (seen.has(rid)) continue
      const p = presets.find((x) => x.id === rid)
      if (p) {
        out.push(p)
        seen.add(rid)
      }
      if (out.length >= limit) return out
    }
  }

  const sg = merged.searchGroup
  if (sg) {
    const nsg = normalizeText(sg)
    for (const p of presets) {
      if (seen.has(p.id)) continue
      const m = mergePresetForSearch(p)
      if (m.searchGroup && normalizeText(m.searchGroup) === nsg) {
        out.push(p)
        seen.add(p.id)
        if (out.length >= limit) return out
      }
    }
  }

  const cat = merged.category
  for (const p of presets) {
    if (seen.has(p.id)) continue
    if (p.category === cat) {
      out.push(p)
      seen.add(p.id)
      if (out.length >= limit) return out
    }
  }

  return out
}
