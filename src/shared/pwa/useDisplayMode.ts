import { useEffect, useState } from 'react'
import type { DisplayMode } from '@/shared/pwa/types'

function resolveMode(): DisplayMode {
  if (typeof window === 'undefined') return 'browser'
  const nav = window.navigator as Navigator & { standalone?: boolean }
  if (nav.standalone === true) return 'standalone'
  const queries: { q: string; mode: DisplayMode }[] = [
    { q: '(display-mode: standalone)', mode: 'standalone' },
    { q: '(display-mode: fullscreen)', mode: 'fullscreen' },
    { q: '(display-mode: minimal-ui)', mode: 'minimal-ui' },
    {
      q: '(display-mode: window-controls-overlay)',
      mode: 'window-controls-overlay',
    },
  ]
  for (const { q, mode } of queries) {
    if (window.matchMedia(q).matches) return mode
  }
  return 'browser'
}

export function useDisplayMode(): DisplayMode {
  const [mode, setMode] = useState<DisplayMode>(() => resolveMode())

  useEffect(() => {
    const queries = [
      '(display-mode: standalone)',
      '(display-mode: fullscreen)',
      '(display-mode: minimal-ui)',
      '(display-mode: window-controls-overlay)',
    ]
    const mqs = queries.map((q) => window.matchMedia(q))
    const onChange = () => setMode(resolveMode())
    mqs.forEach((mq) => mq.addEventListener('change', onChange))
    window.addEventListener('orientationchange', onChange)
    return () => {
      mqs.forEach((mq) => mq.removeEventListener('change', onChange))
      window.removeEventListener('orientationchange', onChange)
    }
  }, [])

  return mode
}

export function useStandaloneDisplay(): boolean {
  const mode = useDisplayMode()
  return mode === 'standalone' || mode === 'fullscreen'
}
