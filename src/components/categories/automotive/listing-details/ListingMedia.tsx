interface ListingMediaProps {
  image?: string;
  title: string;
}

export const ListingMedia = ({ image, title }: ListingMediaProps) => {
  if (!image) return null;
  
  return (
    <div className="aspect-square overflow-hidden rounded-lg">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};