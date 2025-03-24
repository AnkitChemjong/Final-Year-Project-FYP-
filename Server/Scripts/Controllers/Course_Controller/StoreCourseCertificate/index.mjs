import ProgressModel from "../../../Model/Course_Progress_Model/index.mjs";
import User from "../../../Model/User_Model/index.mjs";

const storeCourseCertificate=async (req,res)=>{
    try{
        
       const {userId,courseId}=req.params;
       if(!req.file){
        return res.status(400).json({message:"File is Required"});
       }
       if(!userId && !courseId){
        return res.status(400).json({message:"both studentId and courseId are required.",data:null});
       }
       const userData=await User.findById(userId);
       const progressData=await ProgressModel.findOne({userId,courseId});
       if(!userData || !progressData){
        return res.status(400).json({message:"both userData and progressData are not found.",data:null});
       }
       const user=await User.findById(userId);
       const certificatePath=`${user?.userId}/CourseCertificate/${req.file.filename}`;
       await User.findByIdAndUpdate(userId,{$addToSet:{courseCertificates:{certificate:certificatePath}}},{runValidators:true});
       progressData.certificate=certificatePath;
       await progressData.save();
       return res.status(200).json({message:"certificate created and stored Successfully.",error:null});
    }
    catch(error){
        console.log(error)
            return res.status(500).json({message:"Error on creating and storing course certificate.",data:null,error:error?.message}); 
    }
}

export default storeCourseCertificate;