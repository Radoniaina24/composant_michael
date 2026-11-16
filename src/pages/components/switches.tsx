import { useState } from 'react'
import { z } from 'zod'
import { ActionButton } from '@/components/action-button'
import { ComponentDocs } from '@/components/component-docs'
import { PageHeader } from '@/components/page-header'
import { SwitchField } from '@/components/switch-field'
import switchFieldSource from '@/components/switch-field.tsx?raw'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

const twoFactorSchema = z.literal(true, {
  error:
    'La double authentification est requise pour sécuriser votre compte.',
})

const usage = `import { useState } from 'react'
import { SwitchField } from '@/components/switch-field'

export function Exemple() {
  const [enabled, setEnabled] = useState(true)

  return (
    <SwitchField
      id="notifications"
      label="Notifications par e-mail"
      description="Résumé hebdomadaire et alertes importantes."
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  )
}`

const preferences = [
  {
    id: 'switch-email',
    label: 'Notifications par e-mail',
    description: 'Résumé hebdomadaire et alertes importantes.',
  },
  {
    id: 'switch-push',
    label: 'Notifications push',
    description: 'Alertes en temps réel sur vos appareils.',
  },
  {
    id: 'switch-product',
    label: 'Nouveautés produit',
    description: 'Annonces de fonctionnalités et conseils d’utilisation.',
  },
] as const

export default function SwitchesPage() {
  const [channels, setChannels] = useState<Record<string, boolean>>({
    'switch-email': true,
    'switch-push': false,
    'switch-product': false,
  })
  const [twoFactor, setTwoFactor] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = twoFactorSchema.safeParse(twoFactor)

    if (!result.success) {
      setError(result.error.issues[0].message)
      setConfirmed(false)
      return
    }

    setError(null)
    setConfirmed(true)
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Interrupteurs"
        description="Le composant SwitchField, accessible, réutilisable et adapté à tous les écrans."
      />

      <Card>
        <CardHeader>
          <CardTitle>États</CardTitle>
          <CardDescription>
            Désactivé, activé et désactivé avec un état bloqué.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex items-center gap-2">
            <Switch id="switch-unchecked" />
            <Label htmlFor="switch-unchecked">Désactivé</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="switch-checked" defaultChecked />
            <Label htmlFor="switch-checked">Activé</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="switch-disabled" disabled />
            <Label htmlFor="switch-disabled" className="opacity-50">
              Désactivé
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="switch-disabled-checked" defaultChecked disabled />
            <Label htmlFor="switch-disabled-checked" className="opacity-50">
              Activé bloqué
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>SwitchField</CardTitle>
          <CardDescription>
            Libellé, description et zone tactile : le clic sur le texte active
            aussi l’interrupteur.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {preferences.map((preference) => (
            <SwitchField
              key={preference.id}
              id={preference.id}
              label={preference.label}
              description={preference.description}
              checked={channels[preference.id]}
              onCheckedChange={(checked) =>
                setChannels((current) => ({
                  ...current,
                  [preference.id]: checked,
                }))
              }
            />
          ))}
          <Separator />
          <SwitchField
            id="switch-disabled-field"
            label="Recommandations personnalisées"
            description="Indisponible avec votre offre actuelle."
            disabled
          />
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Validation</CardTitle>
          <CardDescription>
            État d’erreur accessible, validé avec Zod.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-4">
            <SwitchField
              id="two-factor"
              label="Double authentification"
              description="Un code de vérification sera demandé à chaque connexion."
              checked={twoFactor}
              error={error ?? undefined}
              onCheckedChange={(checked) => {
                setTwoFactor(checked)
                setError(null)
                setConfirmed(false)
              }}
            />
            {confirmed && (
              <p className="text-sm text-muted-foreground">
                Double authentification activée, votre compte est mieux protégé.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <ActionButton type="submit" fullWidth="mobile">
              Enregistrer
            </ActionButton>
          </CardFooter>
        </form>
      </Card>

      <ComponentDocs usage={usage} source={switchFieldSource} />
    </div>
  )
}
