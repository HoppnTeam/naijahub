import { useLocation } from "react-router-dom";
import { NewsAndPoliticsCreatePost } from "@/components/posts/NewsAndPoliticsCreatePost";
import { EntertainmentCreatePost } from "@/components/posts/EntertainmentCreatePost";

export default function CreatePost() {
  const location = useLocation();
  const { category, categoryId, subcategories } = location.state || {};

  const renderCategoryForm = () => {
    switch (category) {
      case "News & Politics":
        return <NewsAndPoliticsCreatePost 
          categoryId={categoryId} 
          subcategories={subcategories} 
        />;
      case "Entertainment":
        return <EntertainmentCreatePost />;
      default:
        return <div className="container py-8">
          <h1 className="text-2xl font-bold">Select a category to create a post</h1>
        </div>;
    }
  };

  return renderCategoryForm();
}