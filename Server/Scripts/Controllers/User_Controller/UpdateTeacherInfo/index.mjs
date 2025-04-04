import User from "../../../Model/User_Model/index.mjs";
import fs from 'fs';

export const updateTeacherInfo=async(req,res)=>{
    try{
        const {degree,avilability,feePerHour,description,college,university,category,primaryLanguage,experience}=req.body;
        const {id}=req.params;
        //console.log(degree,avilability,description,college,university);
        if(id){
        if(!req.file){
            return res.status(400).json({message:"File is Required"});
           }
           const user=await User.findById(id);
           if(user?.teacherInfo?.certificate){
            const filePath=`./Scripts/Upload/${user?.teacherInfo?.certificate}`;
            fs.unlink(filePath,(err)=>{
                if (err) {
                    console.error('Error deleting file:', err);
                  } else {
                    console.log('File deleted successfully!');
                  }
            })
           }
           const certificate=`${user?.userId}/TeacherCertificate/${req.file.filename}`;
        
            const updatedUser=await User.findByIdAndUpdate(id,{teacherInfo:{certificate,degree,avilability,description
                ,college,university,feePerHour,category,primaryLanguage,experience
            }},{new:true,runValidators:true});
            if(updatedUser){
                return res.status(200).json({message:"Info Updated Successfully",data:updatedUser,error:null})
            }
            return res.status(400).json({message:"User not found."})
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on updating teacher info.",data:null,error:error?.message})
    }
}