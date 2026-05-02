import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, MoreHorizontal, Phone, Video } from 'lucide-react';

interface TeamsChatDemoProps {
  onFloatingClick: () => void;
}

export function TeamsChatDemo({ onFloatingClick }: TeamsChatDemoProps) {
  return (
    <div className="relative bg-card rounded-xl border border-border overflow-hidden shadow-lg">
      {/* Chat Header */}
      <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">MT</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Marketing Team</p>
            <p className="text-[10px] text-muted-foreground">5 members</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded text-muted-foreground hover:bg-muted">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-muted-foreground hover:bg-muted">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-muted-foreground hover:bg-muted">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="h-[200px] p-4 space-y-3 overflow-y-auto">
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary flex-shrink-0" />
          <div className="bg-muted/50 rounded-lg p-2 max-w-[70%]">
            <p className="text-xs text-foreground">Hey team, what's happening with ROAS this week?</p>
            <span className="text-[9px] text-muted-foreground">9:42 AM</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-accent/20 flex-shrink-0" />
          <div className="bg-muted/50 rounded-lg p-2 max-w-[70%]">
            <p className="text-xs text-foreground">Looks like there's been a dip. Let me check with @AskKyo</p>
            <span className="text-[9px] text-muted-foreground">9:43 AM</span>
          </div>
        </div>
        
        {/* Kyo inline response */}
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
            <span className="text-[8px] font-bold text-primary-foreground">K</span>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 max-w-[85%]">
            <p className="text-xs font-medium text-primary mb-1">Ask Kyo</p>
            <p className="text-xs text-foreground">ROAS dropped 5% due to quality complaints in 3 SKUs (VC, Hustlr, JJ). Recommend updating creatives for 18-25 segment.</p>
            <div className="flex gap-1 mt-1.5">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-warning/10 text-warning">Quality</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Conversion</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded text-muted-foreground hover:bg-muted">
            <Paperclip className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            placeholder="@AskKyo what caused the ROAS drop?"
            className="flex-1 text-xs bg-transparent placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="p-1.5 rounded text-muted-foreground hover:bg-muted">
            <Smile className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded bg-primary text-primary-foreground">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Floating Button */}
      <motion.button
        onClick={onFloatingClick}
        className="absolute bottom-16 right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center font-bold text-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        K
      </motion.button>
    </div>
  );
}
