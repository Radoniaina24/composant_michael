import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DataTableFilters } from './data-table-filters'
import { DataTableViewOptions } from './data-table-view-options'
import type {
  DataTableExportFormat,
  DataTableFilterDef,
} from './types'
import {
  filterValueIsEmpty,
  formatFilterValue,
} from './utils'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  filters: DataTableFilterDef[]
  searchInput: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onRefresh?: () => void
  refreshing?: boolean
  loading?: boolean
  onExport?: (format: DataTableExportFormat) => void | Promise<void>
  enableExport?: boolean
  enableSearch?: boolean
  enableFilters?: boolean
  enableColumnVisibility?: boolean
  enableGrouping?: boolean
  onResetFilters: () => void
  className?: string
}

export function DataTableToolbar<TData>({
  table,
  filters,
  searchInput,
  onSearchChange,
  searchPlaceholder = 'Rechercher…',
  onRefresh,
  refreshing = false,
  loading = false,
  onExport,
  enableExport = true,
  enableSearch = true,
  enableFilters = true,
  enableColumnVisibility = true,
  enableGrouping = false,
  onResetFilters,
  className,
}: DataTableToolbarProps<TData>) {
  const [exporting, setExporting] = useState<DataTableExportFormat | null>(null)

  const filterDefs = new Map(filters.map((filter) => [filter.id, filter]))
  const activeColumnFilters = table
    .getState()
    .columnFilters.filter((filter) => !filterValueIsEmpty(filter.value))
  const activeCount = activeColumnFilters.length
  const hasSearch = searchInput.trim() !== ''
  const hasActiveFilters = hasSearch || activeCount > 0
  const rows = table.getRowModel().rows
  const canExport = enableExport && Boolean(onExport) && rows.length > 0

  async function handleExport(format: DataTableExportFormat) {
    if (!onExport || exporting) {
      return
    }

    setExporting(format)

    try {
      await onExport(format)
    } finally {
      setExporting(null)
    }
  }

  function removeFilter(id: string) {
    table.setColumnFilters(
      table.getState().columnFilters.filter((filter) => filter.id !== id),
    )
  }

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-2 border-b px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center',
          className,
        )}
      >
        {enableSearch && (
          <div className="relative min-w-0 flex-1 sm:max-w-xs sm:basis-60">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={searchInput}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Rechercher dans le tableau"
              className="pl-8 pr-8 [&::-webkit-search-cancel-button]:hidden"
            />
            {hasSearch && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                onClick={() => onSearchChange('')}
                aria-label="Effacer la recherche"
                title="Effacer la recherche"
              >
                <XIcon aria-hidden="true" />
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-wrap items-center gap-1.5 sm:justify-end">
          {enableFilters && filters.length > 0 && (
            <DataTableFilters
              table={table}
              filters={filters}
              activeCount={activeCount}
            />
          )}

          {enableColumnVisibility && (
            <DataTableViewOptions
              table={table}
              enableGrouping={enableGrouping}
            />
          )}

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing || loading}
              aria-label="Actualiser les données"
              title="Actualiser les données"
            >
              <RefreshCwIcon
                className={cn(refreshing && 'animate-spin')}
                aria-hidden="true"
              />
              <span className="hidden md:inline">Actualiser</span>
            </Button>
          )}

          {enableExport && onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canExport || exporting !== null}
                    aria-label="Exporter les données"
                    title="Exporter les données"
                  />
                }
              >
                <DownloadIcon aria-hidden="true" />
                <span className="hidden md:inline">
                  {exporting ? 'Export…' : 'Exporter'}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => {
                    void handleExport('csv')
                  }}
                >
                  <FileTextIcon aria-hidden="true" />
                  Exporter en CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    void handleExport('xls')
                  }}
                >
                  <FileSpreadsheetIcon aria-hidden="true" />
                  Exporter en Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 border-b bg-muted/20 px-3 py-2">
          {hasSearch && (
            <FilterBadge
              label={`Recherche : « ${searchInput.trim()} »`}
              onRemove={() => onSearchChange('')}
            />
          )}
          {activeColumnFilters.map((filter) => {
            const definition = filterDefs.get(filter.id) ?? {
              id: filter.id,
              label: filter.id,
              variant: 'text' as const,
            }

            return (
              <FilterBadge
                key={filter.id}
                label={`${definition.label} : ${formatFilterValue(definition, filter.value)}`}
                onRemove={() => removeFilter(filter.id)}
              />
            )
          })}
          <Button
            variant="ghost"
            size="xs"
            className="ml-auto text-muted-foreground"
            onClick={onResetFilters}
          >
            Réinitialiser
          </Button>
        </div>
      )}
    </>
  )
}

type FilterBadgeProps = {
  label: string
  onRemove: () => void
}

function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  return (
    <span className="inline-flex h-6 max-w-full items-center gap-1 rounded-full border bg-background pr-0.5 pl-2 text-xs">
      <span className="min-w-0 truncate text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-label={`Retirer le filtre ${label}`}
      >
        <XIcon className="size-3" aria-hidden="true" />
      </button>
    </span>
  )
}
