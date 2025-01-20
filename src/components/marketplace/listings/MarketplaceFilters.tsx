import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketplaceFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const MarketplaceFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: MarketplaceFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Search listings..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:w-64"
      />
      <Select
        value={selectedCategory}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="md:w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Phones & Tablets">Phones & Tablets</SelectItem>
          <SelectItem value="Computers">Computers</SelectItem>
          <SelectItem value="Electronics">Electronics</SelectItem>
          <SelectItem value="Accessories">Accessories</SelectItem>
          <SelectItem value="Gaming">Gaming</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};