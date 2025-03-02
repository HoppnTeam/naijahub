import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/lib/error-handling';

interface MenuItemsProps {
  className?: string;
  onClose?: () => void;
}

export const MenuItems = ({ className, onClose }: MenuItemsProps) => {
  const { user, isAdmin } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setUsername(data.username);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        handleAsyncError(error, 'Failed to fetch user profile');
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (onClose) onClose();
      window.location.href = '/';
    } catch (error) {
      handleAsyncError(error, 'Failed to sign out');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleMenuItemClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {user ? (
        <div className="flex flex-col space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-full justify-start gap-2 rounded-md px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl || undefined} alt={username || 'User'} />
                  <AvatarFallback>{username ? getInitials(username) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{username || 'User'}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild onClick={handleMenuItemClick}>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={handleMenuItemClick}>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild onClick={handleMenuItemClick}>
                  <Link to="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <Button asChild variant="outline" onClick={handleMenuItemClick}>
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button asChild onClick={handleMenuItemClick}>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      )}

      <div className="space-y-1">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={handleMenuItemClick}
        >
          <Link to="/">Home</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={handleMenuItemClick}
        >
          <Link to="/categories">Categories</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={handleMenuItemClick}
        >
          <Link to="/marketplace">Marketplace</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={handleMenuItemClick}
        >
          <Link to="/trending">Trending</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={handleMenuItemClick}
        >
          <Link to="/about">About</Link>
        </Button>
      </div>
    </div>
  );
};