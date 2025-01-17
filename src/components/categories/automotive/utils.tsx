import { Car, Settings, ShoppingBag, Wrench } from "lucide-react";

export const getSubcategoryIcon = (name: string) => {
  const icons = {
    "Car Reviews": <Car className="h-5 w-5" />,
    "Workshops & Services": <Wrench className="h-5 w-5" />,
    "Marketplace": <ShoppingBag className="h-5 w-5" />,
    "Auto Tips": <Settings className="h-5 w-5" />,
  };
  return icons[name as keyof typeof icons] || <Car className="h-5 w-5" />;
};

export const getSubcategoryDescription = (name: string) => {
  const descriptions = {
    "Car Reviews": "Read and share car reviews from the community",
    "Workshops & Services": "Find trusted auto workshops and services",
    "Marketplace": "Buy and sell vehicles and auto parts",
    "Auto Tips": "Share and discover automotive maintenance tips",
  };
  return descriptions[name as keyof typeof descriptions] || "";
};

export const getSubcategoryPath = (name: string) => {
  const paths = {
    "Car Reviews": "/categories/automotive/reviews",
    "Workshops & Services": "/categories/automotive/workshops",
    "Marketplace": "/categories/automotive/marketplace",
    "Auto Tips": "/categories/automotive/tips",
  };
  return paths[name as keyof typeof paths] || "";
};