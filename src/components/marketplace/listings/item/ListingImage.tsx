interface ListingImageProps {
  imageUrl: string;
  title: string;
}

export const ListingImage = ({ imageUrl, title }: ListingImageProps) => {
  return (
    <div className="aspect-square w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};