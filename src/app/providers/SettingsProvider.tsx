import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SettingsContext } from '@/app/settings-context'
import {
  loadSettings,
  saveSettings,
  type AppSettings,
} from '@/entities/settings/types'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings>(() => loadSettings())

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setSettings = useCallback(
    (v: AppSettings | ((prev: AppSettings) => AppSettings)) => {
      setSettingsState(v)
    },
    [],
  )

  const value = useMemo(
    () => ({ settings, setSettings }),
    [settings, setSettings],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
