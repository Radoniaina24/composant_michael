import { useEffect, useState, type CSSProperties } from 'react'
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react'
import {
  Toaster as SonnerToaster,
  type ToastClassnames,
  type ToasterProps,
} from 'sonner'
import { cn } from '@/lib/utils'

type DocumentTheme = 'light' | 'dark'

function getDocumentTheme(): DocumentTheme {
  return document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light'
}

function useDocumentTheme() {
  const [theme, setTheme] = useState<DocumentTheme>(getDocumentTheme)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getDocumentTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return theme
}

const toastClassNames: ToastClassnames = {
  toast: cn(
    'group/toast pointer-events-auto relative flex w-full items-start gap-3 rounded-xl border p-4 pr-11 text-left text-popover-foreground shadow-lg shadow-foreground/5 backdrop-blur-md',
    'border-border/70 bg-popover/95',
    'data-[type=success]:border-success/25 data-[type=success]:bg-success-surface',
    'data-[type=error]:border-destructive/25 data-[type=error]:bg-destructive-surface',
    'data-[type=warning]:border-warning/25 data-[type=warning]:bg-warning-surface',
    'data-[type=info]:border-info/25 data-[type=info]:bg-info-surface',
    'data-[type=loading]:border-border/70 data-[type=loading]:bg-popover/95',
    '[&[data-expanded=false][data-front=false]>*]:opacity-0',
    'focus-visible:shadow-none! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ),
  icon: cn(
    'relative mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground',
    'group-data-[type=success]/toast:text-success',
    'group-data-[type=error]/toast:text-destructive',
    'group-data-[type=warning]/toast:text-warning',
    'group-data-[type=info]/toast:text-info',
    'group-data-[type=loading]/toast:text-muted-foreground',
  ),
  content: 'min-w-0 flex-1',
  title: 'text-sm font-medium leading-5 text-foreground',
  description: 'mt-0.5 text-xs leading-5 text-muted-foreground!',
  actionButton: cn(
    'ml-1 inline-flex h-7 shrink-0 items-center justify-center rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground',
    'transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ),
  cancelButton: cn(
    'ml-1 inline-flex h-7 shrink-0 items-center justify-center rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground',
    'transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ),
  closeButton: cn(
    'absolute top-2 right-2 flex size-7 items-center justify-center rounded-full border-0! bg-transparent! text-muted-foreground!',
    'opacity-0 transition-[opacity,background-color,color] hover:bg-muted! hover:text-foreground!',
    'focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'group-hover/toast:opacity-100 max-sm:opacity-100',
  ),
  loader: 'flex items-center justify-center text-muted-foreground',
}

const toastIcons = {
  success: <CircleCheckIcon className="size-5" aria-hidden="true" />,
  error: <CircleXIcon className="size-5" aria-hidden="true" />,
  warning: <TriangleAlertIcon className="size-5" aria-hidden="true" />,
  info: <InfoIcon className="size-5" aria-hidden="true" />,
  loading: (
    <LoaderCircleIcon
      className="size-5 animate-spin motion-reduce:animate-none"
      aria-hidden="true"
    />
  ),
  close: <XIcon className="size-3.5" aria-hidden="true" />,
}

export function Toaster({
  theme,
  style,
  toastOptions,
  icons,
  ...props
}: ToasterProps) {
  const documentTheme = useDocumentTheme()

  return (
    <SonnerToaster
      position="top-right"
      theme={theme ?? documentTheme}
      closeButton
      visibleToasts={4}
      duration={4000}
      gap={12}
      offset={{
        top: 'calc(1rem + env(safe-area-inset-top))',
        right: 'calc(1rem + env(safe-area-inset-right))',
        bottom: 'calc(1rem + env(safe-area-inset-bottom))',
        left: 'calc(1rem + env(safe-area-inset-left))',
      }}
      mobileOffset={{
        top: 'calc(0.75rem + env(safe-area-inset-top))',
        right: '0.75rem',
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        left: '0.75rem',
      }}
      swipeDirections={['right', 'top']}
      containerAriaLabel="Notifications"
      icons={{ ...toastIcons, ...icons }}
      style={
        {
          '--width': '380px',
          fontFamily: 'var(--font-sans)',
          ...style,
        } as CSSProperties
      }
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          ...toastClassNames,
          ...toastOptions?.classNames,
        },
        closeButtonAriaLabel: 'Fermer la notification',
      }}
      {...props}
    />
  )
}
