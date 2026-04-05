import type { ReactNode } from 'react'
import { PwaProvider } from '@/app/providers/PwaProvider'
import { SettingsProvider } from '@/app/providers/SettingsProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <PwaProvider>{children}</PwaProvider>
      </ThemeProvider>
    </SettingsProvider>
  )
}
