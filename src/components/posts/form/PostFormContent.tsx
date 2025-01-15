import { CategorySelect } from "../CategorySelect";
import { PostFormFields } from "./PostFormFields";
import { ImageUpload } from "../ImageUpload";
import { LiveDiscussionToggle } from "../LiveDiscussionToggle";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface PostFormContentProps {
  subcategories: Category[];
  subcategoryId: string;
  onSubcategoryChange: (value: string) => void;
  categoryName: string;
  showSubcategories: boolean;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  showHeadline: boolean;
  onImagesChange: (files: File[]) => void;
  isLive: boolean;
  onLiveChange: (checked: boolean) => void;
  showLiveDiscussion: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const PostFormContent = ({
  subcategories,
  subcategoryId,
  onSubcategoryChange,
  categoryName,
  showSubcategories,
  title,
  content,
  onTitleChange,
  onContentChange,
  showHeadline,
  onImagesChange,
  isLive,
  onLiveChange,
  showLiveDiscussion,
  isLoading,
  onSubmit,
}: PostFormContentProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {showSubcategories && (
        <CategorySelect
          subcategories={subcategories}
          selectedSubcategoryId={subcategoryId}
          onSubcategoryChange={onSubcategoryChange}
          categoryName={categoryName}
        />
      )}
      
      <PostFormFields
        title={title}
        content={content}
        onTitleChange={onTitleChange}
        onContentChange={onContentChange}
        showHeadline={showHeadline}
      />

      <ImageUpload onImagesChange={onImagesChange} />

      {showLiveDiscussion && (
        <LiveDiscussionToggle
          isLive={isLive}
          onLiveChange={onLiveChange}
        />
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
};