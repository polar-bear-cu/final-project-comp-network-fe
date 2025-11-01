import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/userContext";
import { X, UserPlus, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserInterface } from "@/interface/user";

interface AddFriendPopupProps {
  setOpenAddFriendPopup: (bool: boolean) => void;
  handleAddFriend: (friendid: string) => void;
  activeUsers: string[];
}

const AddFriendPopup = ({
  setOpenAddFriendPopup,
  handleAddFriend,
  activeUsers,
}: AddFriendPopupProps) => {
  const { user } = useUser();
  const { socket } = useSocket();
  const [potentialFriends, setPotentialFriends] = useState<UserInterface[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("get-active-users");

    socket.on("active-users", (users: UserInterface[]) => {
      const friendIds = user.friendList.map((f: UserInterface) => f.userid);
      const filteredUsers = users.filter(
        (u) =>
          u.userid !== user.userid &&
          !friendIds.includes(u.userid) &&
          activeUsers.includes(u.userid)
      );
      setPotentialFriends(filteredUsers);
    });

    return () => {
      socket.off("active-users");
    };
  }, [socket, user, activeUsers]);

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

        {potentialFriends.map((potentialFriend) => (
          <div
            key={potentialFriend.userid}
            className="flex items-center justify-between p-2 rounded hover:bg-accent"
          >
            <span className="flex items-center gap-2">
              {potentialFriend.username}
              <div className="w-2 h-2 rounded-full bg-green-500" />{" "}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleAddFriend(potentialFriend.userid);
                setAddedFriends([...addedFriends, potentialFriend.userid]);
              }}
              disabled={addedFriends.includes(potentialFriend.userid)}
            >
              {addedFriends.includes(potentialFriend.userid) ? (
                <Check className="h-5 w-5" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
            </Button>
          </div>
        ))}
        {potentialFriends.length === 0 && (
          <p className="text-center text-muted-foreground">
            No users available to add
          </p>
        )}
      </div>
    </div>
  );
};

export default AddFriendPopup;
