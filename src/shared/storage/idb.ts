import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { HistoryEntry, PromptTemplate } from '@/entities/prompt-template/types'

interface PromtGenDB extends DBSchema {
  templates: {
    key: string
    value: PromptTemplate
  }
  history: {
    key: string
    value: HistoryEntry
  }
}

const DB_NAME = 'promtgen-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<PromtGenDB>> | null = null

export function getDB(): Promise<IDBPDatabase<PromtGenDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PromtGenDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function listTemplates(): Promise<PromptTemplate[]> {
  const db = await getDB()
  return db.getAll('templates')
}

export async function getTemplate(id: string): Promise<PromptTemplate | undefined> {
  const db = await getDB()
  return db.get('templates', id)
}

export async function putTemplate(template: PromptTemplate): Promise<void> {
  const db = await getDB()
  await db.put('templates', {
    ...template,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteTemplate(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('templates', id)
}

export async function listHistory(limit = 200): Promise<HistoryEntry[]> {
  const db = await getDB()
  const all = await db.getAll('history')
  return all
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit)
}

export async function addHistoryEntry(entry: HistoryEntry): Promise<void> {
  const db = await getDB()
  await db.put('history', entry)
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('history', id)
}

export async function clearHistory(): Promise<void> {
  const db = await getDB()
  await db.clear('history')
}

export async function clearAllTemplates(): Promise<void> {
  const db = await getDB()
  await db.clear('templates')
}

export async function clearAllData(): Promise<void> {
  const db = await getDB()
  await db.clear('templates')
  await db.clear('history')
}
