import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import { X, UserPlus, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserInterface } from "@/interface/user";

interface AddFriendPopupProps {
  setOpenAddFriendPopup: (bool: boolean) => void;
  handleAddFriend: (friendid: string) => void;
}

const AddFriendPopup = ({
  setOpenAddFriendPopup,
  handleAddFriend,
}: AddFriendPopupProps) => {
  const { user } = useUser();
  const { socket } = useSocket();
  const [activeUsers, setActiveUsers] = useState<UserInterface[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("get-active-users");

    socket.on("active-users", (users: UserInterface[]) => {
      const friendIds = user.friendList.map((f: UserInterface) => f.userid);
      const filteredUsers = users.filter(
        (u) => u.userid !== user.userid && !friendIds.includes(u.userid)
      );
      setActiveUsers(filteredUsers);
    });

    return () => {
      socket.off("active-users");
    };
  }, [socket, user]);

  const handleAddFriendClick = (friendid: string) => {
    handleAddFriend(friendid);
    setAddedFriends((prev) => [...prev, friendid]);
  };

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

        <h2 className="text-xl font-bold mb-4 text-primary dark:text-white">
          Add Friend
        </h2>

        {activeUsers.length > 0 ? (
          <ul className="flex-1 overflow-auto space-y-3">
            {activeUsers.map((u) => {
              const isAdded = addedFriends.includes(u.userid);
              return (
                <li
                  key={u.userid}
                  className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  <span className="text-gray-800 dark:text-gray-100">
                    {u.username}
                  </span>
                  <Button
                    size="sm"
                    className="cursor-pointer flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => handleAddFriendClick(u.userid)}
                    disabled={isAdded}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} />
                        Added
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Add
                      </>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No active users...</p>
        )}
      </div>
    </div>
  );
};

export default AddFriendPopup;
