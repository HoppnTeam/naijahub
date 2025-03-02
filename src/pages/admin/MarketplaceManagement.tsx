import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingState } from "@/components/admin/LoadingState";
import { MarketplaceFilters } from "@/components/admin/marketplace/MarketplaceFilters";
import { MarketplaceMetrics } from "@/components/admin/marketplace/MarketplaceMetrics";
import { MarketplaceContent } from "@/components/admin/marketplace/MarketplaceContent";
import { ListingEditDialog } from "@/components/marketplace/management";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useMarketplaceManagement } from "@/hooks/use-marketplace-management";

const MarketplaceManagement = () => {
  const {
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    editingListing,
    setEditingListing,
    techListings,
    autoListings,
    techLoading,
    autoLoading,
    techError,
    autoError,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleChatOpen,
    stats
  } = useMarketplaceManagement();

  const isLoading = techLoading || autoLoading;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Marketplace Management</h1>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <MarketplaceMetrics stats={stats} />
        )}

        <MarketplaceFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        <ErrorBoundary>
          <MarketplaceContent
            techListings={techListings || []}
            autoListings={autoListings || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChatOpen={handleChatOpen}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            error={techError || autoError}
          />
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

export default MarketplaceManagement;