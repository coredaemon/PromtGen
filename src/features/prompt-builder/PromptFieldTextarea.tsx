import type { ReactNode } from 'react'

type PromptFieldTextareaProps = {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  hint?: ReactNode
}

export function PromptFieldTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
}: PromptFieldTextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[14px] font-semibold leading-5 text-[var(--text-1)]"
      >
        {label}
      </label>
      {hint ? (
        <p className="text-[13px] leading-[18px] text-[var(--text-3)]">{hint}</p>
      ) : null}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="input-focus min-h-[112px] w-full resize-y rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3.5 text-base leading-[26px] text-[var(--text-1)] transition-[border-color,box-shadow] duration-[120ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] dark:bg-[var(--surface-2)] lg:min-h-[120px]"
      />
    </div>
  )
}
