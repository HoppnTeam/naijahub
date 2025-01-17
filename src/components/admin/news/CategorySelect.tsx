import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const CategorySelect = ({ selectedCategory, onCategoryChange }: CategorySelectProps) => {
  return (
    <Select
      value={selectedCategory}
      onValueChange={onCategoryChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="news">News</SelectItem>
        <SelectItem value="politics">Politics</SelectItem>
        <SelectItem value="business">Business</SelectItem>
        <SelectItem value="technology">Technology</SelectItem>
        <SelectItem value="sports">Sports</SelectItem>
      </SelectContent>
    </Select>
  );
};