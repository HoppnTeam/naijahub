import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TravelHeaderProps {
  onSearch: (query: string) => void;
  onCreatePost: () => void;
}

export const TravelHeader = ({ onSearch }: TravelHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Travel & Tourism</h1>
        <Button onClick={() => navigate("/categories/travel/create")} className="gap-2">
          <PlusCircle className="w-5 h-5" />
          Share Your Journey
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search travel posts..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};