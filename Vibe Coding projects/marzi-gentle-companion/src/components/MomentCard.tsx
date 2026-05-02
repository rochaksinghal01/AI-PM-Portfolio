import { Play, Pause, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MomentContent } from '@/types/marzi';

interface MomentCardProps {
  moment: MomentContent;
  isPlaying?: boolean;
  onPlay?: () => void;
  onComplete?: () => void;
}

export function MomentCard({ moment, isPlaying, onPlay, onComplete }: MomentCardProps) {
  const getTypeLabel = () => {
    switch (moment.type) {
      case 'recipe': return '🍳 Recipe';
      case 'news': return '📰 News';
      case 'fact': return '💡 Did You Know';
      case 'story': return '📖 Story';
      case 'music': return '🎵 Music';
      case 'reflection': return '🌿 Reflection';
    }
  };

  const getTypeColor = () => {
    switch (moment.type) {
      case 'recipe': return 'bg-primary/10 text-primary';
      case 'news': return 'bg-secondary/10 text-secondary';
      case 'fact': return 'bg-accent/10 text-accent-foreground';
      case 'story': return 'bg-marzi-sage/10 text-marzi-sage';
      case 'music': return 'bg-marzi-gold/10 text-marzi-gold';
      case 'reflection': return 'bg-secondary/10 text-secondary';
    }
  };

  return (
    <div className="bg-card rounded-3xl shadow-elevated overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor()}`}>
            {getTypeLabel()}
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{moment.duration}</span>
          </div>
        </div>
        
        <h2 className="text-title font-serif text-foreground mb-3">
          {moment.title}
        </h2>
        
        <p className="text-body text-muted-foreground leading-relaxed">
          {moment.description}
        </p>
      </div>

      {/* Action area */}
      <div className="p-6 pt-2 flex gap-4">
        <Button
          variant="marzi"
          size="lg"
          className="flex-1"
          onClick={onPlay}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Listen</span>
            </>
          )}
        </Button>
        
        <Button
          variant="marzi-ghost"
          size="lg"
          onClick={onComplete}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}
