import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CodeBlockProps = {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({
  code,
  language = 'tsx',
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-muted/40',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b bg-muted/60 px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          {language}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={copyCode}
          aria-label={copied ? 'Code copié' : 'Copier le code'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copié' : 'Copier'}
        </Button>
      </div>
      <pre className="max-h-[28rem] overflow-auto p-3 text-xs leading-relaxed sm:p-4 sm:text-sm">
        <code className="font-mono">{code.trim()}</code>
      </pre>
    </div>
  )
}
