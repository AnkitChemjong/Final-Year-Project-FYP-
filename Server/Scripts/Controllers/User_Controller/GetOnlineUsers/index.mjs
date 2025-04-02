import User from "../../../Model/User_Model/index.mjs";
import { userSocketMap } from "../../../Services/UserService/Socket/index.mjs";

const getOnlineUsers=async(req,res)=>{
    try{
        const onlineUserIds = Array.from(userSocketMap.keys());
        if (onlineUserIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users currently online",
                onlineUsers: []
            });
        }
        const onlineUsers = await User.find(
            { _id: { $in: onlineUserIds } });
        return res.status(200).json({
            success: true,
            message: "Online users fetched successfully",
            onlineUsers: onlineUsers
        });
    }
    catch(error){
        console.log(error);
        return res.status(200).json({message:"Error on getting the online users.",error:error?.message});
    }
}
export default getOnlineUsers;