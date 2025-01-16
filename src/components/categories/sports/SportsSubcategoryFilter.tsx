import { Trophy, Target, Activity, Gamepad2, Swords, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SportsSubcategoryFilterProps {
  subcategories: any[] | undefined;
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string | null) => void;
}

export const SportsSubcategoryFilter = ({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
}: SportsSubcategoryFilterProps) => {
  const getSubcategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'football':
        return <Trophy className="w-4 h-4 mr-2" />;
      case 'basketball':
        return <Target className="w-4 h-4 mr-2" />;
      case 'athletics':
        return <Activity className="w-4 h-4 mr-2" />;
      case 'cricket':
        return <Gamepad2 className="w-4 h-4 mr-2" />;
      case 'tennis':
        return <Swords className="w-4 h-4 mr-2" />;
      case 'combat sports':
        return <Dumbbell className="w-4 h-4 mr-2" />;
      default:
        return <Trophy className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button
        variant={selectedSubcategory === null ? "default" : "outline"}
        onClick={() => onSubcategoryChange(null)}
      >
        All Sports
      </Button>
      {subcategories?.map((subcategory) => (
        <Button
          key={subcategory.id}
          variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
          onClick={() => onSubcategoryChange(subcategory.id)}
          className="flex items-center"
        >
          {getSubcategoryIcon(subcategory.name)}
          {subcategory.name}
        </Button>
      ))}
    </div>
  );
};