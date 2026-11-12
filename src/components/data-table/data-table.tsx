import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ExpandedState,
  type GroupingState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  ChevronRightIcon,
  CircleAlertIcon,
  PlusIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableEmptyState, DataTableErrorState } from './data-table-empty-state'
import { DataTableMobileView } from './data-table-mobile-view'
import { DataTablePagination } from './data-table-pagination'
import {
  DataTableContextMenu,
  DataTableRowActions,
} from './data-table-row-actions'
import { DataTableSkeleton } from './data-table-skeleton'
import { DataTableToolbar } from './data-table-toolbar'
import type {
  DataTableExportFormat,
  DataTableFilterDef,
  DataTableProps,
} from './types'
import {
  buildFilterDefinitions,
  dataTableFilterFns,
  exportTableData,
  formatNumber,
  getAlignClass,
  getColumnLabel,
  isInteractiveTarget,
  isInternalColumn,
  readPersistedTableState,
  writePersistedTableState,
} from './utils'

type RenderItem<TData> =
  | { kind: 'row'; row: Row<TData> }
  | { kind: 'expanded'; row: Row<TData> }

function mergePinnedColumns(
  persisted: ColumnPinningState | undefined,
  left: string[],
  right: string[],
): ColumnPinningState {
  return {
    left: Array.from(new Set([...(persisted?.left ?? []), ...left])),
    right: Array.from(new Set([...(persisted?.right ?? []), ...right])),
  }
}

