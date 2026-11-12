import { useState } from 'react'
import { MailIcon, SearchIcon, UserRoundIcon } from 'lucide-react'
import { ComponentDocs } from '@/components/component-docs'
import { InputField } from '@/components/input-field'
import inputFieldSource from '@/components/input-field.tsx?raw'
import { PageHeader } from '@/components/page-header'
import { TextareaField } from '@/components/textarea-field'
import textareaFieldSource from '@/components/textarea-field.tsx?raw'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const inputUsage = `import { MailIcon } from 'lucide-react'
import { InputField } from '@/components/input-field'

export function Exemple() {
  return (
    <InputField
      id="email"
      label="E-mail"
      type="email"
      placeholder="vous@exemple.fr"
      startIcon={MailIcon}
      description="Nous ne partagerons jamais votre adresse."
      error="Adresse e-mail invalide."
    />
  )
}`

const textareaUsage = `import { TextareaField } from '@/components/textarea-field'

export function Exemple() {
  return (
    <TextareaField
      id="message"
      label="Message"
      rows={4}
      description="200 caractères maximum."
      error="Le message est trop court."
    />
  )
}`

export default function InputsPage() {
  const [message, setMessage] = useState('')

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Champs de saisie"
        description="Les composants InputField et TextareaField, accessibles, réutilisables et adaptés à tous les écrans."
      />

      <Card>
        <CardHeader>
          <CardTitle>InputField</CardTitle>
          <CardDescription>
            Libellé, description, icônes, état d’erreur et champ désactivé.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="name"
            label="Nom complet"
            placeholder="Ada Lovelace"
            startIcon={UserRoundIcon}
            description="Tel qu’il apparaîtra sur votre profil."
          />
          <InputField
            id="email"
            label="E-mail"
            type="email"
            defaultValue="pas-un-email"
            startIcon={MailIcon}
            error="Adresse e-mail invalide."
          />
          <InputField
            id="search"
            label="Recherche"
            placeholder="Rechercher un composant…"
            startIcon={SearchIcon}
          />
          <InputField
            id="username"
            label="Identifiant"
            defaultValue="raitech"
            disabled
            description="Non modifiable."
          />
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>TextareaField</CardTitle>
          <CardDescription>
            Zone de texte avec compteur de caractères.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TextareaField
            id="message"
            label="Message"
            rows={4}
            maxLength={200}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            description={`${message.length}/200 caractères.`}
            placeholder="Écrivez votre message…"
          />
        </CardContent>
      </Card>

      <ComponentDocs
        usage={inputUsage}
        source={inputFieldSource}
        sourceTitle="Code du composant InputField"
      />

      <ComponentDocs
        usage={textareaUsage}
        source={textareaFieldSource}
        sourceTitle="Code du composant TextareaField"
      />
    </div>
  )
}
