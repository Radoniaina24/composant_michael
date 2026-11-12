import { useCallback, useId, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
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

export type SelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type SelectFieldProps = {
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
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

export function SelectField({
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
  value,
  defaultValue,
  onValueChange,
}: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const descriptionId = description ? `${selectId}-description` : undefined
  const errorId = error ? `${selectId}-error` : undefined

  const [open, setOpen] = useState(false)
  const [listElementId, setListElementId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue ?? null,
  )
  const selectedValue = value !== undefined ? value : internalValue
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  )
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

  function handleSelect(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }
    onValueChange?.(nextValue)
    handleOpenChange(false)
  }

  return (
    <div className="grid content-start gap-2">
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          id={selectId}
          role="combobox"
          aria-haspopup="listbox"
          aria-controls={open ? (listElementId ?? undefined) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [descriptionId, errorId].filter(Boolean).join(' ') || undefined
          }
          disabled={disabled}
          className={cn(
            'flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
            className,
          )}
        >
          <span
            className={cn(
              'line-clamp-1 flex-1 text-left',
              !selectedOption && 'text-muted-foreground',
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
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
                  data-checked={option.value === selectedValue}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {name && (
        <input type="hidden" name={name} value={selectedValue ?? ''} />
      )}
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
