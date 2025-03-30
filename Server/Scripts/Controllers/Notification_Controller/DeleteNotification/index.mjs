import NotificationModel from "../../../Model/Notification_Model/index.mjs";


const deleteUserNotification=async(req,res)=>{
    try{
       const {id,userId,status}=req.body;
       console.log('id' ,id,"userId",userId,status)
       if(!id || !status || !userId){
        return res.status(400).json({message:"user id,userId and status is required"});
       }
       if(status === "all"){
         await NotificationModel.deleteMany({userId:userId});
         return res.status(200).json({message:"All Notification Deleted Successfully"});
       }
       else{
           await NotificationModel.findByIdAndDelete(id);
           return res.status(200).json({message:"Successfully deleted user Notification"});
       }
    }
    catch(error){
      console.log(error);
      return res.status(500).json({message:"error on getting user Notification",data:null,error:error?.message});
    }
}
export default deleteUserNotification;