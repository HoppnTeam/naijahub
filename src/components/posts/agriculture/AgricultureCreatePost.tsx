import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { CategorySelect } from "@/components/posts/CategorySelect";
import { LiveDiscussionToggle } from "@/components/posts/LiveDiscussionToggle";
import { useToast } from "@/hooks/use-toast";

interface AgricultureCreatePostProps {
  categoryId: string;
}

export const AgricultureCreatePost = ({ categoryId }: AgricultureCreatePostProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLive, setIsLive] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      const { data: post, error } = await supabase
        .from("posts")
        .insert([
          {
            title,
            content,
            image_url: imageUrl,
            user_id: user.id,
            category_id: categoryId,
            subcategory_id: selectedSubcategoryId,
            is_live: isLive,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created.",
      });

      navigate(`/posts/${post.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[200px]"
        />
      </div>

      <CategorySelect
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategoryChange={setSelectedSubcategoryId}
        categoryName="Agriculture"
      />

      <ImageUpload
        currentImageUrl={imageUrl}
        onImageUploaded={setImageUrl}
        bucket="post-images"
      />

      <LiveDiscussionToggle isLive={isLive} onLiveChange={setIsLive} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
};