import { Toaster } from 'sonner'
import { useLocation } from 'react-router-dom'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'

export function AppToaster() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { pathname } = useLocation()
  const fabStackRoute =
    pathname === '/builder' || pathname.startsWith('/editor')

  const mobileBottom = !isDesktop && fabStackRoute
    ? 'calc(68px + 12px + 44px + 8px + env(safe-area-inset-bottom, 0px))'
    : 'calc(68px + env(safe-area-inset-bottom, 0px) + 8px)'

  return (
    <Toaster
      position={isDesktop ? 'top-right' : 'bottom-center'}
      mobileOffset={{
        bottom: mobileBottom,
      }}
      closeButton
      duration={3200}
      toastOptions={{
        classNames: {
          toast:
            'group toast w-[320px] max-w-[calc(100vw-32px)] rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-3.5 text-[var(--text-1)] shadow-[var(--shadow-md)]',
          title: 'text-sm font-semibold text-[var(--text-1)]',
          description: 'text-sm text-[var(--text-2)]',
          success: 'border-[var(--border-soft)]',
          error: 'border-[var(--border-soft)]',
        },
      }}
    />
  )
}
