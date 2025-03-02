import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onChange?: (value: string[]) => void;
  value?: string[];
  disabled?: boolean;
  maxFiles?: number;
  onUpload?: (files: FileList | null) => Promise<void>;
  images?: string[];
  onRemove?: (index: number) => void;
  isUploading?: boolean;
  maxImages?: number;
}

export const ImageUpload = ({
  onChange,
  value = [],
  onUpload,
  images = [],
  onRemove,
  isUploading = false,
  disabled = false,
  maxFiles = 4,
  maxImages = 4
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const imageList = images.length > 0 ? images : value;
  const maxCount = maxImages || maxFiles;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onUpload) {
        const fileList = Object.assign(new DataTransfer().files, acceptedFiles);
        onUpload(fileList);
      } else if (onChange) {
        const newFiles = acceptedFiles.slice(0, maxCount - imageList.length);

        if (newFiles.length > 0) {
          Promise.all(
            newFiles.map((file) => {
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
              });
            })
          ).then((dataUrls) => {
            onChange([...imageList, ...dataUrls]);
          });
        }
      }
    },
    [onChange, onUpload, imageList, maxCount]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.webp']
    },
    maxFiles: maxCount - imageList.length,
    disabled: disabled || isUploading || imageList.length >= maxCount
  });

  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index);
    } else if (onChange) {
      const newImages = [...imageList];
      newImages.splice(index, 1);
      onChange(newImages);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-md p-4 transition-colors
          ${isDragActive ? 'border-primary' : 'border-gray-300'}
          ${disabled || imageList.length >= maxCount ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-6 w-6 text-gray-500" />
          <div className="text-sm text-gray-500">
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>
                Drag & drop images here, or click to select
                <br />
                <span className="text-xs">
                  {imageList.length}/{maxCount} images used
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center p-2">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm">Uploading images...</span>
        </div>
      )}

      {imageList.length > 0 && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {imageList.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={() => handleRemove(index)}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
