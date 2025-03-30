import NotificationModel from "../../../Model/Notification_Model/index.mjs";


const updateUserNotification=async(req,res)=>{
    try{
       const {id}=req.params;
       if(!id){
        return res.status(400).json({message:"user id is required"});
       }
       await NotificationModel.updateMany({userId:id,read:false},{$set:{read:true}},{runValidators:true});
       return res.status(200).json({message:"Successfully updated user Notification"});
    }
    catch(error){
      console.log(error);
      return res.status(500).json({message:"error on updating user Notification",error:error?.message});
    }
}
export default updateUserNotification;