import { Link } from "react-router-dom";
import { Info, Link as LinkIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C] text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About NaijaHub</h3>
            <p className="text-[#8E9196] text-sm">
              Connecting Nigerians worldwide through news, culture, and community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/content-guidelines" 
                  className="text-[#8E9196] hover:text-white transition-colors flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  Content Guidelines
                </Link>
              </li>
              <li>
                <Link 
                  to="/advertise" 
                  className="text-[#8E9196] hover:text-white transition-colors flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Advertise with Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Advertisement Space */}
          <div className="bg-[#F2FCE2] p-4 rounded-lg">
            <h3 className="text-primary font-semibold mb-2">Advertisement</h3>
            <p className="text-gray-600 text-sm">
              Promote your business to millions of Nigerians worldwide.
              <Link to="/advertise" className="text-primary hover:underline block mt-2">
                Learn More →
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-[#8E9196] text-sm">
          <p>© {new Date().getFullYear()} NaijaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};