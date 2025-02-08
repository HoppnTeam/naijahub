
import { BeautyProfessional } from "@/types/beauty";

interface AboutSectionProps {
  professional: BeautyProfessional;
}

export const AboutSection = ({ professional }: AboutSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-muted-foreground">{professional.description}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {professional.specialties?.map((specialty, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              {specialty.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      {professional.portfolio_images && professional.portfolio_images.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {professional.portfolio_images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Portfolio ${index + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
