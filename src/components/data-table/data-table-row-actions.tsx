import { Fragment } from 'react'
import type { Row } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DataTableRowAction } from './types'

type RowActionItemsProps<TData> = {
  row: Row<TData>
  actions: DataTableRowAction<TData>[]
  context: 'dropdown' | 'context'
}

function RowActionItems<TData>({
  row,
  actions,
  context,
}: RowActionItemsProps<TData>) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row))
  const Item = context === 'dropdown' ? DropdownMenuItem : ContextMenuItem
  const Separator =
    context === 'dropdown' ? DropdownMenuSeparator : ContextMenuSeparator

  return visibleActions.map((action, index) => {
    const Icon = action.icon
    const disabled =
      typeof action.disabled === 'function'
        ? action.disabled(row)
        : action.disabled

    return (
      <Fragment key={`${action.label}-${index}`}>
        {action.separatorBefore && index > 0 && <Separator />}
        <Item
          variant={action.variant}
          disabled={disabled}
          onClick={() => {
            void action.onSelect(row)
          }}
        >
          {Icon && <Icon aria-hidden="true" />}
          {action.label}
        </Item>
      </Fragment>
    )
  })
}

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
  actions: DataTableRowAction<TData>[]
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Ouvrir les actions de la ligne"
            data-row-interactive
          />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <RowActionItems row={row} actions={actions} context="dropdown" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type DataTableContextMenuProps<TData> = {
  row: Row<TData>
  actions: DataTableRowAction<TData>[]
  children: React.ReactNode
  render: React.ReactElement
}

export function DataTableContextMenu<TData>({
  row,
  actions,
  children,
  render,
}: DataTableContextMenuProps<TData>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger render={render}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <RowActionItems row={row} actions={actions} context="context" />
      </ContextMenuContent>
    </ContextMenu>
  )
}