export function DataTable<TData>({
  columns,
  data,
  title,
  description,
  totalCount,
  loading = false,
  refreshing = false,
  error,
  onRetry,
  onRefresh,
  onAdd,
  addLabel = 'Ajouter',
  primaryAction,
  toolbarActions,
  emptyState,
  searchPlaceholder,
  searchDebounce = 300,
  filters,
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  enableSorting = true,
  enableMultiSort = true,
  enableColumnVisibility = true,
  enableColumnResizing = true,
  enableColumnPinning = false,
  enableRowSelection = false,
  enablePagination = true,
  enableVirtualization = false,
  enableGrouping = false,
  mode = 'client',
  pageCount,
  rowCount,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  pagination: paginationProp,
  onPaginationChange,
  sorting: sortingProp,
  onSortingChange,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange,
  grouping: groupingProp,
  onGroupingChange,
  globalFilterFn,
  getRowId,
  getRowCanSelect,
  getRowCanExpand,
  isRowDisabled,
  renderSubComponent,
  onRowClick,
  rowActions,
  bulkActions,
  onExport,
  exportFileName,
  persistenceKey,
  responsiveMode = 'auto',
  stickyHeader = true,
  rowHeight = 44,
  maxHeight,
  loadingRows = 8,
  className,
}: DataTableProps<TData>) {
  const isMobile = useIsMobile()
  const showCards =
    responsiveMode === 'cards' ||
    (responsiveMode === 'auto' && isMobile)

  const persistedState = useMemo(
    () => readPersistedTableState(persistenceKey),
    [persistenceKey],
  )

  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('')
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([])
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({})
  const [internalColumnVisibility, setInternalColumnVisibility] =
    useState<VisibilityState>(persistedState.columnVisibility ?? {})
  const [internalColumnSizing, setInternalColumnSizing] =
    useState<ColumnSizingState>(persistedState.columnSizing ?? {})
  const [internalColumnPinning, setInternalColumnPinning] =
    useState<ColumnPinningState>(() =>
      mergePinnedColumns(
        persistedState.columnPinning,
        enableColumnPinning && enableRowSelection ? ['__select__'] : [],
        enableColumnPinning && rowActions?.length ? ['__actions__'] : [],
      ),
    )
  const [internalGrouping, setInternalGrouping] = useState<GroupingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const pagination = paginationProp ?? internalPagination
  const sorting = sortingProp ?? internalSorting
  const globalFilter = globalFilterProp ?? internalGlobalFilter
  const columnFilters = columnFiltersProp ?? internalColumnFilters
  const rowSelection = rowSelectionProp ?? internalRowSelection
  const columnVisibility = columnVisibilityProp ?? internalColumnVisibility
  const grouping = groupingProp ?? internalGrouping

  const setPagination = onPaginationChange ?? setInternalPagination
  const setSorting = onSortingChange ?? setInternalSorting
  const setGlobalFilter = onGlobalFilterChange ?? setInternalGlobalFilter
  const setColumnFilters = onColumnFiltersChange ?? setInternalColumnFilters
  const setRowSelection = onRowSelectionChange ?? setInternalRowSelection
  const setColumnVisibility =
    onColumnVisibilityChange ?? setInternalColumnVisibility
  const setColumnSizing = setInternalColumnSizing
  const setColumnPinning = setInternalColumnPinning
  const setGrouping = onGroupingChange ?? setInternalGrouping

  const resetPage = useCallback(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [setPagination])

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      setSorting(updater)
      resetPage()
    },
    [setSorting, resetPage],
  )

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      setColumnFilters(updater)
      resetPage()
    },
    [setColumnFilters, resetPage],
  )

  const [searchInput, setSearchInput] = useState(globalFilter)
  const searchTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    window.clearTimeout(searchTimer.current)
    setSearchInput(globalFilter)
  }, [globalFilter])

  useEffect(
    () => () => {
      window.clearTimeout(searchTimer.current)
    },
    [],
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value)
      window.clearTimeout(searchTimer.current)
      searchTimer.current = window.setTimeout(() => {
        setGlobalFilter(value)
        resetPage()
      }, searchDebounce)
    },
    [searchDebounce, setGlobalFilter, resetPage],
  )

  useEffect(() => {
    if (mode !== 'server' || pageCount === undefined) {
      return
    }

    const lastPageIndex = Math.max(0, pageCount - 1)
    if (pagination.pageIndex > lastPageIndex) {
      setPagination({
        pageIndex: lastPageIndex,
        pageSize: pagination.pageSize,
      })
    }
  }, [
    mode,
    pageCount,
    pagination.pageIndex,
    pagination.pageSize,
    setPagination,
  ])

  useEffect(() => {
    if (!persistenceKey) {
      return
    }

    writePersistedTableState(persistenceKey, {
      columnVisibility,
      columnSizing: internalColumnSizing,
      columnPinning: internalColumnPinning,
    })
  }, [
    persistenceKey,
    columnVisibility,
    internalColumnSizing,
    internalColumnPinning,
  ])

  const tableColumns = useMemo(() => {
    const selectionColumn: ColumnDef<TData, unknown> = {
      id: '__select__',
      size: 40,
      minSize: 40,
      maxSize: 40,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      meta: { exportable: false },
      header: ({ table }) => {
        const allSelected = table.getIsAllPageRowsSelected()
        const someSelected = table.getIsSomePageRowsSelected()

        return (
          <Checkbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked === true)
            }
            aria-label="Sélectionner toutes les lignes de la page"
          />
        )
      },
      cell: ({ row, table }) => {
        const rowNumber =
          table
            .getRowModel()
            .rows.findIndex((entry) => entry.id === row.id) + 1

        return (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(checked) => row.toggleSelected(checked === true)}
            aria-label={`Sélectionner la ligne ${rowNumber}`}
          />
        )
      },
    }

    const expandColumn: ColumnDef<TData, unknown> = {
      id: '__expand__',
      size: 36,
      minSize: 36,
      maxSize: 36,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      meta: { exportable: false },
      header: () => <span className="sr-only">Détails</span>,
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <Button
            variant="ghost"
            size="icon-xs"
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
        ) : null,
    }

    const actionsColumn: ColumnDef<TData, unknown> = {
      id: '__actions__',
      size: 48,
      minSize: 48,
      maxSize: 48,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      meta: { exportable: false, align: 'right' },
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) =>
        rowActions && rowActions.length > 0 ? (
          <div className="flex justify-end">
            <DataTableRowActions row={row} actions={rowActions} />
          </div>
        ) : null,
    }

    const userColumns = columns.map((column) => {
      const variant = column.meta?.filterVariant
      const filterFn =
        column.filterFn ??
        (variant === 'multiSelect'
          ? dataTableFilterFns.multiSelect
          : variant === 'dateRange'
            ? dataTableFilterFns.dateRange
            : variant === 'select'
              ? 'equalsString'
              : undefined)

      return {
        ...column,
        size: column.size ?? 160,
        minSize: column.minSize ?? column.meta?.minWidth ?? 80,
        maxSize: column.maxSize ?? column.meta?.maxWidth ?? 600,
        filterFn,
      } as ColumnDef<TData, unknown>
    })

    return [
      ...(enableRowSelection ? [selectionColumn] : []),
      ...(renderSubComponent ? [expandColumn] : []),
      ...userColumns,
      ...(rowActions && rowActions.length > 0 ? [actionsColumn] : []),
    ]
  }, [columns, enableRowSelection, renderSubComponent, rowActions])

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: {
      pagination,
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      columnVisibility,
      columnSizing: internalColumnSizing,
      columnPinning: internalColumnPinning,
      grouping,
      expanded,
    },
    onPaginationChange: setPagination,
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: handleColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnPinningChange: setColumnPinning,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    enableSorting,
    enableMultiSort: enableSorting && enableMultiSort,
    enableFilters: enableSearch || enableFilters,
    enableColumnFilters: enableFilters,
    enableGlobalFilter: enableSearch,
    enableRowSelection: enableRowSelection
      ? (row) =>
          (getRowCanSelect?.(row) ?? true) && !(isRowDisabled?.(row) ?? false)
      : false,
    enableExpanding: Boolean(renderSubComponent),
    getRowCanExpand: (row) => getRowCanExpand?.(row) ?? true,
    enableColumnResizing,
    enableColumnPinning,
    enableGrouping,
    getRowId,
    globalFilterFn: globalFilterFn ?? 'auto',
    filterFns: dataTableFilterFns,
    columnResizeMode: 'onChange',
    manualPagination: mode === 'server',
    manualSorting: mode === 'server',
    manualFiltering: mode === 'server',
    pageCount: mode === 'server' ? pageCount : undefined,
    rowCount: mode === 'server' ? rowCount : undefined,
    autoResetPageIndex: false,
    defaultColumn: {
      size: 160,
      minSize: 80,
      maxSize: 600,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: mode === 'client' ? getSortedRowModel() : undefined,
    getFilteredRowModel: mode === 'client' ? getFilteredRowModel() : undefined,
    getPaginationRowModel:
      mode === 'client' && enablePagination ? getPaginationRowModel() : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getExpandedRowModel: renderSubComponent ? getExpandedRowModel() : undefined,
  })

  const rows = table.getRowModel().rows
  const leafColumnCount = table.getVisibleLeafColumns().length
  const effectiveFilters = useMemo(
    () =>
      enableFilters
        ? (filters ?? buildFilterDefinitions(table.getAllLeafColumns()))
        : [],
    [enableFilters, filters, table],
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const renderItems = useMemo<RenderItem<TData>[]>(() => {
    const items: RenderItem<TData>[] = []

    for (const row of rows) {
      items.push({ kind: 'row', row })
      if (
        renderSubComponent &&
        row.getIsExpanded() &&
        !row.getIsGrouped()
      ) {
        items.push({ kind: 'expanded', row })
      }
    }

    return items
  }, [rows, renderSubComponent])

  const virtualizer = useVirtualizer({
    count: enableVirtualization ? renderItems.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) =>
      renderItems[index]?.kind === 'expanded' ? 220 : rowHeight,
    overscan: 8,
  })

  const selectedRowIds = Object.keys(rowSelection).filter(
    (id) => rowSelection[id],
  )
  const selectedCount = selectedRowIds.length
  const selectedRows = table.getSelectedRowModel().rows

  const displayedCount =
    mode === 'server'
      ? (rowCount ?? data.length)
      : table.getFilteredRowModel().rows.length
  const total = totalCount ?? (mode === 'server' ? rowCount ?? data.length : data.length)
  const countLabel =
    displayedCount !== total
      ? `${formatNumber(displayedCount)} sur ${formatNumber(total)}`
      : formatNumber(total)
  const filtersActive =
    columnFilters.length > 0 || globalFilter.trim() !== ''

  const handleResetFilters = useCallback(() => {
    window.clearTimeout(searchTimer.current)
    setSearchInput('')
    table.resetColumnFilters()
    table.setGlobalFilter('')
    resetPage()
  }, [table, resetPage])

  const effectiveExport = useCallback(
    async (format: DataTableExportFormat) => {
      if (onExport) {
        await onExport(format)
        return
      }

      const exportRows =
        mode === 'server'
          ? table.getRowModel().rows
          : table.getSortedRowModel().rows

      exportTableData(
        format,
        table.getVisibleLeafColumns(),
        exportRows,
        exportFileName ?? title ?? 'export',
      )
    },
    [onExport, mode, table, exportFileName, title],
  )

  const resetSelection = () => table.resetRowSelection()

  const getCellStyle = useCallback(
    (column: Column<TData, unknown>): CSSProperties => {
      const pinned = column.getIsPinned()
      const style: CSSProperties = {
        width: column.getSize(),
        minWidth: column.columnDef.minSize ?? column.getSize(),
        maxWidth: column.columnDef.maxSize ?? column.getSize(),
      }

      if (pinned === 'left') {
        style.position = 'sticky'
        style.left = column.getStart('left')
      }

      if (pinned === 'right') {
        style.position = 'sticky'
        style.right = column.getAfter('right')
      }

      return style
    },
    [],
  )

  const renderRowCells = (row: Row<TData>) =>
    row.getVisibleCells().map((cell) => {
      const column = cell.column
      const meta = column.columnDef.meta
      const pinned = column.getIsPinned()

      return (
        <TableCell
          key={cell.id}
          style={getCellStyle(column)}
          className={cn(
            getAlignClass(meta?.align),
            meta?.cellClassName,
            pinned &&
              'z-10 bg-card group-hover/row:bg-slate-50 group-data-[state=selected]/row:bg-indigo-50 dark:group-hover/row:bg-slate-800 dark:group-data-[state=selected]/row:bg-indigo-950',
            pinned === 'left' &&
              column.getIsLastColumn('left') &&
              'shadow-[inset_-8px_0_8px_-10px_rgba(0,0,0,0.25)]',
            pinned === 'right' &&
              column.getIsFirstColumn('right') &&
              'shadow-[inset_8px_0_8px_-10px_rgba(0,0,0,0.25)]',
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      )
    })

  const handleRowActivation = (
    event: React.MouseEvent<HTMLTableRowElement>,
    row: Row<TData>,
  ) => {
    if (!onRowClick || isRowDisabled?.(row) || isInteractiveTarget(event.target)) {
      return
    }

    onRowClick(row.original)
  }

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    row: Row<TData>,
  ) => {
    if (!onRowClick || event.target !== event.currentTarget) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick(row.original)
    }
  }

  const renderTableRow = (row: Row<TData>) => {
    if (row.getIsGrouped()) {
      const groupingColumn = row.groupingColumnId
        ? table.getColumn(row.groupingColumnId)
        : undefined
      const label = groupingColumn ? getColumnLabel(groupingColumn) : 'Groupe'
      const value = row.groupingColumnId
        ? row.getGroupingValue(row.groupingColumnId)
        : undefined

      return (
        <TableRow key={row.id} className="bg-muted/40 hover:bg-muted/50">
          <TableCell colSpan={leafColumnCount} className="py-2">
            <button
              type="button"
              onClick={row.getToggleExpandedHandler()}
              className="flex items-center gap-1.5 rounded-sm px-1 text-left text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              style={{ paddingLeft: `${row.depth * 1.25 + 0.25}rem` }}
              aria-expanded={row.getIsExpanded()}
            >
              <ChevronRightIcon
                className={cn(
                  'size-4 text-muted-foreground transition-transform',
                  row.getIsExpanded() && 'rotate-90',
                )}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{label} :</span>
              <span>{String(value ?? '—')}</span>
              <Badge variant="secondary" className="ml-1 tabular-nums">
                {formatNumber(row.subRows.length)}
              </Badge>
            </button>
          </TableCell>
        </TableRow>
      )
    }

    const disabled = isRowDisabled?.(row) ?? false
    const rowClassName = cn(
      'group/row',
      onRowClick && !disabled && 'cursor-pointer',
      row.getIsSelected() &&
        'data-[state=selected]:!bg-indigo-50 dark:data-[state=selected]:!bg-indigo-950',
      disabled && 'opacity-60',
    )
    const rowProps = {
      'data-state': row.getIsSelected() ? 'selected' : undefined,
      className: rowClassName,
      style: { height: rowHeight },
      ...(onRowClick
        ? {
            tabIndex: 0,
            onClick: (event: React.MouseEvent<HTMLTableRowElement>) =>
              handleRowActivation(event, row),
            onKeyDown: (event: React.KeyboardEvent<HTMLTableRowElement>) =>
              handleRowKeyDown(event, row),
          }
        : {}),
    }

    const rowElement = (
      <TableRow {...rowProps}>{renderRowCells(row)}</TableRow>
    )

    return (
      <Fragment key={row.id}>
        {rowActions && rowActions.length > 0 ? (
          <DataTableContextMenu
            row={row}
            actions={rowActions}
            render={<TableRow {...rowProps} />}
          >
            {renderRowCells(row)}
          </DataTableContextMenu>
        ) : (
          rowElement
        )}
        {renderSubComponent &&
          row.getIsExpanded() &&
          !row.getIsGrouped() && (
            <TableRow className="bg-muted/20 hover:bg-muted/20">
              <TableCell colSpan={leafColumnCount} className="p-0">
                <div className="px-4 py-3">
                  {renderSubComponent(row)}
                </div>
              </TableCell>
            </TableRow>
          )}
      </Fragment>
    )
  }

  const renderExpandedRow = (row: Row<TData>) => (
    <TableRow
      key={`${row.id}-expanded`}
      className="bg-muted/20 hover:bg-muted/20"
    >
      <TableCell colSpan={leafColumnCount} className="p-0">
        <div className="px-4 py-3">{renderSubComponent?.(row)}</div>
      </TableCell>
    </TableRow>
  )

  const virtualItems = virtualizer.getVirtualItems()
  const virtualPaddingTop =
    virtualItems.length > 0 ? virtualItems[0]?.start ?? 0 : 0
  const virtualPaddingBottom =
    virtualItems.length > 0
      ? virtualizer.getTotalSize() -
        (virtualItems[virtualItems.length - 1]?.end ?? 0)
      : 0

  const tableMinWidth =
    table.getVisibleLeafColumns().reduce((sum, column) => sum + column.getSize(), 0)

  return (
    <div
      className={cn(
        'data-table-theme overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10',
        className,
      )}
    >
      {(title || description || primaryAction || onAdd || toolbarActions) && (
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {title && (
                <h2 className="text-base font-semibold tracking-tight">
                  {title}
                </h2>
              )}
              <Badge
                variant="secondary"
                className="tabular-nums"
                aria-live="polite"
              >
                {loading && total === 0 ? '…' : countLabel}
              </Badge>
            </div>
            {description && (
              <p className="max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {toolbarActions}
            {primaryAction ??
              (onAdd && (
                <Button size="sm" onClick={onAdd} aria-label={addLabel}>
                  <PlusIcon aria-hidden="true" />
                  <span>{addLabel}</span>
                </Button>
              ))}
          </div>
        </div>
      )}

      <DataTableToolbar
        table={table}
        filters={effectiveFilters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        onRefresh={onRefresh}
        refreshing={refreshing}
        loading={loading}
        onExport={enableExport ? effectiveExport : undefined}
        enableExport={enableExport}
        enableSearch={enableSearch}
        enableFilters={enableFilters}
        enableColumnVisibility={enableColumnVisibility}
        enableGrouping={enableGrouping}
        onResetFilters={handleResetFilters}
      />

      {(loading || refreshing) && rows.length > 0 && (
        <div className="h-0.5 w-full overflow-hidden bg-muted" aria-hidden="true">
          <div className="h-full w-1/3 animate-pulse bg-primary/60" />
        </div>
      )}

      {error && rows.length > 0 && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-2 border-b bg-destructive-surface px-3 py-2 text-sm text-destructive"
        >
          <CircleAlertIcon className="size-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            Impossible d’actualiser les données.
          </span>
          {onRetry && (
            <Button variant="outline" size="xs" onClick={onRetry}>
              Réessayer
            </Button>
          )}
        </div>
      )}

      {selectedCount > 0 && enableRowSelection && (
        <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 px-3 py-2 text-sm">
          <span className="font-medium" aria-live="polite">
            {formatNumber(selectedCount)} sélectionné
            {selectedCount > 1 ? 's' : ''}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {bulkActions?.({
              rows: selectedRows,
              selectedRowIds,
              clearSelection: resetSelection,
            })}
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="ml-auto text-muted-foreground"
            onClick={resetSelection}
          >
            Tout désélectionner
          </Button>
        </div>
      )}

      {showCards ? (
        <DataTableMobileView
          table={table}
          loading={loading}
          error={error}
          onRetry={onRetry}
          emptyState={emptyState}
          getRowCanSelect={getRowCanSelect}
          isRowDisabled={isRowDisabled}
          onRowClick={onRowClick}
          rowActions={rowActions}
          renderSubComponent={renderSubComponent}
          loadingRows={loadingRows}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div
          ref={scrollRef}
          className="relative overflow-auto"
          style={{
            maxHeight: enableVirtualization
              ? (maxHeight ?? '70vh')
              : maxHeight,
            height: enableVirtualization ? (maxHeight ?? '70vh') : undefined,
          }}
        >
          <Table
            aria-label={title ?? 'Tableau de données'}
            aria-busy={loading || refreshing}
            className="table-fixed"
            style={{ width: tableMinWidth, minWidth: '100%' }}
          >
            <TableHeader
              className={cn(stickyHeader && 'sticky top-0 z-20')}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border bg-slate-100 backdrop-blur-sm hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"
                >
                  {headerGroup.headers.map((header) => {
                    const column = header.column
                    const meta = column.columnDef.meta
                    const pinned = column.getIsPinned()
                    const sorted = column.getIsSorted()
                    const canSort = enableSorting && column.getCanSort()
                    const isInternal = isInternalColumn(column.id)
                    const headerContent = header.isPlaceholder
                      ? null
                      : meta?.label ??
                        (column.columnDef.header
                          ? flexRender(
                              column.columnDef.header,
                              header.getContext(),
                            )
                          : column.id)

                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={getCellStyle(column)}
                        aria-sort={
                          canSort
                            ? sorted === 'asc'
                              ? 'ascending'
                              : sorted === 'desc'
                                ? 'descending'
                                : 'none'
                            : undefined
                        }
                        className={cn(
                          'group/header relative h-11 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                          getAlignClass(meta?.align),
                          meta?.headerClassName,
                          pinned && 'z-30 bg-slate-100 dark:bg-slate-800',
                          pinned === 'left' &&
                            column.getIsLastColumn('left') &&
                            'shadow-[inset_-8px_0_8px_-10px_rgba(0,0,0,0.25)]',
                          pinned === 'right' &&
                            column.getIsFirstColumn('right') &&
                            'shadow-[inset_8px_0_8px_-10px_rgba(0,0,0,0.25)]',
                        )}
                      >
                        {header.isPlaceholder ? null : isInternal ? (
                          headerContent
                        ) : (
                          <DataTableColumnHeader
                            column={column}
                            title={headerContent}
                            enableSorting={enableSorting}
                            enableColumnVisibility={enableColumnVisibility}
                            enableColumnPinning={enableColumnPinning}
                          />
                        )}

                        {enableColumnResizing && column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn(
                              'absolute top-0 right-0 h-full w-px cursor-col-resize touch-none bg-border opacity-0 transition-opacity select-none group-hover/header:opacity-100 hover:bg-primary/60',
                              column.getIsResizing() && 'w-0.5 bg-primary opacity-100',
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading && rows.length === 0 ? (
                <DataTableSkeleton
                  columnCount={leafColumnCount}
                  rowCount={loadingRows}
                  rowHeight={rowHeight}
                />
              ) : error && rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={leafColumnCount} className="p-0">
                    <DataTableErrorState
                      message={typeof error === 'string' ? error : undefined}
                      onRetry={onRetry}
                    />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={leafColumnCount} className="p-0">
                    <DataTableEmptyState
                      icon={
                        filtersActive
                          ? undefined
                          : emptyState?.icon
                      }
                      title={
                        filtersActive
                          ? 'Aucun résultat'
                          : (emptyState?.title ?? 'Aucune donnée')
                      }
                      description={
                        filtersActive
                          ? 'Aucun enregistrement ne correspond à votre recherche ou à vos filtres.'
                          : emptyState?.description
                      }
                      filtered={filtersActive}
                      action={
                        filtersActive ? (
                          <Button
                            variant="outline"
                            onClick={handleResetFilters}
                          >
                            Réinitialiser les filtres
                          </Button>
                        ) : (
                          emptyState?.action
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : enableVirtualization ? (
                <>
                  {virtualPaddingTop > 0 && (
                    <TableRow
                      aria-hidden="true"
                      className="border-0 hover:bg-transparent"
                    >
                      <TableCell
                        colSpan={leafColumnCount}
                        style={{ height: virtualPaddingTop, padding: 0 }}
                      />
                    </TableRow>
                  )}
                  {virtualItems.map((virtualItem) => {
                    const item = renderItems[virtualItem.index]
                    if (!item) {
                      return null
                    }

                    return item.kind === 'row'
                      ? renderTableRow(item.row)
                      : renderExpandedRow(item.row)
                  })}
                  {virtualPaddingBottom > 0 && (
                    <TableRow
                      aria-hidden="true"
                      className="border-0 hover:bg-transparent"
                    >
                      <TableCell
                        colSpan={leafColumnCount}
                        style={{ height: virtualPaddingBottom, padding: 0 }}
                      />
                    </TableRow>
                  )}
                </>
              ) : (
                rows.map((row) => renderTableRow(row))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {enablePagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          totalCount={
            mode === 'server'
              ? (rowCount ?? undefined)
              : undefined
          }
        />
      )}
    </div>
  )
}

export type { DataTableFilterDef, DataTableProps }
