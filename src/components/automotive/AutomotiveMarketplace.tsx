import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { AutoMarketplaceListing } from '@/types/marketplace';
import { CreateAutoListingModal } from './CreateAutoListingModal';
import { AutoProductCard } from './AutoProductCard';
import { AutoProductDetail } from './AutoProductDetail';
import { Database } from '@/integrations/supabase/types';
import { handleAsyncError, getSupabaseErrorMessage } from '@/lib/error-handling';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useLocation } from '@/hooks/use-location';

// Define a type for the raw database result
type AutoMarketplaceListingRaw = Database['public']['Tables']['auto_marketplace_listings']['Row'] & {
  seller: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
  location: {
    id: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  } | null;
};

// Define a type for the transformed product data
interface TransformedAutoProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  features: string[];
  condition: string;
  seller: {
    id: string;
    username: string;
    avatarUrl: string | null;
  } | null;
  location: {
    id: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  } | null;
  createdAt: string;
}

// Define a mapping function to convert TransformedAutoProduct to AutoMarketplaceListing
const mapToAutoListing = (product: TransformedAutoProduct): AutoMarketplaceListing => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    images: product.images,
    make: product.make,
    model: product.model,
    year: product.year,
    mileage: product.mileage,
    fuel_type: product.fuelType,
    transmission: product.transmission,
    color: product.color,
    features: product.features,
    condition: product.condition,
    seller_id: product.seller?.id || '',
    location_id: product.location?.id || '',
    status: 'available',
    created_at: product.createdAt,
    seller: product.seller ? {
      id: product.seller.id,
      username: product.seller.username,
      avatar_url: product.seller.avatarUrl
    } : undefined,
    location: product.location ? {
      id: product.location.id,
      latitude: product.location.latitude,
      longitude: product.location.longitude,
      city: product.location.city,
      state: product.location.state,
      country: product.location.country
    } : undefined
  };
};

export const AutomotiveMarketplace = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TransformedAutoProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { userLocation, getCurrentLocation, isLoading: isLocationLoading } = useLocation();

  const { 
    data: products, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['auto-marketplace'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('auto_marketplace_listings')
          .select(`
            *,
            seller:profiles (
              id,
              username,
              avatar_url
            ),
            location:locations (
              id,
              latitude,
              longitude,
              city,
              state,
              country
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(getSupabaseErrorMessage(error));
        }

        // Cast and transform the data
        return (data as unknown as AutoMarketplaceListingRaw[]).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          images: item.images || [],
          make: item.make,
          model: item.model,
          year: item.year,
          mileage: item.mileage,
          fuelType: item.fuel_type,
          transmission: item.transmission,
          color: item.color,
          features: item.features || [],
          condition: item.condition,
          seller: item.seller ? {
            id: item.seller.id,
            username: item.seller.username,
            avatarUrl: item.seller.avatar_url
          } : null,
          location: item.location ? {
            id: item.location.id,
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            city: item.location.city,
            state: item.location.state,
            country: item.location.country
          } : null,
          createdAt: item.created_at
        }));
      } catch (err) {
        handleAsyncError(err, 'Failed to load automotive listings');
        throw err;
      }
    },
    retry: 2
  });

  const filteredProducts = products?.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.make.toLowerCase().includes(query) ||
      product.model.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const handleRetry = () => {
    toast({
      title: "Retrying",
      description: "Attempting to reload automotive listings..."
    });
    refetch();
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
    toast({
      title: "Success",
      description: "Your vehicle has been listed successfully."
    });
  };

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-semibold">Automotive Marketplace</h2>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">List Vehicle</span>
            <span className="sm:hidden">List</span>
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search vehicles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
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
              <p>{error instanceof Error ? error.message : 'Failed to load vehicles'}</p>
              <Button variant="outline" size="sm" className="w-fit" onClick={handleRetry}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts?.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No vehicles found matching your search.</p>
              </div>
            ) : (
              filteredProducts?.map((product) => (
                <AutoProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))
            )}
          </div>
        )}

        {/* Create listing modal */}
        <CreateAutoListingModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
          userLocation={userLocation}
          onRequestLocation={getCurrentLocation}
          isLocationLoading={isLocationLoading}
        />

        {/* Product detail modal */}
        {selectedProduct && (
          <AutoProductDetail
            listing={mapToAutoListing(selectedProduct)}
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </ResponsiveContainer>
  );
};
