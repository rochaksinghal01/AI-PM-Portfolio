import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "lavender" | "mint" | "gold" | "cream" | "peach";
  className?: string;
}

export const Tag = ({ children, variant = "default", className }: TagProps) => {
  const variantClasses = {
    default: "bg-secondary text-secondary-foreground",
    lavender: "bg-lavender text-lavender-foreground",
    mint: "bg-mint text-mint-foreground",
    gold: "bg-gold text-gold-foreground",
    cream: "bg-cream text-cream-foreground",
    peach: "bg-peach text-peach-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-border/40",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
