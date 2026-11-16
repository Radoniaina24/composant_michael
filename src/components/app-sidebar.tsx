import {
  BoxesIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  HouseIcon,
  InfoIcon,
  LogOutIcon,
  SettingsIcon,
  SparklesIcon,
  UserRoundIcon,
  type LucideIcon,
} from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { user } from '@/lib/user'

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
}

const navigation: NavItem[] = [
  { title: 'Accueil', url: '/', icon: HouseIcon },
  { title: 'À propos', url: '/a-propos', icon: InfoIcon },
  { title: 'Paramètres', url: '/parametres', icon: SettingsIcon },
]

const componentsNavigation = [
  { title: 'Boutons', url: '/composants/boutons' },
  { title: 'Boutons radio', url: '/composants/boutons-radio' },
  { title: 'Cartes', url: '/composants/cartes' },
  { title: 'Cases à cocher', url: '/composants/cases-a-cocher' },
  { title: 'Champs de saisie', url: '/composants/champs-de-saisie' },
  { title: 'Listes déroulantes', url: '/composants/listes-deroulantes' },
  { title: 'Formulaires', url: '/composants/formulaires' },
  { title: 'Interrupteurs', url: '/composants/interrupteurs' },
  { title: 'Menus déroulants', url: '/composants/menus-deroulants' },
  { title: 'Palette de commandes', url: '/composants/palette-de-commandes' },
  { title: 'Tableaux de données', url: '/composants/tableaux-de-donnees' },
  { title: 'Notifications', url: '/composants/notifications' },
]

export function AppSidebar() {
  const { pathname } = useLocation()

  function isActive(url: string) {
    return url === '/'
      ? pathname === '/'
      : pathname === url || pathname.startsWith(`${url}/`)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SparklesIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">composant27</span>
                <span className="truncate text-xs text-muted-foreground">
                  Espace de travail
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    render={<NavLink to={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Composants</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                defaultOpen={pathname.startsWith('/composants')}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton
                        tooltip="Composants"
                        isActive={pathname.startsWith('/composants')}
                        className="group/composants"
                      />
                    }
                  >
                    <BoxesIcon />
                    <span>Composants</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[panel-open]/composants:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {componentsNavigation.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            isActive={pathname === item.url}
                            render={<NavLink to={item.url} />}
                          >
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={8}
                className="w-56"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/parametres">
                      <UserRoundIcon />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/parametres">
                      <SettingsIcon />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOutIcon />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
