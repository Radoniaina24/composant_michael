import {
  CircleAlertIcon,
  InboxIcon,
  RotateCcwIcon,
  SearchXIcon,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableEmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  filtered?: boolean
  className?: string
}

export function DataTableEmptyState({
  icon: Icon,
  title,
  description,
  action,
  filtered = false,
  className,
}: DataTableEmptyStateProps) {
  const StateIcon = Icon ?? (filtered ? SearchXIcon : InboxIcon)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-14 text-center',
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full border bg-muted/50 text-muted-foreground">
        <StateIcon className="size-5" aria-hidden="true" />
      </div>
      <div className="grid gap-1">
        <p className="font-medium text-foreground">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

type DataTableErrorStateProps = {
  message?: string
  onRetry?: () => void
  className?: string
}

export function DataTableErrorState({
  message = 'Impossible de charger les données.',
  onRetry,
  className,
}: DataTableErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-14 text-center',
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full border border-destructive/25 bg-destructive-surface text-destructive">
        <CircleAlertIcon className="size-5" aria-hidden="true" />
      </div>
      <div className="grid gap-1">
        <p className="font-medium text-foreground">Une erreur est survenue</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCcwIcon aria-hidden="true" />
          Réessayer
        </Button>
      )}
    </div>
  )
}
