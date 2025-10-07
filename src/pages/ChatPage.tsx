import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import type { UserInterface } from "@/interface/user";
import { BASE_URL, type ResponseInterface } from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { X, Moon, Sun } from "lucide-react";
import ChatUserContainer, {
  type ChatUserInterface,
} from "@/components/chatUserContainer";
import ChatMessage, {
  type ChatMessageInterface,
} from "@/components/chatMessage";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);
  const [chatUsers, setChatUsers] = useState<ChatUserInterface[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageInterface[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`${BASE_URL}/v1/user/me`, {
          method: "GET",
          credentials: "include",
        });
        const data: ResponseInterface<UserInterface> = await res.json();

        if (data.success) {
          setUser(data.message);

          const sampleChatUsers: ChatUserInterface[] = Array.from({
            length: 20,
          }).map((_, i) => ({
            id: `User-${i + 1}`,
            username: `User-${i + 1}`,
            datetime: new Date(),
            lastMessage: `This is message ${i + 1}`,
          }));
          setChatUsers(sampleChatUsers);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [navigate, setUser]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/v1/user/logout`, {
        method: "GET",
        credentials: "include",
      });

      const data: ResponseInterface<UserInterface> = await res.json();

      if (data.success) {
        setUser(null);
        setOpenLogoutPopup(false);
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessageInterface = {
      id: crypto.randomUUID(),
      username: user?.username || "",
      message: messageInput.trim(),
      datetime: new Date(),
      isMe: true,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
  };

  const LogoutPopup = () => (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-white dark:bg-card rounded-xl w-[300px] p-6 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer"
          onClick={() => setOpenLogoutPopup(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-primary dark:text-white">
          Log out
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="cursor-pointer text-primary dark:text-white"
            onClick={() => setOpenLogoutPopup(false)}
          >
            Cancel
          </Button>
          <Button className="cursor-pointer text-white" onClick={handleLogout}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );

  const activeUser = chatUsers.find((c) => c.id === activeChatId);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background dark:bg-card">
        <p className="text-xl text-primary dark:text-white animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="w-full h-screen flex bg-gradient-to-tl from-primary to-secondary dark:from-primary/70 dark:to-secondary/70 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[30%] h-full bg-gradient-to-br from-primary to-primary/10 dark:from-primary/20 dark:to-primary/5 backdrop-blur-lg flex flex-col">
          <h2 className="sticky top-0 bg-card text-primary dark:text-white text-2xl font-bold p-3 shadow-md z-10 mb-2">
            Your Chats
          </h2>

          <ul className="flex-1 overflow-y-auto space-y-2">
            {chatUsers.map((chat) => (
              <ChatUserContainer
                key={chat.id}
                username={chat.username}
                lastMessage={chat.lastMessage}
                datetime={chat.datetime}
                onClick={() => setActiveChatId(chat.id)}
                isActive={chat.id === activeChatId}
              />
            ))}
          </ul>

          <div className="w-full h-20 bg-card text-primary dark:text-white p-3 shadow-md z-10 relative flex justify-between items-center gap-4">
            <div>
              <p className="text-md font-medium">Logged in as:</p>
              <p className="text-lg font-bold">{user.username ?? "Unknown"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                className="cursor-pointer text-primary dark:text-white"
                onClick={() => setDarkMode((prev) => !prev)}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => setOpenLogoutPopup(true)}
              >
                Log out
              </Button>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <main className="w-full h-full bg-gradient-to-br from-background to-primary/10 dark:from-card dark:to-primary/20 backdrop-blur-lg flex flex-col z-10">
          {activeUser ? (
            <>
              <h2 className="sticky top-0 bg-card text-primary dark:text-white text-2xl font-bold p-3 z-20 mb-2">
                {activeUser.username}
              </h2>
              {chatMessages.length > 0 ? (
                <ul className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((chat) => (
                    <ChatMessage
                      key={chat.id}
                      username={chat.username}
                      isMe={chat.username === user.username}
                      message={chat.message}
                      datetime={chat.datetime}
                    />
                  ))}
                </ul>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <h1 className="text-6xl font-bold text-primary dark:text-foreground">
                    SockeTalk
                  </h1>
                </div>
              )}
              <div className="w-full h-20 sticky bottom-0 bg-card text-primary dark:text-white p-3 flex gap-4 items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="border rounded-full w-full px-4 py-2 outline-none bg-background dark:bg-card text-foreground dark:text-white"
                  placeholder="Type a message..."
                />
                <Button onClick={handleSendMessage}>Submit</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-6xl font-bold text-primary dark:text-foreground">
                SockeTalk
              </h1>
            </div>
          )}
        </main>
      </div>

      {/* Logout Popup */}
      {openLogoutPopup && <LogoutPopup />}
    </>
  );
};

export default ChatPage;
