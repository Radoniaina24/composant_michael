import type { Row, Table } from '@tanstack/react-table'
import {
  ChevronRightIcon,
  InboxIcon,
  SearchXIcon,
} from 'lucide-react'
import { flexRender } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { DataTableEmptyState, DataTableErrorState } from './data-table-empty-state'
import { DataTableRowActions } from './data-table-row-actions'
import type {
  DataTableEmptyState as DataTableEmptyStateConfig,
  DataTableError,
  DataTableRowAction,
} from './types'
import { getColumnLabel, isInternalColumn } from './utils'

type DataTableMobileViewProps<TData> = {
  table: Table<TData>
  loading: boolean
  error: DataTableError
  onRetry?: () => void
  emptyState?: DataTableEmptyStateConfig
  getRowCanSelect?: (row: Row<TData>) => boolean
  isRowDisabled?: (row: Row<TData>) => boolean
  onRowClick?: (row: TData) => void
  rowActions?: DataTableRowAction<TData>[]
  renderSubComponent?: (row: Row<TData>) => React.ReactNode
  loadingRows: number
  onResetFilters: () => void
}

function MobileCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-6 rounded-full" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
        <div className="grid gap-1">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <div className="grid gap-1">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
    </div>
  )
}

export function DataTableMobileView<TData>({
  table,
  loading,
  error,
  onRetry,
  emptyState,
  getRowCanSelect,
  isRowDisabled,
  onRowClick,
  rowActions,
  renderSubComponent,
  loadingRows,
  onResetFilters,
}: DataTableMobileViewProps<TData>) {
  const rows = table.getRowModel().rows
  const filtersActive =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter)

  if (loading) {
    return (
      <div className="grid gap-2 p-3">
        {Array.from({ length: Math.min(loadingRows, 5) }).map((_, index) => (
          <MobileCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error && rows.length === 0) {
    return (
      <DataTableErrorState
        message={typeof error === 'string' ? error : undefined}
        onRetry={onRetry}
      />
    )
  }

  if (rows.length === 0) {
    const EmptyIcon = filtersActive
      ? SearchXIcon
      : (emptyState?.icon ?? InboxIcon)

    return (
      <DataTableEmptyState
        icon={EmptyIcon}
        title={filtersActive ? 'Aucun résultat' : (emptyState?.title ?? 'Aucune donnée')}
        description={
          filtersActive
            ? 'Aucun enregistrement ne correspond à votre recherche ou à vos filtres.'
            : emptyState?.description
        }
        action={
          filtersActive ? (
            <Button variant="outline" onClick={onResetFilters}>
              Réinitialiser les filtres
            </Button>
          ) : (
            emptyState?.action
          )
        }
      />
    )
  }

  const visibleColumns = table
    .getVisibleLeafColumns()
    .filter(
      (column) =>
        !isInternalColumn(column.id) &&
        !column.columnDef.meta?.mobileHidden,
    )

  const prioritizedColumns = [...visibleColumns].sort((a, b) => {
    const aPriority = a.columnDef.meta?.mobilePriority ?? Number.MAX_SAFE_INTEGER
    const bPriority = b.columnDef.meta?.mobilePriority ?? Number.MAX_SAFE_INTEGER
    return aPriority - bPriority
  })

  const primaryColumn = prioritizedColumns[0]
  const detailColumns = prioritizedColumns.slice(1, 5)

  return (
    <div className="grid gap-2 p-3">
      {rows.map((row, index) => {
        const disabled = isRowDisabled?.(row) ?? false
        const canSelect = getRowCanSelect?.(row) ?? true
        const cells = new Map(
          row.getVisibleCells().map((cell) => [cell.column.id, cell]),
        )
        const primaryCell = primaryColumn
          ? cells.get(primaryColumn.id)
          : undefined
        const canExpand = Boolean(renderSubComponent) && row.getCanExpand()

        const card = (
          <article
            data-slot="data-table-mobile-card"
            className={cn(
              'rounded-xl border bg-card p-3 text-sm transition-colors',
              row.getIsSelected() && 'border-primary/30 bg-muted/40',
              disabled && 'opacity-60',
              onRowClick && 'hover:bg-muted/30',
            )}
            onClick={(event) => {
              if (!onRowClick || disabled) {
                return
              }

              if (
                event.target instanceof Element &&
                event.target.closest(
                  'button, a, input, select, textarea, [role="checkbox"], [role="menuitem"]',
                )
              ) {
                return
              }

              onRowClick(row.original)
            }}
          >
            <div className="flex items-start gap-2.5">
              {canSelect && (
                <div
                  className="pt-0.5"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Checkbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onCheckedChange={(checked) =>
                      row.toggleSelected(checked === true)
                    }
                    aria-label={`Sélectionner la ligne ${index + 1}`}
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                {primaryCell ? (
                  onRowClick ? (
                    <button
                      type="button"
                      className="min-w-0 max-w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
                      onClick={() => onRowClick(row.original)}
                    >
                      {flexRender(
                        primaryCell.column.columnDef.cell,
                        primaryCell.getContext(),
                      )}
                    </button>
                  ) : (
                    flexRender(
                      primaryCell.column.columnDef.cell,
                      primaryCell.getContext(),
                    )
                  )
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                {canExpand && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => row.toggleExpanded()}
                    aria-expanded={row.getIsExpanded()}
                    aria-label={
                      row.getIsExpanded()
                        ? 'Masquer les détails'
                        : 'Afficher les détails'
                    }
                    title={row.getIsExpanded() ? 'Masquer' : 'Détails'}
                  >
                    <ChevronRightIcon
                      className={cn(
                        'transition-transform',
                        row.getIsExpanded() && 'rotate-90',
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                )}
                {rowActions && rowActions.length > 0 && (
                  <DataTableRowActions row={row} actions={rowActions} />
                )}
              </div>
            </div>

            {detailColumns.length > 0 && (
              <dl
                className="mt-3 grid gap-x-3 gap-y-2 border-t pt-2.5"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(detailColumns.length, 2)}, minmax(0, 1fr))`,
                }}
              >
                {detailColumns.map((column) => {
                  const cell = cells.get(column.id)
                  if (!cell) {
                    return null
                  }

                  return (
                    <div key={column.id} className="min-w-0">
                      <dt className="truncate text-[0.7rem] font-medium text-muted-foreground">
                        {getColumnLabel(column)}
                      </dt>
                      <dd className="mt-0.5 min-w-0 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            )}

            {row.getIsExpanded() && renderSubComponent && (
              <div className="mt-3 border-t pt-3">
                {renderSubComponent(row)}
              </div>
            )}
          </article>
        )

        return <div key={row.id}>{card}</div>
      })}
    </div>
  )
}
