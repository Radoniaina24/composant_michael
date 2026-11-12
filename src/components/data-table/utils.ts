import type {
  Column,
  ColumnPinningState,
  FilterFn,
  Row,
  VisibilityState,
} from '@tanstack/react-table'
import {
  endOfDay,
  format,
  isValid,
  parse,
  parseISO,
  startOfDay,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import type {
  DataTableAlign,
  DataTableExportFormat,
  DataTableFilterDef,
  DataTableFilterOption,
  DataTableTone,
} from './types'

export const dataTableFilterFns = {
  dateRange: ((row, columnId, value) => {
    const range = Array.isArray(value) ? (value as string[]) : []
    const from = range[0]
    const to = range[1]

    if (!from && !to) {
      return true
    }

    const cellDate = toDate(row.getValue(columnId))

    if (!cellDate) {
      return false
    }

    const start = from ? startOfDay(parseISO(from)) : null
    const end = to ? endOfDay(parseISO(to)) : null

    if (start && !isValid(start)) {
      return true
    }

    if (end && !isValid(end)) {
      return true
    }

    return (!start || cellDate >= start) && (!end || cellDate <= end)
  }) as FilterFn<unknown>,
  multiSelect: ((row, columnId, value) => {
    if (!Array.isArray(value) || value.length === 0) {
      return true
    }

    return value.includes(String(row.getValue(columnId)))
  }) as FilterFn<unknown>,
} satisfies Record<string, FilterFn<unknown>>

export function isInternalColumn(columnId: string) {
  return columnId.startsWith('__')
}

export function getColumnLabel<TData>(column: Column<TData, unknown>) {
  const metaLabel = column.columnDef.meta?.label
  if (metaLabel) {
    return metaLabel
  }

  if (typeof column.columnDef.header === 'string') {
    return column.columnDef.header
  }

  return column.id
}

export function getFilterOptions(
  filter: DataTableFilterDef,
): DataTableFilterOption[] {
  return filter.options ?? []
}

export function filterValueIsEmpty(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return true
  }

  if (Array.isArray(value)) {
    return value.every((entry) => entry === '')
  }

  return false
}

export function formatFilterValue(
  filter: DataTableFilterDef,
  value: unknown,
) {
  if (filterValueIsEmpty(value)) {
    return ''
  }

  if (filter.variant === 'dateRange' && Array.isArray(value)) {
    const from = value[0] ? formatDateInput(value[0]) : ''
    const to = value[1] ? formatDateInput(value[1]) : ''

    if (from && to) {
      return `du ${from} au ${to}`
    }

    if (from) {
      return `depuis le ${from}`
    }

    return `jusqu’au ${to}`
  }

  const options = getFilterOptions(filter)
  const toLabel = (entry: string) =>
    options.find((option) => option.value === entry)?.label ?? entry

  if (Array.isArray(value)) {
    return value.map((entry) => toLabel(String(entry))).join(', ')
  }

  return toLabel(String(value))
}

export function formatDateInput(value: string) {
  const date = parseISO(value)
  return isValid(date) ? format(date, 'dd/MM/yyyy', { locale: fr }) : value
}

export function formatCurrency(
  value: number,
  currency = 'EUR',
  locale = 'fr-FR',
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number, locale = 'fr-FR') {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDateValue(
  value: Date | string | number | null | undefined,
  pattern = 'dd MMM yyyy',
) {
  const date = toDate(value)
  return date ? format(date, pattern, { locale: fr }) : '—'
}

export function formatDateTimeValue(
  value: Date | string | number | null | undefined,
) {
  return formatDateValue(value, "dd MMM yyyy 'à' HH:mm")
}

export function toDate(value: unknown) {
  if (value instanceof Date) {
    return isValid(value) ? value : null
  }

  if (typeof value === 'number') {
    const date = new Date(value)
    return isValid(date) ? date : null
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseISO(value)
    if (isValid(parsed)) {
      return parsed
    }

    const fallback = parse(value, 'dd/MM/yyyy', new Date(), {
      locale: fr,
    })
    return isValid(fallback) ? fallback : null
  }

  return null
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('fr'))
    .join('')
}

export function getAlignClass(align: DataTableAlign | undefined) {
  if (align === 'center') {
    return 'text-center'
  }

  if (align === 'right') {
    return 'text-right'
  }

  return 'text-left'
}

