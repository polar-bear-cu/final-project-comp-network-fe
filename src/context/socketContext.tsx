import { BASE_SOCKET_PATH } from "@/utils/const";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useUser } from "./userContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
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
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.userid) {
      if (socketRef.current) {
        console.log("User logged out, disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    if (socketRef.current) {
      console.log("Socket already connected");
      return;
    }

    const newSocket = io(BASE_SOCKET_PATH, {
      auth: { username: user.username, userid: user.userid },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket connection");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.userid]);

  const disconnectSocket = () => {
    if (socketRef.current?.connected) {
      console.log("Manual disconnect");
      socketRef.current.disconnect();
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
