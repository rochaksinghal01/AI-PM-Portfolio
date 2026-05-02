import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Phone, User, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CallType, CustomerType } from '@/types/callEvaluation';
import { validateTranscriptFormat } from '@/data/callEvaluationMock';

interface CallInputFormProps {
  onSubmit: (transcript: string, callType: CallType, customerType: CustomerType) => void;
  isLoading: boolean;
}

const sampleTranscript = `[00:00:05] Agent: Thank you for calling TechCorp Support. My name is Sarah. How may I assist you today?
[00:00:12] Customer: Hi Sarah, I'm calling because I noticed a charge on my account that I didn't authorize.
[00:00:20] Agent: I understand your concern, and I apologize for the inconvenience. Let me help you with that right away. May I have your account number please?
[00:00:30] Customer: Sure, it's 12345678.
[00:00:35] Agent: Thank you. And for verification, can you confirm the email address on file?
[00:00:42] Customer: It's john.doe@email.com
[00:00:48] Agent: Perfect, I've verified your account. I can see there's a charge of $49.99 from yesterday. Is this the one you're referring to?
[00:00:58] Customer: Yes, that's the one. I never made that purchase.
[00:01:05] Agent: I completely understand. Let me initiate a dispute for this charge immediately. I'll also flag this for our fraud team to investigate.
[00:01:18] Customer: That would be great, thank you.
[00:01:22] Agent: I've initiated the dispute. You should see a provisional credit within 24 hours. Our fraud team will investigate and follow up within 5 business days. Is there anything else I can help you with?
[00:01:38] Customer: No, that's all. Thank you for your help, Sarah.
[00:01:43] Agent: You're welcome! Have a great day, and thank you for choosing TechCorp.`;

export function CallInputForm({ onSubmit, isLoading }: CallInputFormProps) {
  const [transcript, setTranscript] = useState('');
  const [callType, setCallType] = useState<CallType>('inbound');
  const [customerType, setCustomerType] = useState<CustomerType>('existing');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    const validation = validateTranscriptFormat(transcript);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid transcript format');
      return;
    }
    
    onSubmit(transcript, callType, customerType);
  };

  const loadSample = () => {
    setTranscript(sampleTranscript);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Metadata Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Call Type
          </Label>
          <RadioGroup
            value={callType}
            onValueChange={(v) => setCallType(v as CallType)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inbound" id="inbound" />
              <Label htmlFor="inbound" className="cursor-pointer">Inbound</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outbound" id="outbound" />
              <Label htmlFor="outbound" className="cursor-pointer">Outbound</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Customer Type
          </Label>
          <RadioGroup
            value={customerType}
            onValueChange={(v) => setCustomerType(v as CustomerType)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="cursor-pointer">New</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="cursor-pointer">Existing</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Transcript Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Call Transcript
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSample}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Load Sample
          </Button>
        </div>
        
        <Textarea
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            setError(null);
          }}
          placeholder="[00:00:00] Agent: Hello, how can I help you today?&#10;[00:00:05] Customer: I have a question about my account..."
          className={cn(
            "min-h-[300px] font-mono text-sm resize-none",
            "bg-background/50 border-border/50",
            "focus:border-primary/50 focus:ring-primary/20",
            error && "border-destructive"
          )}
        />
        
        <p className="text-xs text-muted-foreground">
          Format: [HH:MM:SS] Speaker: Text (Speaker must be "Agent" or "Customer")
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !transcript.trim()}
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Evaluate Call
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
