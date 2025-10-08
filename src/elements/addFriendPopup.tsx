import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import { X, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface AddFriendPopupProps {
  setOpenAddFriendPopup: (bool: boolean) => void;
}

const AddFriendPopup = ({ setOpenAddFriendPopup }: AddFriendPopupProps) => {
  const { user } = useUser();
  const { socket } = useSocket();
  const [activeUserIds, setActiveUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("active-users-id", (userids: string[]) => {
      const filteredUserIds = userids.filter((id) => id !== user.userid);
      setActiveUserIds(filteredUserIds);
    });

    return () => {
      socket.off("active-users-id");
    };
  }, [socket, user]);

  return (
    <div
      className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={() => setOpenAddFriendPopup(false)}
    >
      <div
        className="bg-white dark:bg-card rounded-xl w-[80%] h-[80%] p-6 relative shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer"
          onClick={() => setOpenAddFriendPopup(false)}
        >
          <X size={20} />
        </button>

        {/* หัวข้อ */}
        <h2 className="text-xl font-bold mb-4 text-primary dark:text-white">
          Add Friend
        </h2>

        {activeUserIds.length > 0 ? (
          <ul className="flex-1 overflow-auto space-y-3">
            {activeUserIds.map((userId) => (
              <li
                key={userId}
                className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <span className="text-gray-800 dark:text-gray-100">
                  {userId}
                </span>
                <Button
                  size="sm"
                  className="cursor-pointer flex items-center gap-1"
                >
                  <UserPlus size={16} />
                  Add
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No active users...</p>
        )}
      </div>
    </div>
  );
};

export default AddFriendPopup;
