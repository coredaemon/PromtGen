import type { PromptTemplate } from '@/entities/prompt-template/types'
import type { ExportPayload } from '@/entities/prompt-template/validation'

export function buildExportPayload(templates: PromptTemplate[]): ExportPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    templates,
  }
}

export function serializeExport(templates: PromptTemplate[]): string {
  return JSON.stringify(buildExportPayload(templates), null, 2)
}

export function downloadJson(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
