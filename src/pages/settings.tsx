import { ModeToggle } from '@/components/mode-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { user } from '@/lib/user'

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez votre profil et l’apparence de l’application.
        </p>
      </section>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
          <CardDescription>
            Choisissez le thème de l’interface. Votre préférence est
            enregistrée localement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Thème clair / sombre</p>
              <p className="text-sm text-muted-foreground">
                Basculez entre les thèmes clair et sombre.
              </p>
            </div>
            <ModeToggle />
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Barre latérale</p>
              <p className="text-sm text-muted-foreground">
                Réduisez ou affichez la sidebar.
              </p>
            </div>
            <kbd className="rounded border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
              Ctrl + B
            </kbd>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Les informations de votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
