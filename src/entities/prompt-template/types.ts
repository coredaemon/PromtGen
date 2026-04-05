export type PromptMode = 'preset' | 'custom'

export type PromptFields = {
  role: string
  task: string
  context: string
  constraints: string
  negativeConstraints: string
  outputFormat: string
  tone: string
  style: string
  length: string
  examples: string
  additionalInstructions: string
}

export function emptyPromptFields(): PromptFields {
  return {
    role: '',
    task: '',
    context: '',
    constraints: '',
    negativeConstraints: '',
    outputFormat: '',
    tone: '',
    style: '',
    length: '',
    examples: '',
    additionalInstructions: '',
  }
}

export type PromptTemplate = {
  id: string
  title: string
  description: string
  category: string
  mode: PromptMode
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
  fields: PromptFields
  /** If saved from a built-in preset */
  sourcePresetId?: string
}

export type PresetDefinition = {
  id: string
  title: string
  description: string
  category: string
  /** Подгруппа внутри категории (опционально, для группировки в каталоге). */
  group?: string
  fields: PromptFields
}

export type HistoryEntry = {
  id: string
  templateId?: string
  title: string
  result: string
  createdAt: string
}

export const PROMPT_FIELD_KEYS = [
  'role',
  'task',
  'context',
  'constraints',
  'negativeConstraints',
  'outputFormat',
  'tone',
  'style',
  'length',
  'examples',
  'additionalInstructions',
] as const satisfies readonly (keyof PromptFields)[]
