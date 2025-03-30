import { Server } from "socket.io";
import dotenv from 'dotenv';
dotenv.config();

const setUpSocket=(server)=>{
 const io=new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
        methods:["GET","POST"],
        credentials:true
    }
 });

 const userSocketMap=new Map();

 const disconnect=(socket)=>{
    console.log(`Client disconnected: ${socket.id}`);
    for(const [userId,socketId] of userSocketMap.entries()){
      if(socketId===socket.id){
        userSocketMap.delete(userId);
        break;
      }
    }

 }
 const handleCourseBought=(message)=>{
    console.log('course-bought',message?.userId);
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
    socket.on('course-bought',handleCourseBought)
    socket.on('message',(e)=>console.log(e));
    socket.on('disconnect',()=>disconnect(socket))
 })
 
 
}
export default setUpSocket;