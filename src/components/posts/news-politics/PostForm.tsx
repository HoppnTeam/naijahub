import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "../ImageUpload";
import { LiveDiscussionToggle } from "../LiveDiscussionToggle";
import { CategorySelect } from "../CategorySelect";

interface PostFormProps {
  onSubmit: (formData: {
    title: string;
    content: string;
    subcategoryId: string;
    isLive: boolean;
    selectedFiles: File[];
  }) => void;
  isLoading: boolean;
  categoryName: string;
}

export const PostForm = ({ onSubmit, isLoading, categoryName }: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      subcategoryId,
      isLive,
      selectedFiles,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CategorySelect
        selectedSubcategoryId={subcategoryId}
        onSubcategoryChange={setSubcategoryId}
        categoryName={categoryName}
      />
      
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
  );
};