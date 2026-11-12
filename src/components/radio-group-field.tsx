import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

export type RadioOption = {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

type RadioGroupFieldProps = React.ComponentProps<typeof RadioGroup> & {
  label?: React.ReactNode
  description?: React.ReactNode
  options: RadioOption[]
  error?: string
}

export function RadioGroupField({
  id,
  label,
  description,
  options,
  error,
  className,
  ...props
}: RadioGroupFieldProps) {
  const generatedId = useId()
  const groupId = id ?? generatedId
  const labelId = `${groupId}-label`
  const descriptionId = description ? `${groupId}-description` : undefined
  const errorId = error ? `${groupId}-error` : undefined

  return (
    <div className="grid gap-3">
      {(label || description) && (
        <div className="grid gap-1">
          {label && (
            <p id={labelId} className="text-sm font-medium">
              {label}
            </p>
          )}
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <RadioGroup
        id={groupId}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={
          [descriptionId, errorId].filter(Boolean).join(' ') || undefined
        }
        aria-invalid={error ? true : undefined}
        className={cn('gap-3', className)}
        {...props}
      >
        {options.map((option) => {
          const itemId = `${groupId}-${option.value}`
          const optionDescriptionId = option.description
            ? `${itemId}-description`
            : undefined

          return (
            <div key={option.value} className="flex items-start gap-3">
              <RadioGroupItem
                id={itemId}
                value={option.value}
                disabled={option.disabled}
                aria-describedby={optionDescriptionId}
                className="mt-0.5"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor={itemId}
                  className={option.disabled ? 'opacity-50' : undefined}
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p
                    id={optionDescriptionId}
                    className={cn(
                      'text-sm text-muted-foreground',
                      option.disabled && 'opacity-50',
                    )}
                  >
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </RadioGroup>

      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
