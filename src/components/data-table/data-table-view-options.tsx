import type { Table } from '@tanstack/react-table'
import { RotateCcwIcon, SlidersHorizontalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { getColumnLabel, isInternalColumn } from './utils'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
  enableGrouping?: boolean
}

export function DataTableViewOptions<TData>({
  table,
  enableGrouping = false,
}: DataTableViewOptionsProps<TData>) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide() && !isInternalColumn(column.id))

  const groupableColumns = table
    .getAllLeafColumns()
    .filter(
      (column) =>
        !isInternalColumn(column.id) &&
        column.getCanGroup() &&
        typeof column.accessorFn !== 'undefined',
    )

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label="Personnaliser les colonnes"
            title="Personnaliser les colonnes"
          />
        }
      >
        <SlidersHorizontalIcon aria-hidden="true" />
        <span className="hidden sm:inline">Colonnes</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 gap-0 p-0">
        <PopoverHeader className="flex-row items-center justify-between gap-2 border-b px-3 py-2.5">
          <PopoverTitle className="text-sm">Personnaliser</PopoverTitle>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => {
              table.resetColumnVisibility()
              table.resetColumnSizing()
              table.resetColumnPinning()
              if (enableGrouping) {
                table.resetGrouping()
              }
            }}
            aria-label="Réinitialiser les colonnes"
            title="Réinitialiser"
          >
            <RotateCcwIcon aria-hidden="true" />
          </Button>
        </PopoverHeader>

        <div className="max-h-72 overflow-y-auto p-1.5">
          <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
            Colonnes visibles
          </p>
          <div className="grid gap-0.5">
            {columns.map((column) => {
              const label = getColumnLabel(column)
              const id = `column-${column.id}`

              return (
                <div
                  key={column.id}
                  className="flex items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-muted/60"
                >
                  <Checkbox
                    id={id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(checked) =>
                      column.toggleVisibility(checked === true)
                    }
                  />
                  <Label
                    htmlFor={id}
                    className="min-w-0 flex-1 cursor-pointer truncate text-sm font-normal"
                  >
                    {label}
                  </Label>
                </div>
              )
            })}
          </div>

          {enableGrouping && groupableColumns.length > 0 && (
            <>
              <Separator className="my-1.5" />
              <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                Grouper par
              </p>
              <div className="grid gap-0.5">
                {groupableColumns.map((column) => {
                  const label = getColumnLabel(column)
                  const id = `group-${column.id}`

                  return (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-muted/60"
                    >
                      <Checkbox
                        id={id}
                        checked={column.getIsGrouped()}
                        onCheckedChange={() => column.toggleGrouping()}
                      />
                      <Label
                        htmlFor={id}
                        className="min-w-0 flex-1 cursor-pointer truncate text-sm font-normal"
                      >
                        {label}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
