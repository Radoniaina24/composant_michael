import { useState } from 'react'
import { z } from 'zod'
import { ActionButton } from '@/components/action-button'
import { PageHeader } from '@/components/page-header'
import {
  RadioGroupField,
  type RadioOption,
} from '@/components/radio-group-field'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const plans: RadioOption[] = [
  {
    value: 'mensuel',
    label: 'Mensuel',
    description: '9 € par mois, sans engagement.',
  },
  {
    value: 'annuel',
    label: 'Annuel',
    description: '90 € par an, deux mois offerts.',
  },
  {
    value: 'entreprise',
    label: 'Entreprise',
    description: 'Sur devis, support dédié.',
    disabled: true,
  },
]

const contactOptions: RadioOption[] = [
  { value: 'email', label: 'E-mail' },
  { value: 'sms', label: 'SMS' },
  { value: 'telephone', label: 'Téléphone' },
]

const accountOptions: RadioOption[] = [
  {
    value: 'personnel',
    label: 'Compte personnel',
    description: 'Pour un usage individuel.',
  },
  {
    value: 'professionnel',
    label: 'Compte professionnel',
    description: 'Facturation et gestion d’équipe.',
  },
]

const accountSchema = z.string().min(1, {
  error: 'Choisissez un type de compte.',
})

export default function RadioGroupPage() {
  const [plan, setPlan] = useState('mensuel')
  const [contact, setContact] = useState('email')
  const [account, setAccount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const selectedPlan = plans.find((option) => option.value === plan)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = accountSchema.safeParse(account)

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
        title="Boutons radio"
        description="Le composant RadioGroupField, accessible, réutilisable et adapté à tous les écrans."
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Choix d’une formule</CardTitle>
          <CardDescription>
            Une seule option peut être sélectionnée par groupe.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <RadioGroupField
            id="plan"
            label="Formule d’abonnement"
            description="Vous pourrez changer de formule à tout moment."
            options={plans}
            value={plan}
            onValueChange={(value) => setPlan(value)}
          />
          <p className="text-sm text-muted-foreground">
            Formule sélectionnée : {selectedPlan?.label}
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Disposition responsive</CardTitle>
          <CardDescription>
            Empilée sur mobile, alignée horizontalement à partir de l’écran SM.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroupField
            id="contact"
            label="Moyen de contact préféré"
            options={contactOptions}
            value={contact}
            onValueChange={(value) => setContact(value)}
            className="gap-3 sm:auto-cols-max sm:grid-flow-col sm:gap-6"
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
            <RadioGroupField
              id="account"
              label="Type de compte"
              options={accountOptions}
              value={account}
              error={error ?? undefined}
              onValueChange={(value) => {
                setAccount(value)
                setError(null)
                setConfirmed(false)
              }}
            />
            {confirmed && (
              <p className="text-sm text-muted-foreground">
                Type de compte enregistré : {account}.
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
    </div>
  )
}
