import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

export const useCategorySelect = (categoryName: string, showSubcategories: boolean) => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("name", categoryName)
        .single();

      if (categoryError) {
        console.error(`Error fetching ${categoryName} category:`, categoryError);
        return;
      }

      if (category) {
        setCategoryId(category.id);
        
        if (showSubcategories) {
          const { data: subcategoriesData, error: subcategoriesError } = await supabase
            .from("categories")
            .select("*")
            .eq("parent_id", category.id);

          if (subcategoriesError) {
            console.error("Error fetching subcategories:", subcategoriesError);
            return;
          }

          setSubcategories(subcategoriesData || []);
        }
      }
    };

    fetchCategories();
  }, [categoryName, showSubcategories]);

  return {
    categoryId,
    subcategories,
  };
};