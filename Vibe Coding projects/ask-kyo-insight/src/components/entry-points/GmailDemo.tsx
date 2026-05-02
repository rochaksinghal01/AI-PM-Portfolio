import { motion } from 'framer-motion';
import { Inbox, Star, Send, File, Trash2, Settings, Pencil, MoreVertical, Archive, Reply } from 'lucide-react';

interface GmailDemoProps {
  onFloatingClick: () => void;
}

export function GmailDemo({ onFloatingClick }: GmailDemoProps) {
  return (
    <div className="relative bg-card rounded-xl border border-border overflow-hidden shadow-lg">
      {/* Gmail Header */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <div className="w-2 h-2 rounded-full bg-warning" />
            <div className="w-2 h-2 rounded-full bg-success" />
          </div>
          <span className="text-sm font-medium text-foreground">Gmail</span>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex h-[280px]">
        {/* Gmail Sidebar */}
        <div className="w-16 bg-muted/20 border-r border-border py-3 px-2 flex flex-col gap-1">
          <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-primary/10 text-primary text-xs">
            <Inbox className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-xs hover:bg-muted rounded-full">
            <Star className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-xs hover:bg-muted rounded-full">
            <Send className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-xs hover:bg-muted rounded-full">
            <File className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Email content */}
        <div className="flex-1 p-3 overflow-y-auto">
          {/* Email header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Re: Q4 Campaign Performance Review</h3>
              <p className="text-[10px] text-muted-foreground">From: marketing-leads@company.com</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-muted-foreground hover:bg-muted">
                <Archive className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded text-muted-foreground hover:bg-muted">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded text-muted-foreground hover:bg-muted">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Email body */}
          <div className="text-xs text-foreground space-y-2 mb-4">
            <p>Hi Team,</p>
            <p>Please find attached the Q4 campaign performance data. We're seeing some concerning trends in ROAS that we need to address...</p>
            <p>Key points:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>ROAS down 5% WoW</li>
              <li>Quality complaints in 3 SKUs</li>
              <li>CAC increasing for 18-25 segment</li>
            </ul>
          </div>
          
          {/* Reply actions */}
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-muted">
              <Reply className="w-3 h-3" />
              Reply
            </button>
          </div>
        </div>
        
        {/* Kyo Sidebar */}
        <div className="w-[120px] border-l border-border bg-muted/10 p-2">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary-foreground">K</span>
            </div>
            <span className="text-[10px] font-medium text-foreground">Ask Kyo</span>
          </div>
          
          <div className="space-y-2">
            <button className="w-full text-left p-2 rounded-lg bg-primary/5 border border-primary/20 text-[9px] text-foreground hover:bg-primary/10 transition-colors">
              Summarize this thread
            </button>
            <button className="w-full text-left p-2 rounded-lg bg-muted/50 text-[9px] text-muted-foreground hover:bg-muted transition-colors">
              Draft reply
            </button>
            <button className="w-full text-left p-2 rounded-lg bg-muted/50 text-[9px] text-muted-foreground hover:bg-muted transition-colors">
              Extract action items
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating Button */}
      <motion.button
        onClick={onFloatingClick}
        className="absolute bottom-4 right-[140px] w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center font-bold text-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        K
      </motion.button>
    </div>
  );
}