export function getToneClasses(tone: DataTableTone) {
  switch (tone) {
    case 'success':
      return 'border-success/25 bg-success-surface text-success'
    case 'warning':
      return 'border-warning/25 bg-warning-surface text-warning'
    case 'info':
      return 'border-info/25 bg-info-surface text-info'
    case 'destructive':
      return 'border-destructive/25 bg-destructive-surface text-destructive'
    case 'primary':
      return 'border-primary/15 bg-muted text-foreground'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

export function getToneDotClasses(tone: DataTableTone) {
  switch (tone) {
    case 'success':
      return 'bg-success'
    case 'warning':
      return 'bg-warning'
    case 'info':
      return 'bg-info'
    case 'destructive':
      return 'bg-destructive'
    case 'primary':
      return 'bg-primary'
    default:
      return 'bg-muted-foreground'
  }
}

export function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(
    target.closest(
      'button, a, input, select, textarea, [role="checkbox"], [role="menuitem"], [role="button"], [data-row-interactive]',
    ),
  )
}

export function buildFilterDefinitions<TData>(
  columns: Column<TData, unknown>[],
): DataTableFilterDef[] {
  return columns.flatMap((column) => {
    const meta = column.columnDef.meta
    if (!meta?.filterVariant) {
      return []
    }

    return [
      {
        id: column.id,
        label: meta.label ?? column.id,
        variant: meta.filterVariant,
        options: meta.filterOptions,
        placeholder: meta.filterPlaceholder,
      } satisfies DataTableFilterDef,
    ]
  })
}

export type PersistedDataTableState = {
  columnVisibility?: VisibilityState
  columnSizing?: Record<string, number>
  columnPinning?: ColumnPinningState
}

export function readPersistedTableState(
  key: string | undefined,
): PersistedDataTableState {
  if (!key || typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return {}
    }

    const parsed: unknown = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as PersistedDataTableState)
      : {}
  } catch {
    return {}
  }
}

export function writePersistedTableState(
  key: string | undefined,
  state: PersistedDataTableState,
) {
  if (!key || typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(state))
  } catch {
    return
  }
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toExportValue(value: unknown) {
  if (value === null || value === undefined) {
    return ''
  }

  if (value instanceof Date) {
    return isValid(value) ? format(value, 'dd/MM/yyyy HH:mm') : ''
  }

  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return value
}

function getExportData<TData>(
  columns: Column<TData, unknown>[],
  rows: Row<TData>[],
) {
  const exportColumns = columns.filter((column) => {
    if (isInternalColumn(column.id) || column.columnDef.meta?.exportable === false) {
      return false
    }

    return typeof column.accessorFn !== 'undefined' || 'accessorKey' in column.columnDef
  })

  const headers = exportColumns.map((column) => getColumnLabel(column))

  const body = rows.map((row) =>
    exportColumns.map((column) => {
      const customValue = column.columnDef.meta?.exportValue?.(row.original)
      return toExportValue(customValue ?? row.getValue(column.id))
    }),
  )

  return { headers, body }
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function normalizeFileName(fileName: string, extension: string) {
  const base = fileName
    .trim()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^\w.-]/g, '')
    .replaceAll(/\.+$/g, '')

  return `${base || 'export'}.${extension}`
}

export function exportTableToCsv<TData>(
  columns: Column<TData, unknown>[],
  rows: Row<TData>[],
  fileName = 'export',
) {
  const { headers, body } = getExportData(columns, rows)
  const lines = [
    headers.map((header) => escapeCsv(header)).join(';'),
    ...body.map((row) =>
      row.map((value) => escapeCsv(String(value))).join(';'),
    ),
  ]

  downloadFile(
    `\uFEFF${lines.join('\r\n')}`,
    normalizeFileName(fileName, 'csv'),
    'text/csv;charset=utf-8',
  )
}

export function exportTableToXls<TData>(
  columns: Column<TData, unknown>[],
  rows: Row<TData>[],
  fileName = 'export',
) {
  const { headers, body } = getExportData(columns, rows)
  const headerCells = headers
    .map(
      (header) =>
        `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(String(header))}</Data></Cell>`,
    )
    .join('')

  const bodyRows = body
    .map((row) => {
      const cells = row
        .map((value) => {
          if (typeof value === 'number' && Number.isFinite(value)) {
            return `<Cell><Data ss:Type="Number">${value}</Data></Cell>`
          }

          return `<Cell><Data ss:Type="String">${escapeXml(String(value))}</Data></Cell>`
        })
        .join('')

      return `<Row>${cells}</Row>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Export">
    <Table>
      <Row>${headerCells}</Row>
      ${bodyRows}
    </Table>
  </Worksheet>
</Workbook>`

  downloadFile(
    xml,
    normalizeFileName(fileName, 'xls'),
    'application/vnd.ms-excel;charset=utf-8',
  )
}

export function exportTableData<TData>(
  format: DataTableExportFormat,
  columns: Column<TData, unknown>[],
  rows: Row<TData>[],
  fileName: string,
) {
  if (format === 'csv') {
    exportTableToCsv(columns, rows, fileName)
    return
  }

  exportTableToXls(columns, rows, fileName)
}
