
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatRoom } from "./ChatRoom";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  title: string;
}

export const ChatDialog = ({
  open,
  onOpenChange,
  roomId,
  title,
}: ChatDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ChatRoom roomId={roomId} className="flex-1" />
      </DialogContent>
    </Dialog>
  );
};
