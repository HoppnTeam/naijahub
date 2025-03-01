import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { BeautyProduct } from '@/types/beauty-product';
import { MapPin, User, Calendar, Tag, Package } from 'lucide-react';

interface BeautyProductDetailProps {
  product: BeautyProduct | null;
  open: boolean;
  onClose: () => void;
}

export const BeautyProductDetail = ({ product, open, onClose }: BeautyProductDetailProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border">
              <OptimizedImage
                src={product.images[selectedImageIndex] || '/placeholder-image.jpg'}
                alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`
                      w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer
                      ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'}
                    `}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${product.title} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">₦{product.price.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Brand: {product.brand}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Description</h4>
              <p className="text-sm">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{product.category}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{product.quantity} available</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {product.location?.city}, {product.location?.state}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Ingredients</h4>
                <div className="flex flex-wrap gap-1">
                  {product.ingredients.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-secondary px-2 py-1 rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {product.seller && (
              <div className="space-y-2">
                <h4 className="font-medium">Seller</h4>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {product.seller.avatar_url ? (
                      <OptimizedImage
                        src={product.seller.avatar_url}
                        alt={product.seller.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span>{product.seller.username}</span>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button className="w-full">Contact Seller</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
