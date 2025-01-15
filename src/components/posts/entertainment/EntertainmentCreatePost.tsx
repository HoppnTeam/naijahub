import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostForm } from "./PostForm";

export const EntertainmentCreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const uploadImages = async (files: File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
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

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

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
        uploadedImageUrls = await uploadImages(formData.selectedFiles);
      }

      const { error } = await supabase
        .from("posts")
        .insert([
          {
            title: formData.title,
            content: formData.content,
            user_id: user.id,
            category_id: (await supabase
              .from("categories")
              .select("id")
              .eq("name", "Entertainment")
              .single()).data?.id,
            subcategory_id: formData.subcategoryId || null,
            is_live: formData.isLive,
            image_urls: uploadedImageUrls,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created",
      });
      
      navigate("/categories/entertainment");
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
        <h1 className="text-2xl font-bold">Create Entertainment Post</h1>
        <p className="text-muted-foreground">Share entertainment content with the community</p>
      </div>
      
      <PostForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};