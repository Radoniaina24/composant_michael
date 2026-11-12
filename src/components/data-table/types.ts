import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  GroupingState,
  OnChangeFn,
  PaginationState,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type DataTableAlign = 'left' | 'center' | 'right'

export type DataTableTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'info'
  | 'destructive'

export type DataTableFilterVariant =
  | 'text'
  | 'select'
  | 'multiSelect'
  | 'dateRange'

export type DataTableFilterOption = {
  value: string
  label: string
  tone?: DataTableTone
  icon?: LucideIcon
}

export type DataTableFilterDef = {
  id: string
  label: string
  variant: DataTableFilterVariant
  options?: DataTableFilterOption[]
  placeholder?: string
}

export type DataTableFilterValue =
  | string
  | string[]
  | [string, string]
  | null
  | undefined

export type DataTableEmptyState = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export type DataTableExportFormat = 'csv' | 'xls'

export type DataTableRowAction<TData> = {
  label: string
  icon?: LucideIcon
  onSelect: (row: Row<TData>) => void | Promise<void>
  variant?: 'default' | 'destructive'
  disabled?: boolean | ((row: Row<TData>) => boolean)
  hidden?: (row: Row<TData>) => boolean
  separatorBefore?: boolean
}

export type DataTableBulkActionsContext<TData> = {
  rows: Row<TData>[]
  selectedRowIds: string[]
  clearSelection: () => void
}

export type DataTableError = string | Error | null | undefined

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    align?: DataTableAlign
    filterVariant?: DataTableFilterVariant
    filterOptions?: DataTableFilterOption[]
    filterPlaceholder?: string
    minWidth?: number
    maxWidth?: number
    mobilePriority?: number
    mobileHidden?: boolean
    exportable?: boolean
    exportValue?: (row: TData) => unknown
    headerClassName?: string
    cellClassName?: string
  }
}

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]

  title?: string
  description?: string
  totalCount?: number
  loading?: boolean
  refreshing?: boolean
  error?: DataTableError
  onRetry?: () => void
  onRefresh?: () => void

  onAdd?: () => void
  addLabel?: string
  primaryAction?: ReactNode
  toolbarActions?: ReactNode

  emptyState?: DataTableEmptyState
  searchPlaceholder?: string
  searchDebounce?: number
  filters?: DataTableFilterDef[]
  enableSearch?: boolean
  enableFilters?: boolean
  enableExport?: boolean
  enableSorting?: boolean
  enableMultiSort?: boolean
  enableColumnVisibility?: boolean
  enableColumnResizing?: boolean
  enableColumnPinning?: boolean
  enableRowSelection?: boolean
  enablePagination?: boolean
  enableVirtualization?: boolean
  enableGrouping?: boolean

  mode?: 'client' | 'server'
  pageCount?: number
  rowCount?: number
  initialPageSize?: number
  pageSizeOptions?: number[]

  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  globalFilter?: string
  onGlobalFilterChange?: OnChangeFn<string>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  grouping?: GroupingState
  onGroupingChange?: OnChangeFn<GroupingState>
  globalFilterFn?: FilterFn<TData>

  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  getRowCanSelect?: (row: Row<TData>) => boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
  isRowDisabled?: (row: Row<TData>) => boolean
  renderSubComponent?: (row: Row<TData>) => ReactNode
  onRowClick?: (row: TData) => void
  rowActions?: DataTableRowAction<TData>[]
  bulkActions?: (context: DataTableBulkActionsContext<TData>) => ReactNode

  onExport?: (format: DataTableExportFormat) => void | Promise<void>
  exportFileName?: string
  persistenceKey?: string
  responsiveMode?: 'auto' | 'table' | 'cards'
  stickyHeader?: boolean
  rowHeight?: number
  maxHeight?: number | string
  loadingRows?: number
  className?: string
}
