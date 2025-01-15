import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./ImageUpload";
import { CategorySelect } from "./CategorySelect";
import { LiveDiscussionToggle } from "./LiveDiscussionToggle";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
            is_live: showLiveDiscussion ? isLive : false,
            image_urls: uploadedImageUrls,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created",
      });
      
      navigate(redirectPath);
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
      <h1 className="text-3xl font-bold mb-8">Create a New {categoryName} Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {showSubcategories && (
          <CategorySelect
            subcategories={subcategories}
            selectedSubcategoryId={subcategoryId}
            onSubcategoryChange={setSubcategoryId}
            categoryName={categoryName}
          />
        )}
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title"
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