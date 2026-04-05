import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, HardDrive, Layers, Shield, Smartphone, X } from 'lucide-react'
import { BUILTIN_PRESETS } from '@/data/presets/presets'
import type { PromptTemplate } from '@/entities/prompt-template/types'
import { buttonVisualClass } from '@/shared/ui/buttonStyles'
import { SectionTitle } from '@/shared/ui/SectionTitle'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PwaInstallCard } from '@/shared/ui/PwaInstallCard'
import { listTemplates } from '@/shared/storage/idb'
import {
  dismissOnboarding,
  getRecentItems,
  isFavoritePreset,
  isOnboardingDismissed,
} from '@/shared/storage/localPreferences'

export function HomePage() {
  const location = useLocation()
  const [userTemplates, setUserTemplates] = useState<PromptTemplate[]>([])
  const [onboardingOpen, setOnboardingOpen] = useState(
    () => !isOnboardingDismissed(),
  )

  useEffect(() => {
    void listTemplates().then(setUserTemplates)
  }, [location.key])

  const recentResolved = getRecentItems()
    .map((item) => {
      if (item.kind === 'user') {
        const t = userTemplates.find((x) => x.id === item.id)
        if (!t) return null
        return { key: `u-${t.id}`, title: t.title, to: `/editor/${t.id}` }
      }
      const p = BUILTIN_PRESETS.find((x) => x.id === item.id)
      if (!p) return null
      return {
        key: `p-${p.id}`,
        title: p.title,
        to: `/editor?preset=${encodeURIComponent(p.id)}`,
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const favoritePresets = BUILTIN_PRESETS.filter((p) =>
    isFavoritePreset(p.id),
  )

  const favoriteUsers = userTemplates.filter((t) => t.isFavorite).slice(0, 6)

  return (
    <div>
      {onboardingOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(7,17,31,0.45)] p-3 backdrop-blur-[2px] sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <div
            className="w-full max-w-[calc(100vw-24px)] rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-lg)] sm:max-w-md sm:p-6"
            style={{ marginBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          >
            <div className="flex justify-between gap-2">
              <h2
                id="onboarding-title"
                className="text-lg font-semibold text-[var(--text-1)]"
              >
                Добро пожаловать
              </h2>
              <button
                type="button"
                className="rounded-[10px] p-1.5 text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                aria-label="Закрыть"
                onClick={() => {
                  dismissOnboarding()
                  setOnboardingOpen(false)
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-[15px] leading-6 text-[var(--text-2)]">
              PromtGen хранит шаблоны только на вашем устройстве. Выберите
              заготовку или откройте конструктор — предпросмотр обновляется
              сразу.
            </p>
            <button
              type="button"
              className={buttonVisualClass('primary', 'md', 'mt-5 w-full')}
              onClick={() => {
                dismissOnboarding()
                setOnboardingOpen(false)
              }}
            >
              Понятно
            </button>
          </div>
        </div>
      ) : null}

      <section className="mb-6 max-h-none md:max-h-[78vh] md:mb-12">
        <div
          className="flex max-h-full flex-col rounded-[20px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,254,0.96))] p-5 shadow-[var(--shadow-lg)] md:max-h-none md:rounded-[24px] md:p-8 dark:bg-[linear-gradient(180deg,rgba(23,43,69,0.9),rgba(13,26,44,0.9))]"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 md:gap-0">
          <h1 className="text-[28px] font-bold leading-[34px] tracking-tight text-[var(--text-1)] md:text-[40px] md:leading-[48px]">
            PromtGen
          </h1>
          <p className="max-w-2xl text-base leading-[26px] text-[var(--text-2)] md:mt-3 md:text-[18px] md:leading-7">
            Быстрый способ собрать сильный промт: заготовки под задачу или свой
            конструктор из блоков. Всё хранится локально на устройстве.
          </p>
          <ul className="flex max-w-full flex-wrap gap-3 text-[12px] font-semibold leading-4 text-[var(--text-3)] md:mt-4 md:gap-x-4 md:gap-y-2">
            <li className="inline-flex items-center gap-1.5">
              <HardDrive className="h-[14px] w-[14px] shrink-0" aria-hidden />
              Работает локально
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Shield className="h-[14px] w-[14px] shrink-0" aria-hidden />
              Без аккаунта
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Smartphone className="h-[14px] w-[14px] shrink-0" aria-hidden />
              PWA
            </li>
          </ul>

          <div className="grid gap-4 sm:grid-cols-2 md:mt-8 md:gap-6">
            <Link
              to="/presets"
              className="group flex min-h-[136px] sm:min-h-[152px] flex-col rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-[18px] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] md:min-h-[220px] md:p-6"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)]">
                <Layers className="h-7 w-7" aria-hidden />
              </div>
              <h2 className="text-[18px] font-semibold leading-[26px] text-[var(--text-1)]">
                Заготовки
              </h2>
              <p className="mt-2 flex-1 text-[15px] leading-6 text-[var(--text-2)]">
                Готовые сценарии: тексты, работа, обучение, код и другое. Откройте
                и доработайте под себя.
              </p>
              <span className="mt-4 text-sm font-semibold text-[var(--accent)] group-hover:underline">
                Перейти в каталог
              </span>
            </Link>

            <Link
              to="/builder"
              className="group flex min-h-[136px] sm:min-h-[152px] flex-col rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-[18px] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] md:min-h-[220px] md:p-6"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)]">
                <BookOpen className="h-7 w-7" aria-hidden />
              </div>
              <h2 className="text-[18px] font-semibold leading-[26px] text-[var(--text-1)]">
                Свободный режим
              </h2>
              <p className="mt-2 flex-1 text-[15px] leading-6 text-[var(--text-2)]">
                Соберите промт из блоков с живым предпросмотром. Простой и
                расширенный набор полей.
              </p>
              <span className="mt-4 text-sm font-semibold text-[var(--accent)] group-hover:underline">
                Открыть конструктор
              </span>
            </Link>
          </div>
          </div>
        </div>
      </section>

      <PwaInstallCard placement="home" />

      <section>
        <SectionTitle className="mb-3" weight="medium">
          Недавние
        </SectionTitle>
        {recentResolved.length === 0 ? (
          <EmptyState
            title="Пока пусто"
            description="Откройте заготовку или сохраните шаблон — недавние появятся здесь."
            action={
              <Link
                to="/presets"
                className={buttonVisualClass('primary', 'md')}
              >
                К заготовкам
              </Link>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {recentResolved.map((r) => (
              <li key={r.key}>
                <div className="flex min-h-[72px] flex-col gap-2 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-[14px] shadow-[var(--shadow-xs)] sm:h-[72px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-0">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-6 text-[var(--text-1)]">
                      {r.title}
                    </p>
                    <p className="mt-0.5 text-[12px] font-semibold leading-4 text-[var(--text-3)]">
                      Открыто недавно
                    </p>
                  </div>
                  <Link
                    to={r.to}
                    className={buttonVisualClass(
                      'primary',
                      'md',
                      'w-full shrink-0 justify-center sm:w-auto sm:min-w-[7rem]',
                    )}
                  >
                    Открыть
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-5 md:mt-10">
        <SectionTitle className="mb-3">Избранное</SectionTitle>
        {favoritePresets.length === 0 && favoriteUsers.length === 0 ? (
          <EmptyState
            title="Нет избранного"
            description="Нажмите «В избранное» на карточке заготовки или в библиотеке."
            action={
              <Link to="/presets" className={buttonVisualClass('primary', 'md')}>
                В каталог
              </Link>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {favoritePresets.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/editor?preset=${encodeURIComponent(p.id)}`}
                  className="block rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 py-4 text-[15px] font-medium leading-6 text-[var(--text-1)] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-[140ms] hover:border-[var(--border-strong)]"
                >
                  {p.title}{' '}
                  <span className="text-[var(--text-3)]">· {p.category}</span>
                </Link>
              </li>
            ))}
            {favoriteUsers.map((t) => (
              <li key={t.id}>
                <Link
                  to={`/editor/${t.id}`}
                  className="block rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 py-4 text-[15px] font-medium leading-6 text-[var(--text-1)] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-[140ms] hover:border-[var(--border-strong)]"
                >
                  {t.title}{' '}
                  <span className="text-[var(--text-3)]">· мой шаблон</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
