import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { AutoMarketplaceListing } from '@/types/marketplace';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, MessageCircle, Calendar, Info, Car, Fuel, Gauge, Paintbrush } from 'lucide-react';
import { WorkshopMap } from '@/components/workshops/WorkshopMap';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface AutoProductDetailProps {
  listing: AutoMarketplaceListing;
  open: boolean;
  onClose: () => void;
}

export const AutoProductDetail = ({ listing, open, onClose }: AutoProductDetailProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleContactSeller = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contact the seller",
        variant: "destructive"
      });
      return;
    }
    
    // Implement chat functionality here
    toast({
      title: "Coming soon",
      description: "Chat functionality will be available soon"
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl md:text-2xl">{listing.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Image gallery */}
            <div className="space-y-2">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[activeImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {listing.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`
                        w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer
                        ${index === activeImageIndex ? 'ring-2 ring-primary' : ''}
                      `}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${listing.title} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price and actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(listing.price)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={listing.condition === 'New' ? 'default' : 'secondary'}>
                    {listing.condition}
                  </Badge>
                  {listing.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{listing.location.city}, {listing.location.state}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleContactSeller}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Description</h3>
                      <p className="text-muted-foreground">{listing.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Seller Information</h3>
                      {listing.seller ? (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {listing.seller.avatar_url ? (
                              <img 
                                src={listing.seller.avatar_url} 
                                alt={listing.seller.username}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium text-gray-500">
                                {listing.seller.username.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{listing.seller.username}</p>
                            <p className="text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              Listed on {formatDate(listing.created_at)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Seller information not available</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Vehicle Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Make & Model</p>
                          <p className="font-medium">{listing.make} {listing.model}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="font-medium">{listing.year}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Mileage</p>
                          <p className="font-medium">{listing.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Fuel className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Fuel Type</p>
                          <p className="font-medium">{listing.fuel_type}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Transmission</p>
                          <p className="font-medium">{listing.transmission}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Paintbrush className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Color</p>
                          <p className="font-medium">{listing.color}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Vehicle Features</h3>
                {listing.features && listing.features.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No features listed</p>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Vehicle Location</h3>
                {listing.location && listing.location.latitude && listing.location.longitude ? (
                  <div className="h-[300px] rounded-lg overflow-hidden">
                    <WorkshopMap
                      latitude={listing.location.latitude}
                      longitude={listing.location.longitude}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">Location information not available</p>
                )}
                
                {listing.location && (
                  <p className="text-muted-foreground">
                    {listing.location.city}, {listing.location.state}, {listing.location.country}
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
