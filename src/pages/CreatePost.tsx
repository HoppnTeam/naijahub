import { useLocation } from "react-router-dom";
import { NewsAndPoliticsCreatePost } from "@/components/posts/news-politics/NewsAndPoliticsCreatePost";
import { EntertainmentCreatePost } from "@/components/posts/entertainment/EntertainmentCreatePost";
import { TechnologyCreatePost } from "@/components/posts/technology/TechnologyCreatePost";
import { SportsCategoryCreatePost } from "@/components/posts/sports/SportsCategoryCreatePost";
import { BusinessCategoryCreatePost } from "@/components/posts/business/BusinessCategoryCreatePost";
import { HealthCreatePost } from "@/components/posts/health/HealthCreatePost";

export default function CreatePost() {
  const location = useLocation();
  const { category, categoryId } = location.state || {};

  const renderCategoryForm = () => {
    switch (category) {
      case "News & Politics":
        return <NewsAndPoliticsCreatePost categoryId={categoryId} />;
      case "Entertainment":
        return <EntertainmentCreatePost />;
      case "Technology":
        return <TechnologyCreatePost categoryId={categoryId} />;
      case "Sports":
        return <SportsCategoryCreatePost categoryId={categoryId} />;
      case "Business":
        return <BusinessCategoryCreatePost categoryId={categoryId} />;
      case "Health":
        return <HealthCreatePost categoryId={categoryId} />;
      default:
        return (
          <div className="container py-8">
            <h1 className="text-2xl font-bold">Select a category to create a post</h1>
          </div>
        );
    }
  };

  return renderCategoryForm();
}