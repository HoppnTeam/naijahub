import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ResponsiveContainer } from "@/components/ui/ResponsiveContainer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { isMobileDevice } from "@/lib/pwa-utils";
import { ModeToggle } from "@/components/theme/ModeToggle";

export const Navigation = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = isMobileDevice();

  const menuItems = [
    { name: "News & Politics", path: "/categories/news-politics" },
    { name: "Entertainment", path: "/categories/entertainment" },
    { name: "Technology", path: "/categories/technology" },
    { name: "Sports", path: "/categories/sports" },
    { name: "Business", path: "/categories/business" },
    { name: "Health", path: "/categories/health" },
    { name: "Agriculture", path: "/categories/agriculture" },
    { name: "Travel", path: "/categories/travel" },
    { name: "Culture", path: "/categories/culture" },
    { name: "Automotive", path: "/categories/automotive" },
    { name: "Fashion & Beauty", path: "/categories/fashion-beauty" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ResponsiveContainer>
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            {/* Mobile Menu for smaller screens */}
            <MobileMenu className="md:hidden" />
            
            {/* Logo */}
            <h1 
              onClick={() => navigate("/")} 
              className="text-lg md:text-xl font-bold cursor-pointer font-poppins"
            >
              NaijaHub
            </h1>
            
            {/* Desktop Navigation Links - hidden on mobile */}
            <nav className="ml-8 hidden lg:flex items-center space-x-4">
              {menuItems.slice(0, 6).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* More dropdown could be added here for remaining items */}
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ModeToggle />
            
            {/* Auth Buttons or User Nav */}
            {session ? (
              <UserMenu />
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/signin">
                  <Button variant="ghost" size={isMobile ? "sm" : "default"}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size={isMobile ? "sm" : "default"}>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </ResponsiveContainer>
    </header>
  );
};
