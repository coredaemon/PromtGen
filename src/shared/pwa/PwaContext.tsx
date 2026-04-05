import { createContext } from 'react'
import type { DisplayMode } from '@/shared/pwa/types'

export type BeforeInstallPromptEventLike = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type PwaContextValue = {
  displayMode: DisplayMode
  isStandalone: boolean
  online: boolean
  installPhase: 'unavailable' | 'ready' | 'installed'
  deferredPrompt: BeforeInstallPromptEventLike | null
  promptInstall: () => Promise<void>
  dismissInstallCard: () => void
  shouldShowInstallCard: boolean
  setDraftDirty: (dirty: boolean) => void
  draftDirty: boolean
  needRefresh: boolean
  offlineReady: boolean
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  dismissUpdate: () => void
}

export const PwaContext = createContext<PwaContextValue | null>(null)
