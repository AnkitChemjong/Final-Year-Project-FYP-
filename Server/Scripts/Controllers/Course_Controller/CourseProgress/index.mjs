import ProgressModel from "../../../Model/Course_Progress_Model/index.mjs";
import CourseModel from "../../../Model/Course_Model/index.mjs";
import PurchasedCoursesModel from "../../../Model/Purchased_Courses_Model/index.mjs";

class CourseProgress{
    //get course progress
    static getCourseProgress=async(req,res)=>{
           try{
               const {userId,courseId}=req.params;
               
               const purchasedCourses=await PurchasedCoursesModel.findOne({userId});
               

               const checkCoursePurchased=purchasedCourses?.courses?.findIndex((item=>item.courseId === courseId)) > -1;    

               if(!checkCoursePurchased){
                return res.status(200).json({
                    isPurchased:false,
                    message: "Course should be purchased first.",
                    error:null
                })
               }
               const courseProgress=await ProgressModel.findOne({userId,courseId}).populate('courseId');
               if(!courseProgress || courseProgress?.contentProgress.length === 0){
                  const courseDetails=await CourseModel.findById(courseId);
                  if(!courseDetails){
                    return res.status(404).json({
                        message:"course not found",
                        error:null
                    })
                  }

                  return res.status(200).json({
                    message:"0 progress, Start Learning.",
                    error:null,
                    courseDetails:courseDetails,
                    progress:[],
                    isPurchased:true
                  })
               }
               return res.status(200).json({
                data:courseProgress?.courseId,
                progress:courseProgress?.contentProgress,
                completed:courseProgress?.completed,
                completionDate:courseProgress?.completionDate,
                isPurchased:true
               });

           }
           catch(error){
            console.log(error);
            return res.json({message:"Error on getting Course progress",error:error?.message})
        }
    }

    //record course progress
    static resetCourseProgress=async(req,res)=>{
        try{
               
        }
        catch(error){
         console.log(error);
         return res.json({message:"Error on reseting Course progress.",error:error?.message})
     }
    }

    //update view
    static updateCourseViews=async(req,res)=>{
        try{
               
        }
        catch(error){
         console.log(error);
         return res.json({message:"Error on updating Course view.",error:error?.message})
     }
    }
}
export default CourseProgress;