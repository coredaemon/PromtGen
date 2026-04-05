import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Set VITE_BASE when deploying to GitHub Pages, e.g. /PromtGen/
const base = process.env.VITE_BASE ?? '/'
const manifestStartUrl = base.endsWith('/') ? base : `${base}/`

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'icons/*.png',
        'screenshots/*.png',
      ],
      manifest: {
        id: manifestStartUrl,
        name: 'PromtGen',
        short_name: 'PromtGen',
        description: 'Быстрый способ собрать сильный промт без мучений',
        lang: 'ru',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: manifestStartUrl,
        scope: manifestStartUrl,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Главная',
            short_name: 'Главная',
            description: 'Стартовый экран',
            url: './',
            icons: [
              {
                src: 'icons/shortcut-home.png',
                sizes: '96x96',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'Заготовки',
            short_name: 'Заготовки',
            description: 'Каталог заготовок',
            url: 'presets',
            icons: [
              {
                src: 'icons/shortcut-presets.png',
                sizes: '96x96',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'Конструктор',
            short_name: 'Конструктор',
            description: 'Свободный режим',
            url: 'builder',
            icons: [
              {
                src: 'icons/shortcut-builder.png',
                sizes: '96x96',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'Библиотека',
            short_name: 'Библиотека',
            description: 'Сохранённые шаблоны',
            url: 'library',
            icons: [
              {
                src: 'icons/shortcut-library.png',
                sizes: '96x96',
                type: 'image/png',
              },
            ],
          },
        ],
        screenshots: [
          {
            src: 'screenshots/shot-home-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Главная (desktop)',
          },
          {
            src: 'screenshots/shot-builder-narrow.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Конструктор',
          },
          {
            src: 'screenshots/shot-presets-narrow.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Заготовки',
          },
          {
            src: 'screenshots/shot-library-narrow.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Библиотека',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2,webmanifest}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
