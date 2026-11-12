import { ArrowUpRightIcon, UsersIcon } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const stats = [
  { label: 'Membres', value: '248', change: '+12 %' },
  { label: 'Projets', value: '12', change: '+2' },
  { label: 'Tâches', value: '32', change: '−4' },
]

export default function CardsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Cartes"
        description="Des conteneurs pour structurer les informations."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-muted-foreground">
                {stat.change} ce mois-ci
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Projet Alpha</CardTitle>
              <CardDescription>
                Refonte de l’espace client et du design system.
              </CardDescription>
            </div>
            <Badge>En cours</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <UsersIcon className="size-4" />
              8 membres
            </span>
            <span>Échéance : 30 juin</span>
          </div>
          <Separator />
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Avancement</span>
              <span className="text-muted-foreground">64 %</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[64%] rounded-full bg-primary" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            Mis à jour il y a 2 h
          </span>
          <Button variant="outline" size="sm">
            Ouvrir
            <ArrowUpRightIcon />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
