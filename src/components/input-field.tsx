import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputFieldProps = React.ComponentProps<typeof Input> & {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: string
  startIcon?: LucideIcon
  endIcon?: LucideIcon
}

export function InputField({
  id,
  label,
  description,
  error,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className,
  ...props
}: InputFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="grid content-start gap-2">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative">
        {StartIcon && (
          <StartIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
        )}
        <Input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [descriptionId, errorId].filter(Boolean).join(' ') || undefined
          }
          className={cn('block', StartIcon && 'pl-9', EndIcon && 'pr-9', className)}
          {...props}
        />
        {EndIcon && (
          <EndIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
        )}
      </div>
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
