import type { PromptTemplate } from '@/entities/prompt-template/types'

/** Stable snapshot for comparing unsaved edits (excludes updatedAt). */
export function templateDraftFingerprint(t: PromptTemplate): string {
  return JSON.stringify({
    id: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    mode: t.mode,
    isFavorite: t.isFavorite,
    tags: t.tags,
    fields: t.fields,
    sourcePresetId: t.sourcePresetId,
  })
}
