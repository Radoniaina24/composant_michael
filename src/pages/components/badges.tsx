import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from 'lucide-react'
import { ComponentDocs } from '@/components/component-docs'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import badgeSource from '@/components/ui/badge.tsx?raw'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const variants = [
  'default',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'outline',
  'muted',
  'ghost',
  'link',
] as const

const orders = [
  { label: 'Commande #1024', status: 'Payée', variant: 'success' },
  { label: 'Commande #1025', status: 'En attente', variant: 'warning' },
  { label: 'Commande #1026', status: 'Annulée', variant: 'destructive' },
] as const

const usage = `import { Badge } from '@/components/ui/badge'

export function Exemple() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Par défaut</Badge>
      <Badge variant="success" dot>
        Actif
      </Badge>
      <Badge variant="warning" size="lg" dot>
        En attente
      </Badge>
      <Badge variant="destructive">
        <XIcon />
        Échoué
      </Badge>
      <Badge variant="outline">Brouillon</Badge>
    </div>
  )
}`

export default function BadgesPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Badges"
        description="Des indicateurs compacts pour les statuts, catégories et compteurs."
      />

      <Card>
        <CardHeader>
          <CardTitle>Variantes</CardTitle>
          <CardDescription>
            Chaque variante s’appuie sur les couleurs sémantiques du thème.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {variants.map((variant) => (
            <Badge key={variant} variant={variant} className="capitalize">
              {variant}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tailles</CardTitle>
          <CardDescription>
            Trois hauteurs pour s’adapter aux tableaux, formulaires et en-têtes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Default</Badge>
          <Badge size="lg">Large</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Indicateur et icônes</CardTitle>
          <CardDescription>
            Le point reprend la couleur du texte et les icônes sont
            automatiquement dimensionnées.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" dot>
              Actif
            </Badge>
            <Badge variant="warning" dot>
              En attente
            </Badge>
            <Badge variant="info" dot>
              En cours
            </Badge>
            <Badge variant="destructive" dot>
              Inactif
            </Badge>
            <Badge variant="muted" dot>
              Archivé
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">
              <CheckIcon />
              Validé
            </Badge>
            <Badge variant="warning">
              <AlertTriangleIcon />
              À vérifier
            </Badge>
            <Badge variant="info">
              <InfoIcon />
              Information
            </Badge>
            <Badge variant="destructive">
              <XIcon />
              Rejeté
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cas d’usage</CardTitle>
          <CardDescription>
            Statuts de commande, priorités, rôles et compteurs de navigation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {orders.map((order) => (
            <div
              key={order.label}
              className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2 text-sm"
            >
              <span>{order.label}</span>
              <Badge variant={order.variant} dot>
                {order.status}
              </Badge>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2 text-sm">
            <span>Rôle</span>
            <Badge variant="secondary">Administrateur</Badge>
          </div>
        </CardContent>
      </Card>

      <ComponentDocs
        usage={usage}
        source={badgeSource}
        sourceTitle="Code du composant Badge"
        sourceDescription="Badge autonome basé sur class-variance-authority et Tailwind CSS, sans dépendance à une librairie de composants."
      />
    </div>
  )
}
