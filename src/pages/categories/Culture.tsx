import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CultureHeader } from "@/components/categories/culture/CultureHeader";
import { CultureContent } from "@/components/categories/culture/CultureContent";
import { CultureSidebar } from "@/components/categories/culture/CultureSidebar";
import { BackNavigation } from "@/components/BackNavigation";

const Culture = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["culture-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("name", "Culture & Personals")
        .single();

      if (error) throw error;
      
      const { data: subcategories, error: subError } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", data.id);

      if (subError) throw subError;

      return { mainCategory: data, subcategories };
    },
  });

  return (
    <div className="container py-6">
      <BackNavigation />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <CultureHeader />
          <CultureContent 
            categories={categories} 
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
          />
        </div>
        <div className="lg:col-span-3">
          <CultureSidebar 
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Culture;