import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface ProductImageCarouselProps {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const ProductImageCarousel = ({
  images,
  activeIndex,
  onIndexChange,
}: ProductImageCarouselProps) => {
  return (
    <div className="relative aspect-square">
      <Carousel
        opts={{
          startIndex: activeIndex,
          loop: true,
        }}
        className="w-full"
        onIndexChange={onIndexChange}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-square relative">
                <OptimizedImage
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2" />
        <CarouselNext className="absolute right-4 top-1/2" />
      </Carousel>
    </div>
  );
};
