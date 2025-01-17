import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ListingHeaderProps {
  title: string;
  price: number;
  seller: {
    username?: string;
    avatar_url?: string;
  };
  created_at: string;
}

export const ListingHeader = ({ title, price, seller, created_at }: ListingHeaderProps) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarImage src={seller?.avatar_url ?? undefined} />
          <AvatarFallback>
            {seller?.username?.substring(0, 2).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{seller?.username}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <h1 className="text-2xl mb-2">{title}</h1>
      <div className="text-3xl font-bold text-primary">
        ₦{price.toLocaleString()}
      </div>
    </div>
  );
};