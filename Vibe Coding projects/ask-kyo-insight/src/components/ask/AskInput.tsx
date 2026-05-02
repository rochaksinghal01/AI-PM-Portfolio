import { useState } from 'react';
import { Search, Mic, Paperclip, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AskInputProps {
  onSubmit: (question: string) => void;
  placeholder?: string;
}

export function AskInput({ onSubmit, placeholder = "Ask Kyo anything about your customers..." }: AskInputProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={cn(
          'relative bg-card rounded-xl border-2 transition-all shadow-card',
          isFocused ? 'border-primary shadow-soft' : 'border-border'
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <Sparkles className={cn(
            'w-5 h-5 transition-colors',
            isFocused ? 'text-primary' : 'text-muted-foreground'
          )} />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-card-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
          />
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-muted transition-colors"
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-muted transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!query.trim()}
              className={cn(
                'p-2 rounded-lg transition-all',
                query.trim()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-xs text-center text-muted-foreground">
        Press Enter to ask • Kyo will search across all connected data sources
      </p>
    </form>
  );
}
