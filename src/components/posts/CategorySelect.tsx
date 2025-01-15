import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  selectedSubcategoryId,
  onSubcategoryChange,
  categoryName,
}: CategorySelectProps) => {
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        // First fetch the main category
        const { data: category, error: categoryError } = await supabase
          .from("categories")
          .select("id")
          .eq("name", categoryName)
          .single();

        if (categoryError) throw categoryError;

        if (category) {
          // Then fetch its subcategories
          const { data: subcategoriesData, error: subcategoriesError } = await supabase
            .from("categories")
            .select("*")
            .eq("parent_id", category.id);

          if (subcategoriesError) throw subcategoriesError;

          if (subcategoriesData) {
            setSubcategories(subcategoriesData);
          }
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryName]);

  if (isLoading) return null;
  if (subcategories.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="subcategory">Select Subcategory</Label>
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