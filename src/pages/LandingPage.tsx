import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const [haveConnected, setHaveConnected] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch(`${BASE_URL}/`);
        if (response.ok) {
          setHaveConnected(true);
        }
      } catch (error) {
        setHaveConnected(false);
        console.error("Error checking connection:", error);
      }
    }

    const intervalId = setInterval(checkConnection, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary to-secondary flex justify-center items-center">
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-background px-3 py-1 rounded-full shadow-md">
        <div
          className={`w-3 h-3 rounded-full ${
            haveConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <p className="text-black font-medium text-lg">
          {haveConnected ? "Connected" : "Not Connected"}
        </p>
      </div>
      <main className="flex flex-col justify-center items-center gap-16 p-4">
        <div className="flex flex-col items-center text-white font-bold gap-2">
          <h1 className="text-6xl text-primary-foreground drop-shadow-lg">
            SockeTalk
          </h1>
          <h1 className="text-2xl">Chat Website with Socket.io</h1>
        </div>

        <Button className="cursor-pointer" onClick={handleClick} size="landing">
          <p className="text-lg font-semibold text-background">Get Started</p>
        </Button>
      </main>
    </div>
  );
};

export default LandingPage;
