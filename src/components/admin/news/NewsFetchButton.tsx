import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface NewsFetchButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

export const NewsFetchButton = ({ onClick, isLoading }: NewsFetchButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="flex items-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      {isLoading ? 'Fetching Articles...' : 'Fetch New Articles'}
    </Button>
  );
};