import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import type { UserInterface } from "@/interface/user";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Moon, Sun, X } from "lucide-react";
import ChatUserContainer, {
  type ChatUserInterface,
} from "@/components/chatUserContainer";
import ChatMessage, {
  type ChatMessageInterface,
} from "@/components/chatMessage";
import { useSocket } from "@/context/socketContext";
import { BASE_API_PATH, JWT } from "@/utils/const";
import type { ResponseInterface } from "@/interface/api";
import LogoutPopup from "@/elements/logoutPopup";
import AddFriendPopup from "@/elements/addFriendPopup";
import ConnectionCheck from "@/components/connection";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { disconnectSocket, socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);
  const [openAddFriendPopup, setOpenAddFriendPopup] = useState(false);
  const [chatUsers, setChatUsers] = useState<ChatUserInterface[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageInterface[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);
  const [isOpenRightPanelInTablet, setOpenRightPanelInTablet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem(JWT);
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${BASE_API_PATH}/v1/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: ResponseInterface<UserInterface> = await res.json();

        if (data.success) {
          setUser(data.message);
          setChatUsers(
            data.message.friendList.map((f: UserInterface) => ({
              id: f.userid,
              username: f.username,
            }))
          );
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

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("new-friend", (friend: UserInterface) => {
      setChatUsers((prev) => {
        if (prev.some((u) => u.id === friend.userid)) return prev;
        return [...prev, { id: friend.userid, username: friend.username }];
      });
    });

    return () => {
      socket.off("new-friend");
    };
  }, [socket, user]);

  const handleLogout = () => {
    setUser(null);
    disconnectSocket();
    localStorage.removeItem(JWT);
    navigate("/login");
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

  const handleAddFriend = async (friend: UserInterface) => {
    try {
      const token = localStorage.getItem(JWT);
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_API_PATH}/v1/user/add`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend }),
      });

      console.log(response);

      const data: ResponseInterface<string> = await response.json();

      if (data.success) {
        socket?.emit("friend-added", {
          userid: user?.userid,
          friendid: friend.userid,
        });
      }
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  };

  const activeUser = chatUsers.find((c) => c.id === activeChatId);

  if (loading) {
    return (
      <>
        <ConnectionCheck />
        <div className="w-full h-screen flex items-center justify-center bg-background dark:bg-card">
          <p className="text-xl text-primary dark:text-white animate-pulse">
            Loading...
          </p>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <ConnectionCheck />
      <div className="w-full h-screen flex bg-gradient-to-tl from-primary to-secondary dark:from-primary/70 dark:to-secondary/70 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-full md:max-w-[400px] shrink-0 h-full bg-gradient-to-br from-primary to-primary/10 dark:from-primary/20 dark:to-primary/5 backdrop-blur-lg flex flex-col">
          <h2 className="sticky top-0 bg-card text-primary dark:text-white text-2xl font-bold p-3 shadow-md z-10 mb-2">
            Your Chats
          </h2>

          <ul className="flex-1 overflow-y-auto space-y-2">
            {chatUsers.map((chatUser: ChatUserInterface) => (
              <ChatUserContainer
                key={chatUser.id}
                user={chatUser}
                onClick={() => {
                  setActiveChatId(chatUser.id);
                  if (window.innerWidth < 768) setOpenRightPanelInTablet(true);
                }}
                isActive={chatUser.id === activeChatId}
              />
            ))}
          </ul>

          <div className="w-full h-20 bg-card text-primary dark:text-white p-3 shadow-md z-10 relative flex justify-between gap-4">
            <div>
              <p className="text-md font-medium">Logged in as:</p>
              <p className="text-lg font-bold">{user.username ?? "Unknown"}</p>
            </div>
            <div className="flex gap-1 items-center">
              <Button
                variant="outline"
                className="cursor-pointer text-primary dark:text-white"
                onClick={() => setDarkMode((prev) => !prev)}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button
                className="cursor-pointer text-white"
                onClick={() => {
                  setOpenAddFriendPopup(true);
                }}
              >
                Add Friend
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

        {/* Right Panel */}
        <main
          className={`fixed md:static top-0 right-0 w-full md:w-auto md:flex-1 h-full 
            bg-gradient-to-br from-background to-primary/10 dark:from-card dark:to-primary/20 
            backdrop-blur-lg flex flex-col z-20 transform transition-transform duration-300
            ${
              isOpenRightPanelInTablet
                ? "translate-x-0"
                : "translate-x-full md:translate-x-0"
            }`}
        >
          {activeUser ? (
            <>
              <div className="sticky top-0 bg-card text-primary dark:text-white text-2xl font-bold p-3 z-20 mb-2 flex justify-between items-center">
                <span>{activeUser.username}</span>
                <button
                  className="md:hidden p-2 rounded-full hover:bg-muted transition"
                  onClick={() => {
                    setOpenRightPanelInTablet(false);
                    setActiveChatId("");
                  }}
                >
                  <X size={22} />
                </button>
              </div>

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
                  <div ref={messagesEndRef} />
                </ul>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <h1 className="text-6xl font-bold text-primary dark:text-foreground">
                    SockeTalk
                  </h1>
                </div>
              )}

              <div className="w-full h-20 bg-card text-primary dark:text-white p-3 flex gap-4 items-center">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      setMessageInput((prev) => prev + "\n");
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="w-full max-h-32 min-h-[48px] border rounded-full px-4 py-2 outline-none bg-background dark:bg-card text-foreground dark:text-white resize-none overflow-y-auto"
                  rows={1}
                />
                <Button onClick={handleSendMessage} className="text-white">
                  Submit
                </Button>
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

      {/* Popups */}
      {openLogoutPopup && (
        <LogoutPopup
          setOpenLogoutPopup={setOpenLogoutPopup}
          handleLogout={handleLogout}
        />
      )}
      {openAddFriendPopup && (
        <AddFriendPopup
          setOpenAddFriendPopup={setOpenAddFriendPopup}
          handleAddFriend={handleAddFriend}
        />
      )}
    </>
  );
};

export default ChatPage;
