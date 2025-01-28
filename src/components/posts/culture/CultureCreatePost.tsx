import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "../news-politics/PostForm";
import { useToast } from "@/components/ui/use-toast";

export const CultureCreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const categoryId = "c63e8583-cd1d-433c-8e13-b6f6ad574be3"; // Culture category ID

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    subcategoryId: string;
    isLive: boolean;
    selectedFiles: File[];
  }) => {
    if (!user) return;

    try {
      setIsLoading(true);

      let imageUrl;
      if (formData.selectedFiles.length > 0) {
        const file = formData.selectedFiles[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("posts").insert({
        title: formData.title,
        content: formData.content,
        image_url: imageUrl,
        user_id: user.id,
        category_id: categoryId,
        subcategory_id: formData.subcategoryId,
        is_live: formData.isLive,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      navigate("/culture");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please sign in to create a post.</div>;
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Create Culture Post</h1>
      <PostForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        categoryName="Culture & Personals"
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategoryChange={setSelectedSubcategoryId}
      />
    </div>
  );
};