
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./theme/ThemeToggle";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "News & Politics", path: "/categories/news-politics" },
    { name: "Entertainment", path: "/categories/entertainment" },
    { name: "Technology", path: "/categories/technology" },
    { name: "Sports", path: "/categories/sports" },
    { name: "Business", path: "/categories/business" },
    { name: "Health", path: "/categories/health" },
    { name: "Agriculture", path: "/categories/agriculture" },
    { name: "Culture & Personals", path: "/categories/culture" },
    { name: "Automotive", path: "/categories/automotive" },
  ];

  return (
    <nav className="bg-primary py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-4">
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <h1 
              onClick={() => navigate("/")} 
              className="text-xl md:text-2xl font-bold text-white cursor-pointer font-poppins"
            >
              NaijaHub
            </h1>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
