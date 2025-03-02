import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { BeautyProduct } from '@/types/beauty-product';
import { CreateBeautyListingModal } from './CreateBeautyListingModal';
import { BeautyProductCard } from './BeautyProductCard';
import { BeautyProductDetail } from './BeautyProductDetail';
import { Database } from '@/integrations/supabase/types';
import { handleAsyncError, getSupabaseErrorMessage } from '@/lib/error-handling';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

// Define a type for the raw database result
type BeautyMarketplaceListingRaw = Database['public']['Tables']['beauty_marketplace_listings']['Row'] & {
  seller: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
};

export const BeautyMarketplace = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BeautyProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['beauty-marketplace-listings'],
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
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data) return [] as BeautyProduct[];

        // Transform the data to match our BeautyProduct type
        return (data as unknown as BeautyMarketplaceListingRaw[]).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category as BeautyProduct['category'],
          brand: item.category, // Using category as brand since there's no brand field
          quantity: 1, // Default quantity
          images: item.images || [],
          seller_id: item.seller_id,
          location_id: item.location,
          status: item.status as BeautyProduct['status'],
          created_at: item.created_at,
          seller: item.seller ? {
            id: item.seller.id,
            username: item.seller.username,
            avatar_url: item.seller.avatar_url || undefined
          } : undefined,
          location: {
            id: item.location,
            city: item.location,
            state: ''
          }
        })) as BeautyProduct[];
      } catch (error) {
        handleAsyncError(error, "Failed to load beauty products");
        throw error;
      }
    },
    retry: 1,
  });

  const handleProductClick = (product: BeautyProduct) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = products?.filter(product => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2 sm:mb-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Beauty Products Marketplace</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          List Product
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products by name, brand, or category..."
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
        <>
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <BeautyProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {searchQuery.trim() ? 'No products match your search.' : 'No products found.'}
              </p>
              <p className="text-gray-500">
                {searchQuery.trim() ? 'Try a different search term.' : 'Be the first to list a product!'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Create listing modal */}
      <CreateBeautyListingModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Product detail modal */}
      {selectedProduct && (
        <BeautyProductDetail
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};
