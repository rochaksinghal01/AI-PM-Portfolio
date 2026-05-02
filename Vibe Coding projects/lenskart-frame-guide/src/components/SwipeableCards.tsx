import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCard, ProductCardData } from "./ProductCard";
import { cn } from "@/lib/utils";

interface SwipeableCardsProps {
  cards: ProductCardData[];
}

export const SwipeableCards = ({ cards }: SwipeableCardsProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = () => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  useState(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 px-4">
          {cards.map((card) => (
            <div key={card.id} className="flex-[0_0_85%] min-w-0">
              <ProductCard card={card} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {cards.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === selectedIndex
                ? "bg-primary w-6"
                : "bg-border"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};
