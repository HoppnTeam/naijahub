import { Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TechnologyHeaderProps {
  onSearch: (query: string) => void;
}

export const TechnologyHeader = ({ onSearch }: TechnologyHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-3">
        <Laptop className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Technology</h1>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tech discussions..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => navigate("/categories/technology/create")}>Create Post</Button>
      </div>
    </div>
  );
};