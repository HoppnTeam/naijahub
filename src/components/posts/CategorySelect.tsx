import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface CategorySelectProps {
  subcategories: Category[];
  selectedSubcategoryId: string;
  onSubcategoryChange: (value: string) => void;
  categoryName: string;
}

export const CategorySelect = ({
  subcategories,
  selectedSubcategoryId,
  onSubcategoryChange,
  categoryName,
}: CategorySelectProps) => {
  if (subcategories.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="subcategory">{categoryName} Category</Label>
      <Select value={selectedSubcategoryId} onValueChange={onSubcategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a subcategory" />
        </SelectTrigger>
        <SelectContent>
          {subcategories.map((subcategory) => (
            <SelectItem key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};