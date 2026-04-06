import { describe, expect, it } from 'vitest'
import { BUILTIN_PRESETS } from '@/data/presets/presets'
import { emptyPromptFields, type PresetDefinition } from '@/entities/prompt-template/types'
import {
  fullPhraseHit,
  mergePresetForSearch,
  normalizeText,
  scorePresetDetailed,
  searchPresets,
} from '@/shared/lib/presetSearch'

function preset(p: Partial<PresetDefinition> & Pick<PresetDefinition, 'id' | 'title'>): PresetDefinition {
  return {
    description: '',
    category: 'Повседневные задачи',
    fields: emptyPromptFields(),
    ...p,
  }
}

describe('scorePresetDetailed', () => {
  it('суммирует вес по полям для одного токена, а не берёт max', () => {
    const p = preset({
      id: 'sum-test',
      title: 'alpha beta',
      description: 'про alpha и другое',
    })
    const raw = normalizeText('alpha')
    const { score: s } = scorePresetDetailed(p, ['alpha'], raw)
    // title start 60 + desc 15 + бонусы за 1 слово (нет)
    expect(s).toBeGreaterThanOrEqual(75)
  })

  it('даёт бонус за полную фразу в описании и за совпадение всех слов', () => {
    const p = preset({
      id: 'fp-test',
      title: 'другое',
      description: 'объяснить простыми словами для теста',
    })
    const q = 'объяснить простыми словами'
    const raw = normalizeText(q)
    const tokens = raw.split(/\s+/)
    const { score, matchedTokensCount } = scorePresetDetailed(p, tokens, raw)
    expect(matchedTokensCount).toBe(3)
    expect(score).toBeGreaterThan(100)
  })
})

describe('fullPhraseHit + meta', () => {
  it('находит полную фразу из useCases у life-plain-explanation', () => {
    const base = BUILTIN_PRESETS.find((p) => p.id === 'life-plain-explanation')
    expect(base).toBeDefined()
    const merged = mergePresetForSearch(base!)
    const q = normalizeText('объяснить человеку простыми словами')
    expect(fullPhraseHit(merged, q)).toBe(true)
  })
})

describe('searchPresets', () => {
  it('отсекает слабое совпадение: 3+ слова в запросе и ровно 1 токен без полной фразы', () => {
    const noise = preset({
      id: 'noise-human',
      title: 'человек',
      description: '',
    })
    const raw = normalizeText('один два три человек')
    const r = searchPresets([noise], raw, 'all')
    expect(r.items.some((p) => p.id === 'noise-human')).toBe(false)
  })

  it('включает пресет с полной фразой в meta даже при длинном запросе', () => {
    const base = BUILTIN_PRESETS.find((p) => p.id === 'life-plain-explanation')
    expect(base).toBeDefined()
    const q = 'объяснить человеку простыми словами'
    const r = searchPresets(BUILTIN_PRESETS, q, 'all')
    const ids = r.items.map((p) => p.id)
    expect(ids).toContain('life-plain-explanation')
    expect(r.matchedTokensByPresetId.get('life-plain-explanation')).toBeGreaterThanOrEqual(1)
  })
})
