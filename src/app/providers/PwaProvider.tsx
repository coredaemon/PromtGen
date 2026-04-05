import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { PwaContext } from '@/shared/pwa/PwaContext'
import type { BeforeInstallPromptEventLike } from '@/shared/pwa/PwaContext'
import { loadPwaMetrics, savePwaMetrics } from '@/shared/pwa/pwaMetrics'
import { useDisplayMode } from '@/shared/pwa/useDisplayMode'
import { PwaUpdateToast } from '@/shared/ui/PwaUpdateToast'
import { listTemplates } from '@/shared/storage/idb'

const DISMISSED_KEY = 'promtgen-pwa-install-dismissed-v1'

export function PwaProvider({ children }: { children: ReactNode }) {
  const displayMode = useDisplayMode()
  const isStandalone = useMemo(() => {
    if (typeof window === 'undefined') return false
    const nav = window.navigator as Navigator & { standalone?: boolean }
    return (
      displayMode === 'standalone' ||
      displayMode === 'fullscreen' ||
      nav.standalone === true
    )
  }, [displayMode])

  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [draftDirty, setDraftDirty] = useState(false)

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEventLike | null>(null)
  const [installDismissed, setInstallDismissed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(DISMISSED_KEY) === '1',
  )

  const [visitMetrics, setVisitMetrics] = useState(() => {
    const m = loadPwaMetrics()
    const next = { ...m, visits: m.visits + 1 }
    savePwaMetrics(next)
    return next
  })

  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [hasUserTemplates, setHasUserTemplates] = useState(false)

  useEffect(() => {
    void listTemplates().then((list) => setHasUserTemplates(list.length > 0))
  }, [])

  useEffect(() => {
    const startedAt = Date.now()
    const id = window.setInterval(() => {
      setSessionSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => {
      window.clearInterval(id)
      const add = Math.floor((Date.now() - startedAt) / 1000)
      if (add <= 0) return
      setVisitMetrics((prev) => {
        const next = {
          ...prev,
          totalSeconds: prev.totalSeconds + add,
        }
        savePwaMetrics(next)
        return next
      })
    }
  }, [])

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEventLike)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    onRegistered() {
      // no-op; SW registered
    },
  })

  const [needRefreshFlag, setNeedRefresh] = needRefresh
  const [offlineReadyFlag] = offlineReady

  const dismissUpdate = useCallback(() => {
    setNeedRefresh(false)
  }, [setNeedRefresh])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const dismissInstallCard = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setInstallDismissed(true)
  }, [])

  const engagementOk = useMemo(() => {
    const total = visitMetrics.totalSeconds + sessionSeconds
    return (
      visitMetrics.visits >= 2 ||
      hasUserTemplates ||
      sessionSeconds >= 60 ||
      total >= 60
    )
  }, [visitMetrics, sessionSeconds, hasUserTemplates])

  const installPhase = useMemo(() => {
    if (isStandalone) return 'installed' as const
    if (deferredPrompt) return 'ready' as const
    return 'unavailable' as const
  }, [isStandalone, deferredPrompt])

  const shouldShowInstallCard = useMemo(() => {
    if (isStandalone || installDismissed) return false
    if (!engagementOk) return false
    return true
  }, [isStandalone, installDismissed, engagementOk])

  const value = useMemo(
    () => ({
      displayMode,
      isStandalone,
      online,
      installPhase,
      deferredPrompt,
      promptInstall,
      dismissInstallCard,
      shouldShowInstallCard,
      setDraftDirty,
      draftDirty,
      needRefresh: needRefreshFlag,
      offlineReady: offlineReadyFlag,
      updateServiceWorker,
      dismissUpdate,
    }),
    [
      displayMode,
      isStandalone,
      online,
      installPhase,
      deferredPrompt,
      promptInstall,
      dismissInstallCard,
      shouldShowInstallCard,
      draftDirty,
      needRefreshFlag,
      offlineReadyFlag,
      updateServiceWorker,
      dismissUpdate,
    ],
  )

  return (
    <PwaContext.Provider value={value}>
      {children}
      <PwaUpdateToast />
    </PwaContext.Provider>
  )
}
