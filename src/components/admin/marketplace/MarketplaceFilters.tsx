import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FilterState {
  search: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface MarketplaceFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const MarketplaceFilters = ({
  filters,
  onFiltersChange,
}: MarketplaceFiltersProps) => {
  return (
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
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Min Price</Label>
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Max Price</Label>
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
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
              onValueChange={(value: 'asc' | 'desc') => onFiltersChange({ ...filters, sortOrder: value })}
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
  );
};