import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Automotive from "./pages/categories/Automotive";
import CarReviews from "./pages/categories/automotive/CarReviews";
import Workshops from "./pages/categories/automotive/Workshops";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Automotive />} />
        <Route path="/categories/automotive/reviews" element={<CarReviews />} />
        <Route path="/categories/automotive/workshops" element={<Workshops />} />
      </Routes>
    </Router>
  );
};

export default App;
