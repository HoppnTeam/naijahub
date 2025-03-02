import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface AutoProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    condition: string;
  };
  onClick: () => void;
}

export const AutoProductCard = ({ product, onClick }: AutoProductCardProps) => {
  return (
    <Card 
      className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground">
              {product.year} {product.make} {product.model}
            </p>
          </div>
          <Badge variant={product.condition === 'New' ? 'default' : 'secondary'}>
            {product.condition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-medium">Mileage:</span> 
            <span>{product.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Fuel:</span> 
            <span>{product.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Trans:</span> 
            <span>{product.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Color:</span> 
            <span>{product.color}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
        <p className="text-xl font-bold text-primary">
          {formatCurrency(product.price)}
        </p>
      </CardFooter>
    </Card>
  );
};
