import { Sun, Moon, CloudSun, Sparkles } from 'lucide-react';
import type { TimeOfDay } from '@/types/marzi';

interface TimeGreetingProps {
  timeOfDay: TimeOfDay;
  greeting: string;
  message: string;
}

export function TimeGreeting({ timeOfDay, greeting, message }: TimeGreetingProps) {
  const getIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="w-8 h-8 text-accent" />;
      case 'afternoon':
        return <CloudSun className="w-8 h-8 text-primary" />;
      case 'evening':
        return <Sparkles className="w-8 h-8 text-marzi-gold" />;
      case 'night':
        return <Moon className="w-8 h-8 text-secondary" />;
    }
  };

  const getGradientClass = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'gradient-sunrise';
      case 'afternoon':
        return 'bg-muted/30';
      case 'evening':
        return 'gradient-evening';
      case 'night':
        return 'gradient-calm';
    }
  };

  return (
    <div className={`rounded-3xl p-8 ${getGradientClass()} animate-fade-up`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-background/80 shadow-soft">
          {getIcon()}
        </div>
        <div>
          <h1 className="text-heading font-serif text-foreground">{greeting}</h1>
          <p className="text-body text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
