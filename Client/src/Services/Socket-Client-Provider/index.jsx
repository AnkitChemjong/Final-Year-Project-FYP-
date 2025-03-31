import React, { useState, useEffect, createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Host } from '@/Routes';
import { UseContextApi } from '@/Components/ContextApi';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const userState = useSelector(state => state?.user);
    const { data: userInfo } = userState;
    const {specificUserNotification,setSpecificUserNotification,unreadCount, setUnreadCount}=useContext(UseContextApi);

    useEffect(() => {
        if (userInfo?._id && !socket) {
            console.log("Initializing socket...");
            const newSocket = io(Host, {
                withCredentials: true,
                query: { userId: userInfo._id },
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            newSocket.on("connect", () => {
                console.log("Socket connected");
            });

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            newSocket.on("error", (err) => {
                console.error("Socket error:", err);
            });


            const handleAddCourseNotification=async(message)=>{
                try{
                    setSpecificUserNotification((prev) => [...prev, message])
                    setUnreadCount(specificUserNotification?.filter(item => !item?.read).length);
                }
                catch(err){
                    console.log(err);
                }
                
            }
            newSocket.on('notification',handleAddCourseNotification);
            newSocket.on('notification',handleAddCourseNotification);
            setSocket(newSocket);
        }
        return () => {
            if (socket) {
                console.log("Disconnecting socket...");
                socket.disconnect();
                setSocket(null);
            }
        };
    }, [userInfo?._id]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}
