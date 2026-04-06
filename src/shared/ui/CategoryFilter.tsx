type CategoryFilterProps = {
  categories: readonly string[]
  value: string | 'all'
  onChange: (v: string | 'all') => void
}

const chipBase =
  'inline-flex shrink-0 items-center rounded-[999px] border transition-[background-color,border-color,color] duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] h-[34px] px-3 text-[13px] font-medium leading-[16px] md:h-9 md:px-3.5 md:text-sm md:leading-5'

export function CategoryFilter({
  categories,
  value,
  onChange,
}: CategoryFilterProps) {
  const inactive = `${chipBase} border-[var(--border-soft)] bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-3)]`
  const active = `${chipBase} border-transparent bg-[var(--accent-soft)] text-[var(--accent)]`

  return (
    <nav
      className="-mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 py-0.5 md:mx-0 md:px-0"
      aria-label="Категории заготовок"
    >
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`whitespace-nowrap ${value === 'all' ? active : inactive}`}
      >
        Все
      </button>
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`whitespace-nowrap ${value === c ? active : inactive}`}
        >
          {c}
        </button>
      ))}
    </nav>
  )
}
