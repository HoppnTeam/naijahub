import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Search, PlusCircle } from "lucide-react";

interface SportsHeaderProps {
  onSearch: (query: string) => void;
  onCreatePost: () => void;
}

export const SportsHeader = ({ onSearch, onCreatePost }: SportsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Sports Hub</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sports discussions..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button onClick={onCreatePost} className="w-full sm:w-auto">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>
    </div>
  );
};