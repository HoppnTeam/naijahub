import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

interface CategoryFieldsProps {
  condition: string;
  setCondition: (value: string) => void;
  partCategoryId: string;
  setPartCategoryId: (value: string) => void;
}

export const CategoryFields = ({
  condition,
  setCondition,
  partCategoryId,
  setPartCategoryId,
}: CategoryFieldsProps) => {
  const { data: categories } = useQuery({
    queryKey: ["auto_parts_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_parts_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={partCategoryId} onValueChange={setPartCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};