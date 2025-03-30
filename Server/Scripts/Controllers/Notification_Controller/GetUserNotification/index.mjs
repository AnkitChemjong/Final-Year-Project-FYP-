import NotificationModel from "../../../Model/Notification_Model/index.mjs";


const getUserNotification=async(req,res)=>{
    try{
       const {id}=req.params;
       if(!id){
        return res.status(400).json({message:"user id is required"});
       }
       const userNotification=await NotificationModel.find({userId:id});
       return res.status(200).json({message:"Successfully retrived user Notification",data:userNotification});
    }
    catch(error){
      console.log(error);
      return res.status(500).json({message:"error on getting user Notification",data:null,error:error?.message});
    }
}
export default getUserNotification;