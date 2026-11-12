import { useEffect, useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { ListFilterIcon, RotateCcwIcon, SearchIcon } from 'lucide-react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import type {
  DataTableFilterDef,
  DataTableFilterValue,
  DataTableFilterVariant,
  DataTableFilterOption,
} from './types'
import {
  filterValueIsEmpty,
  getToneDotClasses,
} from './utils'

function getFilterValue<TData>(
  table: Table<TData>,
  id: string,
): DataTableFilterValue {
  return table
    .getState()
    .columnFilters.find((filter) => filter.id === id)?.value as
    | DataTableFilterValue
    | undefined
}

function setFilterValue<TData>(
  table: Table<TData>,
  id: string,
  value: DataTableFilterValue,
) {
  const next = table
    .getState()
    .columnFilters.filter((filter) => filter.id !== id)

  if (!filterValueIsEmpty(value)) {
    next.push({ id, value })
  }

  table.setColumnFilters(next)
}

type FilterTextInputProps = {
  id: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

function FilterTextInput({
  id,
  value,
  placeholder,
  onChange,
}: FilterTextInputProps) {
  const [text, setText] = useState(value)
  const [previousValue, setPreviousValue] = useState(value)
  const debouncedText = useDebouncedValue(text, 250)

  if (value !== previousValue) {
    setPreviousValue(value)
    setText(typeof value === 'string' ? value : '')
  }

  useEffect(() => {
    if (debouncedText !== value) {
      onChange(debouncedText)
    }
  }, [debouncedText, onChange, value])

  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id={id}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder ?? 'Rechercher…'}
        className="pl-8"
      />
    </div>
  )
}

type FilterOptionListProps = {
  filter: DataTableFilterDef
  value: DataTableFilterValue
  onChange: (value: DataTableFilterValue) => void
}

function FilterOptionList({
  filter,
  value,
  onChange,
}: FilterOptionListProps) {
  const multiple = filter.variant === 'multiSelect'
  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === 'string' && value !== ''
      ? [value]
      : []

  function toggleOption(option: DataTableFilterOption, checked: boolean) {
    if (!multiple) {
      onChange(checked ? option.value : '')
      return
    }

    const next = checked
      ? [...selectedValues, option.value]
      : selectedValues.filter((entry) => entry !== option.value)

    onChange(next)
  }

  return (
    <div
      role="group"
      aria-labelledby={`filter-label-${filter.id}`}
      className="grid gap-0.5"
    >
      {(filter.options ?? []).map((option) => {
        const id = `filter-${filter.id}-${option.value}`
        const Icon = option.icon
        const checked = selectedValues.includes(option.value)

        return (
          <div
            key={option.value}
            className="flex items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-muted/60"
          >
            <Checkbox
              id={id}
              checked={checked}
              onCheckedChange={(nextChecked) =>
                toggleOption(option, nextChecked === true)
              }
            />
            <Label
              htmlFor={id}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-normal"
            >
              {Icon ? (
                <Icon
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                option.tone && (
                  <span
                    className={cn(
                      'size-1.5 shrink-0 rounded-full',
                      getToneDotClasses(option.tone),
                    )}
                    aria-hidden="true"
                  />
                )
              )}
              <span className="truncate">{option.label}</span>
            </Label>
          </div>
        )
      })}
    </div>
  )
}

type FilterDateRangeProps = {
  filter: DataTableFilterDef
  value: DataTableFilterValue
  onChange: (value: DataTableFilterValue) => void
}

function FilterDateRange({
  filter,
  value,
  onChange,
}: FilterDateRangeProps) {
  const range = Array.isArray(value) ? value : ['', '']
  const from = range[0] ?? ''
  const to = range[1] ?? ''

  function update(fromValue: string, toValue: string) {
    if (!fromValue && !toValue) {
      onChange(undefined)
      return
    }

    onChange([fromValue, toValue])
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="grid gap-1.5">
        <Label
          htmlFor={`filter-${filter.id}-from`}
          className="text-xs font-normal text-muted-foreground"
        >
          Du
        </Label>
        <Input
          id={`filter-${filter.id}-from`}
          type="date"
          value={from}
          onChange={(event) => update(event.target.value, to)}
          max={to || undefined}
        />
      </div>
      <div className="grid gap-1.5">
        <Label
          htmlFor={`filter-${filter.id}-to`}
          className="text-xs font-normal text-muted-foreground"
        >
          Au
        </Label>
        <Input
          id={`filter-${filter.id}-to`}
          type="date"
          value={to}
          onChange={(event) => update(from, event.target.value)}
          min={from || undefined}
        />
      </div>
    </div>
  )
}

