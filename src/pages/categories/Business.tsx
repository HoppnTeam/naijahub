import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { BackNavigation } from "@/components/BackNavigation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessResources } from "@/components/categories/business/BusinessResources";
import { BusinessPosts } from "@/components/categories/business/BusinessPosts";

const Business = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const navigate = useNavigate();

  const { data: subcategories } = useQuery({
    queryKey: ["business-subcategories"],
    queryFn: async () => {
      const { data: businessCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Business")
        .single();

      if (!businessCategory) return [];

      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", businessCategory.id);

      return data || [];
    },
  });

  const handleCreatePost = async () => {
    const { data: businessCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("name", "Business")
      .single();

    navigate("/categories/business/create", {
      state: { 
        category: "Business", 
        categoryId: businessCategory?.id,
      }
    });
  };

  return (
    <div className="container py-8">
      <BackNavigation />
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Business Hub</h1>
        </div>
        <Button onClick={handleCreatePost}>Create Post</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <BusinessPosts
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            subcategories={subcategories}
          />
        </div>

        <div className="col-span-1">
          <BusinessResources />
        </div>
      </div>
    </div>
  );
};

export default Business;