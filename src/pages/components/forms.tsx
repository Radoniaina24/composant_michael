import { useState } from 'react'
import { SendIcon } from 'lucide-react'
import { z } from 'zod'
import { ActionButton } from '@/components/action-button'
import { PageHeader } from '@/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.email('Adresse e-mail invalide.'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères.'),
})

type ContactValues = z.infer<typeof contactSchema>
type FieldErrors = Partial<Record<keyof ContactValues, string>>

const initialValues: ContactValues = { name: '', email: '', message: '' }

export default function FormsPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)

  function setField(field: keyof ContactValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSent(false)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = contactSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string' && !fieldErrors[field as keyof ContactValues]) {
          fieldErrors[field as keyof ContactValues] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setValues(initialValues)
    setSent(true)
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Formulaires"
        description="Champs accessibles et validation avec Zod."
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>
            Tous les champs sont requis. Les erreurs s’affichent sous chaque
            champ.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={values.name}
                onChange={(event) => setField('name', event.target.value)}
                aria-invalid={errors.name !== undefined}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-email">E-mail</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="vous@exemple.fr"
                value={values.email}
                onChange={(event) => setField('email', event.target.value)}
                aria-invalid={errors.email !== undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={values.message}
                onChange={(event) => setField('message', event.target.value)}
                aria-invalid={errors.message !== undefined}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            {sent && (
              <p className="text-sm text-muted-foreground">
                Message envoyé, merci !
              </p>
            )}
          </CardContent>
          <CardFooter>
            <ActionButton type="submit" leftIcon={SendIcon} fullWidth="mobile">
              Envoyer
            </ActionButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
