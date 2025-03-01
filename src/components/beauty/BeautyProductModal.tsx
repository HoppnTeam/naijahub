import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImageCarousel } from './ProductImageCarousel';
import { MapComponent } from '@/components/map/MapComponent';
import { BeautyProduct } from '@/types/beauty-product';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MessageCircle, MapPin, Star, Calendar, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/use-chat';

interface BeautyProductModalProps {
  product: BeautyProduct;
  onClose: () => void;
}

export const BeautyProductModal = ({ product, onClose }: BeautyProductModalProps) => {
  const { user } = useAuth();
  const { startChat } = useChat();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleContactSeller = async () => {
    if (!user) return;
    await startChat(product.seller_id, `Inquiry about: ${product.title}`);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ProductImageCarousel
              images={product.images}
              activeIndex={activeImageIndex}
              onIndexChange={setActiveImageIndex}
            />
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Location</h3>
              <div className="h-[200px] rounded-lg overflow-hidden">
                <MapComponent
                  location={product.location}
                  zoom={14}
                  interactive={false}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.condition}</Badge>
            </div>

            <p className="text-3xl font-bold text-primary mb-6">
              {formatCurrency(product.price)}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  {product.location.city}, {product.location.state}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Listed {formatDate(product.created_at)}</span>
              </div>

              {product.expiry_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Expires {formatDate(product.expiry_date)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>{product.quantity} available</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.ingredients && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Ingredients</h3>
                <p className="text-muted-foreground">{product.ingredients.join(', ')}</p>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex items-center gap-4 mb-4">
                <OptimizedImage
                  src={product.seller.avatar_url || '/default-avatar.png'}
                  alt={product.seller.username}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{product.seller.username}</h4>
                  {product.seller.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{product.seller.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleContactSeller}
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
