import { createContext } from 'react'
import type { AppSettings } from '@/entities/settings/types'

export type SettingsContextValue = {
  settings: AppSettings
  setSettings: (
    v: AppSettings | ((prev: AppSettings) => AppSettings),
  ) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
