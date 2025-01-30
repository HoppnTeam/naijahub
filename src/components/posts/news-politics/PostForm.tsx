import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelect } from "@/components/posts/CategorySelect";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { LiveDiscussionToggle } from "@/components/posts/LiveDiscussionToggle";

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
  selectedSubcategoryId?: string;
  onSubcategoryChange?: (value: string) => void;
}

export const PostForm = ({ 
  onSubmit, 
  isLoading, 
  categoryName,
  selectedSubcategoryId = "",
  onSubcategoryChange = () => {},
}: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subcategoryId, setSubcategoryId] = useState(selectedSubcategoryId);
  const [isLive, setIsLive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        onSubcategoryChange={(value) => {
          setSubcategoryId(value);
          onSubcategoryChange(value);
        }}
        categoryName={categoryName}
      />

      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[200px]"
        />

        <ImageUpload
          onImagesChange={setSelectedFiles}
          maxFiles={5}
          accept="image/*"
        />

        <LiveDiscussionToggle
          isLive={isLive}
          onLiveChange={(checked) => setIsLive(checked)}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
};