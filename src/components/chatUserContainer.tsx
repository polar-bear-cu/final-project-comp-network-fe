import { UserCircle } from "lucide-react";

export interface ChatUserInterface {
  id: number;
  username: string;
}

interface ChatContainerProps {
  username: string;
  lastMessage?: string;
  time?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const ChatUserContainer = ({
  username,
  lastMessage = "This is a message preview...",
  time = "12:34 PM",
  onClick,
  isActive = false,
}: ChatContainerProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded-xl cursor-pointer transition-all duration-200
        ${isActive ? "bg-primary/60 " : "hover:bg-card/10"}
      `}
    >
      <div className="flex items-center gap-3">
        <UserCircle size={32} className="text-gray-200" />
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-md truncate text-foreground dark:text-card-foreground">
            {username}
          </span>
          <span className="text-black-300 dark:text-gray-300 text-sm truncate">
            {lastMessage}
          </span>
        </div>
      </div>

      <span className="text-gray-200 text-xs font-medium">{time}</span>
    </div>
  );
};

export default ChatUserContainer;
