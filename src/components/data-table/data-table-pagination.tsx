import type { Table } from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatNumber } from './utils'

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  pageSizeOptions: number[]
  totalCount?: number
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions,
  totalCount,
}: DataTablePaginationProps<TData>) {
  const pagination = table.getState().pagination
  const pageCount = Math.max(1, table.getPageCount())
  const rowCount =
    totalCount ?? table.getFilteredRowModel().rows.length
  const pageRows = table.getRowModel().rows.length
  const rangeStart = pageRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const rangeEnd = pageRows === 0 ? 0 : rangeStart + pageRows - 1
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div className="flex flex-col gap-3 border-t px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
        <span aria-live="polite">
          {rowCount === 0
            ? 'Aucun résultat'
            : `${formatNumber(rangeStart)}–${formatNumber(rangeEnd)} sur ${formatNumber(rowCount)} résultat${rowCount > 1 ? 's' : ''}`}
        </span>
        {selectedCount > 0 && (
          <span className="text-foreground">
            {formatNumber(selectedCount)} sélectionné{selectedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="whitespace-nowrap text-xs sm:text-sm">
            Lignes par page
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
            >
              <Button
                variant="outline"
                size="sm"
                className="min-w-16 justify-between font-normal"
                aria-label="Nombre de lignes par page"
              >
                {pagination.pageSize}
                <ChevronDownIcon className="text-muted-foreground" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24">
              <DropdownMenuLabel>Lignes</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={String(pagination.pageSize)}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                  table.setPageIndex(0)
                }}
              >
                {pageSizeOptions.map((size) => (
                  <DropdownMenuRadioItem key={size} value={String(size)}>
                    {size}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1">
          <span className="mr-2 hidden whitespace-nowrap text-xs text-muted-foreground tabular-nums sm:inline">
            Page {pagination.pageIndex + 1} sur {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Première page"
            title="Première page"
          >
            <ChevronsLeftIcon aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Page précédente"
            title="Page précédente"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Page suivante"
            title="Page suivante"
          >
            <ChevronRightIcon aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Dernière page"
            title="Dernière page"
          >
            <ChevronsRightIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
