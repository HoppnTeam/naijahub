import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AgricultureHeader } from "@/components/categories/agriculture/AgricultureHeader";
import { AgriculturePosts } from "@/components/categories/agriculture/AgriculturePosts";
import { AgricultureSidebar } from "@/components/categories/agriculture/AgricultureSidebar";
import { BackNavigation } from "@/components/BackNavigation";
import { PlusCircle } from "lucide-react";

const Agriculture = () => {
  const navigate = useNavigate();

  const { data: category } = useQuery({
    queryKey: ["agriculture-category"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Agriculture")
        .single();
      return data;
    },
  });

  const handleCreatePost = () => {
    navigate("/create-post", {
      state: { category: "Agriculture", categoryId: category?.id },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackNavigation />
      <div className="flex justify-between items-center mb-6">
        <AgricultureHeader />
        <Button onClick={handleCreatePost} className="gap-2">
          <PlusCircle className="w-5 h-5" />
          Create Post
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AgriculturePosts />
        </div>
        <div>
          <AgricultureSidebar />
        </div>
      </div>
    </div>
  );
};

export default Agriculture;