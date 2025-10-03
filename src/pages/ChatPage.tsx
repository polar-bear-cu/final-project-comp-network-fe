import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = Cookies.get("username");
    if (!user) {
      window.location.href = "/login";
    } else {
      setUsername(user);
    }
  }, []);

  if (!username) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-primary to-secondary flex justify-center items-center">
      <main className="w-full h-full flex">
        <p className="text-2xl font-bold text-white">
          This is ChatPage. Welcome, {username} 🎉
        </p>
      </main>
    </div>
  );
};

export default ChatPage;
