import { useState } from 'react'
import { z } from 'zod'
import { ActionButton } from '@/components/action-button'
import { ComponentDocs } from '@/components/component-docs'
import { MultiSelectField } from '@/components/multi-select-field'
import multiSelectFieldSource from '@/components/multi-select-field.tsx?raw'
import { PageHeader } from '@/components/page-header'
import {
  SelectField,
  type SelectOption,
} from '@/components/select-field'
import selectFieldSource from '@/components/select-field.tsx?raw'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const plans: SelectOption[] = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'entreprise', label: 'Entreprise', disabled: true },
]

const sectors: SelectOption[] = [
  { value: 'tech', label: 'Technologie' },
  { value: 'finance', label: 'Finance' },
  { value: 'sante', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'industrie', label: 'Industrie' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'autre', label: 'Autre' },
]

const skills: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'node', label: 'Node.js' },
  { value: 'design', label: 'Design' },
  { value: 'accessibilite', label: 'Accessibilité' },
  { value: 'graphql', label: 'GraphQL', disabled: true },
]

const sectorSchema = z.string().min(1, {
  error: 'Choisissez un secteur d’activité.',
})

const usage = `import { useState } from 'react'
import { SelectField } from '@/components/select-field'

const options = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
]

export function Exemple() {
  const [plan, setPlan] = useState('pro')

  return (
    <SelectField
      id="plan"
      label="Formule"
      description="Vous pourrez changer à tout moment."
      options={options}
      value={plan}
      onValueChange={(value) => setPlan(value ?? '')}
      placeholder="Choisir une formule"
      searchPlaceholder="Rechercher une formule…"
      emptyMessage="Aucune formule trouvée."
    />
  )
}`

const multiUsage = `import { useState } from 'react'
import { MultiSelectField } from '@/components/multi-select-field'

const options = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
]

export function Exemple() {
  const [skills, setSkills] = useState(['react'])

  return (
    <MultiSelectField
      id="skills"
      label="Compétences"
      description="Sélectionnez une ou plusieurs compétences."
      options={options}
      values={skills}
      onValuesChange={setSkills}
      placeholder="Choisir des compétences"
      searchPlaceholder="Rechercher une compétence…"
      emptyMessage="Aucune compétence trouvée."
    />
  )
}`

export default function SelectFieldPage() {
  const [plan, setPlan] = useState('pro')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'react',
    'typescript',
    'accessibilite',
    'node',
  ])
  const [sector, setSector] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const selectedPlan = plans.find((option) => option.value === plan)
  const selectedSkillLabels = selectedSkills
    .map((value) => skills.find((option) => option.value === value)?.label)
    .filter(Boolean)
    .join(', ')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = sectorSchema.safeParse(sector)

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
        title="Listes déroulantes"
        description="Les composants SelectField et MultiSelectField, avec recherche instantanée, accessibles et adaptés à tous les écrans."
      />

      <Card>
        <CardHeader>
          <CardTitle>SelectField</CardTitle>
          <CardDescription>
            Recherche instantanée (cmdk), libellé, description, option
            désactivée et champ désactivé.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="plan"
            label="Formule"
            description="Vous pourrez changer de formule à tout moment."
            options={plans}
            value={plan}
            onValueChange={(value) => setPlan(value ?? '')}
          />
          <SelectField
            id="country"
            label="Pays"
            defaultValue="fr"
            disabled
            description="Déterminé automatiquement."
            options={[
              { value: 'fr', label: 'France' },
              { value: 'be', label: 'Belgique' },
              { value: 'ch', label: 'Suisse' },
            ]}
          />
          <p className="text-sm text-muted-foreground sm:col-span-2">
            Formule sélectionnée : {selectedPlan?.label}
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>MultiSelectField</CardTitle>
          <CardDescription>
            Sélection multiple avec badges, suppression directe et compteur au-delà
            de trois éléments.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <MultiSelectField
            id="skills"
            label="Compétences"
            description="Sélectionnez une ou plusieurs compétences."
            options={skills}
            values={selectedSkills}
            onValuesChange={setSelectedSkills}
            placeholder="Choisir des compétences"
            searchPlaceholder="Rechercher une compétence…"
            emptyMessage="Aucune compétence trouvée."
          />
          <p className="text-sm text-muted-foreground">
            {selectedSkills.length === 0
              ? 'Aucune compétence sélectionnée.'
              : `${selectedSkills.length} compétence${
                  selectedSkills.length > 1 ? 's' : ''
                } sélectionnée${
                  selectedSkills.length > 1 ? 's' : ''
                } : ${selectedSkillLabels}`}
          </p>
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
            <SelectField
              id="sector"
              label="Secteur d’activité"
              placeholder="Choisir un secteur"
              options={sectors}
              value={sector}
              error={error ?? undefined}
              onValueChange={(value) => {
                setSector(value ?? '')
                setError(null)
                setConfirmed(false)
              }}
            />
            {confirmed && (
              <p className="text-sm text-muted-foreground">
                Secteur enregistré : {sector}.
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

      <ComponentDocs usage={usage} source={selectFieldSource} />

      <ComponentDocs
        usage={multiUsage}
        usageTitle="Utilisation · MultiSelectField"
        source={multiSelectFieldSource}
        sourceTitle="Code du composant MultiSelectField"
      />
    </div>
  )
}