type FilterControlProps<TData> = {
  table: Table<TData>
  filter: DataTableFilterDef
}

function FilterControl<TData>({ table, filter }: FilterControlProps<TData>) {
  const value = getFilterValue(table, filter.id)

  const change = (nextValue: DataTableFilterValue) =>
    setFilterValue(table, filter.id, nextValue)

  return (
    <div className="grid gap-2">
      <Label
        id={`filter-label-${filter.id}`}
        className="text-xs font-medium text-muted-foreground"
      >
        {filter.label}
      </Label>
      <FilterInput filter={filter} value={value} onChange={change} />
    </div>
  )
}

type FilterInputProps = {
  filter: DataTableFilterDef
  value: DataTableFilterValue
  onChange: (value: DataTableFilterValue) => void
}

function FilterInput({
  filter,
  value,
  onChange,
}: FilterInputProps) {
  const variant: DataTableFilterVariant = filter.variant

  if (variant === 'text') {
    return (
      <FilterTextInput
        id={`filter-${filter.id}`}
        value={typeof value === 'string' ? value : ''}
        placeholder={filter.placeholder}
        onChange={(text) => onChange(text)}
      />
    )
  }

  if (variant === 'dateRange') {
    return (
      <FilterDateRange filter={filter} value={value} onChange={onChange} />
    )
  }

  return <FilterOptionList filter={filter} value={value} onChange={onChange} />
}

type FilterPanelProps<TData> = {
  table: Table<TData>
  filters: DataTableFilterDef[]
}

function FilterPanel<TData>({ table, filters }: FilterPanelProps<TData>) {
  return (
    <div className="grid gap-4">
      {filters.map((filter) => (
        <FilterControl key={filter.id} table={table} filter={filter} />
      ))}
    </div>
  )
}

type DataTableFiltersProps<TData> = {
  table: Table<TData>
  filters: DataTableFilterDef[]
  activeCount: number
}

export function DataTableFilters<TData>({
  table,
  filters,
  activeCount,
}: DataTableFiltersProps<TData>) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  if (filters.length === 0) {
    return null
  }

  const trigger = (
    <Button
      variant="outline"
      size="sm"
      aria-label="Filtrer les résultats"
      aria-expanded={open}
      title="Filtrer les résultats"
    >
      <ListFilterIcon aria-hidden="true" />
      <span className="hidden sm:inline">Filtres</span>
      {activeCount > 0 && (
        <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-medium leading-4 text-primary-foreground tabular-nums">
          {activeCount}
        </span>
      )}
    </Button>
  )

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label="Filtrer les résultats"
          title="Filtrer les résultats"
        >
          <ListFilterIcon aria-hidden="true" />
          <span className="hidden sm:inline">Filtres</span>
          {activeCount > 0 && (
            <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-medium leading-4 text-primary-foreground tabular-nums">
              {activeCount}
            </span>
          )}
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[85dvh] gap-0 p-0"
            showCloseButton={false}
          >
            <SheetHeader className="flex-row items-start justify-between border-b px-4 py-3">
              <div>
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>
                  Affinez les résultats selon vos critères.
                </SheetDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  table.resetColumnFilters()
                  setOpen(false)
                }}
                aria-label="Réinitialiser les filtres"
                title="Réinitialiser les filtres"
              >
                <RotateCcwIcon aria-hidden="true" />
              </Button>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <FilterPanel table={table} filters={filters} />
            </div>
            <SheetFooter className="flex-row gap-2 border-t bg-muted/30 p-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  table.resetColumnFilters()
                  setOpen(false)
                }}
              >
                Réinitialiser
              </Button>
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Afficher les résultats
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="start" className="w-80 gap-0 p-0">
        <PopoverHeader className="flex-row items-center justify-between border-b px-3 py-2.5">
          <div className="flex items-center gap-2">
            <PopoverTitle className="text-sm">Filtres</PopoverTitle>
            {activeCount > 0 && (
              <span className="rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums">
                {activeCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => table.resetColumnFilters()}
            aria-label="Réinitialiser les filtres"
            title="Réinitialiser les filtres"
          >
            <RotateCcwIcon aria-hidden="true" />
          </Button>
        </PopoverHeader>
        <div className="max-h-[min(26rem,65vh)] overflow-y-auto p-3">
          <FilterPanel table={table} filters={filters} />
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Afficher les résultats
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
