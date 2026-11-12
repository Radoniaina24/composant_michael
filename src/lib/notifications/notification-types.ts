import type { ReactNode } from 'react'

export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading'

export const notificationDurations: Record<NotificationType, number> = {
  success: 3500,
  info: 4000,
  warning: 5000,
  error: 6000,
  loading: Number.POSITIVE_INFINITY,
}

export type NotificationAction = {
  label: ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export type NotificationOptions = {
  description?: ReactNode
  action?: NotificationAction
  duration?: number
  id?: string | number
  dismissible?: boolean
  closeButton?: boolean
  onDismiss?: () => void
  dedupe?: boolean
  dedupeWindow?: number
}

export type PromiseNotificationOptions<Data> = {
  loading: ReactNode
  success: ReactNode | ((data: Data) => ReactNode)
  error: ReactNode | ((error: unknown) => ReactNode)
  description?: ReactNode
  successDescription?: ReactNode | ((data: Data) => ReactNode)
  errorDescription?: ReactNode | ((error: unknown) => ReactNode)
  successDuration?: number
  errorDuration?: number
  action?: NotificationAction
  id?: string | number
  onDismiss?: () => void
}
