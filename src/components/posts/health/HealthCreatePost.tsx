import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CategorySelect } from "@/components/posts/CategorySelect";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { BackNavigation } from "@/components/BackNavigation";

interface HealthCreatePostProps {
  categoryId?: string;
}

export const HealthCreatePost = ({ categoryId }: HealthCreatePostProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        title,
        content,
        image_url: imageUrl,
        user_id: user.id,
        category_id: categoryId,
        subcategory_id: selectedSubcategoryId || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your health post has been created successfully.",
      });

      navigate("/categories/health");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <BackNavigation />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Health Post</h1>
          <p className="text-muted-foreground">Share your health insights and experiences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CategorySelect
            selectedSubcategoryId={selectedSubcategoryId}
            onSubcategoryChange={setSelectedSubcategoryId}
            categoryName="Health"
          />

          <div className="space-y-2">
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Share your health knowledge..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[200px]"
            />
          </div>

          <ImageUpload
            onImagesChange={(files) => {
              if (files.length > 0) {
                const file = files[0];
                setImageUrl(URL.createObjectURL(file));
              }
            }}
            currentImageUrl={imageUrl || undefined}
            onImageUploaded={setImageUrl}
            bucket="post-images"
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </div>
    </div>
  );
};