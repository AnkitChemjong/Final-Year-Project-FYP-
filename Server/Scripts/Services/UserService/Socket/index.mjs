import { Server } from "socket.io";
import NotificationModel from "../../../Model/Notification_Model/index.mjs";
import dotenv from 'dotenv';
dotenv.config();

let io;
const userSocketMap=new Map();

const setUpSocket=(server)=>{
  io=new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
        methods:["GET","POST"],
        credentials:true
    }
 });

 const disconnect=(socket)=>{
    console.log(`Client disconnected: ${socket.id}`);
    for(const [userId,socketId] of userSocketMap.entries()){
      if(socketId===socket.id){
        userSocketMap.delete(userId);
        break;
      }
    }

 }
 const handleCourseBoughtTeacher=async(message)=>{
    try{
        console.log(message);
        const socketId=userSocketMap.get(message?.userId);
        const notificationMessage=await NotificationModel.create(message);
        if(notificationMessage && socketId){
            io.to(socketId).emit('notification',notificationMessage);
        }

    }
    catch(error){
        console.log(error);
    }
 }
 const handleCourseBoughtStudent=async(message)=>{
    try{
        const socketId=userSocketMap.get(message?.userId);
        const notificationMessage=await NotificationModel.create(message);
        if(notificationMessage && socketId){
            io.to(socketId).emit('notification',notificationMessage);
        }

    }
    catch(error){
        console.log(error);
    }
 }
 const handleSubscriptionBought=async(message)=>{
    try{
        const socketId=userSocketMap.get(message?.userId);
        const notificationMessage=await NotificationModel.create(message);
        if(notificationMessage && socketId){
            io.to(socketId).emit('notification',notificationMessage);
        }

    }
    catch(error){
        console.log(error);
    }
 }
 
 io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap.set(userId,socket.id);
        console.log(`User Connected: ${userId} with socket ID: ${socket.id}`)
    }
    else{
        console.log("User Id not provided during connection")
    }
    socket.on('course-bought-teacher',handleCourseBoughtTeacher);
    socket.on('course-bought-student',handleCourseBoughtStudent);
    socket.on('subscription-bought',handleSubscriptionBought);
    socket.on('message',(e)=>console.log(e));
    socket.on('disconnect',()=>disconnect(socket))
 })
 
 
}

export {io,userSocketMap};
export default setUpSocket;