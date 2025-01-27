import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/posts/ImageUpload";

export const CreatePersonalAd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    seeking_gender: "",
    age_range: "",
    relationship_type: "",
    location_preference: "",
    interests: [] as string[],
    image_url: "",
  });

  const handleImageUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      try {
        const { error: uploadError, data } = await supabase.storage
          .from('post-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, image_url: publicUrl }));
      } catch (error) {
        toast({
          title: "Error uploading image",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get the Culture & Personals category and Personal Ads subcategory
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Culture & Personals')
        .single();

      const { data: subcategoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Relationships & Dating')
        .eq('parent_id', categoryData?.id)
        .single();

      const { error } = await supabase.from('posts').insert({
        ...formData,
        user_id: user.id,
        category_id: categoryData?.id,
        subcategory_id: subcategoryData?.id,
      });

      if (error) throw error;

      toast({
        title: "Personal Ad Created",
        description: "Your personal ad has been published successfully.",
      });

      navigate("/categories/culture");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your personal ad.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Write a catchy title for your personal ad"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seeking_gender">Seeking</Label>
        <Select
          value={formData.seeking_gender}
          onValueChange={(value) => setFormData(prev => ({ ...prev, seeking_gender: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="any">Any</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="age_range">Age Range</Label>
        <Input
          id="age_range"
          value={formData.age_range}
          onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
          placeholder="e.g. 25-35"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationship_type">Relationship Type</Label>
        <Select
          value={formData.relationship_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, relationship_type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="What are you looking for?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="friendship">Friendship</SelectItem>
            <SelectItem value="dating">Dating</SelectItem>
            <SelectItem value="long-term">Long Term Relationship</SelectItem>
            <SelectItem value="marriage">Marriage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_preference">Location Preference</Label>
        <Input
          id="location_preference"
          value={formData.location_preference}
          onChange={(e) => setFormData(prev => ({ ...prev, location_preference: e.target.value }))}
          placeholder="e.g. Lagos, Nigeria"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Input
          id="interests"
          value={formData.interests.join(", ")}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            interests: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
          }))}
          placeholder="e.g. Movies, Travel, Music"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">About Me</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Tell potential matches about yourself..."
          className="min-h-[150px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Profile Picture (Optional)</Label>
        <ImageUpload
          onImagesChange={handleImageUpload}
          currentImageUrl={formData.image_url}
          multiple={false}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Personal Ad"}
      </Button>
    </form>
  );
};