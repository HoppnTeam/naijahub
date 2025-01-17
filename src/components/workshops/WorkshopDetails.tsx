import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Star, Globe, Clock, Mail, Wrench } from "lucide-react";
import { Workshop } from "@/types/workshop";
import { WorkshopMap } from "./WorkshopMap";

interface WorkshopDetailsProps {
  workshop: Workshop;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkshopDetails = ({ workshop, isOpen, onClose }: WorkshopDetailsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{workshop.name}</span>
            {workshop.verified && (
              <span className="text-primary text-sm">✓ Verified</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-muted-foreground" />
                  <span className="capitalize">{workshop.workshop_type.replace(/_/g, " ")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{workshop.rating.toFixed(1)} ({workshop.review_count} reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>{workshop.address}, {workshop.city}, {workshop.state}</span>
                </div>

                {workshop.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a href={`tel:${workshop.phone_number}`} className="hover:underline">
                      {workshop.phone_number}
                    </a>
                  </div>
                )}

                {workshop.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <a href={`mailto:${workshop.email}`} className="hover:underline">
                      {workshop.email}
                    </a>
                  </div>
                )}

                {workshop.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <a 
                      href={workshop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {workshop.opening_hours && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                      <div className="font-medium mb-1">Opening Hours</div>
                      <div className="text-sm text-muted-foreground">
                        {Object.entries(workshop.opening_hours).map(([day, hours]) => (
                          <div key={day} className="grid grid-cols-2 gap-2">
                            <span className="capitalize">{day}:</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-muted-foreground">{workshop.description}</p>
              </CardContent>
            </Card>

            {workshop.services_offered && workshop.services_offered.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Services Offered</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {workshop.services_offered.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="h-[400px]">
            <WorkshopMap 
              latitude={workshop.latitude || 0} 
              longitude={workshop.longitude || 0}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};