import { Car, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AutomotiveHeaderProps {
  onSearch: (query: string) => void;
}

export const AutomotiveHeader = ({ onSearch }: AutomotiveHeaderProps) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center gap-3">
        <Car className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Automotive</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search automotive discussions..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};