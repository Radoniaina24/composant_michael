import { Switch } from 'radix-ui'
import { cn } from '@/lib/utils'

function SwitchRoot({ className, ...props }: React.ComponentProps<typeof Switch.Root>) {
  return (
    <Switch.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-[state=unchecked]:bg-input/80',
        className
      )}
      {...props}
    >
      <Switch.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-background shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
      />
    </Switch.Root>
  )
}

export { SwitchRoot as Switch }
