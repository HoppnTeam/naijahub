import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntertainmentHeader } from "@/components/categories/entertainment/EntertainmentHeader";
import { EntertainmentSidebar } from "@/components/categories/entertainment/EntertainmentSidebar";
import { CelebrityCorner } from "@/components/categories/entertainment/CelebrityCorner";
import { EntertainmentPosts } from "@/components/categories/entertainment/EntertainmentPosts";
import { BackNavigation } from "@/components/BackNavigation";

const Entertainment = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | undefined>();

  const { data: categories } = useQuery({
    queryKey: ["categories", "entertainment"],
    queryFn: async () => {
      const { data: parentCategory, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Entertainment")
        .single();

      if (parentError) throw parentError;
      if (!parentCategory) return { mainCategory: null, subcategories: [] };

      const { data: subcategories, error: subError } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id)
        .neq("name", "Arts & Culture");

      if (subError) throw subError;

      return {
        mainCategory: parentCategory,
        subcategories: subcategories || [],
      };
    },
  });

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId === selectedSubcategoryId ? undefined : subcategoryId);
  };

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <EntertainmentHeader
        onSearch={setSearchQuery}
        onCreatePost={() => navigate("/categories/entertainment/create", { 
          state: { 
            category: "Entertainment",
            categoryId: categories?.mainCategory?.id,
            subcategories: categories?.subcategories 
          }
        })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CelebrityCorner />
          <div className="mt-8">
            <EntertainmentPosts
              categoryId={categories?.mainCategory?.id}
              subcategories={categories?.subcategories}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />
          </div>
        </div>

        <EntertainmentSidebar 
          subcategories={categories?.subcategories}
          onSubcategorySelect={handleSubcategorySelect}
          selectedSubcategoryId={selectedSubcategoryId}
        />
      </div>
    </div>
  );
};

export default Entertainment;