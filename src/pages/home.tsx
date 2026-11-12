import { useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
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

const newsletterSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
})

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubscribed(false)

    const result = newsletterSchema.safeParse({ email })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setError(null)
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div className="grid gap-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          Bienvenue sur composant27
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          React + Vite + TypeScript, TailwindCSS, shadcn/ui, React Router et Zod.
        </p>
        <Button render={<Link to="/composants/boutons" />}>
          Découvrir les composants
        </Button>
      </section>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Newsletter</CardTitle>
          <CardDescription>
            Saisissez votre e-mail, validé avec Zod.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError(null)
                setSubscribed(false)
              }}
              aria-invalid={error !== null}
              aria-describedby={error ? 'email-error' : undefined}
            />
            {error && (
              <p id="email-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {subscribed && (
              <p className="text-sm text-muted-foreground">
                Merci, votre inscription est confirmée.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit">S’inscrire</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
