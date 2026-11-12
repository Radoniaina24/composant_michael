import { useCallback, useMemo, useState } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  BanIcon,
  CheckCheckIcon,
  CheckIcon,
  CircleCheckIcon,
  CopyIcon,
  EyeIcon,
  PackageOpenIcon,
} from 'lucide-react'
import { z } from 'zod'
import { ActionButton } from '@/components/action-button'
import { CodeBlock } from '@/components/code-block'
import {
  DataTable,
  DataTableAvatar,
  DataTableCurrency,
  DataTableDate,
  DataTableNumber,
  DataTableStatus,
  DataTableText,
  formatCurrency,
  formatDateValue,
  type DataTableRowAction,
} from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { notify } from '@/lib/notifications/notify'
import {
  cancelOrders,
  createOrderRecord,
  fetchOrders,
  markOrdersDelivered,
} from '@/lib/demo/orders-api'
import {
  getOrderChannelMeta,
  getOrderPriorityMeta,
  getOrderStatusMeta,
  largeOrders,
  orderChannelOptions,
  orderPriorityOptions,
  orderStatusOptions,
  orders,
  type NewOrderInput,
  type Order,
  type OrderPriority,
} from '@/lib/demo/orders'

type DemoMode = 'client' | 'server'
type ResponsiveMode = 'auto' | 'table' | 'cards'

const priorityRank: Record<OrderPriority, number> = {
  high: 0,
  normal: 1,
  low: 2,
}

const orderColumns: ColumnDef<Order>[] = [
  {
    id: 'customer',
    accessorFn: (row) =>
      `${row.customer.name} ${row.customer.email} ${row.company}`,
    size: 240,
    meta: {
      label: 'Client',
      filterVariant: 'text',
      filterPlaceholder: 'Nom, e-mail ou société…',
      minWidth: 200,
      maxWidth: 340,
      mobilePriority: 1,
      exportValue: (row) => row.customer.name,
    },
    cell: ({ row }) => (
      <DataTableAvatar
        name={row.original.customer.name}
        description={row.original.customer.email}
      />
    ),
  },
  {
    accessorKey: 'company',
    size: 160,
    meta: {
      label: 'Société',
      minWidth: 130,
      mobileHidden: true,
      exportValue: (row) => row.company,
    },
    cell: ({ row }) => (
      <DataTableText value={row.original.company} />
    ),
  },
  {
    accessorKey: 'reference',
    size: 140,
    meta: {
      label: 'Référence',
      mobileHidden: true,
      minWidth: 120,
      exportValue: (row) => row.reference,
    },
    cell: ({ row }) => (
      <DataTableText value={row.original.reference} mono />
    ),
  },
  {
    accessorKey: 'status',
    size: 130,
    meta: {
      label: 'Statut',
      filterVariant: 'multiSelect',
      filterOptions: orderStatusOptions,
      mobilePriority: 2,
      minWidth: 110,
      exportValue: (row) => getOrderStatusMeta(row.status).label,
    },
    sortingFn: (a, b) =>
      getOrderStatusMeta(a.original.status).label.localeCompare(
        getOrderStatusMeta(b.original.status).label,
        'fr',
      ),
    cell: ({ row }) => {
      const status = getOrderStatusMeta(row.original.status)
      return <DataTableStatus label={status.label} tone={status.tone} />
    },
  },
  {
    accessorKey: 'channel',
    size: 140,
    meta: {
      label: 'Canal',
      filterVariant: 'multiSelect',
      filterOptions: orderChannelOptions,
      mobileHidden: true,
      minWidth: 120,
      exportValue: (row) => getOrderChannelMeta(row.channel).label,
    },
    sortingFn: (a, b) =>
      getOrderChannelMeta(a.original.channel).label.localeCompare(
        getOrderChannelMeta(b.original.channel).label,
        'fr',
      ),
    cell: ({ row }) => (
      <DataTableText value={getOrderChannelMeta(row.original.channel).label} />
    ),
  },
  {
    accessorKey: 'priority',
    size: 110,
    meta: {
      label: 'Priorité',
      filterVariant: 'multiSelect',
      filterOptions: orderPriorityOptions,
      mobileHidden: true,
      minWidth: 100,
      exportValue: (row) => getOrderPriorityMeta(row.priority).label,
    },
    sortingFn: (a, b) =>
      priorityRank[a.original.priority] - priorityRank[b.original.priority],
    cell: ({ row }) => {
      const priority = getOrderPriorityMeta(row.original.priority)
      return (
        <DataTableStatus
          label={priority.label}
          tone={priority.tone}
          showDot
        />
      )
    },
  },
  {
    accessorKey: 'amount',
    size: 120,
    meta: {
      label: 'Montant',
      align: 'right',
      mobilePriority: 3,
      minWidth: 100,
      exportValue: (row) => row.amount,
    },
    cell: ({ row }) => <DataTableCurrency value={row.original.amount} />,
  },
  {
    accessorKey: 'items',
    size: 90,
    meta: {
      label: 'Articles',
      align: 'right',
      mobileHidden: true,
      minWidth: 80,
      exportValue: (row) => row.items,
    },
    cell: ({ row }) => (
      <DataTableNumber value={row.original.items} suffix="art." />
    ),
  },
  {
    accessorKey: 'createdAt',
    size: 140,
    meta: {
      label: 'Créée le',
      filterVariant: 'dateRange',
      mobilePriority: 4,
      minWidth: 120,
      exportValue: (row) => formatDateValue(row.createdAt, 'dd/MM/yyyy'),
    },
    cell: ({ row }) => <DataTableDate value={row.original.createdAt} />,
  },
]

