import { useContext } from 'react'
import { PwaContext } from '@/shared/pwa/PwaContext'

export function useInstallPrompt() {
  const ctx = useContext(PwaContext)
  if (!ctx) {
    throw new Error('useInstallPrompt must be used within PwaProvider')
  }
  return {
    installPhase: ctx.installPhase,
    deferredPrompt: ctx.deferredPrompt,
    promptInstall: ctx.promptInstall,
    dismissInstallCard: ctx.dismissInstallCard,
    shouldShowInstallCard: ctx.shouldShowInstallCard,
    isStandalone: ctx.isStandalone,
  }
}
