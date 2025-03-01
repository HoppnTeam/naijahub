import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ListingActionsProps {
  listing: any;
  marketplace: "tech" | "auto" | "beauty";
  onEdit: (listing: any) => void;
  onDelete: (id: string, marketplace: "tech" | "auto" | "beauty") => void;
  onChatOpen: (listingId: string) => void;
  unreadMessages: number;
}

export const ListingActions = ({
  listing,
  marketplace,
  onEdit,
  onDelete,
  onChatOpen,
  unreadMessages,
}: ListingActionsProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        onClick={() => onEdit({ ...listing, marketplace })}
      >
        Edit
      </Button>
      
      <Button
        variant="outline"
        onClick={() => onChatOpen(listing.id)}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Messages {unreadMessages > 0 && <Badge variant="destructive">{unreadMessages}</Badge>}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(listing.id, marketplace)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};