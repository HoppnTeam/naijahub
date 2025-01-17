import { LocationStatus } from "@/components/LocationStatus";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">NaijaHub</span>
          </Link>
          <LocationStatus />
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/profile" className="text-sm">Profile</Link>
          <Link to="/create-post" className="text-sm">Create Post</Link>
          <Link to="/advertise" className="text-sm">Advertise</Link>
          <Link to="/admin/dashboard" className="text-sm">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
