
import { Card } from "@/components/ui/card";
import { BeautyProfessional } from "@/types/beauty";

interface ContactSectionProps {
  professional: BeautyProfessional;
}

export const ContactSection = ({ professional }: ContactSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
      <div className="space-y-4">
        {professional.contact_email && (
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{professional.contact_email}</p>
          </div>
        )}
        {professional.contact_phone && (
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">{professional.contact_phone}</p>
          </div>
        )}
        {professional.website && (
          <div>
            <p className="font-medium">Website</p>
            <a
              href={professional.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}
        {professional.instagram_handle && (
          <div>
            <p className="font-medium">Instagram</p>
            <a
              href={`https://instagram.com/${professional.instagram_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{professional.instagram_handle}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
