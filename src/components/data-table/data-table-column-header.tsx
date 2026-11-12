import type { Column } from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
  PinOffIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { isInternalColumn } from './utils'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: React.ReactNode
  enableSorting: boolean
  enableColumnVisibility: boolean
  enableColumnPinning: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  enableSorting,
  enableColumnVisibility,
  enableColumnPinning,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = enableSorting && column.getCanSort()
  const sorted = column.getIsSorted()
  const sortIndex = column.getSortIndex()
  const canHide = enableColumnVisibility && column.getCanHide()
  const canPin = enableColumnPinning && column.getCanPin()
  const pinned = column.getIsPinned()
  const showMenu = canSort || canHide || canPin
  const isInternal = isInternalColumn(column.id)

  const sortIcon =
    sorted === 'asc' ? (
      <ArrowUpIcon className="size-3.5" aria-hidden="true" />
    ) : sorted === 'desc' ? (
      <ArrowDownIcon className="size-3.5" aria-hidden="true" />
    ) : (
      <ChevronsUpDownIcon
        className="size-3.5 text-muted-foreground/60"
        aria-hidden="true"
      />
    )

  return (
    <div className="flex min-w-0 items-center justify-between gap-1">
      {canSort ? (
        <button
          type="button"
          onClick={column.getToggleSortingHandler()}
          className={cn(
            '-ml-1.5 flex min-w-0 flex-1 items-center gap-1 rounded-md px-1.5 py-1 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50',
            sorted && 'text-foreground',
          )}
          aria-label={`Trier par ${typeof title === 'string' ? title : column.id}`}
        >
          <span className="truncate">{title}</span>
          {sortIcon}
          {sortIndex > -1 && (
            <span className="rounded-sm bg-muted px-1 text-[0.65rem] leading-4 tabular-nums text-muted-foreground">
              {sortIndex + 1}
            </span>
          )}
        </button>
      ) : (
        <span className="truncate">{title}</span>
      )}

      {showMenu && !isInternal && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/header:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
                aria-label="Options de la colonne"
              />
            }
          >
            <ChevronsUpDownIcon aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="truncate">
              {title}
            </DropdownMenuLabel>
            {canSort && (
              <>
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                  <ArrowUpIcon aria-hidden="true" />
                  Trier croissant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                  <ArrowDownIcon aria-hidden="true" />
                  Trier décroissant
                </DropdownMenuItem>
                {sorted && (
                  <DropdownMenuItem onClick={() => column.clearSorting()}>
                    <ChevronsUpDownIcon aria-hidden="true" />
                    Retirer le tri
                  </DropdownMenuItem>
                )}
              </>
            )}
            {(canPin || canHide) && <DropdownMenuSeparator />}
            {canPin && pinned !== 'left' && (
              <DropdownMenuItem onClick={() => column.pin('left')}>
                <ArrowLeftToLineIcon aria-hidden="true" />
                Épingler à gauche
              </DropdownMenuItem>
            )}
            {canPin && pinned !== 'right' && (
              <DropdownMenuItem onClick={() => column.pin('right')}>
                <ArrowRightToLineIcon aria-hidden="true" />
                Épingler à droite
              </DropdownMenuItem>
            )}
            {canPin && pinned && (
              <DropdownMenuItem onClick={() => column.pin(false)}>
                <PinOffIcon aria-hidden="true" />
                Désépingler
              </DropdownMenuItem>
            )}
            {canHide && (
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOffIcon aria-hidden="true" />
                Masquer la colonne
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
