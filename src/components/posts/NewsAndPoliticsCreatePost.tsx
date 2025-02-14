import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { LiveDiscussionToggle } from "./LiveDiscussionToggle";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface NewsAndPoliticsCreatePostProps {
  categoryId?: string;
  subcategories?: Category[];
}

export const NewsAndPoliticsCreatePost = ({ 
  categoryId,
  subcategories = []
}: NewsAndPoliticsCreatePostProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!subcategoryId && subcategories.length > 0) {
      toast({
        title: "Select a subcategory",
        description: "Please select a subcategory for your post",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let uploadedImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedImageUrls = await uploadImages();
      }

      const { error } = await supabase
        .from("posts")
        .insert([
          {
            title,
            content,
            user_id: user.id,
            category_id: categoryId,
            subcategory_id: subcategoryId || null,
            is_live: isLive,
            image_urls: uploadedImageUrls,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created",
      });
      
      navigate("/categories/news-politics");
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
        <h1 className="text-2xl font-bold">Create News & Politics Post</h1>
        <p className="text-muted-foreground">Share news and political insights with the community</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {subcategories.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="subcategory">Select Subcategory</Label>
            <Select value={subcategoryId} onValueChange={setSubcategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="title">Headline</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your headline"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            className="min-h-[200px]"
            required
          />
        </div>

        <ImageUpload onImagesChange={setSelectedFiles} />

        <LiveDiscussionToggle
          isLive={isLive}
          onLiveChange={setIsLive}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};