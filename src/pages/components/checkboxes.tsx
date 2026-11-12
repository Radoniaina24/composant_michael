import { useState } from 'react'
import { z } from 'zod'
import { ActionButton } from '@/components/action-button'
import { CheckboxField } from '@/components/checkbox-field'
import checkboxFieldSource from '@/components/checkbox-field.tsx?raw'
import { ComponentDocs } from '@/components/component-docs'
import { PageHeader } from '@/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const termsSchema = z.literal(true, {
  error: 'Vous devez accepter les conditions pour continuer.',
})

const usage = `import { useState } from 'react'
import { CheckboxField } from '@/components/checkbox-field'

export function Exemple() {
  const [accepted, setAccepted] = useState(false)

  return (
    <CheckboxField
      id="terms"
      label="J’accepte les conditions"
      description="Vous pourrez modifier ce choix à tout moment."
      checked={accepted}
      onCheckedChange={setAccepted}
    />
  )
}`

const preferences = [
  {
    id: 'notify-email',
    label: 'Notifications par e-mail',
    description: 'Résumé hebdomadaire et alertes importantes.',
  },
  {
    id: 'notify-push',
    label: 'Notifications push',
    description: 'Alertes en temps réel sur vos appareils.',
  },
  {
    id: 'notify-sms',
    label: 'Notifications SMS',
    description: 'Uniquement pour les événements critiques.',
  },
] as const

export default function CheckboxesPage() {
  const [channels, setChannels] = useState<Record<string, boolean>>({
    'notify-email': true,
    'notify-push': false,
    'notify-sms': false,
  })
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = termsSchema.safeParse(accepted)

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
        title="Cases à cocher"
        description="Le composant CheckboxField, accessible, réutilisable et adapté à tous les écrans."
      />

      <Card>
        <CardHeader>
          <CardTitle>États</CardTitle>
          <CardDescription>
            Décoché, coché, indéterminé et désactivé.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-unchecked" />
            <Label htmlFor="checkbox-unchecked">Décoché</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-checked" defaultChecked />
            <Label htmlFor="checkbox-checked">Coché</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-indeterminate" indeterminate />
            <Label htmlFor="checkbox-indeterminate">Indéterminé</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-disabled" disabled />
            <Label htmlFor="checkbox-disabled" className="opacity-50">
              Désactivé
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-disabled-checked" defaultChecked disabled />
            <Label htmlFor="checkbox-disabled-checked" className="opacity-50">
              Désactivé coché
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>CheckboxField</CardTitle>
          <CardDescription>
            Libellé, description et zone tactile : le clic sur le texte active
            aussi la case.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {preferences.map((preference) => (
            <CheckboxField
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
          <CheckboxField
            id="preference-disabled"
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
            <CheckboxField
              id="terms"
              label="J’accepte les conditions d’utilisation"
              description="Vous pourrez modifier ce choix à tout moment."
              checked={accepted}
              error={error ?? undefined}
              onCheckedChange={(checked) => {
                setAccepted(checked)
                setError(null)
                setConfirmed(false)
              }}
            />
            {confirmed && (
              <p className="text-sm text-muted-foreground">
                Conditions acceptées, merci !
              </p>
            )}
          </CardContent>
          <CardFooter>
            <ActionButton type="submit" fullWidth="mobile">
              Continuer
            </ActionButton>
          </CardFooter>
        </form>
      </Card>

      <ComponentDocs usage={usage} source={checkboxFieldSource} />
    </div>
  )
}
