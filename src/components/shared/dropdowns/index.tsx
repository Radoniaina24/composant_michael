import { Fragment, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  EllipsisIcon,
  FilterIcon,
  LogOutIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type DropdownAction = {
  label: string
  onSelect: () => void
  icon?: LucideIcon
  description?: string
  shortcut?: string
  badge?: string
  disabled?: boolean
  destructive?: boolean
  separatorBefore?: boolean
}

type ActionDropdownProps = {
  trigger: ReactElement
  actions: DropdownAction[]
  label?: string
  description?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  disabled?: boolean
  className?: string
  contentClassName?: string
}

export function ActionDropdown({
  trigger,
  actions,
  label,
  description,
  align = 'end',
  side = 'bottom',
  disabled,
  className,
  contentClassName,
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={cn('w-56', contentClassName)}
      >
        {(label || description) && (
          <>
            <DropdownMenuLabel className="px-2 py-1.5">
              {label && <span className="block text-sm text-foreground">{label}</span>}
              {description && (
                <span className="mt-0.5 block font-normal text-muted-foreground">
                  {description}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Fragment key={`${action.label}-${index}`}>
              {action.separatorBefore && index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                disabled={action.disabled}
                variant={action.destructive ? 'destructive' : 'default'}
                className={className}
                onSelect={action.onSelect}
              >
                {Icon && <Icon aria-hidden="true" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{action.label}</span>
                  {action.description && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  )}
                </span>
                {action.badge && (
                  <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[0.65rem]">
                    {action.badge}
                  </Badge>
                )}
                {action.shortcut && (
                  <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            </Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type UserDropdownProps = {
  name: string
  email: string
  initials: string
  onProfile?: () => void
  onSignOut?: () => void
}

export function UserDropdown({
  name,
  email,
  initials,
  onProfile,
  onSignOut,
}: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-auto min-w-56 justify-start gap-3 px-3 py-2 text-left"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-indigo-100 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="grid min-w-0 flex-1">
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <span className="block text-foreground">{name}</span>
          <span className="font-normal">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onProfile}>
          <UserRoundIcon aria-hidden="true" />
          Mon profil
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span className="size-4" aria-hidden="true" />
          Préférences
          <DropdownMenuShortcut>⌘ ,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={onSignOut}
        >
          <LogOutIcon aria-hidden="true" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type TableRowDropdownProps = {
  actions: DropdownAction[]
  label?: string
}

export function TableRowDropdown({
  actions,
  label = 'Actions de la ligne',
}: TableRowDropdownProps) {
  return (
    <ActionDropdown
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label={label}>
          <EllipsisIcon aria-hidden="true" />
        </Button>
      }
      actions={actions}
      contentClassName="w-52"
    />
  )
}

type NavigationDropdownProps = {
  trigger: ReactElement
  items: Array<{
    label: string
    to: string
    icon?: DropdownAction['icon']
    description?: string
    disabled?: boolean
  }>
  label?: string
}

export function NavigationDropdown({
  trigger,
  items,
  label,
}: NavigationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {items.map(({ label: itemLabel, to, icon: Icon, description, disabled }) => (
          <Fragment key={to}>
            {disabled ? (
              <DropdownMenuItem disabled>
                {Icon && <Icon aria-hidden="true" />}
                <span>{itemLabel}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link to={to}>
                  {Icon && <Icon aria-hidden="true" />}
                  <span className="min-w-0">
                    <span className="block truncate">{itemLabel}</span>
                    {description && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {description}
                      </span>
                    )}
                  </span>
                </Link>
              </DropdownMenuItem>
            )}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type FilterDropdownProps = {
  options: Array<{ label: string; value: string; disabled?: boolean }>
  selected: string[]
  onSelectedChange: (selected: string[]) => void
  label?: string
}

export function FilterDropdown({
  options,
  selected,
  onSelectedChange,
  label = 'Filtres',
}: FilterDropdownProps) {
  const count = selected.length

  function toggle(value: string, checked: boolean | 'indeterminate') {
    const next = new Set(selected)
    if (checked === true) {
      next.add(value)
    } else {
      next.delete(value)
    }
    onSelectedChange([...next])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon aria-hidden="true" />
          {label}
          {count > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 justify-center px-1">
              {count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Afficher les éléments</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            disabled={option.disabled}
            onCheckedChange={(checked) => toggle(option.value, checked)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
