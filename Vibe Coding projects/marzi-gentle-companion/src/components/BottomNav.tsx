import { Heart, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'moments' | 'wellness';
  onTabChange: (tab: 'moments' | 'wellness') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-50">
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onTabChange('moments')}
            className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === 'moments'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className={`w-6 h-6 ${activeTab === 'moments' ? 'animate-pulse-gentle' : ''}`} />
            <span className="text-sm font-medium">Moments</span>
          </button>

          <button
            onClick={() => onTabChange('wellness')}
            className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === 'wellness'
                ? 'bg-secondary/10 text-secondary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className={`w-6 h-6 ${activeTab === 'wellness' ? 'animate-pulse-gentle' : ''}`} />
            <span className="text-sm font-medium">Wellness</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
