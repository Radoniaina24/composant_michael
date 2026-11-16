import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  BookOpenIcon,
  CheckIcon,
  CommandIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LoaderCircleIcon,
  MoonIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  ToggleRightIcon,
  UserRoundIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { notify } from '@/lib/notifications/notify'
import { router } from '@/router'
import { OPEN_COMMAND_PALETTE_EVENT } from '@/lib/command-palette'
import {
  APP_THEME_CHANGE_EVENT,
  getAppTheme,
  setAppTheme,
} from '@/lib/theme'

type CommandPage = 'root' | 'clients'

const navigationCommands = [
  { label: 'Tableau de bord', description: 'Accueil de l’espace de travail', to: '/', icon: HomeIcon, keywords: 'dashboard accueil' },
  { label: 'À propos', description: 'Informations sur l’application', to: '/a-propos', icon: BookOpenIcon, keywords: 'about' },
  { label: 'Boutons', description: 'Démonstration des boutons', to: '/composants/boutons', icon: CommandIcon, keywords: 'composants ui' },
  { label: 'Boutons radio', description: 'Groupes de sélection', to: '/composants/boutons-radio', icon: CheckIcon, keywords: 'radio' },
  { label: 'Cartes', description: 'Composants de cartes', to: '/composants/cartes', icon: CreditCardIcon, keywords: 'cards' },
  { label: 'Cases à cocher', description: 'Champs à cocher', to: '/composants/cases-a-cocher', icon: CheckIcon, keywords: 'checkbox' },
  { label: 'Champs de saisie', description: 'Démonstration des champs', to: '/composants/champs-de-saisie', icon: FileTextIcon, keywords: 'inputs' },
  { label: 'Listes déroulantes', description: 'Sélecteurs et listes', to: '/composants/listes-deroulantes', icon: ArrowRightIcon, keywords: 'select' },
  { label: 'Formulaires', description: 'Formulaires et validation', to: '/composants/formulaires', icon: FileTextIcon, keywords: 'forms zod' },
  { label: 'Interrupteurs', description: 'Boutons bascule accessibles', to: '/composants/interrupteurs', icon: ToggleRightIcon, keywords: 'switch toggle' },
  { label: 'Tableaux de données', description: 'Commandes et tableaux', to: '/composants/tableaux-de-donnees', icon: PackageIcon, keywords: 'data table orders' },
  { label: 'Menus déroulants', description: 'Menus accessibles Radix UI', to: '/composants/menus-deroulants', icon: ArrowRightIcon, keywords: 'dropdown menu' },
  { label: 'Notifications', description: 'Messages et alertes', to: '/composants/notifications', icon: BellIcon, keywords: 'toast sonner' },
  { label: 'Paramètres', description: 'Profil et apparence', to: '/parametres', icon: SettingsIcon, keywords: 'settings preferences' },
] as const

const clientSearchDemo = [
  { id: 'client-1', name: 'Camille Bernard', company: 'Atelier Lumière' },
  { id: 'client-2', name: 'Louis Moreau', company: 'Moreau & Fils' },
  { id: 'client-3', name: 'Léa Dubois', company: 'Studio Marée' },
  { id: 'client-4', name: 'Hugo Laurent', company: 'Laurent Logistique' },
]

const quickActions = [
  { label: 'Créer un client', icon: UsersIcon },
  { label: 'Créer une facture', icon: FileTextIcon },
  { label: 'Créer un devis', icon: FileTextIcon },
  { label: 'Ajouter un fournisseur', icon: PackageIcon },
  { label: 'Créer un utilisateur', icon: UserRoundIcon },
  { label: 'Créer une tâche', icon: PlusIcon },
]

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest('input, textarea, select, [role="textbox"], [contenteditable="true"]') !== null)
  )
}

