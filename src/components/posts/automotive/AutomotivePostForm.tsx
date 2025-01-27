import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { LiveDiscussionToggle } from "@/components/posts/LiveDiscussionToggle";
import { CategorySelect } from "@/components/posts/CategorySelect";

interface AutomotivePostFormProps {
  onSubmit: (formData: {
    title: string;
    content: string;
    image_url?: string;
  }) => void;
  categoryName: string;
  selectedSubcategoryId: string;
  onSubcategoryChange: (value: string) => void;
}

export const AutomotivePostForm = ({
  onSubmit,
  categoryName,
  selectedSubcategoryId,
  onSubcategoryChange,
}: AutomotivePostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit({
      title,
      content,
      image_url: imageUrl,
    });
    setIsLoading(false);
  };

  const handleImagesChange = async (files: File[]) => {
    if (files.length > 0) {
      setImageUrl("/placeholder.svg");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CategorySelect
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategoryChange={onSubcategoryChange}
        categoryName={categoryName}
      />
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Share your automotive insights or questions..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write about car maintenance, reviews, or seek advice..."
          className="min-h-[200px]"
          required
        />
      </div>

      <ImageUpload onImagesChange={handleImagesChange} />

      <LiveDiscussionToggle
        isLive={isLive}
        onLiveChange={setIsLive}
      />
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Automotive Post"}
      </Button>
    </form>
  );
};