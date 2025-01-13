import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EntertainmentHeaderProps {
  onSearch: (query: string) => void;
  onCreatePost: () => void;
}

export const EntertainmentHeader = ({
  onSearch,
  onCreatePost,
}: EntertainmentHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-4">Entertainment Hub</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entertainment content..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button onClick={onCreatePost}>Create Post</Button>
      </div>
    </div>
  );
};