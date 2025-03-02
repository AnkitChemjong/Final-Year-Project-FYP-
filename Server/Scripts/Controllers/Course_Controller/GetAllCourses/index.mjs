import CourseModel from "../../../Model/Course_Model/index.mjs";

const getAllCourses=async (req,res)=>{
    try{
       const allCourses=await CourseModel.find({}).populate('creator').populate('students.studentId').sort({createdAt:-1});
       if(allCourses){
           return res.status(200).json({message:"Fetched all Successfully",
            course:allCourses,
            error:null
           });
       }
    }
    catch(error){
        console.log(error)
            return res.json({message:"Error on getting courses.",data:null,error:error?.message}); 
    }
}

export default getAllCourses;