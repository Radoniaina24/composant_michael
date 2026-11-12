import { LoaderCircleIcon, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ActionButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean
  fullWidth?: 'always' | 'mobile'
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
}

export function ActionButton({
  children,
  className,
  loading = false,
  fullWidth,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      className={cn(
        'max-sm:min-h-10',
        fullWidth === 'always' && 'w-full',
        fullWidth === 'mobile' && 'w-full sm:w-auto',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
      ) : LeftIcon ? (
        <LeftIcon aria-hidden="true" />
      ) : null}
      {children}
      {RightIcon && !loading ? (
        <RightIcon aria-hidden="true" />
      ) : null}
    </Button>
  )
}
