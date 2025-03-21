import CourseModel from "../../../Model/Course_Model/index.mjs";

class TeacherCourses{
    static getTeachersCourses=async(req,res)=>{
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:"id is required",error:null});
            }
            const teacherCourses=await CourseModel.find({creator:id});
            return res.status(200).json({message:"teacher courses found successfully",data:teacherCourses});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({ message: "Error fetching teacher courses.", error: error?.message });
        }
    }
}
export default TeacherCourses;

