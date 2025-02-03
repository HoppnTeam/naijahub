import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/posts/ImageUpload";

export const ISSUE_CATEGORIES = [
  { value: "content", label: "Content Related" },
  { value: "transaction", label: "Transaction Related" },
  { value: "app_improvement", label: "App Improvements" },
  { value: "user_related", label: "User Related" },
  { value: "general", label: "General Issues" }
] as const;

export type IssueCategory = typeof ISSUE_CATEGORIES[number]["value"];

interface ReportFormProps {
  onSubmit: (data: {
    category: IssueCategory;
    subject: string;
    description: string;
    selectedImage: File[];
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const ReportForm = ({ onSubmit, isSubmitting }: ReportFormProps) => {
  const [category, setCategory] = useState<IssueCategory>("content");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ category, subject, description, selectedImage });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value: IssueCategory) => setCategory(value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select issue category" />
          </SelectTrigger>
          <SelectContent>
            {ISSUE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief subject of the issue"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail"
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Attach Image (Optional)</Label>
        <ImageUpload
          onImagesChange={setSelectedImage}
          multiple={false}
          maxFiles={1}
          accept="image/*"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>
    </form>
  );
};