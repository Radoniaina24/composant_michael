export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type OrderChannel = 'web' | 'store' | 'phone' | 'partner'

export type OrderPriority = 'low' | 'normal' | 'high'

export type OrderStatusTone =
  | 'warning'
  | 'info'
  | 'success'
  | 'destructive'
  | 'neutral'

export type OrderFilterOption<T extends string> = {
  value: T
  label: string
  tone: OrderStatusTone
}

export const orderStatusOptions: OrderFilterOption<OrderStatus>[] = [
  { value: 'pending', label: 'En attente', tone: 'warning' },
  { value: 'processing', label: 'En préparation', tone: 'info' },
  { value: 'completed', label: 'Livrée', tone: 'success' },
  { value: 'cancelled', label: 'Annulée', tone: 'destructive' },
  { value: 'refunded', label: 'Remboursée', tone: 'neutral' },
]

export const orderChannelOptions: OrderFilterOption<OrderChannel>[] = [
  { value: 'web', label: 'Boutique en ligne', tone: 'info' },
  { value: 'store', label: 'Boutique', tone: 'success' },
  { value: 'phone', label: 'Téléphone', tone: 'warning' },
  { value: 'partner', label: 'Partenaire', tone: 'neutral' },
]

export const orderPriorityOptions: OrderFilterOption<OrderPriority>[] = [
  { value: 'low', label: 'Basse', tone: 'neutral' },
  { value: 'normal', label: 'Normale', tone: 'info' },
  { value: 'high', label: 'Haute', tone: 'warning' },
]

const statusMap = new Map(
  orderStatusOptions.map((option) => [option.value, option]),
)
const channelMap = new Map(
  orderChannelOptions.map((option) => [option.value, option]),
)
const priorityMap = new Map(
  orderPriorityOptions.map((option) => [option.value, option]),
)

export function getOrderStatusMeta(status: OrderStatus) {
  return statusMap.get(status) ?? orderStatusOptions[0]!
}

export function getOrderChannelMeta(channel: OrderChannel) {
  return channelMap.get(channel) ?? orderChannelOptions[0]!
}

export function getOrderPriorityMeta(priority: OrderPriority) {
  return priorityMap.get(priority) ?? orderPriorityOptions[1]!
}

export type OrderCustomer = {
  name: string
  email: string
}

export type Order = {
  id: string
  reference: string
  customer: OrderCustomer
  company: string
  status: OrderStatus
  channel: OrderChannel
  priority: OrderPriority
  amount: number
  items: number
  createdAt: string
  dueDate: string
  owner: string
  disabled?: boolean
}

type CustomerSeed = {
  name: string
  company: string
  email: string
}

const customers: CustomerSeed[] = [
  { name: 'Camille Bernard', company: 'Atelier Lumière', email: 'camille@atelier-lumiere.fr' },
  { name: 'Louis Moreau', company: 'Moreau & Fils', email: 'louis@moreau-fils.fr' },
  { name: 'Léa Dubois', company: 'Studio Marée', email: 'lea@studio-maree.fr' },
  { name: 'Hugo Laurent', company: 'Laurent Logistique', email: 'hugo@laurent-logistique.fr' },
  { name: 'Chloé Simon', company: 'Maison Simon', email: 'chloe@maison-simon.fr' },
  { name: 'Nathan Michel', company: 'Michel Industries', email: 'nathan@michel-industries.fr' },
  { name: 'Manon Lefèvre', company: 'Lefèvre Conseil', email: 'manon@lefevre-conseil.fr' },
  { name: 'Théo Leroy', company: 'Leroy Digital', email: 'theo@leroy-digital.fr' },
  { name: 'Inès Roux', company: 'Roux Éditions', email: 'ines@roux-editions.fr' },
  { name: 'Gabriel David', company: 'David Énergies', email: 'gabriel@david-energies.fr' },
  { name: 'Jade Bertrand', company: 'Bertrand Santé', email: 'jade@bertrand-sante.fr' },
  { name: 'Raphaël Morel', company: 'Morel Matériaux', email: 'raphael@morel-materiaux.fr' },
  { name: 'Louise Fournier', company: 'Fournier Design', email: 'louise@fournier-design.fr' },
  { name: 'Arthur Girard', company: 'Girard Distribution', email: 'arthur@girard-distribution.fr' },
  { name: 'Alice Bonnet', company: 'Bonnet Immobilier', email: 'alice@bonnet-immobilier.fr' },
  { name: 'Jules Dupont', company: 'Dupont Technologies', email: 'jules@dupont-technologies.fr' },
  { name: 'Rose Lambert', company: 'Lambert Traiteur', email: 'rose@lambert-traiteur.fr' },
  { name: 'Adam Fontaine', company: 'Fontaine Automobile', email: 'adam@fontaine-automobile.fr' },
  { name: 'Anna Rousseau', company: 'Rousseau Graphisme', email: 'anna@rousseau-graphisme.fr' },
  { name: 'Paul Vincent', company: 'Vincent Agro', email: 'paul@vincent-agro.fr' },
  { name: 'Sarah Muller', company: 'Muller Finance', email: 'sarah@muller-finance.fr' },
  { name: 'Victor Lefort', company: 'Lefort Bâtiment', email: 'victor@lefort-batiment.fr' },
  { name: 'Lina Garnier', company: 'Garnier Textile', email: 'lina@garnier-textile.fr' },
  { name: 'Oscar Chevalier', company: 'Chevalier Médias', email: 'oscar@chevalier-medias.fr' },
]

