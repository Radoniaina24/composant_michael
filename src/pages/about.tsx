import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AboutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>À propos</CardTitle>
        <CardDescription>La stack du projet composant27.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>React + Vite + TypeScript</li>
          <li>TailwindCSS v4</li>
          <li>shadcn/ui</li>
          <li>React Router</li>
          <li>Zod</li>
        </ul>
      </CardContent>
    </Card>
  )
}
