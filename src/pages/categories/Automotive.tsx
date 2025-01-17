import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AutomotiveHeader } from "@/components/categories/automotive/AutomotiveHeader";
import { AutomotiveContent } from "@/components/categories/automotive/AutomotiveContent";
import { AutomotiveSidebar } from "@/components/categories/automotive/AutomotiveSidebar";
import { BackNavigation } from "@/components/BackNavigation";

const Automotive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", "automotive"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Automotive")
        .single();

      if (!parentCategory) return [];

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <AutomotiveHeader onSearch={setSearchQuery} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <AutomotiveContent 
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={setSelectedSubcategory}
            searchQuery={searchQuery}
          />
        </div>
        <div className="lg:col-span-1">
          <AutomotiveSidebar />
        </div>
      </div>
    </div>
  );
};

export default Automotive;