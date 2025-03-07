import { UploadCloud } from "lucide-react";
import { useState } from "react";

export interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  multiple?: boolean;
  currentImageUrl?: string;
  onImageUploaded?: (url: string) => void;
  bucket?: string;
  className?: string;
  maxFiles?: number;
  accept?: string;
}

export const ImageUpload = ({ 
  onImagesChange, 
  multiple = false,
  currentImageUrl,
  onImageUploaded,
  bucket = "post-images",
  className = "",
  maxFiles = 1,
  accept = "image/*"
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      if (maxFiles && files.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      onImagesChange(multiple ? files : [files[0]]);
      setUploadedFiles(files.map(file => file.name));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      if (maxFiles && files.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      onImagesChange(multiple ? files : [files[0]]);
      setUploadedFiles(files.map(file => file.name));
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
        hover:border-primary hover:bg-primary/5 ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Drag and drop your {multiple ? "images" : "image"} here, or click to select
        </p>
        {uploadedFiles.length > 0 && (
          <div className="mt-2 text-sm text-green-600">
            {uploadedFiles.length} {uploadedFiles.length === 1 ? "file" : "files"} selected:
            <ul className="mt-1">
              {uploadedFiles.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
          </div>
        )}
        {currentImageUrl && (
          <img 
            src={currentImageUrl} 
            alt="Current" 
            className="mt-4 max-h-32 mx-auto"
          />
        )}
      </label>
    </div>
  );
};