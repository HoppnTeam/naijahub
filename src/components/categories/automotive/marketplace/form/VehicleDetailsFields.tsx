import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VEHICLE_TYPES = ["car", "motorcycle", "tricycle", "truck", "bus", "van", "parts"] as const;
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"] as const;

interface VehicleDetailsFieldsProps {
  price: string;
  setPrice: (value: string) => void;
  vehicleType: typeof VEHICLE_TYPES[number];
  setVehicleType: (value: typeof VEHICLE_TYPES[number]) => void;
  condition: typeof CONDITIONS[number];
  setCondition: (value: typeof CONDITIONS[number]) => void;
  make: string;
  setMake: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
}

export const VehicleDetailsFields = ({
  price,
  setPrice,
  vehicleType,
  setVehicleType,
  condition,
  setCondition,
  make,
  setMake,
  model,
  setModel,
  year,
  setYear,
}: VehicleDetailsFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₦)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicle-type">Vehicle Type</Label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Toyota"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Camry"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2020"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};