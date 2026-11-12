import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type TextareaFieldProps = React.ComponentProps<typeof Textarea> & {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: string
}

export function TextareaField({
  id,
  label,
  description,
  error,
  className,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const descriptionId = description ? `${textareaId}-description` : undefined
  const errorId = error ? `${textareaId}-error` : undefined

  return (
    <div className="grid content-start gap-2">
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <Textarea
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [descriptionId, errorId].filter(Boolean).join(' ') || undefined
        }
        className={cn(className)}
        {...props}
      />
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
