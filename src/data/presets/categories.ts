export const PRESET_CATEGORIES = [
  'Тексты',
  'Работа и деловое общение',
  'Обучение',
  'Код',
  'Идеи и творчество',
  'Юридические черновики',
  'Изображения',
  'Повседневные задачи',
] as const

export type PresetCategory = (typeof PRESET_CATEGORIES)[number]
