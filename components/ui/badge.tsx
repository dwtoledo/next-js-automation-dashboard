import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { BADGE_COLORS } from "@/lib/constants"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: BADGE_COLORS.default,
        secondary: BADGE_COLORS.secondary,
        destructive: BADGE_COLORS.destructive,
        outline: BADGE_COLORS.outline,
        yellow: BADGE_COLORS.yellow,
        gray: BADGE_COLORS.gray,
        green: BADGE_COLORS.green,
        blue: BADGE_COLORS.blue,
        red: BADGE_COLORS.red,
        purple: BADGE_COLORS.purple,
        emerald: BADGE_COLORS.emerald,
        indigo: BADGE_COLORS.indigo,
        orange: BADGE_COLORS.orange,
        amber: BADGE_COLORS.amber,
        cyan: BADGE_COLORS.cyan,
        sky: BADGE_COLORS.sky,
        violet: BADGE_COLORS.violet,
        fuchsia: BADGE_COLORS.fuchsia,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
