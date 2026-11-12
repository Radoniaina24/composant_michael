import { useState } from 'react'
import {
  ArchiveIcon,
  BellIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  FilePenLineIcon,
  FolderIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Settings2Icon,
  Share2Icon,
  Trash2Icon,
  UserRoundIcon,
} from 'lucide-react'
import { ActionButton } from '@/components/action-button'
import { ActionDropdown, FilterDropdown, NavigationDropdown, TableRowDropdown, UserDropdown } from '@/components/shared/dropdowns'
import { PageHeader } from '@/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { notify } from '@/lib/notifications/notify'

function DemoCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function announce(action: string) {
  notify.info(action, { description: 'Interaction de démonstration.' })
}

export default function DropdownMenusPage() {
  const [includeArchived, setIncludeArchived] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [view, setView] = useState('comfortable')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['open'])

  const basicActions = [
    { label: 'Modifier', icon: PencilIcon, onSelect: () => announce('Modification ouverte') },
    { label: 'Dupliquer', icon: CopyIcon, onSelect: () => announce('Élément dupliqué') },
  ]

  const iconActions = [
    { label: 'Télécharger', icon: DownloadIcon, description: 'Exporter une copie', onSelect: () => announce('Téléchargement lancé') },
    { label: 'Partager', icon: Share2Icon, badge: 'Nouveau', onSelect: () => announce('Lien de partage copié') },
    { label: 'Renommer', icon: FilePenLineIcon, disabled: true, onSelect: () => announce('Renommage') },
  ]

  const separatedActions = [
    { label: 'Copier le lien', icon: LinkIcon, onSelect: () => announce('Lien copié') },
    { label: 'Déplacer vers…', icon: FolderIcon, onSelect: () => announce('Déplacement') },
    { label: 'Archiver', icon: ArchiveIcon, separatorBefore: true, onSelect: () => announce('Élément archivé') },
  ]

  const shortcutActions = [
    { label: 'Nouveau document', icon: PlusIcon, shortcut: '⌘ N', onSelect: () => announce('Nouveau document') },
    { label: 'Rechercher', icon: Settings2Icon, shortcut: '⌘ K', onSelect: () => announce('Recherche ouverte') },
  ]

  const destructiveActions = [
    { label: 'Supprimer définitivement', icon: Trash2Icon, destructive: true, description: 'Cette action est irréversible', onSelect: () => notify.warning('Suppression simulée') },
  ]

  const rowActions = [
    { label: 'Voir le détail', icon: UserRoundIcon, onSelect: () => announce('Détail de la commande') },
    { label: 'Modifier', icon: PencilIcon, onSelect: () => announce('Commande à modifier') },
    { label: 'Supprimer', icon: Trash2Icon, destructive: true, separatorBefore: true, onSelect: () => notify.warning('Suppression de commande simulée') },
  ]

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Menus déroulants"
        description="Menus accessibles et réutilisables, construits avec Radix UI et habillés selon le design system shadcn du projet."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DemoCard
          title="Menu simple"
          description="Actions courantes avec fermeture automatique et navigation clavier."
        >
          <ActionDropdown
            trigger={<Button variant="outline">Ouvrir le menu</Button>}
            actions={basicActions}
          />
        </DemoCard>

        <DemoCard
          title="Avec icônes et descriptions"
          description="Les détails restent lisibles sans alourdir les libellés."
        >
          <ActionDropdown
            trigger={<Button variant="outline">Actions du fichier</Button>}
            actions={iconActions}
            label="Rapport trimestriel"
            description="Mis à jour il y a 2 minutes"
          />
        </DemoCard>

        <DemoCard
          title="Groupes et séparateurs"
          description="Les actions liées sont regroupées visuellement."
        >
          <ActionDropdown
            trigger={<Button variant="outline">Organiser</Button>}
            actions={separatedActions}
          />
        </DemoCard>

        <DemoCard
          title="Sous-menus"
          description="Les sous-menus sont positionnés et gérés nativement par Radix."
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Options d’affichage</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Document</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => announce('Document renommé')}>
                <PencilIcon aria-hidden="true" />
                Renommer
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderIcon aria-hidden="true" />
                  Déplacer vers
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  <DropdownMenuItem onSelect={() => announce('Déplacé dans Projets')}>
                    Projets
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => announce('Déplacé dans Archives')}>
                    Archives
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </DemoCard>

        <DemoCard
          title="Cases à cocher"
          description="Plusieurs options peuvent être activées sans quitter le menu."
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings2Icon aria-hidden="true" />
                Préférences
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              >
                Alertes par e-mail
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={includeArchived}
                onCheckedChange={setIncludeArchived}
              >
                Inclure les éléments archivés
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DemoCard>

        <DemoCard
          title="Groupe radio"
          description="Sélection unique et contrôlée de la densité d’affichage."
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Densité : {view === 'comfortable' ? 'Confortable' : 'Compacte'}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Densité des lignes</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={view} onValueChange={setView}>
                <DropdownMenuRadioItem value="comfortable">
                  Confortable
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="compact">
                  Compacte
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </DemoCard>

        <DemoCard
          title="Raccourcis clavier"
          description="Les raccourcis sont présentés comme des repères visuels."
        >
          <ActionDropdown
            trigger={<Button variant="outline">Commandes rapides</Button>}
            actions={shortcutActions}
          />
        </DemoCard>

        <DemoCard
          title="Action destructive"
          description="La suppression se distingue clairement et reste accessible."
        >
          <ActionDropdown
            trigger={<Button variant="outline">Actions sensibles</Button>}
            actions={destructiveActions}
          />
        </DemoCard>

        <DemoCard
          title="Menu utilisateur"
          description="Profil, préférences et déconnexion avec état désactivé."
        >
          <UserDropdown
            name="Camille Bernard"
            email="camille@atelier-lumiere.fr"
            initials="CB"
            onProfile={() => announce('Profil ouvert')}
            onSignOut={() => announce('Déconnexion simulée')}
          />
        </DemoCard>

        <DemoCard
          title="Actions de ligne"
          description="Menu compact adapté aux actions d’une ligne de DataTable."
        >
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">CMD-2026-1042</p>
              <p className="text-xs text-muted-foreground">Commande client</p>
            </div>
            <TableRowDropdown actions={rowActions} />
          </div>
        </DemoCard>

        <DemoCard
          title="Navigation"
          description="Les liens conservent le routage React Router."
        >
          <NavigationDropdown
            trigger={<Button variant="outline">Aller à…</Button>}
            label="Espace de travail"
            items={[
              { label: 'Accueil', to: '/', icon: UserRoundIcon },
              { label: 'Tableaux de données', to: '/composants/tableaux-de-donnees', icon: FolderIcon },
              { label: 'Paramètres', to: '/parametres', icon: Settings2Icon },
            ]}
          />
        </DemoCard>

        <DemoCard
          title="Filtrer par statut"
          description="Sélection multiple contrôlée, avec le nombre de filtres actifs."
        >
          <FilterDropdown
            options={[
              { label: 'Ouvert', value: 'open' },
              { label: 'En cours', value: 'progress' },
              { label: 'Terminé', value: 'done' },
              { label: 'Archivé', value: 'archived' },
            ]}
            selected={selectedStatuses}
            onSelectedChange={setSelectedStatuses}
          />
        </DemoCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comportements natifs</CardTitle>
          <CardDescription>
            Cliquez sur une option pour vérifier que les interactions fonctionnent.
            Les menus se ferment avec Échap ou un clic extérieur et peuvent être
            parcourus au clavier.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <ActionButton
            variant="secondary"
            onClick={() => announce('Les composants utilisent Radix UI Dropdown Menu')}
          >
            <CheckIcon aria-hidden="true" />
            Radix UI actif
          </ActionButton>
          <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
            <BellIcon className="size-4" aria-hidden="true" />
            Alertes e-mail {emailAlerts ? 'activées' : 'désactivées'}
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
            <MoreHorizontalIcon className="size-4" aria-hidden="true" />
            Statuts sélectionnés : {selectedStatuses.length}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
