import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { IssueReport } from "./types";

interface ReportDetailsDialogProps {
  report: IssueReport | null;
  onClose: () => void;
  onResolve: (notes: string) => Promise<void>;
}

export const ReportDetailsDialog = ({ report, onClose, onResolve }: ReportDetailsDialogProps) => {
  const [resolutionNotes, setResolutionNotes] = useState("");

  if (!report) return null;

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Issue Report Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Category</Label>
            <p className="capitalize">{report.category}</p>
          </div>

          <div>
            <Label>Subject</Label>
            <p>{report.subject}</p>
          </div>

          <div>
            <Label>Description</Label>
            <p className="whitespace-pre-wrap">{report.description}</p>
          </div>

          {report.image_url && (
            <div>
              <Label>Attached Image</Label>
              <img
                src={report.image_url}
                alt="Report attachment"
                className="mt-2 max-h-[300px] rounded-md"
              />
            </div>
          )}

          {report.status === "pending" && (
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Notes</Label>
              <Textarea
                id="resolution"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter resolution notes..."
                className="min-h-[100px]"
              />
              <Button onClick={() => onResolve(resolutionNotes)} className="w-full">
                Mark as Resolved
              </Button>
            </div>
          )}

          {report.status === "resolved" && (
            <div>
              <Label>Resolution Notes</Label>
              <p className="whitespace-pre-wrap">{report.resolution_notes}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Resolved on {format(new Date(report.resolved_at!), "MMM d, yyyy")}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};