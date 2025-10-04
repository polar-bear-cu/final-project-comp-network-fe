import { Home } from "lucide-react";
import { useNavigate } from "react-router";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("/");
      }}
      className="absolute top-4 left-4 bg-background px-6 py-2 rounded-full shadow-md z-50 cursor-pointer"
    >
      <Home size={24} />
    </button>
  );
};

export default HomeButton;
