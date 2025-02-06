import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingTabs } from "@/components/marketplace/management";
import { useState } from "react";
import { ListingEditDialog } from "@/components/marketplace/management";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/admin/LoadingState";

type ListingStatus = 'active' | 'inactive' | 'suspended';

interface FilterState {
  search: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const MarketplaceManagement = () => {
  const [editingListing, setEditingListing] = useState<any>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "created_at",
    sortOrder: "desc"
  });
  const { toast } = useToast();

  const { data: techListings, isLoading: techLoading, refetch: refetchTech } = useQuery({
    queryKey: ['admin-tech-listings', filters],
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
        query = query.eq('status', filters.status as ListingStatus);
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: autoListings, isLoading: autoLoading, refetch: refetchAuto } = useQuery({
    queryKey: ['admin-auto-listings', filters],
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
        query = query.eq('status', filters.status as ListingStatus);
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

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
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Sorting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search listings..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Min Price</Label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Max Price</Label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: 'asc' | 'desc') => setFilters(prev => ({ ...prev, sortOrder: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <ListingTabs
              techListings={techListings || []}
              autoListings={autoListings || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChatOpen={handleChatOpen}
            />
          </CardContent>
        </Card>

        <ListingEditDialog
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onUpdate={handleUpdate}
        />
      </div>
    </AdminLayout>
  );
};
