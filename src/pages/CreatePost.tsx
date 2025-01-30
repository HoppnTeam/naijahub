import { useLocation } from "react-router-dom";
import { NewsAndPoliticsCreatePost } from "@/components/posts/news-politics/NewsAndPoliticsCreatePost";
import { EntertainmentCreatePost } from "@/components/posts/entertainment/EntertainmentCreatePost";
import { TechnologyCreatePost } from "@/components/posts/technology/TechnologyCreatePost";
import { SportsCategoryCreatePost } from "@/components/posts/sports/SportsCategoryCreatePost";
import { BusinessCategoryCreatePost } from "@/components/posts/business/BusinessCategoryCreatePost";
import { HealthCreatePost } from "@/components/posts/health/HealthCreatePost";
import { AgricultureCreatePost } from "@/components/posts/agriculture/AgricultureCreatePost";
import { CultureCreatePost } from "@/components/posts/culture/CultureCreatePost";
import { AutomotiveCreatePost } from "@/components/posts/automotive/AutomotiveCreatePost";

interface LocationState {
  category?: string;
  categoryId?: string;
}

export default function CreatePost() {
  const location = useLocation();
  const { category, categoryId } = (location.state as LocationState) || {};

  const renderCategoryForm = () => {
    switch (category) {
      case "News & Politics":
        return <NewsAndPoliticsCreatePost />;
      case "Entertainment":
        return <EntertainmentCreatePost />;
      case "Technology":
        return <TechnologyCreatePost />;
      case "Sports":
        return <SportsCategoryCreatePost />;
      case "Business":
        return <BusinessCategoryCreatePost />;
      case "Health":
        return <HealthCreatePost />;
      case "Agriculture":
        return <AgricultureCreatePost />;
      case "Culture & Personals":
        return <CultureCreatePost />;
      case "Automotive":
        return <AutomotiveCreatePost />;
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