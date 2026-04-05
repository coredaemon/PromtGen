export const PRESET_CATEGORIES = [
  'Тексты',
  'Работа и деловое общение',
  'Обучение',
  'Код',
  'Идеи и творчество',
  'Юридические черновики',
  'Изображения',
  'Видео',
  'Повседневные задачи',
] as const

export type PresetCategory = (typeof PRESET_CATEGORIES)[number]

/** Порядок подгрупп в каталоге заготовок (остальные группы — по алфавиту после них). */
export const PRESET_GROUP_SORT_ORDER = [
  'Редактирование фото',
  'Промты и сцены',
] as const

export function sortPresetGroupKeys(keys: string[]): string[] {
  const order = new Map<string, number>(
    PRESET_GROUP_SORT_ORDER.map((k, i) => [k, i]),
  )
  return [...keys].sort((a, b) => {
    const oa = order.get(a) ?? 1000
    const ob = order.get(b) ?? 1000
    if (oa !== ob) return oa - ob
    return a.localeCompare(b, 'ru')
  })
}
