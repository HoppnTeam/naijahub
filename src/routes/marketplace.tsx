import { Route } from "react-router-dom";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";
import { ListingDetails } from "@/components/marketplace/ListingDetails";
import { CreateListingForm } from "@/components/marketplace/CreateListingForm";
import { OrdersList } from "@/components/marketplace/OrdersList";

export const marketplaceRoutes = (
  <>
    <Route path="/marketplace" element={<MarketplaceListings />} />
    <Route path="/marketplace/listings/new" element={<CreateListingForm />} />
    <Route path="/marketplace/listings/:id" element={<ListingDetails />} />
    <Route path="/marketplace/orders" element={<OrdersList />} />
  </>
);