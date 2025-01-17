import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactButtonProps {
  isOwner: boolean;
  isBusiness: boolean;
  onContact: () => void;
}

export const ContactButton = ({ isOwner, isBusiness, onContact }: ContactButtonProps) => {
  if (isBusiness || isOwner) return null;

  return (
    <Button onClick={onContact} className="w-full">
      <MessageSquare className="w-4 h-4 mr-2" />
      Contact Seller
    </Button>
  );
};