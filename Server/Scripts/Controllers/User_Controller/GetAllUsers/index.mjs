import User from "../../../Model/User_Model/index.mjs";

const getAllUsers=async(req,res)=>{
    try{
         const allUsers=await User.find({});
        //  console.log(allUsers);
         if(allUsers.length>0){
            return res.status(200).json({message:"all users are fetched successfully",data:allUsers});

         }
         return res.status(400).json({message:"no users found",data:null})

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on getting all users.",error:error?.message})
    }
}

export default getAllUsers;