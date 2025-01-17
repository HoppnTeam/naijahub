import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface NewsFetchButtonProps {
  onClick: () => Promise<void>;
}

export const NewsFetchButton = ({ onClick }: NewsFetchButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="flex items-center gap-2"
    >
      <RefreshCw className="w-4 h-4" />
      Fetch New Articles
    </Button>
  );
};