import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PostFormFieldsProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  showHeadline?: boolean;
}

export const PostFormFields = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  showHeadline = false,
}: PostFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">{showHeadline ? "Headline" : "Title"}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={showHeadline ? "Enter your headline" : "Enter your post title"}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your post content here..."
          className="min-h-[200px]"
          required
        />
      </div>
    </>
  );
};