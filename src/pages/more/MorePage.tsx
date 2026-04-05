import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Database, Info, Settings } from 'lucide-react'
import { APP_VERSION } from '@/shared/appVersion'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PwaInstallCard } from '@/shared/ui/PwaInstallCard'

export function MorePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash !== '#more-about') return
    requestAnimationFrame(() => {
      document.getElementById('more-about')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [location.hash, location.key])

  return (
    <div>
      <PageHeader
        title="Ещё"
        description="Дополнительные разделы и настройки."
      />

      <PwaInstallCard placement="more" />

      <ul className="flex flex-col gap-3">
        <li>
          <Link
            to="/settings"
            className="flex h-16 min-h-[64px] items-center justify-between gap-3 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-0 text-[var(--text-1)] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[140ms] hover:-translate-y-0.5 hover:border-[var(--border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--surface-2)] text-[var(--accent)]">
                <Settings className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="text-[15px] font-semibold leading-5">Настройки</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-3)]" aria-hidden />
          </Link>
        </li>
        <li>
          <Link
            to="/settings#settings-data"
            className="flex h-16 min-h-[64px] items-center justify-between gap-3 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-0 text-[var(--text-1)] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[140ms] hover:-translate-y-0.5 hover:border-[var(--border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--surface-2)] text-[var(--accent)]">
                <Database className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="text-[15px] font-semibold leading-5">Экспорт и импорт</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-3)]" aria-hidden />
          </Link>
        </li>
        <li>
          <a
            href="#more-about"
            className="flex h-16 min-h-[64px] items-center justify-between gap-3 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-0 text-[var(--text-1)] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform] duration-[140ms] hover:-translate-y-0.5 hover:border-[var(--border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--surface-2)] text-[var(--accent)]">
                <Info className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="text-[15px] font-semibold leading-5">О приложении</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-3)]" aria-hidden />
          </a>
        </li>
      </ul>

      <section
        id="more-about"
        className="mt-8 scroll-mt-24 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-xs)]"
      >
        <h2 className="text-[16px] font-semibold leading-6 text-[var(--text-1)]">
          О приложении
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-[var(--text-2)]">
          PromtGen помогает собирать промты из блоков и заготовок. Данные хранятся
          только в этом браузере — без облака и аккаунта.
        </p>
      </section>

      <footer className="mt-8 border-t border-[var(--border-soft)] pt-6 pb-2">
        <p className="text-center text-[12px] leading-[18px] text-[var(--text-3)]">
          Версия {APP_VERSION}
          <span className="mx-2 text-[var(--border-strong)]" aria-hidden>
            ·
          </span>
          локальное хранение
          <span className="mx-2 text-[var(--border-strong)]" aria-hidden>
            ·
          </span>
          можно установить как PWA
        </p>
      </footer>
    </div>
  )
}
