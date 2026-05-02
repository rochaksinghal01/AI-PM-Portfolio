import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText } from "lucide-react";

interface ExportButtonsProps {
  data: any;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `call-evaluation-${data.call_metadata.call_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={exportJSON} className="gap-2">
        <FileJson className="h-4 w-4" />
        Export JSON
      </Button>
      <Button variant="outline" size="sm" disabled className="gap-2">
        <FileText className="h-4 w-4" />
        Export PDF
        <span className="text-xs text-muted-foreground">(Coming Soon)</span>
      </Button>
    </div>
  );
}
