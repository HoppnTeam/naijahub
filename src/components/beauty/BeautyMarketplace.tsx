import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { BeautyProduct } from '@/types/beauty-product';
import { CreateBeautyListingModal } from './CreateBeautyListingModal';
import { BeautyProductCard } from './BeautyProductCard';
import { BeautyProductDetail } from './BeautyProductDetail';

export const BeautyMarketplace = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BeautyProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch beauty products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['beauty-marketplace-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beauty_marketplace_listings')
        .select(`
          *,
          seller:profiles!beauty_marketplace_listings_seller_id_fkey (
            id, 
            username, 
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the BeautyProduct interface
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        brand: item.category, // Using category as brand since there's no brand field
        quantity: 1, // Default quantity
        images: item.images || [],
        seller_id: item.seller_id,
        location_id: item.location,
        status: item.status,
        created_at: item.created_at,
        seller: item.seller,
        location: {
          id: item.location,
          city: item.location,
          state: ''
        },
        ingredients: [] // Default empty ingredients
      })) as BeautyProduct[];
    },
  });

  // Filter products based on search query
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Beauty Products Marketplace</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
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
        <div className="text-center py-12">
          <p className="text-red-500">Error loading products. Please try again later.</p>
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <BeautyProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery.trim() ? 'No products match your search.' : 'No products found.'}
          </p>
          <p className="text-gray-500">
            {searchQuery.trim() ? 'Try a different search term.' : 'Be the first to list a product!'}
          </p>
        </div>
      )}

      {/* Modals */}
      <CreateBeautyListingModal 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <BeautyProductDetail
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
