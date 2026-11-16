import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type SwitchFieldProps = React.ComponentProps<typeof Switch> & {
  label: React.ReactNode
  description?: React.ReactNode
  error?: string
}

export function SwitchField({
  id,
  label,
  description,
  error,
  className,
  ...props
}: SwitchFieldProps) {
  const generatedId = useId()
  const switchId = id ?? generatedId
  const descriptionId = description ? `${switchId}-description` : undefined
  const errorId = error ? `${switchId}-error` : undefined

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="grid gap-1">
        <Label
          htmlFor={switchId}
          className={props.disabled ? 'opacity-50' : undefined}
        >
          {label}
        </Label>
        {description && (
          <p
            id={descriptionId}
            className={cn(
              'text-sm text-muted-foreground',
              props.disabled && 'opacity-50'
            )}
          >
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
      <Switch
        id={switchId}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [descriptionId, errorId].filter(Boolean).join(' ') || undefined
        }
        className={cn('mt-0.5', className)}
        {...props}
      />
    </div>
  )
}
