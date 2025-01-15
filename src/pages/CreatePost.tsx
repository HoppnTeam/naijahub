import { useLocation } from "react-router-dom";
import { NewsAndPoliticsCreatePost } from "@/components/posts/news-politics/NewsAndPoliticsCreatePost";
import { EntertainmentCreatePost } from "@/components/posts/entertainment/EntertainmentCreatePost";
import { TechnologyCreatePost } from "@/components/posts/technology/TechnologyCreatePost";

export default function CreatePost() {
  const location = useLocation();
  const { category, categoryId } = location.state || {};

  const renderCategoryForm = () => {
    switch (category) {
      case "News & Politics":
        return <NewsAndPoliticsCreatePost 
          categoryId={categoryId}
        />;
      case "Entertainment":
        return <EntertainmentCreatePost />;
      case "Technology":
        return <TechnologyCreatePost categoryId={categoryId} />;
      default:
        return <div className="container py-8">
          <h1 className="text-2xl font-bold">Select a category to create a post</h1>
        </div>;
    }
  };

  return renderCategoryForm();
}