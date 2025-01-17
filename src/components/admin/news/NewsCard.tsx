import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewsCardProps {
  post: Post;
  onPublish: (postId: string) => Promise<void>;
}

export const NewsCard = ({ post, onPublish }: NewsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const { toast } = useToast();

  const handleViewOriginal = () => {
    if (post.source_url) {
      window.open(post.source_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleImageUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        await supabase
          .from('posts')
          .update({ image_url: publicUrl })
          .eq('id', post.id);

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveContent = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', post.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-muted-foreground">{content}</p>
          )}

          <div className="space-y-4">
            <ImageUpload
              onImagesChange={handleImageUpload}
              currentImageUrl={post.image_url}
              className="mt-4"
            />
          </div>

          <div className="flex justify-end gap-2">
            {post.source_url && (
              <Button
                variant="outline"
                onClick={handleViewOriginal}
              >
                View Original
              </Button>
            )}
            
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveContent}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Content
              </Button>
            )}

            <Button onClick={() => onPublish(post.id)}>
              Publish Article
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};