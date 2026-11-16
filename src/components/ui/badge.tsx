import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "border-destructive/20 bg-destructive-surface text-destructive dark:border-destructive/30 [a]:hover:bg-destructive/15",
        success:
          "border-success/20 bg-success-surface text-success dark:border-success/30 [a]:hover:bg-success/15",
        warning:
          "border-warning/25 bg-warning-surface text-warning dark:border-warning/30 [a]:hover:bg-warning/15",
        info: "border-info/20 bg-info-surface text-info dark:border-info/30 [a]:hover:bg-info/15",
        outline:
          "border-border bg-transparent text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        muted:
          "border-transparent bg-muted text-muted-foreground [a]:hover:bg-muted/80",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        link: "border-transparent bg-transparent p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-4 gap-1 px-1.5 text-[0.625rem] leading-none",
        md: "h-5 gap-1 px-2 text-xs leading-none",
        lg: "h-6 gap-1.5 px-2.5 text-sm leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean
  }

function Badge({
  className,
  variant,
  size,
  dot = false,
  children,
  ref,
  ...props
}: BadgeProps) {
  return (
    <span
      ref={ref}
      data-slot="badge"
      data-variant={variant ?? "default"}
      data-size={size ?? "md"}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          data-slot="badge-dot"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      ) : null}
      {children}
    </span>
  )
}

export { Badge, badgeVariants, type BadgeProps }
