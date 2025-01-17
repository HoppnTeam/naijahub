import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  vehicleType?: string;
  location?: string;
  make?: string;
  transmission?: string;
  fuelType?: string;
}

export const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-6 p-4 bg-background border rounded-lg">
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min Price"
            onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Max Price"
            onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select onValueChange={(value) => handleFilterChange("condition", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like-new">Like New</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Vehicle Type</Label>
        <Select onValueChange={(value) => handleFilterChange("vehicleType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="bus">Bus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Make</Label>
        <Input
          placeholder="Enter make"
          onChange={(e) => handleFilterChange("make", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="Enter location"
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Transmission</Label>
        <Select onValueChange={(value) => handleFilterChange("transmission", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="cvt">CVT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fuel Type</Label>
        <Select onValueChange={(value) => handleFilterChange("fuelType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};