const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.'),
  company: z
    .string()
    .trim()
    .min(2, 'La société doit contenir au moins 2 caractères.'),
  email: z.union([z.literal(''), z.email('Adresse e-mail invalide.')]),
  amount: z.coerce
    .number({ error: 'Saisissez un montant valide.' })
    .positive('Le montant doit être supérieur à zéro.')
    .max(1_000_000, 'Le montant ne peut pas dépasser 1 000 000 €.'),
})

const initialForm = {
  customerName: '',
  company: '',
  email: '',
  amount: '',
}

type FormField = keyof typeof initialForm
type FormErrors = Partial<Record<FormField, string>>

type CreateOrderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (input: NewOrderInput) => Promise<void>
}

function CreateOrderDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateOrderDialogProps) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function resetForm() {
    setForm(initialForm)
    setErrors({})
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm()
    }

    onOpenChange(nextOpen)
  }

  function setField(field: FormField, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = createOrderSchema.safeParse(form)

    if (!result.success) {
      const nextErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (
          typeof field === 'string' &&
          !nextErrors[field as FormField]
        ) {
          nextErrors[field as FormField] = issue.message
        }
      }
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    try {
      await onCreate({
        customerName: result.data.customerName,
        company: result.data.company,
        email: result.data.email || undefined,
        amount: result.data.amount,
      })
      resetForm()
    } catch {
      return
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle commande</DialogTitle>
          <DialogDescription>
            Créez une commande pour un client. Elle apparaîtra en tête de
            liste.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="order-customer">Nom du client</Label>
            <Input
              id="order-customer"
              value={form.customerName}
              onChange={(event) => setField('customerName', event.target.value)}
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={
                errors.customerName ? 'order-customer-error' : undefined
              }
              placeholder="Camille Bernard"
            />
            {errors.customerName && (
              <p id="order-customer-error" className="text-sm text-destructive">
                {errors.customerName}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-company">Société</Label>
            <Input
              id="order-company"
              value={form.company}
              onChange={(event) => setField('company', event.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={
                errors.company ? 'order-company-error' : undefined
              }
              placeholder="Atelier Lumière"
            />
            {errors.company && (
              <p id="order-company-error" className="text-sm text-destructive">
                {errors.company}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="order-email">E-mail</Label>
              <Input
                id="order-email"
                type="email"
                value={form.email}
                onChange={(event) => setField('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'order-email-error' : undefined
                }
                placeholder="client@exemple.fr"
              />
              {errors.email && (
                <p id="order-email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order-amount">Montant (€)</Label>
              <Input
                id="order-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => setField('amount', event.target.value)}
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={
                  errors.amount ? 'order-amount-error' : undefined
                }
                placeholder="1 250"
              />
              {errors.amount && (
                <p id="order-amount-error" className="text-sm text-destructive">
                  {errors.amount}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <ActionButton type="submit" loading={submitting}>
              Créer la commande
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type OrderDetailsSheetProps = {
  order: Order | null
  onOpenChange: (open: boolean) => void
  onDeliver: (order: Order) => Promise<void>
  onCancel: (order: Order) => Promise<void>
}

function OrderDetailsSheet({
  order,
  onOpenChange,
  onDeliver,
  onCancel,
}: OrderDetailsSheetProps) {
  const [pending, setPending] = useState<'deliver' | 'cancel' | null>(null)

  if (!order) {
    return null
  }

  const currentOrder = order
  const status = getOrderStatusMeta(order.status)
  const channel = getOrderChannelMeta(order.channel)
  const priority = getOrderPriorityMeta(order.priority)
  const finished =
    order.status === 'completed' ||
    order.status === 'cancelled' ||
    order.status === 'refunded'

  async function run(action: 'deliver' | 'cancel') {
    setPending(action)
    try {
      await (action === 'deliver'
        ? onDeliver(currentOrder)
        : onCancel(currentOrder))
    } finally {
      setPending(null)
    }
  }

  return (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>Commande {order.reference}</SheetTitle>
          <SheetDescription>
            {order.customer.name} · {order.company}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 p-3">
            <DataTableAvatar
              name={order.customer.name}
              description={order.customer.email}
              secondary={order.company}
            />
            <DataTableStatus label={status.label} tone={status.tone} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Montant
              </dt>
              <dd className="mt-0.5 font-medium tabular-nums">
                {formatCurrency(order.amount)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Articles
              </dt>
              <dd className="mt-0.5 tabular-nums">{order.items}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Canal
              </dt>
              <dd className="mt-0.5">{channel.label}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Priorité
              </dt>
              <dd className="mt-0.5">{priority.label}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Responsable
              </dt>
              <dd className="mt-0.5">{order.owner}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Référence
              </dt>
              <dd className="mt-0.5 font-mono text-xs">{order.reference}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Créée le
              </dt>
              <dd className="mt-0.5">
                {formatDateValue(order.createdAt, 'dd MMM yyyy HH:mm')}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Échéance
              </dt>
              <dd className="mt-0.5">
                {formatDateValue(order.dueDate, 'dd MMM yyyy')}
              </dd>
            </div>
          </dl>
        </div>

        {!finished && (
          <SheetFooter className="flex-row gap-2 border-t bg-muted/30">
            <ActionButton
              variant="outline"
              className="flex-1"
              onClick={() => {
                void run('cancel')
              }}
              loading={pending === 'cancel'}
            >
              Annuler
            </ActionButton>
            <ActionButton
              className="flex-1"
              onClick={() => {
                void run('deliver')
              }}
              loading={pending === 'deliver'}
            >
              <CheckIcon aria-hidden="true" />
              Marquer livrée
            </ActionButton>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function OrderInlineDetails({ order }: { order: Order }) {
  const status = getOrderStatusMeta(order.status)
  const channel = getOrderChannelMeta(order.channel)
  const priority = getOrderPriorityMeta(order.priority)

  return (
    <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Statut</p>
        <div className="mt-1">
          <DataTableStatus label={status.label} tone={status.tone} />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Canal</p>
        <p className="mt-1">{channel.label}</p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Priorité</p>
        <p className="mt-1">{priority.label}</p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Responsable</p>
        <p className="mt-1">{order.owner}</p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Échéance</p>
        <p className="mt-1">{formatDateValue(order.dueDate)}</p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Société</p>
        <p className="mt-1">{order.company}</p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Articles</p>
        <p className="mt-1">{order.items}</p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Référence</p>
        <p className="mt-1 font-mono text-xs">{order.reference}</p>
      </div>
    </div>
  )
}

const usage = `import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  DataTable,
  DataTableAvatar,
  DataTableCurrency,
  DataTableStatus,
} from '@/components/data-table'

const columns: ColumnDef<Order>[] = [
  {
    id: 'customer',
    accessorFn: (row) => row.customer.name,
    meta: { label: 'Client', mobilePriority: 1 },
    cell: ({ row }) => (
      <DataTableAvatar
        name={row.original.customer.name}
        description={row.original.customer.email}
      />
    ),
  },
  {
    accessorKey: 'amount',
    meta: { label: 'Montant', align: 'right' },
    cell: ({ row }) => <DataTableCurrency value={row.original.amount} />,
  },
]

export function OrdersTable() {
  const [selection, setSelection] = useState({})

  return (
    <DataTable
      title="Commandes"
      columns={columns}
      data={orders}
      getRowId={(row) => row.id}
      enableRowSelection
      rowSelection={selection}
      onRowSelectionChange={setSelection}
      onRowClick={(row) => console.log(row)}
      persistenceKey="orders-table"
    />
  )
}`

export default function DataTablePage() {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<DemoMode>('client')
  const [responsiveMode, setResponsiveMode] =
    useState<ResponsiveMode>('auto')
  const [simulateError, setSimulateError] = useState(false)
  const [emptyData, setEmptyData] = useState(false)
  const [largeVolume, setLargeVolume] = useState(false)
  const [virtualize, setVirtualize] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [clientOrders, setClientOrders] = useState<Order[]>(orders)
  const [clientRefreshing, setClientRefreshing] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const serverQuery = useQuery({
    queryKey: [
      'demo-orders',
      pagination,
      sorting,
      globalFilter,
      columnFilters,
      simulateError,
      emptyData,
    ],
    queryFn: ({ signal }) =>
      fetchOrders({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        globalFilter,
        columnFilters,
        signal,
        simulateError,
        empty: emptyData,
      }),
    enabled: mode === 'server',
    placeholderData: keepPreviousData,
    retry: false,
  })

  const applyUpdatedOrders = useCallback((updated: Order[]) => {
    if (updated.length === 0) {
      return
    }

    const updatedById = new Map(updated.map((order) => [order.id, order]))
    setClientOrders((current) =>
      current.map((order) => updatedById.get(order.id) ?? order),
    )
  }, [])

  const syncDetail = useCallback((updated: Order | undefined) => {
    if (!updated) {
      return
    }

    setDetailOrder((current) =>
      current && current.id === updated.id ? updated : current,
    )
  }, [])

  const openDetail = useCallback((order: Order) => {
    setDetailOrder(order)
  }, [])

  const copyReference = useCallback(async (order: Order) => {
    try {
      await navigator.clipboard.writeText(order.reference)
      notify.success('Référence copiée', {
        description: `${order.reference} est dans le presse-papiers.`,
      })
    } catch {
      notify.error('Impossible de copier la référence')
    }
  }, [])

  const markDelivered = useCallback(
    async (order: Order) => {
      try {
        const [updated] = await markOrdersDelivered([order.id])
        if (updated) {
          applyUpdatedOrders([updated])
          syncDetail(updated)
          notify.success('Commande livrée', {
            description: `${order.reference} a été marquée comme livrée.`,
          })
        }
        await queryClient.invalidateQueries({ queryKey: ['demo-orders'] })
      } catch {
        notify.error('Impossible de mettre à jour la commande', {
          description: 'Veuillez réessayer dans un instant.',
        })
      }
    },
    [applyUpdatedOrders, queryClient, syncDetail],
  )

  const cancelOrder = useCallback(
    async (order: Order) => {
      try {
        const [updated] = await cancelOrders([order.id])
        if (updated) {
          applyUpdatedOrders([updated])
          syncDetail(updated)
          notify.success('Commande annulée', {
            description: `${order.reference} a été annulée.`,
          })
        }
        await queryClient.invalidateQueries({ queryKey: ['demo-orders'] })
      } catch {
        notify.error('Impossible d’annuler la commande', {
          description: 'Veuillez réessayer dans un instant.',
        })
      }
    },
    [applyUpdatedOrders, queryClient, syncDetail],
  )

  const rowActions = useMemo<DataTableRowAction<Order>[]>(() => {
    const actions: DataTableRowAction<Order>[] = [
      {
        label: 'Voir les détails',
        icon: EyeIcon,
        onSelect: (row) => openDetail(row.original),
      },
      {
        label: 'Copier la référence',
        icon: CopyIcon,
        onSelect: (row) => copyReference(row.original),
      },
    ]

    if (!readOnly) {
      actions.push(
        {
          label: 'Marquer comme livrée',
          icon: CircleCheckIcon,
          separatorBefore: true,
          hidden: (row) =>
            Boolean(row.original.disabled) ||
            ['completed', 'cancelled', 'refunded'].includes(
              row.original.status,
            ),
          onSelect: (row) => markDelivered(row.original),
        },
        {
          label: 'Annuler la commande',
          icon: BanIcon,
          variant: 'destructive',
          hidden: (row) =>
            Boolean(row.original.disabled) ||
            ['completed', 'cancelled', 'refunded'].includes(
              row.original.status,
            ),
          onSelect: (row) => cancelOrder(row.original),
        },
      )
    }

    return actions
  }, [readOnly, openDetail, copyReference, markDelivered, cancelOrder])

  const [bulkPending, setBulkPending] = useState(false)

  const handleBulkDeliver = useCallback(
    async (ids: string[], clearSelection: () => void) => {
      if (ids.length === 0) {
        return
      }

      setBulkPending(true)
      try {
        const updated = await markOrdersDelivered(ids)
        applyUpdatedOrders(updated)
        await queryClient.invalidateQueries({ queryKey: ['demo-orders'] })
        notify.success(
          `${updated.length} commande${updated.length > 1 ? 's' : ''} mise${updated.length > 1 ? 's' : ''} à jour`,
          { description: 'Les commandes sélectionnées sont marquées livrées.' },
        )
        clearSelection()
      } catch {
        notify.error('Impossible de mettre à jour la sélection')
      } finally {
        setBulkPending(false)
      }
    },
    [applyUpdatedOrders, queryClient],
  )

  const handleBulkCancel = useCallback(
    async (ids: string[], clearSelection: () => void) => {
      if (ids.length === 0) {
        return
      }

      setBulkPending(true)
      try {
        const updated = await cancelOrders(ids)
        applyUpdatedOrders(updated)
        await queryClient.invalidateQueries({ queryKey: ['demo-orders'] })
        notify.success(
          `${updated.length} commande${updated.length > 1 ? 's' : ''} annulée${updated.length > 1 ? 's' : ''}`,
          { description: 'Les commandes sélectionnées ont été annulées.' },
        )
        clearSelection()
      } catch {
        notify.error('Impossible d’annuler la sélection')
      } finally {
        setBulkPending(false)
      }
    },
    [applyUpdatedOrders, queryClient],
  )

  const handleCreate = useCallback(
    async (input: NewOrderInput) => {
      try {
        const order = await createOrderRecord(input)
        setClientOrders((current) => [order, ...current])
        setPagination((current) => ({ ...current, pageIndex: 0 }))
        await queryClient.invalidateQueries({ queryKey: ['demo-orders'] })
        notify.success('Commande créée', {
          description: `${order.reference} a été ajoutée à la liste.`,
        })
        setCreateOpen(false)
      } catch {
        notify.error('Impossible de créer la commande', {
          description: 'Veuillez réessayer dans un instant.',
        })
        throw new Error('create-order-failed')
      }
    },
    [queryClient],
  )

  const handleRefresh = useCallback(() => {
    if (mode === 'server') {
      void serverQuery.refetch()
      return
    }

    setClientRefreshing(true)
    window.setTimeout(() => {
      setClientRefreshing(false)
      if (simulateError) {
        notify.error('Actualisation impossible', {
          description: 'Le service est momentanément indisponible.',
        })
        return
      }

      notify.success('Données actualisées', {
        description: 'La liste des commandes est à jour.',
      })
    }, 700)
  }, [mode, serverQuery, simulateError])

  function changeMode(nextMode: DemoMode) {
    if (nextMode === mode) {
      return
    }

    setMode(nextMode)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  function toggleLargeVolume(checked: boolean) {
    setLargeVolume(checked)
    setClientOrders(checked ? [...largeOrders] : [...orders])
    setVirtualize(checked ? true : virtualize)
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
      pageSize: checked ? 100 : 10,
    }))
  }

  const clientData =
    emptyData || simulateError ? [] : clientOrders
  const serverRows = serverQuery.isError
    ? []
    : (serverQuery.data?.rows ?? [])

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Tableaux de données"
        description="Un DataTable premium, générique et performant : tri multi-colonnes, filtres, sélection, actions groupées, export, pagination client ou serveur et expérience mobile dédiée."
      />

      <Card>
        <CardHeader>
          <CardTitle>Scénarios de démonstration</CardTitle>
          <CardDescription>
            Testez les modes de données, les états de l’interface et les
            comportements responsive directement sur le tableau ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Source de données</span>
              <div className="inline-flex rounded-lg border bg-muted/30 p-0.5">
                <Button
                  variant={mode === 'client' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => changeMode('client')}
                  aria-pressed={mode === 'client'}
                >
                  Client
                </Button>
                <Button
                  variant={mode === 'server' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => changeMode('server')}
                  aria-pressed={mode === 'server'}
                >
                  Serveur
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Affichage mobile</span>
              <div className="inline-flex rounded-lg border bg-muted/30 p-0.5">
                {(['auto', 'table', 'cards'] as const).map((value) => (
                  <Button
                    key={value}
                    variant={responsiveMode === value ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setResponsiveMode(value)}
                    aria-pressed={responsiveMode === value}
                    className="capitalize"
                  >
                    {value === 'auto'
                      ? 'Auto'
                      : value === 'table'
                        ? 'Tableau'
                        : 'Cartes'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="scenario-error"
                checked={simulateError}
                onCheckedChange={(checked) =>
                  setSimulateError(checked === true)
                }
              />
              <Label
                htmlFor="scenario-error"
                className="cursor-pointer text-sm font-normal"
              >
                Simuler une erreur API
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="scenario-empty"
                checked={emptyData}
                onCheckedChange={(checked) => setEmptyData(checked === true)}
              />
              <Label
                htmlFor="scenario-empty"
                className="cursor-pointer text-sm font-normal"
              >
                Jeu de données vide
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="scenario-large"
                checked={largeVolume}
                disabled={mode === 'server'}
                onCheckedChange={(checked) =>
                  toggleLargeVolume(checked === true)
                }
              />
              <Label
                htmlFor="scenario-large"
                className="cursor-pointer text-sm font-normal data-[disabled=true]:opacity-50"
              >
                Grand volume (1 500 lignes)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="scenario-virtual"
                checked={virtualize}
                disabled={mode === 'server'}
                onCheckedChange={(checked) => setVirtualize(checked === true)}
              />
              <Label
                htmlFor="scenario-virtual"
                className="cursor-pointer text-sm font-normal"
              >
                Virtualisation
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="scenario-readonly"
                checked={readOnly}
                onCheckedChange={(checked) => setReadOnly(checked === true)}
              />
              <Label
                htmlFor="scenario-readonly"
                className="cursor-pointer text-sm font-normal"
              >
                Mode lecture seule
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        key={mode}
        columns={orderColumns}
        data={mode === 'server' ? serverRows : clientData}
        title="Commandes"
        description="Suivez et gérez les commandes clients. Cliquez sur une ligne pour ouvrir sa fiche détaillée."
        totalCount={
          mode === 'server'
            ? (serverQuery.data?.total ?? 0)
            : clientData.length
        }
        loading={mode === 'server' && serverQuery.isLoading}
        refreshing={
          mode === 'server'
            ? serverQuery.isFetching && !serverQuery.isLoading
            : clientRefreshing
        }
        error={
          simulateError
            ? new Error('Le service de commandes est indisponible.')
            : mode === 'server' && serverQuery.isError
              ? serverQuery.error
              : null
        }
        onRetry={() => {
          if (mode === 'server') {
            void serverQuery.refetch()
          }
        }}
        onRefresh={handleRefresh}
        onAdd={readOnly ? undefined : () => setCreateOpen(true)}
        addLabel="Nouvelle commande"
        mode={mode}
        pageCount={mode === 'server' ? serverQuery.data?.pageCount : undefined}
        rowCount={mode === 'server' ? serverQuery.data?.total : undefined}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        searchPlaceholder="Rechercher une commande, un client…"
        enableRowSelection={!readOnly}
        enableColumnPinning
        enableGrouping={mode === 'client'}
        enableVirtualization={virtualize}
        responsiveMode={responsiveMode}
        rowHeight={48}
        stickyHeader
        persistenceKey="demo-orders-table"
        exportFileName="commandes"
        getRowId={(row) => row.id}
        getRowCanSelect={(row) => !row.original.disabled}
        isRowDisabled={(row) => Boolean(row.original.disabled)}
        rowActions={rowActions}
        bulkActions={
          readOnly
            ? undefined
            : ({ selectedRowIds, clearSelection }) => (
                <>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={bulkPending}
                    onClick={() => {
                      void handleBulkDeliver(selectedRowIds, clearSelection)
                    }}
                  >
                    <CheckCheckIcon aria-hidden="true" />
                    Marquer livrées
                  </Button>
                  <Button
                    size="xs"
                    variant="destructive"
                    disabled={bulkPending}
                    onClick={() => {
                      void handleBulkCancel(selectedRowIds, clearSelection)
                    }}
                  >
                    <BanIcon aria-hidden="true" />
                    Annuler
                  </Button>
                </>
              )
        }
        onRowClick={openDetail}
        renderSubComponent={(row) => (
          <OrderInlineDetails order={row.original} />
        )}
        emptyState={{
          icon: PackageOpenIcon,
          title: 'Aucune commande',
          description:
            'Les commandes créées apparaîtront ici avec leur statut et leur montant.',
          action: readOnly ? undefined : (
            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              Ajouter une commande
            </Button>
          ),
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Utilisation</CardTitle>
          <CardDescription>
            Le composant est entièrement typé et configurable. Les colonnes
            déclarent leurs filtres et priorités d’affichage mobile via leur
            méta-donnée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={usage} />
        </CardContent>
      </Card>

      <CreateOrderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <OrderDetailsSheet
        order={detailOrder}
        onOpenChange={(open) => {
          if (!open) {
            setDetailOrder(null)
          }
        }}
        onDeliver={markDelivered}
        onCancel={cancelOrder}
      />
    </div>
  )
}
