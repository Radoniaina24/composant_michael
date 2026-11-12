import type {
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table'
import {
  buildOrder,
  getOrderChannelMeta,
  getOrderStatusMeta,
  orders as initialOrders,
  type NewOrderInput,
  type Order,
  type OrderChannel,
  type OrderPriority,
  type OrderStatus,
} from './orders'

let serverOrders: Order[] = [...initialOrders]
let sequence = 0

export type FetchOrdersParams = {
  pageIndex: number
  pageSize: number
  sorting: SortingState
  globalFilter: string
  columnFilters: ColumnFiltersState
  signal?: AbortSignal
  simulateError?: boolean
  empty?: boolean
}

export type OrdersPage = {
  rows: Order[]
  total: number
  pageCount: number
}

function delay(milliseconds: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Requête annulée', 'AbortError'))
      return
    }

    const timeout = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, milliseconds)

    function handleAbort() {
      window.clearTimeout(timeout)
      reject(new DOMException('Requête annulée', 'AbortError'))
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

function getFilterValues(
  columnFilters: ColumnFiltersState,
  id: string,
): string[] {
  const value = columnFilters.find((filter) => filter.id === id)?.value
  return Array.isArray(value) ? value.map(String) : []
}

function getTextFilter(columnFilters: ColumnFiltersState, id: string) {
  const value = columnFilters.find((filter) => filter.id === id)?.value
  return typeof value === 'string' ? value.trim().toLocaleLowerCase('fr') : ''
}

function getDateRange(columnFilters: ColumnFiltersState) {
  const value = columnFilters.find(
    (filter) => filter.id === 'createdAt',
  )?.value

  if (!Array.isArray(value)) {
    return { from: '', to: '' }
  }

  return {
    from: typeof value[0] === 'string' ? value[0] : '',
    to: typeof value[1] === 'string' ? value[1] : '',
  }
}

function matchesSearch(order: Order, query: string) {
  if (!query) {
    return true
  }

  return [
    order.reference,
    order.customer.name,
    order.customer.email,
    order.company,
    order.owner,
  ]
    .join(' ')
    .toLocaleLowerCase('fr')
    .includes(query)
}

function getSortValue(order: Order, columnId: string): string | number {
  switch (columnId) {
    case 'reference':
      return order.reference
    case 'customer':
      return order.customer.name
    case 'company':
      return order.company
    case 'status':
      return getOrderStatusMeta(order.status).label
    case 'channel':
      return getOrderChannelMeta(order.channel).label
    case 'priority':
      return ['high', 'normal', 'low'].indexOf(order.priority)
    case 'amount':
      return order.amount
    case 'items':
      return order.items
    case 'createdAt':
      return order.createdAt
    case 'dueDate':
      return order.dueDate
    case 'owner':
      return order.owner
    default:
      return ''
  }
}

function compareOrders(a: Order, b: Order, sorting: SortingState) {
  for (const sort of sorting) {
    const aValue = getSortValue(a, sort.id)
    const bValue = getSortValue(b, sort.id)
    const direction = sort.desc ? -1 : 1

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      if (aValue !== bValue) {
        return (aValue - bValue) * direction
      }
      continue
    }

    const comparison = String(aValue).localeCompare(String(bValue), 'fr', {
      numeric: true,
      sensitivity: 'base',
    })

    if (comparison !== 0) {
      return comparison * direction
    }
  }

  return 0
}

export async function fetchOrders({
  pageIndex,
  pageSize,
  sorting,
  globalFilter,
  columnFilters,
  signal,
  simulateError = false,
  empty = false,
}: FetchOrdersParams): Promise<OrdersPage> {
  await delay(480, signal)

  if (simulateError) {
    throw new Error('Le service de commandes est momentanément indisponible.')
  }

  const search = globalFilter.trim().toLocaleLowerCase('fr')
  const statuses = getFilterValues(columnFilters, 'status')
  const channels = getFilterValues(columnFilters, 'channel')
  const priorities = getFilterValues(columnFilters, 'priority')
  const customerFilter = getTextFilter(columnFilters, 'customer')
  const { from, to } = getDateRange(columnFilters)

  let filtered = empty
    ? []
    : serverOrders.filter((order) => {
        if (!matchesSearch(order, search)) {
          return false
        }

        if (statuses.length > 0 && !statuses.includes(order.status)) {
          return false
        }

        if (channels.length > 0 && !channels.includes(order.channel)) {
          return false
        }

        if (priorities.length > 0 && !priorities.includes(order.priority)) {
          return false
        }

        if (
          customerFilter &&
          !`${order.customer.name} ${order.customer.email} ${order.company}`
            .toLocaleLowerCase('fr')
            .includes(customerFilter)
        ) {
          return false
        }

        const createdDay = order.createdAt.slice(0, 10)
        if (from && createdDay < from) {
          return false
        }

        if (to && createdDay > to) {
          return false
        }

        return true
      })

  if (sorting.length > 0) {
    filtered = [...filtered].sort((a, b) => compareOrders(a, b, sorting))
  }

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePageIndex = Math.min(Math.max(pageIndex, 0), pageCount - 1)
  const start = safePageIndex * pageSize

  return {
    rows: filtered.slice(start, start + pageSize),
    total,
    pageCount,
  }
}

export type OrderUpdate = Partial<
  Pick<Order, 'status' | 'priority' | 'owner'>
>

export async function updateOrders(
  ids: string[],
  patch: OrderUpdate,
  milliseconds = 520,
) {
  await delay(milliseconds)
  const idSet = new Set(ids)
  const updated: Order[] = []

  serverOrders = serverOrders.map((order) => {
    if (!idSet.has(order.id)) {
      return order
    }

    const nextOrder = { ...order, ...patch }
    updated.push(nextOrder)
    return nextOrder
  })

  return updated
}

export async function createOrderRecord(input: NewOrderInput) {
  await delay(420)
  sequence += 1
  const order = buildOrder(input, sequence)
  serverOrders = [order, ...serverOrders]
  return order
}

export async function markOrdersDelivered(ids: string[]) {
  return updateOrders(ids, { status: 'completed' })
}

export async function cancelOrders(ids: string[]) {
  return updateOrders(ids, { status: 'cancelled' })
}

export type { Order, OrderChannel, OrderPriority, OrderStatus }
