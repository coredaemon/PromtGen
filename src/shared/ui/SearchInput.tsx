import { Search } from 'lucide-react'

type SearchInputProps = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  id?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Поиск…',
  id = 'search',
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--text-4)]"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-focus h-12 w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-1)] py-0 pl-12 pr-4 text-base text-[var(--text-1)] shadow-[var(--shadow-sm)] dark:bg-[var(--surface-2)]"
      />
    </div>
  )
}
