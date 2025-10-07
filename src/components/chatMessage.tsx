import { convertDateToDateTimeString } from "@/utils/function";

export interface ChatMessageInterface {
  id: string;
  username: string;
  isMe: boolean;
  message: string;
  datetime: Date;
}

interface ChatMessageProps {
  username: string;
  isMe: boolean;
  message: string;
  datetime: Date;
}

const ChatMessage = ({
  username,
  isMe,
  message,
  datetime,
}: ChatMessageProps) => {
  return (
    <div
      className={`flex flex-col ${isMe ? "items-end" : "items-start"} gap-1`}
    >
      {!isMe && (
        <p className="text-sm font-medium text-primary dark:text-white">
          {username}
        </p>
      )}
      <div
        className={`flex gap-2 items-end ${
          isMe ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <p
          className={`max-w-[60%] border text-md p-3 rounded-md break-all whitespace-pre-wrap ${
            isMe
              ? "border-primary bg-primary text-white dark:text-foreground"
              : "border-background bg-background text-primary dark:text-white"
          }`}
        >
          {message}
        </p>

        <p className="text-sm text-foreground">
          {convertDateToDateTimeString(datetime)}
        </p>
      </div>
    </div>
  );
};
export default ChatMessage;
