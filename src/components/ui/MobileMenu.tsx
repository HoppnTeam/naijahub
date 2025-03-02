import { useState } from 'react';
import { Menu, X, Home, Search, User, Bell, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  className?: string;
}

export const MobileMenu = ({ className = '' }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { session } = useAuth();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="md:hidden p-2" 
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}
      
      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden ios-safe-bottom",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">NaijaHub</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1" 
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-2">
              <Link 
                to="/" 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive('/') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
                onClick={closeMenu}
              >
                <Home className="mr-3 h-5 w-5" />
                Home
              </Link>
              
              <Link 
                to="/search" 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive('/search') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
                onClick={closeMenu}
              >
                <Search className="mr-3 h-5 w-5" />
                Search
              </Link>
              
              {session ? (
                <>
                  <Link 
                    to="/notifications" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md",
                      isActive('/notifications') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    onClick={closeMenu}
                  >
                    <Bell className="mr-3 h-5 w-5" />
                    Notifications
                  </Link>
                  
                  <Link 
                    to="/messages" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md",
                      isActive('/messages') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    onClick={closeMenu}
                  >
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Messages
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md",
                      isActive('/profile') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    onClick={closeMenu}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/signin" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md",
                      isActive('/signin') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  
                  <Link 
                    to="/signup" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md",
                      isActive('/signup') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
            
            {/* Categories Section */}
            <div className="mt-6 px-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Categories</h3>
              <nav className="space-y-1">
                {['News', 'Politics', 'Entertainment', 'Sports', 'Technology', 'Business'].map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase()}`}
                    className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
                    onClick={closeMenu}
                  >
                    {category}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="p-4 border-t">
            {session ? (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  // Handle sign out
                  closeMenu();
                }}
              >
                Sign Out
              </Button>
            ) : (
              <div className="text-sm text-center text-muted-foreground">
                Join NaijaHub to connect with Nigerians worldwide
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t z-30 md:hidden ios-safe-bottom">
        <div className="grid grid-cols-5 h-14">
          <Link 
            to="/" 
            className={cn(
              "flex flex-col items-center justify-center",
              isActive('/') ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/search" 
            className={cn(
              "flex flex-col items-center justify-center",
              isActive('/search') ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Link>
          
          <Link 
            to="/notifications" 
            className={cn(
              "flex flex-col items-center justify-center",
              isActive('/notifications') ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Alerts</span>
          </Link>
          
          <Link 
            to="/messages" 
            className={cn(
              "flex flex-col items-center justify-center",
              isActive('/messages') ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={cn(
              "flex flex-col items-center justify-center",
              isActive('/profile') ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};
