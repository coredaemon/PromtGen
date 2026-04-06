import type { ReactNode } from 'react'
import { normalizeText } from '@/shared/lib/presetSearch'

type HighlightTextProps = {
  text: string
  /** Нормализованные токены (как из tokenizeQuery). */
  tokens: string[]
  className?: string
}

/**
 * Подсветка вхождений токенов в тексте (регистр и ё/е через normalizeText).
 */
export function HighlightText({ text, tokens, className }: HighlightTextProps) {
  const usable = tokens.filter((t) => t.length >= 2)
  if (usable.length === 0) return text

  const n = normalizeText(text)
  const marks = new Array<boolean>(text.length).fill(false)
  for (const t of usable) {
    let pos = 0
    while (pos < n.length) {
      const i = n.indexOf(t, pos)
      if (i === -1) break
      for (let k = 0; k < t.length; k++) {
        marks[i + k] = true
      }
      pos = i + 1
    }
  }

  const parts: ReactNode[] = []
  let buf = ''
  let bufMarked = false
  const flush = () => {
    if (!buf) return
    if (bufMarked) {
      parts.push(
        <mark
          key={parts.length}
          className={
            className ??
            'rounded-sm bg-[var(--accent-soft)] px-0.5 font-semibold text-[var(--text-1)]'
          }
        >
          {buf}
        </mark>,
      )
    } else {
      parts.push(buf)
    }
    buf = ''
  }

  for (let i = 0; i < text.length; i++) {
    const m = marks[i] ?? false
    if (buf.length > 0 && m !== bufMarked) {
      flush()
      bufMarked = m
    } else if (buf.length === 0) {
      bufMarked = m
    }
    buf += text[i]!
  }
  flush()

  return <>{parts}</>
}
