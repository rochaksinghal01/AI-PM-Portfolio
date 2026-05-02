import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Play, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptInputProps {
  onSubmit: (transcript: string, callType: string, customerType: string) => void;
  isLoading?: boolean;
}

const sampleTranscript = `[00:00:05] Agent: Thank you for calling ABC Support, my name is Sarah. How may I assist you today?
[00:00:12] Customer: Hi Sarah, I'm calling because I noticed a charge on my account that I definitely didn't make.
[00:00:20] Agent: I understand your concern, and I'm here to help. Before we proceed, may I verify your account? Can you please provide your account number and the last four digits of your registered phone?
[00:00:35] Customer: Sure, my account number is 987654 and the last four digits are 1234.
[00:00:42] Agent: Thank you for that verification. I can see your account now. Could you tell me more about the charge you're disputing?
[00:00:52] Customer: I was charged $49.99 by something called 'Merchant XYZ' on January 10th. I have no idea what this is - I've never heard of them.
[00:01:08] Agent: I apologize for the inconvenience this has caused. Let me look into this transaction for you. Could you please hold for just a moment while I review the details?
[00:01:18] Customer: Yes, that's fine.
[00:01:48] Agent: Thank you for holding. I've reviewed the transaction, and I can see this charge does appear unusual. I'm going to initiate a dispute on your behalf and also flag this for our fraud investigation team.
[00:02:05] Customer: Okay, that sounds good. Will I get my money back?
[00:02:12] Agent: Yes, we'll issue a provisional credit to your account within 24-48 hours while we complete the investigation. The full investigation typically takes 5-7 business days.
[00:02:28] Customer: That's a relief. Thank you so much for your help, Sarah.
[00:02:34] Agent: You're very welcome! Is there anything else I can assist you with today?
[00:02:40] Customer: No, that's all. Thank you again!
[00:02:45] Agent: Thank you for calling ABC Support. Have a wonderful day!`;

export function TranscriptInput({ onSubmit, isLoading }: TranscriptInputProps) {
  const [transcript, setTranscript] = useState("");
  const [callType, setCallType] = useState("inbound");
  const [customerType, setCustomerType] = useState("existing");

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    onSubmit(transcript, callType, customerType);
  };

  const loadSample = () => {
    setTranscript(sampleTranscript);
  };

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Call Transcript</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Paste the transcript in [HH:MM:SS] Speaker: Text format
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadSample} className="gap-2">
          <FileText className="h-4 w-4" />
          Load Sample
        </Button>
      </div>

      <div className="space-y-6">
        <Textarea
          placeholder="[00:00:05] Agent: Thank you for calling...
[00:00:12] Customer: Hi, I'm calling because..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-[280px] font-mono text-sm resize-none bg-secondary/30 border-border focus:ring-primary/20"
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Call Type</Label>
            <RadioGroup value={callType} onValueChange={setCallType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inbound" id="inbound" />
                <Label htmlFor="inbound" className="text-sm cursor-pointer">Inbound</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outbound" id="outbound" />
                <Label htmlFor="outbound" className="text-sm cursor-pointer">Outbound</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Customer Type</Label>
            <RadioGroup value={customerType} onValueChange={setCustomerType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="text-sm cursor-pointer">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="text-sm cursor-pointer">Existing</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!transcript.trim() || isLoading}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Evaluate Call
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
