import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OPEN_COMMAND_PALETTE_EVENT } from '@/lib/command-palette'
import { cn } from '@/lib/utils'

type CommandPaletteLauncherProps = {
  className?: string
  compact?: boolean
}

export function CommandPaletteLauncher({
  className,
  compact = false,
}: CommandPaletteLauncherProps) {
  return (
    <Button
      variant="outline"
      size={compact ? 'sm' : 'default'}
      className={cn(
        compact && 'size-8 p-0 sm:h-8 sm:w-auto sm:justify-start sm:px-2.5',
        className,
      )}
      aria-label={compact ? 'Ouvrir la palette de commandes' : undefined}
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))}
    >
      <SearchIcon aria-hidden="true" />
      <span className={compact ? 'sr-only sm:not-sr-only' : undefined}>
        Recherche rapide
      </span>
      <kbd className={cn(
        'ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground',
        compact && 'hidden lg:inline-flex',
      )}>
        ⌘ K / Ctrl K
      </kbd>
    </Button>
  )
}
