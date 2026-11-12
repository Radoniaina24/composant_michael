import type { LucideIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { DataTableTone } from './types'
import {
  formatCurrency,
  formatDateValue,
  formatDateTimeValue,
  getInitials,
  getToneClasses,
  getToneDotClasses,
} from './utils'

type DataTableTextProps = {
  value: string | number | null | undefined
  secondary?: string | null
  mono?: boolean
  className?: string
}

export function DataTableText({
  value,
  secondary,
  mono = false,
  className,
}: DataTableTextProps) {
  const text = value === null || value === undefined || value === '' ? '—' : String(value)

  return (
    <div className={cn('min-w-0', className)}>
      <span
        className={cn(
          'block truncate',
          mono && 'font-mono text-xs',
          (value === null || value === undefined || value === '') &&
            'text-muted-foreground',
        )}
        title={text}
      >
        {text}
      </span>
      {secondary && (
        <span
          className="block truncate text-xs text-muted-foreground"
          title={secondary}
        >
          {secondary}
        </span>
      )}
    </div>
  )
}

type DataTableNumberProps = {
  value: number | null | undefined
  maximumFractionDigits?: number
  minimumFractionDigits?: number
  suffix?: string
  className?: string
}

export function DataTableNumber({
  value,
  maximumFractionDigits = 0,
  minimumFractionDigits = 0,
  suffix,
  className,
}: DataTableNumberProps) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value)

  return (
    <span className={cn('tabular-nums', className)}>
      {formatted}
      {suffix ? ` ${suffix}` : null}
    </span>
  )
}

type DataTableCurrencyProps = {
  value: number | null | undefined
  currency?: string
  className?: string
}

export function DataTableCurrency({
  value,
  currency = 'EUR',
  className,
}: DataTableCurrencyProps) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <span className={cn('font-medium tabular-nums', className)}>
      {formatCurrency(value, currency)}
    </span>
  )
}

type DataTableDateProps = {
  value: Date | string | number | null | undefined
  withTime?: boolean
  className?: string
}

export function DataTableDate({
  value,
  withTime = false,
  className,
}: DataTableDateProps) {
  return (
    <span className={cn('whitespace-nowrap text-muted-foreground', className)}>
      {withTime ? formatDateTimeValue(value) : formatDateValue(value)}
    </span>
  )
}

type DataTableStatusProps = {
  label: string
  tone?: DataTableTone
  icon?: LucideIcon
  showDot?: boolean
  className?: string
}

export function DataTableStatus({
  label,
  tone = 'neutral',
  icon: Icon,
  showDot = true,
  className,
}: DataTableStatusProps) {
  return (
    <span
      className={cn(
        'inline-flex h-5 max-w-full items-center gap-1.5 rounded-full border px-2 text-xs font-medium whitespace-nowrap',
        getToneClasses(tone),
        className,
      )}
    >
      {Icon ? (
        <Icon className="size-3" aria-hidden="true" />
      ) : showDot ? (
        <span
          className={cn('size-1.5 rounded-full', getToneDotClasses(tone))}
          aria-hidden="true"
        />
      ) : null}
      <span className="truncate">{label}</span>
    </span>
  )
}

type DataTableAvatarProps = {
  name: string
  description?: string
  secondary?: string
  className?: string
}

export function DataTableAvatar({
  name,
  description,
  secondary,
  className,
}: DataTableAvatarProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Avatar size="sm" className="shrink-0">
        <AvatarFallback className="bg-muted text-[0.65rem] font-medium text-muted-foreground">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <span className="block truncate font-medium text-foreground" title={name}>
          {name}
        </span>
        {description && (
          <span
            className="block truncate text-xs text-muted-foreground"
            title={description}
          >
            {description}
          </span>
        )}
        {secondary && (
          <span className="block truncate text-xs text-muted-foreground">
            {secondary}
          </span>
        )}
      </div>
    </div>
  )
}

type DataTableCellStackProps = {
  primary: string
  secondary?: string
  className?: string
}

export function DataTableCellStack({
  primary,
  secondary,
  className,
}: DataTableCellStackProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <span className="block truncate" title={primary}>
        {primary}
      </span>
      {secondary && (
        <span
          className="block truncate text-xs text-muted-foreground"
          title={secondary}
        >
          {secondary}
        </span>
      )}
    </div>
  )
}
