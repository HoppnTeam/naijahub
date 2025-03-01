import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a storage bucket if it doesn't exist
 */
export const createBucketIfNotExists = async (bucketName: string, isPublic: boolean = false) => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
      });
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Bucket ${bucketName} created successfully`);
      return true;
    }
    
    console.log(`Bucket ${bucketName} already exists`);
    return true;
  } catch (error) {
    console.error(`Error checking/creating bucket ${bucketName}:`, error);
    return false;
  }
};

/**
 * Sets up all required storage buckets for the application
 */
export const setupStorage = async () => {
  // Create product-images bucket (public)
  await createBucketIfNotExists('product-images', true);
};
