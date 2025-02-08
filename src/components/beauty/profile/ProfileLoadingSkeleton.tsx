
import { PostSkeleton } from "@/components/PostSkeleton";

export const ProfileLoadingSkeleton = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PostSkeleton />
        </div>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
