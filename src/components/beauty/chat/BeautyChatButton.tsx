
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { BeautyChatDialog } from "./BeautyChatDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BeautyChatButtonProps {
  recipientId: string;
  recipientName: string;
  type: "marketplace" | "professional";
  listingId?: string;
  professionalId?: string;
}

export const BeautyChatButton = ({
  recipientId,
  recipientName,
  type,
  listingId,
  professionalId,
}: BeautyChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartChat = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start a chat",
        variant: "destructive",
      });
      return;
    }

    if (user.id === recipientId) {
      toast({
        title: "Cannot message yourself",
        description: "This is your own listing/profile",
        variant: "destructive",
      });
      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleStartChat}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </Button>

      <BeautyChatDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        recipientId={recipientId}
        type={type}
        title={`Chat with ${recipientName}`}
        listingId={listingId}
        professionalId={professionalId}
      />
    </>
  );
};
