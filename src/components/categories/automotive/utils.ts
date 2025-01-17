import { Car, Settings, ShoppingBag, Newspaper, Wrench, Shield } from "lucide-react";

export const getSubcategoryIcon = (name: string) => {
  switch (name) {
    case "Car Reviews":
      return <Car className="w-5 h-5" />;
    case "Maintenance & Repairs":
      return <Settings className="w-5 h-5" />;
    case "Auto Marketplace":
      return <ShoppingBag className="w-5 h-5" />;
    case "Auto News":
      return <Newspaper className="w-5 h-5" />;
    case "Workshops & Services":
      return <Wrench className="w-5 h-5" />;
    case "Road Safety":
      return <Shield className="w-5 h-5" />;
    default:
      return <Car className="w-5 h-5" />;
  }
};

export const getSubcategoryDescription = (name: string) => {
  switch (name) {
    case "Car Reviews":
      return "Detailed reviews and comparisons of vehicles available in Nigeria";
    case "Maintenance & Repairs":
      return "Expert tips, guides, and discussions about car maintenance and repairs";
    case "Auto Marketplace":
      return "Buy, sell, and trade vehicles, parts, and automotive accessories";
    case "Auto News":
      return "Latest automotive news and updates from Nigeria and worldwide";
    case "Workshops & Services":
      return "Find and review trusted local automotive workshops and services";
    case "Road Safety":
      return "Discussions and tips about road safety in Nigeria";
    default:
      return "";
  }
};