const owners = [
  'Élodie Martin',
  'Yanis Robert',
  'Clara Richard',
  'Nolan Petit',
  'Ambre Durand',
  'Maël Garcia',
]

const channels: OrderChannel[] = ['web', 'store', 'phone', 'partner']
const statuses: OrderStatus[] = [
  'pending',
  'processing',
  'completed',
  'completed',
  'cancelled',
  'refunded',
]
const priorities: OrderPriority[] = ['low', 'normal', 'normal', 'high']

function createRandom(seed: number) {
  let state = seed % 2147483647
  if (state <= 0) {
    state += 2147483646
  }

  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function pad(value: number, length: number) {
  return String(value).padStart(length, '0')
}

export function generateOrders(count: number, seed = 2026): Order[] {
  const random = createRandom(seed)
  const baseTime = Date.UTC(2026, 0, 2, 9, 0, 0)
  const day = 24 * 60 * 60 * 1000

  return Array.from({ length: count }).map((_, index) => {
    const customer = customers[index % customers.length]!
    const status = statuses[Math.floor(random() * statuses.length)]!
    const channel = channels[Math.floor(random() * channels.length)]!
    const priority = priorities[Math.floor(random() * priorities.length)]!
    const progress = count > 1 ? index / (count - 1) : 0
    const createdAt = new Date(
      baseTime + progress * day * 300 + random() * day,
    )
    const dueDate = new Date(
      createdAt.getTime() + (status === 'completed' ? 5 : 14) * day,
    )
    const amount = Math.round((39 + random() * 4200) * 100) / 100
    const items = 1 + Math.floor(random() * 12)
    const owner = owners[Math.floor(random() * owners.length)]!

    return {
      id: `order-${pad(index + 1, 4)}`,
      reference: `CMD-2026-${pad(1000 + index, 4)}`,
      customer: { name: customer.name, email: customer.email },
      company: customer.company,
      status,
      channel,
      priority,
      amount,
      items,
      createdAt: createdAt.toISOString(),
      dueDate: dueDate.toISOString(),
      owner,
      disabled: status === 'refunded' && index % 6 === 0,
    }
  })
}

export const orders = generateOrders(240, 20261112)

export const largeOrders = generateOrders(1500, 20260101)

export type NewOrderInput = {
  customerName: string
  company: string
  email?: string
  amount: number
  status?: OrderStatus
  channel?: OrderChannel
  priority?: OrderPriority
}

export function buildOrder(input: NewOrderInput, sequence: number): Order {
  const now = new Date()
  const email =
    input.email && input.email.trim() !== ''
      ? input.email.trim()
      : `${input.customerName.toLocaleLowerCase('fr').replaceAll(/\s+/g, '.')}@exemple.fr`

  return {
    id: `order-new-${sequence}`,
    reference: `CMD-2026-${pad(2000 + sequence, 4)}`,
    customer: { name: input.customerName, email },
    company: input.company,
    status: input.status ?? 'pending',
    channel: input.channel ?? 'web',
    priority: input.priority ?? 'normal',
    amount: input.amount,
    items: 1,
    createdAt: now.toISOString(),
    dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    owner: 'Élodie Martin',
  }
}
