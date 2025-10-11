import { BASE_API_PATH } from "@/utils/const";
import { useEffect, useState } from "react";

const ConnectionCheck = () => {
  const [haveConnected, setHaveConnected] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch(`${BASE_API_PATH}/v1/connection`);
        if (response.ok) {
          setHaveConnected(true);
        }
      } catch (error) {
        setHaveConnected(false);
      }
    }

    const intervalId = setInterval(checkConnection, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-background px-3 py-1 rounded-full shadow-md z-100">
      <div
        className={`w-3 h-3 rounded-full ${
          haveConnected ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <p className="text-black font-medium text-lg">
        {haveConnected ? "Connected" : "Not Connected"}
      </p>
    </div>
  );
};

export default ConnectionCheck;