function matchesAllWords(value: string, search: string) {
  const normalizedValue = value.toLocaleLowerCase('fr')
  return search
    .trim()
    .toLocaleLowerCase('fr')
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => normalizedValue.includes(word))
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<CommandPage>('root')
  const [search, setSearch] = useState('')
  const [clientLoading, setClientLoading] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(getAppTheme)

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLocaleLowerCase() === 'k' &&
        !event.altKey &&
        !event.shiftKey &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault()
        setOpen(true)
      }
    }

    function handleOpenRequest() {
      setOpen(true)
    }

    window.addEventListener('keydown', handleShortcut)
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpenRequest)
    return () => {
      window.removeEventListener('keydown', handleShortcut)
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpenRequest)
    }
  }, [])

  useEffect(() => {
    function syncTheme(event: Event) {
      const themeEvent = event as CustomEvent<'light' | 'dark'>
      setTheme(themeEvent.detail)
    }

    window.addEventListener(APP_THEME_CHANGE_EVENT, syncTheme)
    return () => window.removeEventListener(APP_THEME_CHANGE_EVENT, syncTheme)
  }, [])

  useEffect(() => {
    if (!open || page !== 'clients') {
      return
    }

    const timer = window.setTimeout(() => setClientLoading(false), 250)
    return () => window.clearTimeout(timer)
  }, [open, page, search])

  const filteredClients = useMemo(() => {
    return clientSearchDemo.filter((client) =>
      matchesAllWords(`${client.name} ${client.company}`, search),
    )
  }, [search])

  function closePalette() {
    setOpen(false)
    setSearch('')
    setPage('root')
  }

  function navigate(to: string) {
    void router.navigate(to)
    closePalette()
  }

  function returnToCommands() {
    setPage('root')
    setSearch('')
  }

  function runDemoAction(label: string) {
    notify.info(`${label} — démonstration`, {
      description: 'Aucune donnée n’a été créée : le module métier n’est pas connecté.',
    })
    closePalette()
  }

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setAppTheme(nextTheme)
    setTheme(nextTheme)
    notify.info(`Thème ${nextTheme === 'dark' ? 'sombre' : 'clair'} activé`)
    closePalette()
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && page !== 'root' && search === '') {
      event.preventDefault()
      returnToCommands()
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(nextOpen) => {
      if (nextOpen) {
        setOpen(true)
      } else {
        closePalette()
      }
    }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          aria-describedby="command-palette-description"
          className="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl shadow-slate-950/20 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 sm:top-[18vh] motion-reduce:animate-none"
        >
          <DialogPrimitive.Title className="sr-only">
            Palette de commandes
          </DialogPrimitive.Title>
          <DialogPrimitive.Description id="command-palette-description" className="sr-only">
            Recherchez une page, une action ou un client de démonstration.
          </DialogPrimitive.Description>

          <Command
            shouldFilter={page === 'root'}
            filter={(value, query) => (matchesAllWords(value, query) ? 1 : 0)}
            className="rounded-none bg-transparent p-0"
          >
            <div className="flex items-center border-b px-4">
              {page === 'root' ? (
                <SearchIcon className="mr-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mr-2 shrink-0"
                  onClick={returnToCommands}
                  aria-label="Retour aux commandes"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
              )}
              <CommandPrimitive.Input
                autoFocus
                value={search}
                onValueChange={(value) => {
                  setSearch(value)
                  if (page === 'clients') {
                    setClientLoading(true)
                  }
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  page === 'root'
                    ? 'Rechercher une page, une action ou un élément...'
                    : 'Rechercher un client...'
                }
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                aria-label={page === 'root' ? 'Rechercher une commande' : 'Rechercher un client démo'}
              />
              {search && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="ml-2 shrink-0 text-muted-foreground"
                  onClick={() => setSearch('')}
                  aria-label="Effacer la recherche"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              )}
            </div>

            <CommandList className="max-h-[min(60vh,26rem)] p-2">
              {page === 'root' ? (
                <>
                  <CommandEmpty className="py-10 text-muted-foreground">
                    Aucun résultat. Essayez un autre terme.
                  </CommandEmpty>

                  <CommandGroup heading="Navigation">
                    {navigationCommands.map((command) => {
                      const Icon = command.icon
                      return (
                        <CommandItem
                          key={command.to}
                          value={`${command.label} ${command.description} ${command.keywords}`}
                          onSelect={() => navigate(command.to)}
                          className="min-h-10 gap-3 px-3"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{command.label}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {command.description}
                            </span>
                          </span>
                          <ArrowRightIcon className="size-4 shrink-0 opacity-0 group-data-selected/command-item:opacity-100" aria-hidden="true" />
                        </CommandItem>
                      )
                    })}
                    <CommandItem
                      value="clients rechercher clients démonstration"
                      onSelect={() => {
                        setClientLoading(true)
                        setPage('clients')
                        setSearch('')
                      }}
                      className="min-h-10 gap-3 px-3"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                        <UsersIcon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">Rechercher un client</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          Données fictives de démonstration
                        </span>
                      </span>
                      <span className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        Démo
                      </span>
                    </CommandItem>
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Actions rapides · démo">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <CommandItem
                          key={action.label}
                          value={`${action.label} action rapide`}
                          onSelect={() => runDemoAction(action.label)}
                          className="min-h-9 gap-3 px-3"
                        >
                          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                          <span className="flex-1">{action.label}</span>
                          <span className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            Démo
                          </span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Préférences">
                    <CommandItem
                      value="changer thème clair sombre appearance"
                      onSelect={toggleTheme}
                      className="min-h-9 gap-3 px-3"
                    >
                      {theme === 'dark' ? (
                        <SunIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <MoonIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                      )}
                      <span className="flex-1">
                        Passer au thème {theme === 'dark' ? 'clair' : 'sombre'}
                      </span>
                      <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        ↵
                      </kbd>
                    </CommandItem>
                    <CommandItem
                      value="profil paramètres preferences"
                      onSelect={() => navigate('/parametres')}
                      className="min-h-9 gap-3 px-3"
                    >
                      <UserRoundIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                      <span className="flex-1">Mon profil et préférences</span>
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : (
                <>
                  {clientLoading ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground" role="status">
                      <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
                      Recherche locale…
                    </div>
                  ) : search.trim().toLocaleLowerCase('fr') === 'erreur' ? (
                    <div className="flex flex-col items-center gap-3 py-8 text-center" role="alert">
                      <p className="text-sm text-destructive">
                        Erreur de recherche simulée.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                        Réessayer
                      </Button>
                    </div>
                  ) : (
                    <>
                      {filteredClients.length === 0 && (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                          Aucun client ne correspond à cette recherche.
                        </div>
                      )}
                      <CommandGroup heading="Clients · données fictives">
                        {filteredClients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={`${client.name} ${client.company}`}
                            onSelect={() => {
                              notify.info(client.name, {
                                description: `${client.company} · résultat fictif de démonstration.`,
                              })
                              closePalette()
                            }}
                            className="min-h-11 gap-3 px-3"
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                              {client.name.split(' ').map((part) => part[0]).join('')}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium">{client.name}</span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {client.company}
                              </span>
                            </span>
                            <ArrowRightIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </>
              )}
            </CommandList>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span><kbd className="rounded border bg-background px-1">↑</kbd> <kbd className="rounded border bg-background px-1">↓</kbd> naviguer</span>
                <span><kbd className="rounded border bg-background px-1">↵</kbd> sélectionner</span>
                {page !== 'root' && (
                  <span><kbd className="rounded border bg-background px-1">⌫</kbd> retour</span>
                )}
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={closePalette}
              >
                Fermer <kbd className="rounded border bg-background px-1">Esc</kbd>
              </button>
            </div>
          </Command>
          <DialogPrimitive.Close
            className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Fermer la palette"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
