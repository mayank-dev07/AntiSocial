import React, { createContext, useContext, useEffect, useState } from "react";
import useStore from "../zustand/zustan";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setonlineUsers] = useState([]);
  const { user } = useStore();

  useEffect(() => {
    const newSocket = io("/", {
      query: {
        userId: user?._id,
      },
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (users) => {
        setonlineUsers(users);
        // //console.log(users);
      });
    }
  }, [socket]);

  // useEffect(() => {
  //   //console.log(onlineUsers);
  // }, [onlineUsers, socket]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
