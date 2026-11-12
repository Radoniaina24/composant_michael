import { useState } from 'react'
import { ArrowRightIcon, PlusIcon, SendIcon, Trash2Icon } from 'lucide-react'
import { ActionButton } from '@/components/action-button'
import actionButtonSource from '@/components/action-button.tsx?raw'
import { ComponentDocs } from '@/components/component-docs'
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

const usage = `import { useState } from 'react'
import { ArrowRightIcon, PlusIcon } from 'lucide-react'
import { ActionButton } from '@/components/action-button'

export function Exemple() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-wrap gap-3">
      <ActionButton
        leftIcon={PlusIcon}
        onClick={() => setCount((value) => value + 1)}
      >
        Cliquer ({count})
      </ActionButton>
      <ActionButton variant="outline" rightIcon={ArrowRightIcon}>
        Continuer
      </ActionButton>
      <ActionButton loading>Enregistrement…</ActionButton>
    </div>
  )
}`

export default function ButtonsPage() {
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  function simulateLoading() {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Boutons"
        description="Le composant ActionButton, réutilisable et adapté à tous les écrans."
      />

      <Card>
        <CardHeader>
          <CardTitle>ActionButton</CardTitle>
          <CardDescription>
            Icônes, état de chargement, largeur responsive et zones tactiles
            agrandies sur mobile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-wrap gap-3">
            <ActionButton leftIcon={PlusIcon}>Nouveau</ActionButton>
            <ActionButton variant="outline" rightIcon={ArrowRightIcon}>
              Continuer
            </ActionButton>
            <ActionButton
              variant="destructive"
              leftIcon={Trash2Icon}
              onClick={simulateLoading}
              loading={loading}
            >
              {loading ? 'Suppression…' : 'Supprimer'}
            </ActionButton>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Largeur responsive</p>
            <p className="text-sm text-muted-foreground">
              Pleine largeur sur mobile, largeur automatique à partir de
              l’écran SM.
            </p>
            <ActionButton fullWidth="mobile" leftIcon={SendIcon}>
              Envoyer le formulaire
            </ActionButton>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton loading>Enregistrement…</ActionButton>
            <ActionButton loading variant="outline">
              Chargement…
            </ActionButton>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Déclencher une action</CardTitle>
          <CardDescription>
            Le bouton conserve le comportement natif : onClick, submit, lien et
            actions asynchrones avec l’état loading.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <ActionButton onClick={() => setCount((value) => value + 1)}>
            Incrémenter
          </ActionButton>
          <span className="text-sm text-muted-foreground">
            Clics : {count}
          </span>
          <ActionButton
            variant="outline"
            disabled={count === 0}
            onClick={() => setCount(0)}
          >
            Réinitialiser
          </ActionButton>
        </CardContent>
      </Card>

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

      <ComponentDocs usage={usage} source={actionButtonSource} />
    </div>
  )
}
