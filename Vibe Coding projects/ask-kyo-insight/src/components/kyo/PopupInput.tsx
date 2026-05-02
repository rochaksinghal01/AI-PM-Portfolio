import { useState, useRef } from 'react';
import { Send, Mic, Camera, FileText, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PopupInputProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

export function PopupInput({ onSubmit, isLoading }: PopupInputProps) {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
      setQuery('');
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording end
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setQuery("What's causing the drop in conversion this week?");
      }, 2000);
    }
  };

  return (
    <div className="border-t border-border/50 bg-muted/20 p-3">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Upload screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Upload document"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Paste link"
          >
            <Link2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              className={cn(
                'w-full px-4 py-2.5 pr-10 rounded-xl',
                'bg-card border border-border',
                'text-sm text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
                'transition-all',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            />
          </div>
          
          {/* Voice button */}
          <motion.button
            type="button"
            onClick={handleMicClick}
            className={cn(
              'p-2.5 rounded-xl transition-colors',
              isRecording 
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: isRecording ? Infinity : 0, duration: 0.8 }}
          >
            <Mic className="w-4 h-4" />
          </motion.button>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              'p-2.5 rounded-xl transition-all',
              query.trim() && !isLoading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
