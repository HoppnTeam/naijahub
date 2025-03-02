import React from 'react';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SavedItems = () => {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Items</CardTitle>
            <CardDescription>
              View and manage your saved items from the NaijaHub marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="py-10">
            <div className="text-center space-y-3">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No saved items yet</h3>
              <p className="text-muted-foreground">
                Items you save will appear here for easy access
              </p>
              <Button 
                variant="default" 
                onClick={() => window.location.href = '/marketplace'}
                className="mt-4"
              >
                Browse Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  );
};

export default SavedItems;
