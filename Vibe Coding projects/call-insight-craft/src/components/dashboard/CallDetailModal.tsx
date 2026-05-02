import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScoreBadge } from "@/components/evaluation/ScoreBadge";
import { format } from "date-fns";
import { 
  Tag, 
  Target, 
  AlertTriangle, 
  Users, 
  Heart,
  Clock
} from "lucide-react";

interface CallDetailModalProps {
  call: any;
  isOpen: boolean;
  onClose: () => void;
}

export function CallDetailModal({ call, isOpen, onClose }: CallDetailModalProps) {
  if (!call) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Call Details
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                {call.call_id}
              </p>
            </div>
            <ScoreBadge score={call.model_score} size="lg" />
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Date & Time</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {format(new Date(call.date), "MMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Customer Type</span>
              </div>
              <p className="text-sm font-medium text-foreground capitalize">
                {call.customer_type}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Classification */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Primary Topic</span>
              </div>
              <p className="text-sm font-medium text-foreground capitalize">
                {call.primary_topic.replace(/_/g, " ")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Root Cause</span>
              </div>
              <p className="text-sm font-medium text-foreground capitalize">
                {call.root_cause.replace(/_/g, " ")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Assigned Team</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {call.assigned_team}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Emotion Shift</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {call.emotion_shift}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Escalation Status */}
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Escalation Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                call.escalation 
                  ? "bg-warning/20 text-warning" 
                  : "bg-success/20 text-success"
              }`}>
                {call.escalation ? "Escalated" : "Not Escalated"}
              </span>
            </div>
          </div>

          {/* Note */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span> Full evaluation details including transcript, 
              dimension scores, and team routing are available in the Call Evaluation screen.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
