import PurchasedCoursesModel from "../../../Model/Purchased_Courses_Model/index.mjs";


const getEnrolledCourses = async (req,res)=>{
    try{
          const {studentId}=req.params;
          const studentEnrolledCourses= await PurchasedCoursesModel.findOne({
            userId:studentId
          });
          return res.status(200).json({
            data:studentEnrolledCourses?.courses
          })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Error fetching enrolled course details.", error: error?.message });
    }
}

export default getEnrolledCourses;