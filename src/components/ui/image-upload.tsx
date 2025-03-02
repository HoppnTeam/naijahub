import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
  disabled?: boolean;
  maxFiles?: number;
}

export const ImageUpload = ({
  onChange,
  value,
  disabled,
  maxFiles = 4
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange([...(value || []), event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [onChange, value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    disabled,
    maxFiles
  });

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img
              className="object-cover w-full h-full"
              src={url}
              alt="Product image"
            />
          </div>
        ))}
      </div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center
          ${isDragActive ? 'border-[#32a852]' : 'border-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#32a852]'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-gray-500" />
          <p className="text-sm text-gray-500">
            Drag & drop images here, or click to select
          </p>
          <p className="text-xs text-gray-400">
            (Up to {maxFiles} images, PNG, JPG, JPEG, GIF)
          </p>
        </div>
      </div>
    </div>
  );
};
