import { useCallback, useId, useRef, useState } from 'react'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { SelectOption } from '@/components/select-field'

type MultiSelectFieldProps = {
  id?: string
  name?: string
  label?: React.ReactNode
  description?: React.ReactNode
  error?: string
  placeholder?: React.ReactNode
  searchPlaceholder?: string
  emptyMessage?: React.ReactNode
  options: SelectOption[]
  className?: string
  disabled?: boolean
  maxDisplayed?: number
  values?: string[]
  defaultValues?: string[]
  onValuesChange?: (values: string[]) => void
}

export function MultiSelectField({
  id,
  name,
  label,
  description,
  error,
  placeholder = 'Sélectionner…',
  searchPlaceholder = 'Rechercher…',
  emptyMessage = 'Aucun résultat.',
  options,
  className,
  disabled,
  maxDisplayed = 3,
  values,
  defaultValues,
  onValuesChange,
}: MultiSelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const labelId = `${selectId}-label`
  const descriptionId = description ? `${selectId}-description` : undefined
  const errorId = error ? `${selectId}-error` : undefined
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [open, setOpen] = useState(false)
  const [listElementId, setListElementId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [internalValues, setInternalValues] = useState<string[]>(
    defaultValues ?? [],
  )
  const selectedValues = values ?? internalValues
  const selectedOptions = selectedValues
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is SelectOption => Boolean(option))
  const displayedOptions = selectedOptions.slice(0, maxDisplayed)
  const hiddenCount = selectedOptions.length - displayedOptions.length
  const listRef = useCallback((node: HTMLDivElement | null) => {
    const nextId = node?.id ?? null
    setListElementId((current) => (current === nextId ? current : nextId))
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearch('')
    }
  }

  function setSelection(nextValues: string[]) {
    if (values === undefined) {
      setInternalValues(nextValues)
    }
    onValuesChange?.(nextValues)
  }

  function toggleValue(value: string) {
    setSelection(
      selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value],
    )
  }

  function removeValue(
    value: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault()
    event.stopPropagation()
    toggleValue(value)
  }

  return (
    <div className="grid content-start gap-2">
      {label && (
        <Label
          id={labelId}
          onClick={() => {
            triggerRef.current?.focus()
            triggerRef.current?.click()
          }}
        >
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          ref={triggerRef}
          id={selectId}
          render={<div />}
          nativeButton={false}
          role="combobox"
          aria-haspopup="listbox"
          aria-controls={open ? (listElementId ?? undefined) : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [descriptionId, errorId].filter(Boolean).join(' ') || undefined
          }
          disabled={disabled}
          className={cn(
            'relative flex min-h-8 w-full items-center gap-1 rounded-lg border border-input bg-transparent py-1 pr-8 pl-2 text-sm transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
            className,
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1 text-left">
            {displayedOptions.length === 0 && (
              <span className="px-0.5 text-muted-foreground">
                {placeholder}
              </span>
            )}
            {displayedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex max-w-full items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                <span className="truncate">{option.label}</span>
                {!disabled && (
                  <button
                    type="button"
                    aria-label={`Retirer ${
                      typeof option.label === 'string'
                        ? option.label
                        : option.value
                    }`}
                    className="shrink-0 rounded-sm opacity-60 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
                    onClick={(event) =>
                      removeValue(option.value, event)
                    }
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                +{hiddenCount}
              </span>
            )}
          </div>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-(--anchor-width) min-w-(--anchor-width) overflow-hidden rounded-lg p-0"
        >
          <Command
            shouldFilter
            loop
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList
              ref={listRef}
              aria-multiselectable="true"
              className="max-h-64 p-1 [&_[cmdk-item]]:gap-2 [&_[cmdk-item]]:rounded-md [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-1.5"
            >
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={
                    typeof option.label === 'string'
                      ? `${option.label} ${option.value}`
                      : option.value
                  }
                  disabled={option.disabled}
                  data-checked={selectedValues.includes(option.value)}
                  onSelect={() => toggleValue(option.value)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {name &&
        selectedValues.map((value) => (
          <input key={value} type="hidden" name={name} value={value} />
        ))}
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
