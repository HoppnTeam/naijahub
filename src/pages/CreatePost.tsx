import { useLocation } from "react-router-dom";
import { NewsAndPoliticsCreatePost } from "@/components/posts/NewsAndPoliticsCreatePost";
import { EntertainmentCreatePost } from "@/components/posts/EntertainmentCreatePost";

export default function CreatePost() {
  const location = useLocation();
  const categoryFromPath = location.state?.category;

  const renderCategoryForm = () => {
    switch (categoryFromPath) {
      case "News & Politics":
        return <NewsAndPoliticsCreatePost />;
      case "Entertainment":
        return <EntertainmentCreatePost />;
      default:
        return <EntertainmentCreatePost />;
    }
  };

  return renderCategoryForm();
}