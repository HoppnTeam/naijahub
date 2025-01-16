import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  bucket: string;
  currentImageUrl?: string | null;
}

export const ImageUpload = ({ onImageUploaded, bucket, currentImageUrl }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image (optional)</Label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-[200px]"
          disabled={isUploading}
        >
          <Label htmlFor="image" className="cursor-pointer">
            {isUploading ? "Uploading..." : "Upload Image"}
          </Label>
        </Button>
        <input
          type="file"
          id="image"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </div>
      {currentImageUrl && (
        <img
          src={currentImageUrl}
          alt="Preview"
          className="mt-2 max-w-[200px] rounded-md"
        />
      )}
    </div>
  );
};