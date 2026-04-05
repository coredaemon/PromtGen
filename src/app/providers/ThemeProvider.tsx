import { useEffect, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { useSettings } from '@/app/hooks/useSettings'

function resolveEffectiveTheme(theme: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') return theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolveEffectiveTheme(settings.theme)
  }, [settings.theme])

  useEffect(() => {
    if (settings.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      document.documentElement.dataset.theme = mq.matches ? 'dark' : 'light'
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [settings.theme])

  useLayoutEffect(() => {
    document.documentElement.dataset.fontScale = settings.fontScale
  }, [settings.fontScale])

  return children
}
