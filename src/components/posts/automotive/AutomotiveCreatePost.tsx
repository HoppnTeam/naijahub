import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { CategorySelect } from "@/components/posts/CategorySelect";
import { LiveDiscussionToggle } from "@/components/posts/LiveDiscussionToggle";
import { BackNavigation } from "@/components/BackNavigation";

export const AutomotiveCreatePost = () => {
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
            category_id: "automotive",
            subcategory_id: selectedSubcategoryId,
            is_live: isLive,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your automotive post has been created.",
      });

      navigate(`/categories/automotive`);
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
    <div className="container mx-auto py-8">
      <BackNavigation />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create Automotive Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <CategorySelect
            selectedSubcategoryId={selectedSubcategoryId}
            onSubcategoryChange={setSelectedSubcategoryId}
            categoryName="Automotive"
          />

          <div className="space-y-2">
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
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

          <ImageUpload
            onImagesChange={(files) => {
              if (files.length > 0) {
                // Handle the first image only since we only need one
                const file = files[0];
                // You might want to handle the image upload here
                setImageUrl(URL.createObjectURL(file));
              }
            }}
            currentImageUrl={imageUrl}
            onImageUploaded={setImageUrl}
            bucket="post-images"
          />

          <LiveDiscussionToggle isLive={isLive} onLiveChange={setIsLive} />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </div>
    </div>
  );
};