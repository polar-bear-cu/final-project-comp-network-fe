import { BASE_SOCKET_PATH } from "@/utils/const";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useUser } from "./userContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectSocket: (userid: string) => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(BASE_SOCKET_PATH, {
      auth: { userid: user.userid },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const connectSocket = (userid: string) => {
    if (!socket) return;
    if (!socket.connected) {
      socket.auth = { userid };
      socket.connect();
    }
  };

  const disconnectSocket = () => {
    if (!socket) return;
    if (socket.connected) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    if (socket && user) {
      connectSocket(user.userid);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, connectSocket, disconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
