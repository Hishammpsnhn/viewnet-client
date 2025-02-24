import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Array<{
    message: string;
  }>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      message: string;
    }>
  >([]);

  useEffect(() => {
    const socketInstance = io("http://api.viewnet.cfd", {
      withCredentials: true,
      path: "/socket.io/",
      transports: ["websocket"],
    });
    
    socketInstance.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });
    
    socketInstance.on("error", (error) => {
      console.error("Socket Error:", error);
    });
    
    socketInstance.io.on("ping", () => {
      console.log("ping");
    });
    


    // Set up event listeners
    socketInstance.on("connect", () => {
      setIsConnected(true);
      // Subscribe to notifications
      setSocket(socketInstance);
      socketInstance.emit("subscribeToNotifications");
    });
    socketInstance.on("selectedMovie", (videoState) => {
      navigate(videoState);
    });
    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    socketInstance.on("notification", (notification) => {
      toast.info(notification.message);
      setNotifications((prev) => [...prev, notification]);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};
