import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { handleAsyncError } from '@/lib/error-handling';
import { Location } from '@/types/location';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Loader2, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().nonnegative('Mileage must be a positive number'),
  fuel_type: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  color: z.string().min(1, 'Color is required'),
  condition: z.string().min(1, 'Condition is required'),
  features: z.string().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateAutoListingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userLocation: Location | null;
  onRequestLocation: () => Promise<Location | null>;
  isLocationLoading: boolean;
}

export const CreateAutoListingModal = ({
  open,
  onClose,
  onSuccess,
  userLocation,
  onRequestLocation,
  isLocationLoading,
}: CreateAutoListingModalProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      fuel_type: '',
      transmission: '',
      color: '',
      condition: 'Used',
      features: '',
      images: [],
    },
  });
  
  const createListingMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user) throw new Error('You must be logged in to create a listing');
      if (!userLocation) throw new Error('Location is required to create a listing');
      
      try {
        // Parse features string to array
        const featuresArray = values.features
          ? values.features.split(',').map(feature => feature.trim()).filter(Boolean)
          : [];
        
        const { data, error } = await supabase
          .from('auto_marketplace_listings')
          .insert({
            title: values.title,
            description: values.description,
            price: values.price,
            make: values.make,
            model: values.model,
            year: values.year,
            mileage: values.mileage,
            fuel_type: values.fuel_type,
            transmission: values.transmission,
            color: values.color,
            condition: values.condition,
            features: featuresArray,
            images: values.images,
            seller_id: user.id,
            location_id: userLocation.id,
            status: 'available',
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        handleAsyncError(error, 'Failed to create listing');
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      onClose();
      if (onSuccess) onSuccess();
    },
  });
  
  const handleSubmit = async (values: FormValues) => {
    createListingMutation.mutate(values);
  };
  
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;
    
    setIsUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `auto-listings/${user.id}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('marketplace')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('marketplace')
          .getPublicUrl(filePath);
          
        return publicUrl;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...uploadedUrls], { shouldValidate: true });
    } catch (error) {
      handleAsyncError(error, 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images');
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue('images', newImages, { shouldValidate: true });
  };
  
  const handleLocationRequest = async () => {
    await onRequestLocation();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List Your Vehicle</DialogTitle>
          <DialogDescription>
            Fill out the form below to list your vehicle on the marketplace.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Location section */}
            <div className="space-y-2">
              <FormLabel>Your Location</FormLabel>
              {userLocation ? (
                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    {userLocation.city}, {userLocation.state}, {userLocation.country}
                  </AlertDescription>
                </Alert>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleLocationRequest}
                  disabled={isLocationLoading}
                  className="w-full"
                >
                  {isLocationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Share your location
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {/* Basic information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2019 Toyota Camry in excellent condition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₦)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your vehicle in detail..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Vehicle details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Camry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fuel_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="CNG">CNG</SelectItem>
                        <SelectItem value="LPG">LPG</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                        <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                        <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                        <SelectItem value="For Parts">For Parts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter features separated by commas (e.g. Leather seats, Sunroof, Bluetooth)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    List the key features of your vehicle, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      images={field.value}
                      onUpload={handleImageUpload}
                      onRemove={handleRemoveImage}
                      isUploading={isUploading}
                      maxImages={6}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload up to 6 images of your vehicle. The first image will be the main image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={createListingMutation.isPending || isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createListingMutation.isPending || isUploading || !userLocation}
              >
                {createListingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
