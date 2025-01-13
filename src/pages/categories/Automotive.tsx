import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutomotiveHeader } from "@/components/categories/automotive/AutomotiveHeader";
import { AutomotiveSidebar } from "@/components/categories/automotive/AutomotiveSidebar";
import { AutomotiveContent } from "@/components/categories/automotive/AutomotiveContent";

const Automotive = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <AutomotiveHeader onSearch={handleSearch} onCreatePost={handleCreatePost} />
          <AutomotiveContent searchQuery={searchQuery} />
        </div>
        <div className="lg:col-span-3">
          <AutomotiveSidebar />
        </div>
      </div>
    </div>
  );
};

export default Automotive;