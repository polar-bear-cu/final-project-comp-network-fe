import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import type { UserInterface } from "@/interface/user";
import { BASE_URL, type ResponseInterface } from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);

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
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    }

    loadUser();
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    alert("ออกจากระบบแล้วนะ");
    setOpenLogoutPopup(false);
  };

  const LogoutPopup = () => {
    return (
      <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div
          className="bg-white rounded-xl w-[300px] p-6 relative shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
            onClick={() => setOpenLogoutPopup(false)}
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-4 text-primary">Log out</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to log out?
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpenLogoutPopup(false)}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={handleLogout}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex bg-gradient-to-tl from-primary to-secondary overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-[30%] h-full bg-gradient-to-br from-primary to-primary/10 backdrop-blur-lg flex flex-col">
        <div className="sticky top-0 bg-background text-primary text-2xl font-bold p-3 shadow-md z-10">
          Your Chats
        </div>

        <ul className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <li
              key={i}
              className="p-2 rounded-lg hover:bg-white/20 cursor-pointer text-white"
            >
              Chat {i + 1}
            </li>
          ))}
        </ul>

        <div className="bg-white p-3 shadow-md z-10 relative">
          <div className="flex justify-between items-center gap-4">
            <div className="text-primary">
              <p className="text-md font-medium">Logged in as:</p>
              <p className="text-lg font-bold">{user.username ?? "Unknown"}</p>
            </div>
            <div>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => {
                  setOpenLogoutPopup(true);
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Content */}
      <main className="w-[70%] h-full bg-gradient-to-br from-primary to-primary/10 backdrop-blur-lg flex flex-col">
        This is Chat Content
      </main>

      {/* Logout Popup */}
      {openLogoutPopup && <LogoutPopup />}
    </div>
  );
};

export default ChatPage;
