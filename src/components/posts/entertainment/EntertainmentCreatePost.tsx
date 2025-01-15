import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "./PostForm";
import { BackNavigation } from "@/components/BackNavigation";

export const EntertainmentCreatePost = () => {
  const navigate = useNavigate();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories", "entertainment"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Entertainment")
        .single();

      if (!parentCategory) return null;

      const { data: subcategories } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id);

      return {
        mainCategory: parentCategory,
        subcategories: subcategories || [],
      };
    },
  });

  const handleCreatePost = async (formData: {
    title: string;
    content: string;
    image_url?: string;
  }) => {
    if (!categories?.mainCategory?.id) {
      console.error("No category ID available");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title: formData.title,
      content: formData.content,
      image_url: formData.image_url,
      category_id: categories.mainCategory.id,
      subcategory_id: selectedSubcategoryId || null,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      console.error("Error creating post:", error);
      return;
    }

    navigate("/categories/entertainment");
  };

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create Entertainment Post</h1>
        <PostForm
          onSubmit={handleCreatePost}
          categoryName="Entertainment"
          selectedSubcategoryId={selectedSubcategoryId}
          onSubcategoryChange={setSelectedSubcategoryId}
        />
      </div>
    </div>
  );
};