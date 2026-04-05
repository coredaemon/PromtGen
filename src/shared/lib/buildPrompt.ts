import type { PromptFields } from '@/entities/prompt-template/types'

const BLOCKS: { key: keyof PromptFields; label: string }[] = [
  { key: 'role', label: 'Роль' },
  { key: 'task', label: 'Задача' },
  { key: 'context', label: 'Контекст' },
  { key: 'constraints', label: 'Ограничения' },
  { key: 'negativeConstraints', label: 'Что нельзя делать' },
  { key: 'outputFormat', label: 'Формат ответа' },
  { key: 'tone', label: 'Тон' },
  { key: 'style', label: 'Стиль' },
  { key: 'length', label: 'Длина ответа' },
  { key: 'examples', label: 'Примеры' },
  { key: 'additionalInstructions', label: 'Дополнительные инструкции' },
]

function trimValue(value: string): string {
  return value.trim()
}

/** Собирает итоговый промт: только непустые поля, фиксированные заголовки. */
export function buildPrompt(fields: PromptFields): string {
  const parts: string[] = []
  for (const { key, label } of BLOCKS) {
    const raw = fields[key]
    if (typeof raw !== 'string') continue
    const text = trimValue(raw)
    if (!text) continue
    parts.push(`${label}:\n${text}`)
  }
  return parts.join('\n\n')
}
