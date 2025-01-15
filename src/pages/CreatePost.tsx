import { useLocation } from "react-router-dom";
import { EntertainmentCreatePost } from "@/components/posts/EntertainmentCreatePost";

export default function CreatePost() {
  const location = useLocation();
  const categoryFromPath = location.state?.category || "Entertainment";

  // For now, we'll default to Entertainment. As we add more categories,
  // we'll expand this switch statement
  const renderCategoryForm = () => {
    switch (categoryFromPath) {
      case "Entertainment":
        return <EntertainmentCreatePost />;
      default:
        return <EntertainmentCreatePost />;
    }
  };

  return renderCategoryForm();
}