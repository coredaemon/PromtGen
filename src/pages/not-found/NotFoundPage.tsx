import { Link } from 'react-router-dom'
import { PageHeader } from '@/shared/ui/PageHeader'
import { buttonVisualClass } from '@/shared/ui/buttonStyles'

export function NotFoundPage() {
  return (
    <div>
      <PageHeader
        title="Страница не найдена"
        description="Похоже, ссылка устарела или адрес введён с ошибкой."
      />
      <Link to="/" className={buttonVisualClass('primary', 'md')}>
        На главную
      </Link>
    </div>
  )
}
