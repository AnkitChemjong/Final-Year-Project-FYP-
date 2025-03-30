import React, { useRef, useEffect,createContext,useContext } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Host } from '@/Routes';

const socketContext=createContext();

export const useSocket = () => {
    return useContext(socketContext);
}
    

export default function SocketContext({ children }) {
    const socket = useRef(null);
    const userState = useSelector(state => state?.user);
    const { data: userInfo,loading } = userState;

    useEffect(() => {
        if (userInfo?._id && !socket.current?.connected) {
            socket.current = io(Host, {
                withCredentials: true,
                query: { userId: userInfo._id },
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socket.current.on("connect", () => {
                console.log("Socket connected");
            });

            socket.current.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            socket.current.on("error", (err) => {
                console.error("Socket error:", err);
            });
        }

        return () => {
            if (socket.current?.connected) {
                socket.current.disconnect();
            }
        };
    }, [userInfo?._id,!loading]);

    return (
        <socketContext.Provider value={{socket:socket.current}}>
            {children}
        </socketContext.Provider>
    );
}