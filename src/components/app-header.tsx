import { Fragment, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const pageTitles: Record<string, string> = {
  '/': 'Accueil',
  '/a-propos': 'À propos',
  '/parametres': 'Paramètres',
  '/composants/boutons': 'Boutons',
  '/composants/boutons-radio': 'Boutons radio',
  '/composants/cartes': 'Cartes',
  '/composants/cases-a-cocher': 'Cases à cocher',
  '/composants/champs-de-saisie': 'Champs de saisie',
  '/composants/listes-deroulantes': 'Listes déroulantes',
  '/composants/formulaires': 'Formulaires',
}

type Crumb = {
  label: string
  to?: string
}

function getCrumbs(pathname: string): Crumb[] {
  if (pathname === '/') {
    return [{ label: 'Accueil' }]
  }

  if (pathname.startsWith('/composants')) {
    return [
      { label: 'Accueil', to: '/' },
      { label: 'Composants', to: '/composants' },
      { label: pageTitles[pathname] ?? 'Composants' },
    ]
  }

  return [
    { label: 'Accueil', to: '/' },
    { label: pageTitles[pathname] ?? 'Page introuvable' },
  ]
}

export function AppHeader() {
  const { pathname } = useLocation()
  const crumbs = getCrumbs(pathname)
  const title = crumbs[crumbs.length - 1].label

  useEffect(() => {
    document.title = `${title} · composant27`
  }, [title])

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-vertical:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1

            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && (
                  <BreadcrumbSeparator className="hidden sm:block" />
                )}
                <BreadcrumbItem
                  className={
                    index < crumbs.length - 1
                      ? 'hidden sm:inline-flex'
                      : undefined
                  }
                >
                  {isLast || !crumb.to ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={crumb.to} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1">
        <ModeToggle />
      </div>
    </header>
  )
}
