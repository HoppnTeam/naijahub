import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { BeautyProduct, BeautyCategory } from '@/types/beauty-product';
import { BeautyMarketplaceListing } from '@/types/marketplace';
import { CreateBeautyListingModal } from './CreateBeautyListingModal';
import { BeautyProductCard } from './BeautyProductCard';
import { BeautyProductDetail } from './BeautyProductDetail';
import { Database } from '@/integrations/supabase/types';
import { handleAsyncError, getSupabaseErrorMessage } from '@/lib/error-handling';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

// Define a type for the raw database result
type BeautyMarketplaceListingRaw = Database['public']['Tables']['beauty_marketplace_listings']['Row'] & {
  seller: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
};

// Define a type for the transformed product data
interface TransformedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  brand: string;
  category: string;
  condition: string;
  seller: {
    id: string;
    username: string;
    avatarUrl: string | null;
  } | null;
  createdAt: string;
}

// Define a mapping function to convert TransformedProduct to BeautyProduct
const mapToBeautyProduct = (product: TransformedProduct): BeautyProduct => {
  return {
    id: product.id,
    title: product.name,
    description: product.description,
    price: product.price,
    category: product.category as BeautyCategory,
    brand: product.brand,
    quantity: 1,
    images: [product.imageUrl],
    seller_id: product.seller?.id || '',
    location_id: '',
    status: 'available',
    created_at: product.createdAt,
    seller: product.seller ? {
      id: product.seller.id,
      username: product.seller.username,
      avatar_url: product.seller.avatarUrl
    } : undefined,
    condition: product.condition
  };
};

export const BeautyMarketplace = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TransformedProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { 
    data: products, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['beauty-marketplace'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('beauty_marketplace_listings')
          .select(`
            *,
            seller:profiles (
              id,
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(getSupabaseErrorMessage(error));
        }

        // Cast and transform the data
        return (data as unknown as BeautyMarketplaceListingRaw[]).map(item => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: item.price,
          imageUrl: item.images[0] || '',
          brand: item.category,
          category: item.category,
          condition: item.condition,
          seller: item.seller ? {
            id: item.seller.id,
            username: item.seller.username,
            avatarUrl: item.seller.avatar_url
          } : null,
          createdAt: item.created_at
        }));
      } catch (err) {
        handleAsyncError(err, 'Failed to load beauty products');
        throw err;
      }
    },
    retry: 2
  });

  const filteredProducts = products?.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const handleRetry = () => {
    toast({
      title: "Retrying",
      description: "Attempting to reload beauty products..."
    });
    refetch();
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
    toast({
      title: "Success",
      description: "Your product has been listed successfully."
    });
  };

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-semibold">Beauty Products Marketplace</h2>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">List Product</span>
            <span className="sm:hidden">List</span>
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-[200px] w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error instanceof Error ? error.message : 'Failed to load products'}</p>
              <Button variant="outline" size="sm" className="w-fit" onClick={handleRetry}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts?.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            ) : (
              filteredProducts?.map((product) => (
                <BeautyProductCard
                  key={product.id}
                  product={mapToBeautyProduct(product)}
                  onClick={() => setSelectedProduct(product)}
                />
              ))
            )}
          </div>
        )}

        {/* Create listing modal */}
        <CreateBeautyListingModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Product detail modal */}
        {selectedProduct && (
          <BeautyProductDetail
            product={mapToBeautyProduct(selectedProduct)}
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </ResponsiveContainer>
  );
};
