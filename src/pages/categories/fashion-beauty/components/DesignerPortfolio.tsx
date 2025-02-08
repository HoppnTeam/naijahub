
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingImageCarousel } from "@/components/marketplace/listings/item/ListingImageCarousel";

interface DesignerPortfolioProps {
  images: string[];
  businessName: string;
}

export const DesignerPortfolio = ({ images, businessName }: DesignerPortfolioProps) => {
  if (images.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <ListingImageCarousel 
          images={images}
          title={businessName}
        />
      </CardContent>
    </Card>
  );
};
