import { useState } from 'react'
import {
  BellRingIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  LayersIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
  Undo2Icon,
  XIcon,
} from 'lucide-react'
import { ActionButton } from '@/components/action-button'
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
import {
  notificationDurations,
  notify,
} from '@/lib/notifications/notify'
import notifySource from '@/lib/notifications/notify.ts?raw'
import sonnerSource from '@/components/ui/sonner.tsx?raw'

const typeDemos = [
  {
    type: 'success',
    label: 'Succès',
    icon: CircleCheckIcon,
    className:
      'w-full justify-start border-success/30 bg-success-surface/60 hover:bg-success-surface [&_svg]:text-success',
    trigger: () =>
      notify.success('Enregistrement effectué', {
        description: 'Les modifications ont été sauvegardées avec succès.',
      }),
  },
  {
    type: 'error',
    label: 'Erreur',
    icon: CircleXIcon,
    className:
      'w-full justify-start border-destructive/30 bg-destructive-surface/60 hover:bg-destructive-surface [&_svg]:text-destructive',
    trigger: () =>
      notify.error('La synchronisation a échoué', {
        description: 'Vérifiez votre connexion puis réessayez.',
      }),
  },
  {
    type: 'warning',
    label: 'Avertissement',
    icon: TriangleAlertIcon,
    className:
      'w-full justify-start border-warning/30 bg-warning-surface/60 hover:bg-warning-surface [&_svg]:text-warning',
    trigger: () =>
      notify.warning('Stock faible', {
        description: 'Il reste moins de cinq unités pour cette référence.',
      }),
  },
  {
    type: 'info',
    label: 'Information',
    icon: InfoIcon,
    className:
      'w-full justify-start border-info/30 bg-info-surface/60 hover:bg-info-surface [&_svg]:text-info',
    trigger: () =>
      notify.info('Mise à jour disponible', {
        description: 'La nouvelle version sera déployée cette nuit.',
      }),
  },
] as const

const durationSummary = [
  `Succès ${notificationDurations.success / 1000} s`,
  `Information ${notificationDurations.info / 1000} s`,
  `Avertissement ${notificationDurations.warning / 1000} s`,
  `Erreur ${notificationDurations.error / 1000} s`,
  'Chargement persistant',
].join(' · ')

const notifyUsage = `import { notify } from '@/lib/notifications/notify'

notify.success('Enregistrement effectué', {
  description: 'Les modifications ont été sauvegardées.',
  action: {
    label: 'Annuler',
    onClick: restaurerLeDocument,
  },
})

notify.promise(creerLeCompte(donnees), {
  loading: 'Création du compte…',
  success: (compte) => \`Compte de \${compte.name} créé\`,
  error: 'Impossible de créer le compte',
  successDescription: 'L’invitation sera envoyée sous peu.',
})

notify.dismiss()`

const toasterUsage = `import { Toaster } from '@/components/ui/sonner'

export function Racine() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}`

function simulerCreationDeCompte(shouldFail = false) {
  return new Promise<{ name: string }>((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Le service est momentanément indisponible.'))
        return
      }

      resolve({ name: 'Camille Martin' })
    }, 2200)
  })
}

