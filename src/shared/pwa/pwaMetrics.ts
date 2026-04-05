const METRICS_KEY = 'promtgen-pwa-metrics-v1'

export type PwaMetrics = {
  visits: number
  totalSeconds: number
}

export function loadPwaMetrics(): PwaMetrics {
  try {
    const raw = localStorage.getItem(METRICS_KEY)
    if (!raw) return { visits: 0, totalSeconds: 0 }
    const p = JSON.parse(raw) as Partial<PwaMetrics>
    return {
      visits: typeof p.visits === 'number' ? p.visits : 0,
      totalSeconds: typeof p.totalSeconds === 'number' ? p.totalSeconds : 0,
    }
  } catch {
    return { visits: 0, totalSeconds: 0 }
  }
}

export function savePwaMetrics(m: PwaMetrics): void {
  localStorage.setItem(METRICS_KEY, JSON.stringify(m))
}
