import { clearAllData } from '@/shared/storage/idb'

export function clearLocalAppStorageKeys(): void {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith('promtgen-')) keys.push(k)
  }
  for (const k of keys) {
    localStorage.removeItem(k)
  }
}

export async function resetAllUserData(): Promise<void> {
  await clearAllData()
  clearLocalAppStorageKeys()
}
