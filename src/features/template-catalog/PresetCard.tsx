import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PresetDefinition } from '@/entities/prompt-template/types'
import { FavoriteToggle } from '@/features/favorites/FavoriteToggle'
import { buttonVisualClass } from '@/shared/ui/buttonStyles'

type PresetCardProps = {
  preset: PresetDefinition
  favorite: boolean
  onFavoriteToggle: () => void
}

export function PresetCard({
  preset,
  favorite,
  onFavoriteToggle,
}: PresetCardProps) {
  return (
    <article
      className="group flex min-h-[176px] flex-col rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-[18px] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] md:min-h-[220px] md:rounded-[18px] md:p-6 dark:hover:shadow-[var(--shadow-md)]"
    >
      <div className="mb-2 text-[12px] font-semibold uppercase leading-4 tracking-[0.02em] text-[var(--text-3)]">
        {preset.category}
      </div>
      <h3 className="text-[17px] font-semibold leading-6 tracking-tight text-[var(--text-1)] transition-colors duration-[140ms] group-hover:text-[var(--accent)] md:text-[22px] md:leading-[30px]">
        {preset.title}
      </h3>
      <p className="mt-2 flex-1 text-[15px] font-normal leading-6 text-[var(--text-2)]">
        {preset.description}
      </p>
      <div className="mt-[18px] flex flex-col gap-2.5 border-t border-[var(--border-soft)] pt-4 md:flex-row md:flex-wrap md:items-center md:gap-2">
        <Link
          to={`/editor?preset=${encodeURIComponent(preset.id)}`}
          className={buttonVisualClass(
            'primary',
            'lg',
            'order-1 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-[12px] md:order-2 md:ml-auto md:w-[min(100%,132px)]',
          )}
        >
          Открыть
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <FavoriteToggle
          active={favorite}
          onToggle={onFavoriteToggle}
          label={favorite ? 'В избранном' : 'В избранное'}
          className="order-2 h-11 min-h-[44px] w-full justify-center px-3 text-[13px] md:order-1 md:h-10 md:min-h-0 md:w-auto md:min-w-0 md:flex-initial md:px-4 md:text-sm"
        />
      </div>
    </article>
  )
}
