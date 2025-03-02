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
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Bath & Body', 'Tools & Accessories']),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

interface CreateBeautyListingModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateBeautyListingModal = ({ open, onClose }: CreateBeautyListingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userLocation } = useLocation();
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      brand: '',
      category: 'Skincare',
      quantity: 1,
    }
  });

  useEffect(() => {
    if (!open) {
      reset();
      setImages([]);
    }
  }, [open, reset]);

  const createListing = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      if (!user) throw new Error('You must be logged in to create a listing');
      if (!userLocation) throw new Error('Location is required');
      if (images.length === 0) throw new Error('At least one image is required');

      const listingId = uuidv4();

      const { error } = await supabase
        .from('beauty_marketplace_listings')
        .insert({
          id: listingId,
          title: data.title,
          description: data.description,
          price: data.price,
          brand: data.brand,
          category: data.category,
          quantity: data.quantity,
          images: images,
          seller_id: user.id,
          location_id: userLocation.id,
          status: 'available',
        });

      if (error) throw error;

      return listingId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beauty-marketplace'] });
      toast({
        title: 'Success',
        description: 'Your beauty product has been listed successfully.',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create listing',
      });
    },
  });

  const onSubmit = async (data: CreateListingForm) => {
    try {
      await createListing.mutateAsync(data);
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to upload images',
      });
      return;
    }

    setIsUploading(true);

    try {
      const newImages = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `beauty-listings/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('marketplace-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('marketplace-images')
          .getPublicUrl(filePath);

        newImages.push(data.publicUrl);
      }

      setImages(newImages);
      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload images',
      });
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Create Beauty Listing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input id="price" type="number" {...register('price')} />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" {...register('quantity')} />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" {...register('brand')} />
            {errors.brand && (
              <p className="text-sm text-red-500">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              {...register('category')}
              className="w-full p-2 border rounded-md"
            >
              {BEAUTY_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <ImageUpload
              onUpload={handleImageUpload}
              images={images}
              onRemove={removeImage}
              isUploading={isUploading}
              maxImages={5}
            />
            {images.length === 0 && (
              <p className="text-sm text-red-500">At least one image is required</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createListing.isPending || isUploading || images.length === 0}
            >
              {createListing.isPending ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
