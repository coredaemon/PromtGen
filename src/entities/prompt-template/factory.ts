import {
  emptyPromptFields,
  type PromptFields,
  type PromptMode,
  type PromptTemplate,
} from '@/entities/prompt-template/types'

export function createNewTemplate(
  overrides: Partial<PromptTemplate> & { fields?: Partial<PromptFields> } = {},
): PromptTemplate {
  const now = new Date().toISOString()
  const { fields: fieldOverrides, ...rest } = overrides
  const baseFields = emptyPromptFields()
  const fields =
    fieldOverrides === undefined
      ? baseFields
      : { ...baseFields, ...fieldOverrides }

  return {
    id: crypto.randomUUID(),
    title: 'Новый шаблон',
    description: '',
    category: 'Повседневные задачи',
    mode: 'custom' satisfies PromptMode,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
    tags: [],
    fields,
    ...rest,
  }
}

export function templateFromPreset(presetId: string, preset: {
  title: string
  description: string
  category: string
  fields: PromptFields
}): PromptTemplate {
  const t = createNewTemplate({
    title: preset.title,
    description: preset.description,
    category: preset.category,
    mode: 'preset',
    fields: preset.fields,
    sourcePresetId: presetId,
  })
  return t
}
