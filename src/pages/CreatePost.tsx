import { useLocation } from "react-router-dom";
import { EntertainmentCreatePost } from "@/components/posts/EntertainmentCreatePost";
import { NewsAndPoliticsCreatePost } from "@/components/posts/NewsAndPoliticsCreatePost";

export default function CreatePost() {
  const location = useLocation();
  const categoryFromPath = location.state?.category || "Entertainment";

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