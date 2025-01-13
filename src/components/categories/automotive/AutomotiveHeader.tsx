import { Car, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AutomotiveHeaderProps {
  onSearch: (query: string) => void;
  onCreatePost: () => void;
}

export const AutomotiveHeader = ({ onSearch, onCreatePost }: AutomotiveHeaderProps) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center gap-3">
        <Car className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Automotive</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-lg shadow flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <span>Car Reviews</span>
        </div>
        <div className="p-4 bg-card rounded-lg shadow flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <span>Find Workshops</span>
        </div>
        <div className="p-4 bg-card rounded-lg shadow flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          <span>Sell Your Car</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search cars, workshops, or discussions..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button onClick={onCreatePost} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Post
        </Button>
      </div>
    </div>
  );
};