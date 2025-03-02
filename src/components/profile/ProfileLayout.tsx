import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Package, Heart, CreditCard } from 'lucide-react';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      label: 'Account', 
      icon: <User className="h-5 w-5" />, 
      href: '/profile/account' 
    },
    { 
      label: 'Orders', 
      icon: <Package className="h-5 w-5" />, 
      href: '/profile/orders' 
    },
    { 
      label: 'Saved Items', 
      icon: <Heart className="h-5 w-5" />, 
      href: '/profile/saved' 
    },
    { 
      label: 'Payment Methods', 
      icon: <CreditCard className="h-5 w-5" />, 
      href: '/profile/payment' 
    },
    { 
      label: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      href: '/profile/settings' 
    },
  ];

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="p-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
            
            <nav className="mt-6 flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    className="justify-start"
                    asChild
                  >
                    <Link to={item.href} className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
};
