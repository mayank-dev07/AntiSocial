import React, { createContext, useContext, useEffect, useState } from "react";
import useStore from "../zustand/zustan";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useStore();

  useEffect(() => {
    const newSocket = io("http://localhost:8000", {
      query: {
        userId: user?._id,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socket.on("error", (error) => {
        console.error("Socket.IO error:", error);
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};