import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-[200px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
};