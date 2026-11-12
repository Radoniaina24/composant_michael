import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CodeBlock } from '@/components/code-block'

type ComponentDocsProps = {
  usage: string
  source: string
  usageTitle?: string
  sourceTitle?: string
  sourceDescription?: string
}

export function ComponentDocs({
  usage,
  source,
  usageTitle = 'Utilisation',
  sourceTitle = 'Code du composant',
  sourceDescription = 'Le composant est personnalisable via ses props et Tailwind.',
}: ComponentDocsProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{usageTitle}</CardTitle>
          <CardDescription>
            Import et exemple de mise en œuvre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={usage} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{sourceTitle}</CardTitle>
          <CardDescription>{sourceDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium underline-offset-4 select-none hover:underline">
              Afficher le code source
            </summary>
            <div className="mt-3">
              <CodeBlock code={source} />
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
