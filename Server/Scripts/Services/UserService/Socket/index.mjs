import { Server } from "socket.io";
import NotificationModel from "../../../Model/Notification_Model/index.mjs";
import webpush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

webpush.setVapidDetails(
    'mailto:npp.rasik@email.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

let io;
const userSocketMap=new Map();
const pushSubscriptions = new Map();


const sendPushNotification = async (userId, message) => {
    try {
      if (pushSubscriptions.has(userId)) {
        const subscription = pushSubscriptions.get(userId);
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: 'New Notification',
            body: message.content || 'You have a new notification',
            data: { 
              url: '/notifications',
              userId: userId,
              ...message 
            }
          })
        );
      }
    } catch (error) {
      console.error('Push notification failed:', error);
      if (error.statusCode === 410) {
        pushSubscriptions.delete(userId); 
      }
    }
  };
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
        if(notificationMessage ){
            if(socketId){

                io.to(socketId).emit('notification',notificationMessage);
            }
            else {
                await sendPushNotification(message.userId, notificationMessage);
              }
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
        if(notificationMessage  ){
            if(socketId){

                io.to(socketId).emit('notification',notificationMessage);
            }
        }

    }
    catch(error){
        console.log(error);
    }
 }
 const handleHireTeacher=async(message)=>{
  try{
      const socketId=userSocketMap.get(message?.userId);
      const notificationMessage=await NotificationModel.create(message);
      if(notificationMessage  ){
          if(socketId){
              io.to(socketId).emit('notification',notificationMessage);
          }
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
        if(notificationMessage ){
            if(socketId){

                io.to(socketId).emit('notification',notificationMessage);
            }
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
        socket.on('register-push', (subscription) => {
            pushSubscriptions.set(userId, subscription);
            console.log(`Push subscription registered for user ${userId}`);
          });
        console.log(`User Connected: ${userId} with socket ID: ${socket.id}`)
    }
    else{
        console.log("User Id not provided during connection")
    }
    socket.on('course-bought-teacher',handleCourseBoughtTeacher);
    socket.on('course-bought-student',handleCourseBoughtStudent);
    socket.on('subscription-bought',handleSubscriptionBought);
    socket.on("hire-teacher-message",handleHireTeacher);
    socket.on("request-update",handleHireTeacher);
    socket.on('message',(e)=>console.log(e));
    socket.on('disconnect',()=>disconnect(socket))
 })
 
 
}


export {io,userSocketMap,sendPushNotification};
export default setUpSocket;