import CourseModel from "../../../Model/Course_Model/index.mjs";

const updateCourse=async (req,res)=>{
    try{
       const {id}=req.params;
       const updateData=req.body;
       const courseDetails=await CourseModel.findByIdAndUpdate(id,updateData,{new:true,runValidators:true});
       if(!courseDetails){
        return res.status(400).json({message:"Course not found.",
            data:null,
            error:"couse not found"
           });
       }
       return res.status(200).json({message:"Course updated Successfully.",
            data:courseDetails,
            error:null
           });
    }
    catch(error){
        console.log(error)
            return res.status(500).json({message:"Error on updating course.",data:null,error:error?.message}); 
    }
}

export default updateCourse;