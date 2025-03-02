import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

const AppIcons = () => {
  const iconSizes = [
    { size: '192x192', file: '/icons/icon-192x192.png' },
    { size: '512x512', file: '/icons/icon-512x512.png' },
    { size: 'Apple Touch Icon', file: '/icons/apple-touch-icon.png' },
    { size: 'Favicon', file: '/favicon.ico' },
  ];

  const downloadIcon = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">NaijaHub App Icons</h1>
      <p className="text-lg mb-8">
        This page contains all the app icons used for NaijaHub PWA. You can download and use these icons
        for your device home screen or for development purposes.
      </p>

      <Tabs defaultValue="current">
        <TabsList className="mb-6">
          <TabsTrigger value="current">Current Icons</TabsTrigger>
          <TabsTrigger value="guidelines">Icon Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {iconSizes.map((icon) => (
              <Card key={icon.size} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{icon.size}</CardTitle>
                  <CardDescription>
                    {icon.size === 'Favicon' ? 'Browser tab icon' : 'App icon for home screen'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                  <img 
                    src={icon.file} 
                    alt={`${icon.size} icon`} 
                    className="max-w-full h-auto object-contain" 
                    style={{ maxHeight: '150px' }}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => downloadIcon(icon.file, icon.file.split('/').pop() || 'icon')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle>App Icon Guidelines</CardTitle>
              <CardDescription>
                Follow these guidelines when creating custom icons for NaijaHub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Required Icon Sizes</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>192x192 pixels</strong> - Standard icon for Android devices</li>
                <li><strong>512x512 pixels</strong> - High-resolution icon for larger screens</li>
                <li><strong>180x180 pixels</strong> - Apple Touch Icon for iOS devices</li>
                <li><strong>32x32, 16x16 pixels</strong> - Favicon for browser tabs</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-6">Design Guidelines</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the NaijaHub green (#32a852) as the primary color</li>
                <li>Ensure the icon is recognizable at small sizes</li>
                <li>Use simple shapes and avoid too much detail</li>
                <li>Include a 10% padding around the edges</li>
                <li>Export as PNG with transparency for the app icons</li>
                <li>Use ICO format for the favicon</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-6">File Naming</h3>
              <p>Use the following naming convention for your icon files:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><code>icon-[size].png</code> - For standard app icons</li>
                <li><code>apple-touch-icon.png</code> - For iOS devices</li>
                <li><code>favicon.ico</code> - For browser tabs</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppIcons;
