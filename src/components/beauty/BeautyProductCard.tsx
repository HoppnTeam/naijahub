import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { BeautyProduct } from '@/types/beauty-product';
import { formatCurrency } from '@/lib/utils';

interface BeautyProductCardProps {
  product: BeautyProduct;
  onClick: () => void;
}

export const BeautyProductCard = ({ product, onClick }: BeautyProductCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square relative">
        <OptimizedImage
          src={product.images[0] || '/placeholder-image.jpg'}
          alt={product.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold truncate">{product.title}</h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <p className="font-semibold text-lg">₦{product.price.toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center">
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="text-sm text-muted-foreground">
            {product.quantity} available
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
