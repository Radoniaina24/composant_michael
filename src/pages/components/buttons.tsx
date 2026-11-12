import { ArrowRightIcon, PlusIcon } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
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
  'outline',
  'ghost',
  'destructive',
  'link',
] as const

export default function ButtonsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Boutons"
        description="Les variantes et tailles du composant Button."
      />

      <Card>
        <CardHeader>
          <CardTitle>Variantes</CardTitle>
          <CardDescription>
            Utilisez la variante adaptée au niveau d’importance de l’action.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} className="capitalize">
              {variant}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tailles</CardTitle>
          <CardDescription>Du plus compact au plus large.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avec icônes</CardTitle>
          <CardDescription>
            Les icônes renforcent la lisibilité des actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>
            <PlusIcon />
            Nouveau
          </Button>
          <Button variant="outline">
            Continuer
            <ArrowRightIcon />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
