
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Globe, Instagram } from "lucide-react";

interface DesignerContactProps {
  email: string | null;
  phone: string | null;
  website: string | null;
  instagramHandle: string | null;
}

export const DesignerContact = ({
  email,
  phone,
  website,
  instagramHandle
}: DesignerContactProps) => {
  return (
    <div>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a 
              href={`mailto:${email}`}
              className="text-primary hover:underline"
            >
              {email}
            </a>
          </div>
        )}
        
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a 
              href={`tel:${phone}`}
              className="text-primary hover:underline"
            >
              {phone}
            </a>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        {instagramHandle && (
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-muted-foreground" />
            <a 
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{instagramHandle}
            </a>
          </div>
        )}
      </CardContent>
    </div>
  );
};
