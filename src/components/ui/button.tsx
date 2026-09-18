import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition outline-none select-none focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-subtle-foreground/40 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border-border text-muted-foreground hover:border-border-strong hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-muted text-foreground hover:bg-border aria-expanded:bg-muted aria-expanded:text-foreground",
        ghost:
          "font-medium text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "border-subtle-foreground text-foreground hover:bg-muted focus-visible:border-destructive/40 focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2",
        xs: "gap-1 rounded-lg px-2 py-1 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "gap-1 rounded-lg px-3 py-1.5 text-xs [&_svg:not([class*='size-'])]:size-4",
        lg: "px-4 py-2.5 [&_svg:not([class*='size-'])]:size-5",
        icon: "rounded-lg p-2 [&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs": "rounded-lg p-1 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "rounded-lg p-1.5 [&_svg:not([class*='size-'])]:size-4.5",
        "icon-lg": "rounded-lg p-2.5 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
