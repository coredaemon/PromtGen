import { useContext } from 'react'
import { PwaContext } from '@/shared/pwa/PwaContext'

export function usePwaUpdate() {
  const ctx = useContext(PwaContext)
  if (!ctx) {
    throw new Error('usePwaUpdate must be used within PwaProvider')
  }
  return {
    needRefresh: ctx.needRefresh,
    offlineReady: ctx.offlineReady,
    updateServiceWorker: ctx.updateServiceWorker,
    dismissUpdate: ctx.dismissUpdate,
  }
}
