import { useId } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type CheckboxFieldProps = React.ComponentProps<typeof Checkbox> & {
  label: React.ReactNode
  description?: React.ReactNode
  error?: string
}

export function CheckboxField({
  id,
  label,
  description,
  error,
  className,
  ...props
}: CheckboxFieldProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const descriptionId = description ? `${checkboxId}-description` : undefined
  const errorId = error ? `${checkboxId}-error` : undefined

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={checkboxId}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [descriptionId, errorId].filter(Boolean).join(' ') || undefined
        }
        className={cn('mt-0.5', className)}
        {...props}
      />
      <div className="grid gap-1">
        <Label
          htmlFor={checkboxId}
          className={props.disabled ? 'opacity-50' : undefined}
        >
          {label}
        </Label>
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
    </div>
  )
}
