import CourseModel from "../../../Model/Course_Model/index.mjs";

const getCourseDetails=async (req,res)=>{
    try{
       const {id}=req.params;
       const courseDetails=await CourseModel.findById(id);
       if(!courseDetails){
        return res.status(400).json({message:"Course not found.",
            data:null,
            error:"couse not found"
           })
       }
       return res.status(200).json({message:"Course details fetched Successfully.",
            data:courseDetails,
            error:null
           });
    }
    catch(error){
        console.log(error)
            return res.json({message:"Error on getting course details.",data:null,error:error?.message}); 
    }
}

export default getCourseDetails;