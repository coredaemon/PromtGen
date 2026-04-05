import { Monitor, Moon, Sun } from 'lucide-react'
import { useSettings } from '@/app/hooks/useSettings'
import type { ThemePreference } from '@/entities/settings/types'

const order: ThemePreference[] = ['light', 'dark', 'system']

const labels: Record<ThemePreference, string> = {
  light: 'Светлая тема',
  dark: 'Тёмная тема',
  system: 'Как в системе',
}

export function ThemeToggle() {
  const { settings, setSettings } = useSettings()
  const i = order.indexOf(settings.theme)
  const next = order[(i + 1) % order.length]

  const Icon =
    settings.theme === 'light'
      ? Sun
      : settings.theme === 'dark'
        ? Moon
        : Monitor

  return (
    <button
      type="button"
      title={`${labels[settings.theme]} — нажмите для «${labels[next]}»`}
      aria-label={`Тема: ${labels[settings.theme]}. Переключить на ${labels[next]}`}
      onClick={() => setSettings({ ...settings, theme: next })}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text-2)] transition-colors duration-[140ms] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
    </button>
  )
}
