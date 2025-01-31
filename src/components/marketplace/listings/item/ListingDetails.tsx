import { formatCurrency } from "@/lib/utils";

interface ListingDetailsProps {
  title: string;
  description: string;
  price: number;
  condition: string;
  location: string;
  sellerUsername?: string;
}

export const ListingDetails = ({ 
  title, 
  description, 
  price, 
  condition, 
  location, 
  sellerUsername 
}: ListingDetailsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      <div className="text-sm text-muted-foreground">
        <p>Location: {location}</p>
        <p>Condition: {condition}</p>
        {sellerUsername && (
          <p>Seller: {sellerUsername}</p>
        )}
      </div>
    </div>
  );
};