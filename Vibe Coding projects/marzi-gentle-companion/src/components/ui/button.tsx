import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-glow rounded-xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl",
        outline:
          "border-2 border-primary/20 bg-transparent text-foreground hover:bg-primary/5 hover:border-primary/40 rounded-xl",
        secondary:
          "bg-secondary/15 text-secondary border border-secondary/20 hover:bg-secondary/25 rounded-xl",
        ghost: 
          "text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl",
        link: 
          "text-primary underline-offset-4 hover:underline",
        // Marzi-specific variants
        marzi: 
          "bg-primary text-primary-foreground rounded-full hover:shadow-glow",
        "marzi-secondary":
          "bg-secondary/10 text-secondary border border-secondary/20 rounded-full hover:bg-secondary/20",
        "marzi-ghost":
          "text-muted-foreground rounded-full hover:bg-muted hover:text-foreground",
        "marzi-accent":
          "bg-accent/15 text-accent-foreground border border-accent/20 rounded-full hover:bg-accent/25",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl rounded-full",
        icon: "h-12 w-12 rounded-full",
        "icon-lg": "h-16 w-16 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
