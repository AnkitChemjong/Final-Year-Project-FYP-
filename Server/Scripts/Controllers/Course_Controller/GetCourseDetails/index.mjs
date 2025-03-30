import CourseModel from "../../../Model/Course_Model/index.mjs";
import PurchasedCoursesModel from "../../../Model/Purchased_Courses_Model/index.mjs";
import RateCourse from "../../../Model/Course_Rate_Model/index.mjs";

const getCourseDetails=async (req,res)=>{
    try{
       const {id,studentId}=req.params;
       const courseDetails=await CourseModel.findById(id).populate('creator').populate('students.studentId');
       if(!courseDetails){
        return res.status(400).json({message:"Course not found.",
            data:null,
            error:"couse not found"
           })
       }
       //check course is purchased by the student or not
       const studentCourses=await PurchasedCoursesModel.findOne({
        userId:studentId
       });
       //console.log(studentCourses);
        const boughtCourse=studentCourses?.courses.findIndex(item=>item.courseId === id) > -1;
        const ratingData=await RateCourse.find({courseId:id}).populate('userId').sort({rating:-1}).limit(3);
       return res.status(200).json({message:"Course details fetched Successfully.",
            data:courseDetails,
            ratingData,
            error:null,
            coursePurchased:boughtCourse
           });
    }
    catch(error){
        console.log(error)
            return res.status(500).json({message:"Error on getting course details.",data:null,error:error?.message}); 
    }
}

const checkPurchase=async (req,res)=>{
    try{
       const {id,studentId}=req.params;

       //check course is purchased by the student or not
       const studentCourses=await PurchasedCoursesModel.findOne({
        userId:studentId
       });
       //console.log(studentCourses);
        const boughtCourse=studentCourses?.courses.findIndex(item=>item.courseId === id) > -1;

       return res.status(200).json({message:"Course purchase status.",
            data:boughtCourse,
            error:null,
           });
    }
    catch(error){
        console.log(error)
            return res.status(500).json({message:"Error on getting course purchase details.",data:null,error:error?.message}); 
    }
}

export {getCourseDetails,checkPurchase};