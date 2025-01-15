import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostForm } from "@/components/posts/news-politics/PostForm";

interface TechnologyCreatePostProps {
  categoryId?: string;
}

export const TechnologyCreatePost = ({ categoryId }: TechnologyCreatePostProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    subcategoryId: string;
    isLive: boolean;
    selectedFiles: File[];
  }) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create a post",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let uploadedImageUrls: string[] = [];
      if (formData.selectedFiles.length > 0) {
        for (const file of formData.selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            toast({
              title: "Upload failed",
              description: `Failed to upload ${file.name}`,
              variant: "destructive",
            });
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl);
        }
      }

      const { error } = await supabase
        .from("posts")
        .insert([
          {
            title: formData.title,
            content: formData.content,
            user_id: user.id,
            category_id: categoryId,
            subcategory_id: formData.subcategoryId || null,
            is_live: formData.isLive,
            image_url: uploadedImageUrls[0], // Use the first image as the main image
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created",
      });
      
      navigate("/categories/technology");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Technology Post</h1>
        <p className="text-muted-foreground">Share your tech insights with the community</p>
      </div>
      
      <PostForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        categoryName="Technology"
      />
    </div>
  );
};