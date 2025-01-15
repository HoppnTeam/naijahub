import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./ImageUpload";
import { CategorySelect } from "./CategorySelect";
import { LiveDiscussionToggle } from "./LiveDiscussionToggle";
import { PostFormHeader } from "./form/PostFormHeader";
import { PostFormFields } from "./form/PostFormFields";
import { usePostForm } from "./form/usePostForm";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface BaseCreatePostProps {
  categoryName: string;
  redirectPath: string;
  showSubcategories?: boolean;
  showLiveDiscussion?: boolean;
}

export const BaseCreatePost = ({
  categoryName,
  redirectPath,
  showSubcategories = true,
  showLiveDiscussion = true,
}: BaseCreatePostProps) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    categoryId,
    setCategoryId,
    subcategoryId,
    setSubcategoryId,
    isLive,
    setIsLive,
    isLoading,
    selectedFiles,
    setSelectedFiles,
    handleSubmit,
  } = usePostForm({
    categoryName,
    redirectPath,
    showLiveDiscussion,
  });

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

  return (
    <div className="container max-w-2xl py-8">
      <PostFormHeader categoryName={categoryName} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {showSubcategories && (
          <CategorySelect
            subcategories={subcategories}
            selectedSubcategoryId={subcategoryId}
            onSubcategoryChange={setSubcategoryId}
            categoryName={categoryName}
          />
        )}
        
        <PostFormFields
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
        />

        <ImageUpload onImagesChange={setSelectedFiles} />

        {showLiveDiscussion && (
          <LiveDiscussionToggle
            isLive={isLive}
            onLiveChange={setIsLive}
          />
        )}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};