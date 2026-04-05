export const PRESET_CATEGORIES = [
  'Текст',
  'Работа и деловое общение',
  'Обучение',
  'Идеи и творчество',
  'Повседневные задачи',
] as const

export type PresetCategory = (typeof PRESET_CATEGORIES)[number]

/** Сортировка подгрупп в каталоге заготовок (по алфавиту). */
export function sortPresetGroupKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => a.localeCompare(b, 'ru'))
}
