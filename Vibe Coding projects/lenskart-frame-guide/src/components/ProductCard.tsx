import { Tag } from "./Tag";
import { cn } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  title: string;
  icon?: React.ReactNode;
  description: string[];
  tags: Array<{ label: string; variant?: "default" | "lavender" | "mint" | "gold" | "cream" | "peach" }>;
  background: "lavender" | "cream" | "mint" | "gold" | "peach";
}

interface ProductCardProps {
  card: ProductCardData;
  className?: string;
}

export const ProductCard = ({ card, className }: ProductCardProps) => {
  const backgroundClasses = {
    lavender: "bg-lavender",
    cream: "bg-cream",
    mint: "bg-mint",
    gold: "bg-gold",
    peach: "bg-peach",
  };

  return (
    <div
      className={cn(
        "rounded-3xl p-6 min-h-[280px] flex flex-col justify-between",
        backgroundClasses[card.background],
        className
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {card.icon && (
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                {card.icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {card.description.map((line, index) => (
            <p key={index} className="text-sm text-foreground/80 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag, index) => (
          <Tag key={index} variant={tag.variant || "default"}>
            {tag.label}
          </Tag>
        ))}
      </div>
    </div>
  );
};
