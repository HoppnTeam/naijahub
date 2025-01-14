import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface PostModerationFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export const PostModerationFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: PostModerationFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="reported">Reported</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};