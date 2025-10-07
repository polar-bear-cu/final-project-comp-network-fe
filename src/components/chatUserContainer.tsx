import { convertDateToDateString } from "@/utils/function";
import { UserCircle } from "lucide-react";

export interface ChatUserInterface {
  id: string;
  username: string;
  datetime: Date;
  lastMessage: string;
}

interface ChatContainerProps {
  username: string;
  lastMessage?: string;
  datetime: Date;
  onClick?: () => void;
  isActive?: boolean;
}

const ChatUserContainer = ({
  username,
  lastMessage,
  datetime,
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
        <UserCircle
          size={32}
          className="text-background dark:text-foreground"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-md truncate text-background dark:text-foreground">
            {username}
          </span>
          <span className="text-background dark:text-foreground text-sm truncate">
            {lastMessage}
          </span>
        </div>
      </div>

      <span className="text-background dark:text-foreground text-xs font-medium">
        {convertDateToDateString(datetime)}
      </span>
    </div>
  );
};

export default ChatUserContainer;
