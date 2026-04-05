import { createBrowserRouter } from 'react-router-dom'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')
import { AppLayout } from '@/shared/ui/AppLayout'
import { HomePage } from '@/pages/home/HomePage'
import { PresetsPage } from '@/pages/presets/PresetsPage'
import { BuilderPage } from '@/pages/builder/BuilderPage'
import { EditorPage } from '@/pages/editor/EditorPage'
import { LibraryPage } from '@/pages/library/LibraryPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { MorePage } from '@/pages/more/MorePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'presets', element: <PresetsPage /> },
        { path: 'builder', element: <BuilderPage /> },
        { path: 'editor', element: <EditorPage /> },
        { path: 'editor/:id', element: <EditorPage /> },
        { path: 'library', element: <LibraryPage /> },
        { path: 'more', element: <MorePage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  routerBasename ? { basename: routerBasename } : {},
)
