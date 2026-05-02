import { useState } from "react";
import { Heart, Scan } from "lucide-react";
import { SwipeableCards } from "@/components/SwipeableCards";
import { QuestionRail } from "@/components/QuestionRail";
import { ChatbotPopup } from "@/components/ChatbotPopup";
import { ProductCardData } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>();

  const productCards: ProductCardData[] = [
    {
      id: "1",
      title: "Styling & Face Appeal",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
      description: [
        "This square shape gives a sharp, modern look that adds sophistication.",
        "Perfect for office, daily wear, and smart-casual occasions.",
        "Works well for oval, round, and heart-shaped faces.",
      ],
      tags: [
        { label: "Square", variant: "lavender" },
        { label: "Minimal", variant: "default" },
        { label: "Unisex", variant: "default" },
      ],
      background: "lavender",
    },
    {
      id: "2",
      title: "Comfort & Fit",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      description: [
        "Very comfortable—light on the nose and ears for all-day wear.",
        "Features spring hinges that flex with movement.",
        "Adjustable nose pads ensure a custom, secure fit.",
      ],
      tags: [
        { label: "Lightweight", variant: "mint" },
        { label: "Spring Hinges", variant: "mint" },
        { label: "Adjustable Pads", variant: "mint" },
      ],
      background: "mint",
    },
    {
      id: "3",
      title: "Functional Features",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
        </svg>
      ),
      description: [
        "The sides open wider than standard frames—never feels tight.",
        "Strong, durable construction for daily use and active lifestyles.",
        "Blue-light filtering available for screen protection.",
      ],
      tags: [
        { label: "Secure Grip", variant: "cream" },
        { label: "Screen Friendly", variant: "cream" },
        { label: "Durable", variant: "cream" },
      ],
      background: "cream",
    },
    {
      id: "4",
      title: "Collection Identity",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      description: [
        "From our Meller collection—clean lines, minimal design, and contemporary styling.",
        "Handpicked for professionals and style-conscious customers.",
        "A timeless look that pairs with any outfit.",
      ],
      tags: [
        { label: "Meller", variant: "gold" },
        { label: "Contemporary", variant: "gold" },
        { label: "Premium", variant: "gold" },
      ],
      background: "gold",
    },
    {
      id: "5",
      title: "Offers & Value",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      description: [
        "This frame is part of our BOGO offer—pick another frame absolutely free!",
        "Great value if you want a backup pair or different styles.",
        "Currently 26% off—save more on lenses and coatings.",
      ],
      tags: [
        { label: "BOGO", variant: "peach" },
        { label: "26% Off", variant: "peach" },
        { label: "Great Value", variant: "peach" },
      ],
      background: "peach",
    },
  ];

  const commonQuestions = [
    "Is this good for daily wear?",
    "Why is it priced like this?",
    "Is it durable?",
    "Will this suit my face?",
    "Any offer on this?",
    "Collection story?",
    "Can I get this in my power?",
    "Return/exchange?",
    "Delivery time?",
  ];

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Scan className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative bg-gradient-to-b from-muted/30 to-background px-4 py-8">
        <div className="absolute top-4 left-4">
          <Badge className="bg-lavender text-lavender-foreground border-lavender-foreground/20">
            <span className="flex items-center gap-1">
              100% match
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </span>
          </Badge>
          <div className="text-xs font-medium text-muted-foreground mt-1">POWERED</div>
        </div>

        <div className="flex items-center justify-center py-12">
          <svg
            width="280"
            height="120"
            viewBox="0 0 280 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            <path
              d="M40 60 Q50 40, 70 40 L130 40 Q140 40, 140 50 L140 70 Q140 80, 130 80 L70 80 Q50 80, 40 60 Z"
              fill="#1a2332"
              stroke="#1a2332"
              strokeWidth="3"
            />
            <path
              d="M240 60 Q230 40, 210 40 L150 40 Q140 40, 140 50 L140 70 Q140 80, 150 80 L210 80 Q230 80, 240 60 Z"
              fill="#1a2332"
              stroke="#1a2332"
              strokeWidth="3"
            />
            <path
              d="M140 55 L145 55"
              stroke="#1a2332"
              strokeWidth="2"
            />
            <text x="100" y="35" fill="#1a2332" fontSize="10" fontWeight="600">
              lenskart
            </text>
          </svg>
        </div>

        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-border"></div>
          <div className="w-2 h-2 rounded-full bg-border"></div>
        </div>
      </div>

      {/* Price Section */}
      <div className="px-4 py-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">₹1400</span>
          <span className="text-lg text-muted-foreground line-through">₹1900</span>
          <span className="text-sm font-semibold text-green-600">(26% OFF)</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">with lenses</p>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1 rounded-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Similar
          </Button>
          <Button className="flex-1 rounded-full">
            Details
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Sales Assistant Section */}
      <div className="space-y-6 py-4">
        <div className="px-4">
          <h2 className="text-2xl font-bold text-foreground mb-1">Sales Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Quick answers to help you explain this frame confidently
          </p>
        </div>

        <SwipeableCards cards={productCards} />

        <QuestionRail
          questions={commonQuestions}
          onQuestionClick={handleQuestionClick}
          onAskQuestion={() => setChatOpen(true)}
        />
      </div>

      <ChatbotPopup
        open={chatOpen}
        onOpenChange={setChatOpen}
        initialQuestion={selectedQuestion}
      />
    </div>
  );
};

export default Index;
