import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface AutoMarketplaceFiltersProps {
  filters: {
    vehicleType: string;
    priceRange: number[];
    distance: number;
  };
  onFiltersChange: (filters: any) => void;
}

export const AutoMarketplaceFilters = ({
  filters,
  onFiltersChange,
}: AutoMarketplaceFiltersProps) => {
  return (
    <Card>
      <CardContent className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Type</label>
            <Select
              value={filters.vehicleType}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, vehicleType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Cars</SelectItem>
                <SelectItem value="motorcycle">Motorcycles</SelectItem>
                <SelectItem value="tricycle">Tricycles</SelectItem>
                <SelectItem value="truck">Trucks</SelectItem>
                <SelectItem value="bus">Buses</SelectItem>
                <SelectItem value="van">Vans</SelectItem>
                <SelectItem value="parts">Auto Parts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Price Range (₦{filters.priceRange[0].toLocaleString()} - ₦
              {filters.priceRange[1].toLocaleString()})
            </label>
            <Slider
              min={0}
              max={1000000}
              step={10000}
              value={filters.priceRange}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, priceRange: value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Distance ({filters.distance}km)
            </label>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[filters.distance]}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, distance: value[0] })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};