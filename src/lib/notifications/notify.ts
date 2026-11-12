import type { ReactNode } from 'react'
import { toast } from 'sonner'
import {
  notificationDurations,
  type NotificationAction,
  type NotificationOptions,
  type NotificationType,
  type PromiseNotificationOptions,
} from './notification-types'

const DEFAULT_DEDUPE_WINDOW = 1500
const errorDedupeWindow = 5000

type RecentNotification = {
  id: string | number
  timeout: ReturnType<typeof setTimeout>
}

const recentNotifications = new Map<string, RecentNotification>()

function clearRecentNotification(key: string) {
  const recentNotification = recentNotifications.get(key)

  if (!recentNotification) {
    return
  }

  clearTimeout(recentNotification.timeout)
  recentNotifications.delete(key)
}

function toSonnerAction(action?: NotificationAction) {
  if (!action) {
    return undefined
  }

  return {
    label: action.label,
    onClick: action.onClick,
  }
}

function getDedupeKey(
  type: NotificationType,
  message: ReactNode,
  options?: NotificationOptions,
) {
  if (options?.id !== undefined) {
    return null
  }

  const shouldDedupe = options?.dedupe ?? type !== 'loading'

  if (!shouldDedupe || typeof message !== 'string') {
    return null
  }

  return `${type}:${message.trim().toLocaleLowerCase('fr')}`
}

function createNotification(
  type: NotificationType,
  message: ReactNode,
  options?: NotificationOptions,
) {
  const dedupeKey = getDedupeKey(type, message, options)

  if (dedupeKey) {
    const existing = recentNotifications.get(dedupeKey)

    if (existing) {
      return existing.id
    }
  }

  const id = toast[type](message, {
    id: options?.id,
    description: options?.description,
    duration:
      options?.duration ??
      notificationDurations[type],
    action: toSonnerAction(options?.action),
    dismissible: options?.dismissible,
    closeButton: options?.closeButton,
    onDismiss: () => {
      if (dedupeKey) {
        clearRecentNotification(dedupeKey)
      }

      options?.onDismiss?.()
    },
  })

  if (dedupeKey) {
    const timeout = setTimeout(() => {
      recentNotifications.delete(dedupeKey)
    }, options?.dedupeWindow ??
      (type === 'error' ? errorDedupeWindow : DEFAULT_DEDUPE_WINDOW))

    recentNotifications.set(dedupeKey, { id, timeout })
  }

  return id
}

export function notifySuccess(
  message: ReactNode,
  options?: NotificationOptions,
) {
  return createNotification('success', message, options)
}

export function notifyError(
  message: ReactNode,
  options?: NotificationOptions,
) {
  return createNotification('error', message, options)
}

export function notifyWarning(
  message: ReactNode,
  options?: NotificationOptions,
) {
  return createNotification('warning', message, options)
}

export function notifyInfo(
  message: ReactNode,
  options?: NotificationOptions,
) {
  return createNotification('info', message, options)
}

export function notifyLoading(
  message: ReactNode,
  options?: NotificationOptions,
) {
  return createNotification('loading', message, options)
}

export function notifyPromise<Data>(
  promise: Promise<Data> | (() => Promise<Data>),
  messages: PromiseNotificationOptions<Data>,
) {
  function getResult(
    message: ReactNode,
    description: ReactNode,
    duration: number,
  ) {
    return {
      message,
      ...(description === undefined ? {} : { description }),
      duration,
      action: toSonnerAction(messages.action),
    }
  }

  return toast.promise(promise, {
    id: messages.id,
    loading: messages.loading,
    description: messages.description,
    success: (data) =>
      getResult(
        typeof messages.success === 'function'
          ? messages.success(data)
          : messages.success,
        typeof messages.successDescription === 'function'
          ? messages.successDescription(data)
          : messages.successDescription,
        messages.successDuration ??
          notificationDurations.success,
      ),
    error: (error) =>
      getResult(
        typeof messages.error === 'function'
          ? messages.error(error)
          : messages.error,
        typeof messages.errorDescription === 'function'
          ? messages.errorDescription(error)
          : messages.errorDescription,
        messages.errorDuration ??
          notificationDurations.error,
      ),
    onDismiss: messages.onDismiss
      ? () => messages.onDismiss?.()
      : undefined,
  })
}

export function notifyDismiss(id?: string | number) {
  return toast.dismiss(id)
}

export const notify = {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  loading: notifyLoading,
  promise: notifyPromise,
  dismiss: notifyDismiss,
}

export { notificationDurations }
export type {
  NotificationAction,
  NotificationOptions,
  NotificationType,
  PromiseNotificationOptions,
}
