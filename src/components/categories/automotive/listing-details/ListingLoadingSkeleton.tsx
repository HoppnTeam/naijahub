export const ListingLoadingSkeleton = () => {
  return (
    <div className="container max-w-4xl py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-muted rounded-lg" />
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/4" />
      </div>
    </div>
  );
};