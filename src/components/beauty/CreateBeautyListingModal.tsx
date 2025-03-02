import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/use-location';
import { supabase } from '@/integrations/supabase/client';
import { BeautyProduct, BeautyCategory } from '@/types/beauty-product';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const BEAUTY_CATEGORIES: BeautyCategory[] = [
  'Skincare',
  'Haircare',
  'Makeup',
  'Fragrance',
  'Bath & Body',
  'Tools & Accessories'
];

const createListingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  ingredients: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

interface CreateBeautyListingModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateBeautyListingModal = ({ open, onClose }: CreateBeautyListingModalProps) => {
  const { user } = useAuth();
  const { getCurrentLocation } = useLocation();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      price: 0,
      quantity: 1,
      category: '',
    }
  });

  // Function to upload images to Supabase Storage
  const uploadImages = async (imageDataUrls: string[]) => {
    if (!user) throw new Error('Must be logged in');
    
    const uploadedUrls: string[] = [];
    setIsUploading(true);
    
    try {
      // Check if bucket exists by trying to list files
      const { data: bucketList, error: bucketError } = await supabase.storage.listBuckets();
      
      // Default bucket to use
      let bucketName = 'avatars'; // Use an existing bucket as fallback
      
      // Check if our preferred bucket exists
      const productBucket = bucketList?.find(bucket => bucket.name === 'product-images');
      if (productBucket) {
        bucketName = 'product-images';
      }
      
      for (const dataUrl of imageDataUrls) {
        // Convert data URL to blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        
        // Generate a unique filename
        const fileExt = blob.type.split('/')[1] || 'png';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `beauty-products/${user.id}/${fileName}`;
        
        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from(bucketName)
          .upload(filePath, blob, {
            contentType: blob.type,
            upsert: true
          });
          
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
          
        uploadedUrls.push(urlData.publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error in uploadImages:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const createListing = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      if (!user) throw new Error('Must be logged in');
      if (images.length === 0) throw new Error('At least one image is required');
      if (!selectedCategory) throw new Error('Category is required');

      const location = await getCurrentLocation();
      if (!location) throw new Error('Location is required');
      
      // Upload images first
      const imageUrls = await uploadImages(images);
      
      const { data: listing, error } = await supabase
        .from('beauty_products')
        .insert({
          ...data,
          category: selectedCategory,
          seller_id: user.id,
          images: imageUrls,
          location_id: location.id,
          status: 'available',
          ingredients: data.ingredients?.split(',').map(i => i.trim()) || [],
        })
        .select()
        .single();

      if (error) throw error;
      return listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beauty-products'] });
      toast({
        title: "Success",
        description: "Product listed successfully"
      });
      reset();
      setImages([]);
      setSelectedCategory("");
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const onSubmit = (data: CreateListingForm) => {
    createListing.mutate(data);
  };

  const handleImageChange = (newImages: string[]) => {
    // Limit to 4 images
    setImages(newImages.slice(0, 4));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Beauty Product Listing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                {...register('brand')}
                className={errors.brand ? 'border-red-500' : ''}
              />
              {errors.brand && (
                <p className="text-sm text-red-500">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {BEAUTY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {!selectedCategory && (
                <p className="text-sm text-red-500">Category is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity', { valueAsNumber: true })}
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
              <Textarea
                id="ingredients"
                {...register('ingredients')}
              />
            </div>

            <div>
              <Label>Product Images (Up to 4)</Label>
              <div className="mt-2">
                <ImageUpload
                  value={images}
                  onChange={handleImageChange}
                  disabled={isUploading || createListing.isPending}
                  maxFiles={4}
                />
                {images.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">At least one image is required</p>
                )}
                {images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {images.length} of 4 images selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || createListing.isPending || images.length === 0 || !selectedCategory}
            >
              {isUploading ? 'Uploading Images...' : 
               createListing.isPending ? 'Creating Listing...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
