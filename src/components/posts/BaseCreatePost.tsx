import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  // Fetch category and its subcategories
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
        {showSubcategories && subcategories.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="subcategory">{categoryName} Category</Label>
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

        {showLiveDiscussion && (
          <div className="flex items-center space-x-2">
            <Switch
              id="live-discussion"
              checked={isLive}
              onCheckedChange={setIsLive}
            />
            <Label htmlFor="live-discussion">Mark as Live Discussion</Label>
          </div>
        )}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};