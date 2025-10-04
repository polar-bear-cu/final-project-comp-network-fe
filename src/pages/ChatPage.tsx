import type { UserInterface } from "@/interface/user";
import { BASE_URL, type ResponseInterface } from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ChatPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function getUsername() {
      try {
        const res = await fetch(`${BASE_URL}/v1/user/me`, {
          method: "GET",
          credentials: "include",
        });

        const data: ResponseInterface<UserInterface> = await res.json();
        if (data.success) {
          setUsername(data.message.username);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    }

    getUsername();
  }, []);

  if (!username) return <p>Loading...</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-primary to-secondary flex justify-center items-center">
      <main className="w-full h-full flex">
        <p className="text-2xl font-bold text-white text-center">
          This is ChatPage. Welcome, {username}
        </p>
      </main>
    </div>
  );
};

export default ChatPage;
