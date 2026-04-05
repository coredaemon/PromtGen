import { NavLink, Outlet } from 'react-router-dom'
import {
  BookOpen,
  Home,
  Layers,
  Library,
  Menu,
  Settings,
} from 'lucide-react'
import { AppToaster } from '@/app/providers/AppToaster'
import { OfflineBadge } from '@/shared/ui/OfflineBadge'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'

const desktopNav = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/presets', label: 'Заготовки', icon: Layers },
  { to: '/builder', label: 'Конструктор', icon: BookOpen },
  { to: '/library', label: 'Библиотека', icon: Library },
  { to: '/settings', label: 'Настройки', icon: Settings },
] as const

const mobileNav = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/presets', label: 'Заготовки', icon: Layers },
  { to: '/builder', label: 'Конструктор', icon: BookOpen },
  { to: '/library', label: 'Библиотека', icon: Library },
  { to: '/more', label: 'Ещё', icon: Menu },
] as const

function desktopNavLinkClass(isActive: boolean) {
  return [
    'inline-flex h-10 items-center gap-2 rounded-[999px] px-3.5 text-sm font-medium leading-5 transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]',
    isActive
      ? 'bg-[rgba(49,94,251,0.08)] text-[var(--text-1)] dark:bg-[var(--surface-3)]'
      : 'text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]',
  ].join(' ')
}

function mobileNavLinkClass(isActive: boolean) {
  return [
    'flex min-h-[44px] min-w-0 max-w-[5rem] flex-1 flex-col items-center justify-center gap-1 rounded-[14px] px-2 py-[6px] text-[11px] font-normal leading-[14px] transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
    isActive
      ? 'bg-[rgba(49,94,251,0.05)] text-[var(--text-1)] dark:bg-[rgba(92,140,255,0.07)]'
      : 'text-[var(--text-4)] hover:bg-[var(--surface-2)] hover:text-[var(--text-3)] active:bg-[var(--surface-2)]',
  ].join(' ')
}

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div
        className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--surface-1)]/72 backdrop-blur-[14px] [padding-top:env(safe-area-inset-top,0px)]"
      >
        <header className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-4 md:h-16 md:px-8">
          <NavLink
            to="/"
            className="text-lg font-semibold tracking-tight text-[var(--text-1)] transition-opacity duration-[140ms] hover:opacity-90"
          >
            PromtGen
          </NavLink>
          <div className="flex items-center gap-2">
            <OfflineBadge />
            <ThemeToggle />
            <NavLink
              to="/settings"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text-2)] transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] aria-[current=page]:border-[var(--accent-soft)] aria-[current=page]:text-[var(--accent)]"
              aria-label="Настройки"
            >
              <Settings className="h-[18px] w-[18px]" aria-hidden />
            </NavLink>
          </div>
        </header>

        <nav
          className="hidden border-t border-[var(--border-soft)] md:block"
          aria-label="Основная навигация"
        >
          <div className="mx-auto flex max-w-[1280px] flex-wrap gap-2 px-4 py-2 md:px-8">
            {desktopNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => desktopNavLinkClass(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-4 pb-[calc(68px+env(safe-area-inset-bottom,0px))] pt-4 md:px-8 md:pb-8 md:pt-6">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-soft)] bg-[rgba(255,255,255,0.92)] backdrop-blur-[14px] dark:bg-[rgba(11,23,40,0.92)] md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Основная навигация"
      >
        <ul className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-1 px-2.5 py-2">
          {mobileNav.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex min-w-0 flex-1 justify-center">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${mobileNavLinkClass(isActive)} w-full`
                }
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <AppToaster />
    </div>
  )
}
