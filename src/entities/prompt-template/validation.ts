import { z } from 'zod'
import {
  emptyPromptFields,
  type PromptFields,
  type PromptTemplate,
} from '@/entities/prompt-template/types'

const promptFieldsSchema = z.object({
  role: z.string(),
  task: z.string(),
  context: z.string(),
  constraints: z.string(),
  negativeConstraints: z.string(),
  outputFormat: z.string(),
  tone: z.string(),
  style: z.string(),
  length: z.string(),
  examples: z.string(),
  additionalInstructions: z.string(),
})

export const promptTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  mode: z.enum(['preset', 'custom']),
  isFavorite: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(z.string()),
  fields: promptFieldsSchema,
  sourcePresetId: z.string().optional(),
})

export const exportFileSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  templates: z.array(promptTemplateSchema),
})

export type ExportPayload = z.infer<typeof exportFileSchema>

export function parseImportJson(text: string): {
  ok: true
  templates: PromptTemplate[]
} | {
  ok: false
  error: string
} {
  let data: unknown
  try {
    data = JSON.parse(text) as unknown
  } catch {
    return { ok: false, error: 'Некорректный JSON' }
  }

  const direct = z.array(promptTemplateSchema).safeParse(data)
  if (direct.success) {
    return { ok: true, templates: direct.data }
  }

  const wrapped = exportFileSchema.safeParse(data)
  if (wrapped.success) {
    return { ok: true, templates: wrapped.data.templates }
  }

  return {
    ok: false,
    error: 'Ожидался массив шаблонов или объект с полем templates',
  }
}

export function normalizeImportedFields(raw: unknown): PromptFields {
  const parsed = promptFieldsSchema.safeParse(raw)
  if (parsed.success) return parsed.data
  return emptyPromptFields()
}
