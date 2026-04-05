type PromptPreviewProps = {
  text: string
  className?: string
}

export function PromptPreview({ text, className = '' }: PromptPreviewProps) {
  const empty = !text.trim()

  return (
    <div
      className={`flex min-h-[380px] max-h-[min(560px,calc(100vh-140px))] flex-col overflow-hidden rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-[var(--shadow-sm)] dark:shadow-[var(--shadow-sm)] ${className}`}
    >
      <div className="flex h-10 shrink-0 items-center border-b border-[var(--border-soft)] px-[18px] text-[12px] font-semibold uppercase leading-4 tracking-[0.02em] text-[var(--text-3)]">
        Предпросмотр
      </div>
      <div
        className="min-h-0 flex-1 overflow-auto p-[18px]"
        style={{ background: 'var(--preview-inner-bg)' }}
      >
        <pre
          className={`font-sans whitespace-pre-wrap break-words text-[15px] font-normal leading-[26px] text-[var(--text-1)] ${empty ? 'text-[var(--text-4)]' : ''}`}
        >
          {empty
            ? 'Заполните поля слева — здесь появится итоговый промт.'
            : text}
        </pre>
      </div>
    </div>
  )
}
