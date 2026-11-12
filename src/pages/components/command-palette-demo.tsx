import { CommandIcon, KeyboardIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import { CommandPaletteLauncher } from '@/components/shared/command-palette-launcher'
import { PageHeader } from '@/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CommandPaletteDemoPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Palette de commandes"
        description="Accédez rapidement aux pages et aux actions disponibles, depuis n’importe où dans l’application."
      />

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex size-11 items-center justify-center rounded-xl border bg-background text-primary">
            <SparklesIcon className="size-5" aria-hidden="true" />
          </div>
          <CardTitle>Tout à portée de clavier</CardTitle>
          <CardDescription>
            Recherchez les pages existantes, lancez les actions de démonstration
            et retrouvez des clients fictifs sans quitter votre contexte.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                <KeyboardIcon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">Ouvrir rapidement</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Utilisez <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd> ou{' '}
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">⌘ K</kbd>.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                <SearchIcon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">Recherche instantanée</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Les termes recherchés correspondent aux noms et descriptions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                <CommandIcon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">Navigation au clavier</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Flèches pour naviguer, Entrée pour choisir, Échap pour fermer.
                </p>
              </div>
            </div>
          </div>
          <CommandPaletteLauncher />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>À propos des données</CardTitle>
          <CardDescription>
            La palette ne crée pas de routes ni d’API métier qui n’existent pas.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          Les pages de navigation pointent vers les routes présentes dans
          l’application. La recherche de clients et les actions de création sont
          identifiées comme démonstrations et utilisent uniquement des données
          fictives locales. Elles pourront être reliées aux API lorsque les
          modules métier seront disponibles.
        </CardContent>
      </Card>
    </div>
  )
}