export default function NotificationsPage() {
  const [loadingId, setLoadingId] = useState<string | number | null>(null)

  function startLoading() {
    if (loadingId !== null) {
      notify.dismiss(loadingId)
    }

    const id = notify.loading('Enregistrement en cours…', {
      description: 'La notification reste affichée jusqu’à la fin du traitement.',
      onDismiss: () => setLoadingId(null),
    })

    setLoadingId(id)
  }

  function finishLoading() {
    if (loadingId === null) {
      return
    }

    notify.success('Enregistrement terminé', {
      id: loadingId,
      description: 'Le chargement a été remplacé par une confirmation.',
    })

    setLoadingId(null)
  }

  function showAccountCreation(shouldFail: boolean) {
    notify.promise(simulerCreationDeCompte(shouldFail), {
      loading: 'Création du compte en cours…',
      success: (data) => `Compte de ${data.name} créé`,
      error: 'Impossible de créer le compte',
      description: 'Nous préparons l’espace de travail.',
      successDescription: 'L’invitation sera envoyée dans quelques instants.',
      errorDescription: (error) =>
        error instanceof Error
          ? error.message
          : 'Une erreur inattendue est survenue.',
    })
  }

  function undoDeletion() {
    notify.success('Document supprimé', {
      description: 'La suppression sera définitive dans quelques secondes.',
      duration: 8000,
      action: {
        label: 'Annuler',
        onClick: () => {
          notify.info('Suppression annulée', {
            description: 'Le document a été restauré.',
          })
        },
      },
    })
  }

  function showPersistentNotification() {
    notify.info('Notification persistante', {
      description: 'Survolez la notification pour révéler le bouton de fermeture.',
      duration: Number.POSITIVE_INFINITY,
    })
  }

  function showMultipleNotifications() {
    const notifications = [
      () =>
        notify.success('Paiement confirmé', {
          description: 'La facture #2026-042 est acquittée.',
        }),
      () =>
        notify.info('Nouveau commentaire', {
          description: 'Léa a commenté le projet Atlas.',
        }),
      () =>
        notify.warning('Stock faible', {
          description: 'Il reste trois unités de la référence A-104.',
        }),
      () =>
        notify.error('Échec de synchronisation', {
          description: 'La connexion au serveur a été interrompue.',
        }),
    ]

    notifications.forEach((showNotification, index) => {
      window.setTimeout(showNotification, index * 160)
    })
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Notifications"
        description="Un système de toasts premium fondé sur Sonner : types sémantiques, actions, promesses, empilement maîtrisé et accessibilité native."
      />

      <Card>
        <CardHeader>
          <CardTitle>Types de notifications</CardTitle>
          <CardDescription>
            Chaque type applique une teinte discrète, une icône dédiée et une
            durée adaptée à l’attention requise.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {typeDemos.map(({ type, label, icon, className, trigger }) => (
            <ActionButton
              key={type}
              variant="outline"
              leftIcon={icon}
              className={className}
              onClick={trigger}
            >
              {label}
            </ActionButton>
          ))}
        </CardContent>
        <CardFooter className="flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Durées par défaut : {durationSummary}.</span>
          <span>
            Déduplication sur 1,5 s, étendue à 5 s pour les erreurs.
          </span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chargement et promesse</CardTitle>
          <CardDescription>
            Un état de chargement persistant peut être remplacé par un résultat,
            et une promesse ne confirme le succès qu’après sa résolution.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <ActionButton
            leftIcon={LoaderCircleIcon}
            className="w-full justify-start sm:w-auto"
            onClick={startLoading}
          >
            Démarrer un chargement
          </ActionButton>
          <ActionButton
            variant="outline"
            leftIcon={CircleCheckIcon}
            className="w-full justify-start sm:w-auto"
            disabled={loadingId === null}
            onClick={finishLoading}
          >
            Terminer le chargement
          </ActionButton>
          <ActionButton
            variant="outline"
            leftIcon={CircleCheckIcon}
            className="w-full justify-start sm:w-auto"
            onClick={() => showAccountCreation(false)}
          >
            Promesse réussie
          </ActionButton>
          <ActionButton
            variant="outline"
            leftIcon={CircleXIcon}
            className="w-full justify-start sm:w-auto"
            onClick={() => showAccountCreation(true)}
          >
            Promesse échouée
          </ActionButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions et empilement</CardTitle>
          <CardDescription>
            Actions contextuelles, notification persistante, affichage simultané
            limité et fermeture groupée.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <ActionButton
            leftIcon={Undo2Icon}
            fullWidth="mobile"
            onClick={undoDeletion}
          >
            Action avec annulation
          </ActionButton>
          <ActionButton
            variant="outline"
            leftIcon={BellRingIcon}
            fullWidth="mobile"
            onClick={showPersistentNotification}
          >
            Notification persistante
          </ActionButton>
          <ActionButton
            variant="outline"
            leftIcon={LayersIcon}
            fullWidth="mobile"
            onClick={showMultipleNotifications}
          >
            Empiler quatre notifications
          </ActionButton>
          <ActionButton
            variant="outline"
            leftIcon={XIcon}
            fullWidth="mobile"
            onClick={() => notify.dismiss()}
          >
            Tout fermer
          </ActionButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibilité et adaptation</CardTitle>
          <CardDescription>
            Le comportement reste confortable au clavier, sur mobile et avec les
            préférences système.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">Lecteurs d’écran</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Les changements sont annoncés via les régions live de Sonner, avec
              des libellés explicites pour fermer les notifications.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">Navigation clavier</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Les actions et le bouton de fermeture restent atteignables au
              clavier, avec un anneau de focus visible.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">Mouvement réduit</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Les animations respectent les préférences du système et les marges
              tiennent compte des zones sûres des appareils mobiles.
            </p>
          </div>
        </CardContent>
      </Card>

      <ComponentDocs
        usage={notifyUsage}
        source={notifySource}
        usageTitle="API de notifications"
        sourceTitle="Code de l’API centralisée"
        sourceDescription="Durées centralisées, déduplication, actions et promesses typées."
      />

      <ComponentDocs
        usage={toasterUsage}
        source={sonnerSource}
        usageTitle="Intégration globale"
        sourceTitle="Composant Toaster"
        sourceDescription="Monté une seule fois à la racine, il suit le thème clair ou sombre de l’application."
      />
    </div>
  )
}
