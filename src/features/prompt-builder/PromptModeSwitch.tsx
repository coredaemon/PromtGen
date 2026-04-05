type PromptModeSwitchProps = {
  advanced: boolean
  onChange: (advanced: boolean) => void
}

export function PromptModeSwitch({
  advanced,
  onChange,
}: PromptModeSwitchProps) {
  return (
    <div
      className="inline-flex h-10 rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] p-1 dark:bg-[var(--surface-2)]"
      role="group"
      aria-label="Режим полей"
    >
      <button
        type="button"
        onClick={() => onChange(false)}
        className={
          advanced
            ? 'rounded-[10px] px-3 py-1.5 text-sm font-medium text-[var(--text-3)] transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]'
            : 'rounded-[10px] bg-[var(--surface-3)] px-3 py-1.5 text-sm font-semibold text-[var(--text-1)] shadow-[var(--shadow-sm)] dark:bg-[var(--surface-3)]'
        }
      >
        Простой
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={
          advanced
            ? 'rounded-[10px] bg-[var(--surface-1)] px-3 py-1.5 text-sm font-semibold text-[var(--text-1)] shadow-[var(--shadow-sm)] dark:bg-[var(--surface-3)]'
            : 'rounded-[10px] px-3 py-1.5 text-sm font-medium text-[var(--text-3)] transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]'
        }
      >
        Расширенный
      </button>
    </div>
  )
}
