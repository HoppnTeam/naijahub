import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostViolation } from "./types";

interface ReviewViolationDialogProps {
  violation: PostViolation | null;
  actionNotes: string;
  selectedAction: string;
  onActionNotesChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const ReviewViolationDialog = ({
  violation,
  actionNotes,
  selectedAction,
  onActionNotesChange,
  onActionChange,
  onClose,
  onSubmit,
}: ReviewViolationDialogProps) => {
  if (!violation) return null;

  return (
    <Dialog open={!!violation} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Content Violation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Post Title</Label>
            <p>{violation.post.title}</p>
          </div>

          <div>
            <Label>Content</Label>
            <p className="whitespace-pre-wrap">{violation.post.content}</p>
          </div>

          <div>
            <Label>Violation Type</Label>
            <p className="capitalize">{violation.violation_type.replace(/_/g, " ")}</p>
          </div>

          <div>
            <Label>Description</Label>
            <p>{violation.description}</p>
          </div>

          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={selectedAction} onValueChange={onActionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select action to take" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warning">Send Warning</SelectItem>
                <SelectItem value="remove_post">Remove Post</SelectItem>
                <SelectItem value="dismiss">Dismiss Violation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={actionNotes}
              onChange={(e) => onActionNotesChange(e.target.value)}
              placeholder="Add notes about the action taken..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={onSubmit} className="w-full">
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};