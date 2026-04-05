export type ThemePreference = 'light' | 'dark' | 'system'

export type FontScale = 'sm' | 'md' | 'lg'

export type AppSettings = {
  theme: ThemePreference
  fontScale: FontScale
  /** Подставляется в поле «Формат ответа» для новых шаблонов */
  defaultOutputFormat: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  fontScale: 'md',
  defaultOutputFormat: '',
}

const KEY = 'promtgen-settings-v1'

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEY, JSON.stringify(settings))
}
