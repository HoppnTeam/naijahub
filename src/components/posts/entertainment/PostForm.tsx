import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { CategorySelect } from "@/components/posts/CategorySelect";

interface PostFormProps {
  onSubmit: (data: { title: string; content: string; image_url?: string }) => void;
  categoryName: string;
  selectedSubcategoryId: string;
  onSubcategoryChange: (id: string) => void;
}

export const PostForm = ({
  onSubmit,
  categoryName,
  selectedSubcategoryId,
  onSubcategoryChange,
}: PostFormProps) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      image_url: imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <Input
          {...register("title", { required: "Title is required" })}
          placeholder="Post title"
          className="text-lg"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.title.message as string}
          </p>
        )}
      </div>

      <CategorySelect
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategoryChange={onSubcategoryChange}
        categoryName={categoryName}
      />

      <div>
        <Textarea
          {...register("content", { required: "Content is required" })}
          placeholder="Write your post content here..."
          className="min-h-[200px]"
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">
            {errors.content.message as string}
          </p>
        )}
      </div>

      <ImageUpload
        onImageUploaded={setImageUrl}
        className="w-full aspect-video"
      />

      <Button type="submit" className="w-full">
        Create Post
      </Button>
    </form>
  );
};