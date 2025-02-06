import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListingTabs } from "@/components/marketplace/management";
import { ListingEditDialog } from "@/components/marketplace/management";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/admin/LoadingState";
import { MarketplaceFilters, FilterState } from "@/components/admin/marketplace/MarketplaceFilters";
import { MarketplacePagination } from "@/components/admin/marketplace/MarketplacePagination";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ITEMS_PER_PAGE = 15;

export const MarketplaceManagement = () => {
  const [editingListing, setEditingListing] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "created_at",
    sortOrder: "desc"
  });
  const { toast } = useToast();

  const { data: techListings, isLoading: techLoading, error: techError, refetch: refetchTech } = useQuery({
    queryKey: ['admin-tech-listings', filters, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('tech_marketplace_listings')
        .select(`
          *,
          profiles!tech_marketplace_listings_seller_id_profiles_fkey (username, avatar_url),
          marketplace_chats (
            marketplace_messages (
              read_at
            )
          ),
          tech_marketplace_likes (
            count
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status as 'active' | 'sold' | 'pending' | 'cancelled');
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      // Apply pagination
      query = query
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: autoListings, isLoading: autoLoading, error: autoError, refetch: refetchAuto } = useQuery({
    queryKey: ['admin-auto-listings', filters, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('auto_marketplace_listings')
        .select(`
          *,
          profiles!auto_marketplace_listings_seller_id_profiles_fkey (username, avatar_url),
          marketplace_chats (
            marketplace_messages (
              read_at
            )
          ),
          auto_marketplace_likes (
            count
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status as 'active' | 'sold' | 'pending' | 'cancelled');
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      // Apply pagination
      query = query
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (listing: any) => {
    setEditingListing(listing);
  };

  const handleDelete = async (id: string, marketplace: "tech" | "auto") => {
    try {
      const table = marketplace === "tech" ? "tech_marketplace_listings" : "auto_marketplace_listings";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      if (marketplace === "tech") {
        refetchTech();
      } else {
        refetchAuto();
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete listing",
      });
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      const table = formData.marketplace === "tech" ? "tech_marketplace_listings" : "auto_marketplace_listings";
      const { error } = await supabase
        .from(table)
        .update({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          status: formData.status,
        })
        .eq('id', formData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing updated successfully",
      });

      setEditingListing(null);
      if (formData.marketplace === "tech") {
        refetchTech();
      } else {
        refetchAuto();
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update listing",
      });
    }
  };

  const handleChatOpen = (listingId: string) => {
    // This will be implemented when we add chat functionality
    console.log("Opening chat for listing:", listingId);
  };

  if (techLoading || autoLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <LoadingState />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Marketplace Management</h1>
        
        <MarketplaceFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        <ErrorBoundary>
          <Card>
            <CardContent>
              <ListingTabs
                techListings={techListings || []}
                autoListings={autoListings || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChatOpen={handleChatOpen}
              />

              {(techError || autoError) && (
                <div className="p-4 text-red-500">
                  Error loading listings. Please try again.
                </div>
              )}

              <MarketplacePagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </ErrorBoundary>

        <ListingEditDialog
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onUpdate={handleUpdate}
        />
      </div>
    </AdminLayout>
  );
};
