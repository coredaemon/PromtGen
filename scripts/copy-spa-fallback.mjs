import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const index = resolve(dist, 'index.html')
const fallback = resolve(dist, '404.html')

if (!existsSync(index)) {
  console.error('copy-spa-fallback: dist/index.html not found; run vite build first')
  process.exit(1)
}

copyFileSync(index, fallback)
console.log('copy-spa-fallback: dist/index.html -> dist/404.html')
