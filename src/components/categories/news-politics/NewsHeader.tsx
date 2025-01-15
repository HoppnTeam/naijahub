import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewsHeaderProps {
  onSearch: (query: string) => void;
  onCreatePost?: () => void;
}

export const NewsHeader = ({ onSearch, onCreatePost }: NewsHeaderProps) => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      navigate("/create-post", { state: { category: "News & Politics" } });
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">News & Politics</h1>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search news and discussions..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreatePost}>Create Post</Button>
      </div>
    </div>
  );
};