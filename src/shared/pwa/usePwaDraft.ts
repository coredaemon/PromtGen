import { useContext } from 'react'
import { PwaContext } from '@/shared/pwa/PwaContext'

export function usePwaDraft() {
  const ctx = useContext(PwaContext)
  if (!ctx) {
    throw new Error('usePwaDraft must be used within PwaProvider')
  }
  return { draftDirty: ctx.draftDirty, setDraftDirty: ctx.setDraftDirty }
}
