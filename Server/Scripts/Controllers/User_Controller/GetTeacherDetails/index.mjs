import User from "../../../Model/User_Model/index.mjs";

const getTeacherDetails=async (req,res)=>{
try{
    const {id}=req.params;
    if(!id){
        return res.status(400).json({message:"id is required on getting teacher details.",data:null});
    }
    const teacherDetails=await User.findById(id);
    if(teacherDetails){
        return res.status(200).json({message:"Teacher Details is fetched successfully",data:teacherDetails});
    }
    return res.status(400).json({message:"Error on fetching teacher details",data:null});
}
catch(error){
    console.log(error);
    res.status(500).json({message:"Error on getting the details of the teacher",error:error?.message})
}
}
export default getTeacherDetails;