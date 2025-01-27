import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "@/components/posts/news-politics/PostForm";

interface CultureCreatePostProps {
  categoryId: string;
}

export const CultureCreatePost = ({ categoryId }: CultureCreatePostProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    image_url?: string;
  }) => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a post",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("posts").insert({
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url,
        user_id: user.id,
        category_id: categoryId,
        subcategory_id: selectedSubcategoryId,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your post has been created",
      });

      navigate("/categories/culture");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "There was an error creating your post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-3xl font-bold mb-6">Create Culture Post</h1>
      <PostForm
        onSubmit={handleSubmit}
        categoryName="Culture & Personals"
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategoryChange={setSelectedSubcategoryId}
      />
    </div>
  );
};