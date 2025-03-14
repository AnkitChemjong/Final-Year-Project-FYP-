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
               const courseProgress=await ProgressModel.findOne({userId,courseId});
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
                    courseDetails,
                    progress:[],
                    isPurchased:true,
                    completed:false
                  })
               }
               const courseDetails=await CourseModel.findById(courseId);
               return res.status(200).json({
                courseDetails,
                progress:courseProgress?.contentProgress,
                completed:courseProgress?.completed,
                completionDate:courseProgress?.completionDate,
                isPurchased:true,
                error:null
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
            const {userId,courseId} =req.body;
            const progress = await ProgressModel.findOne({userId,courseId});
            if(!progress){
                return res.status(404).json({
                    message:"Progress not found.",
                    error:null
                })
            }   

            progress.contentProgress=[];
            progress.completed = false;
            progress.completionDate = null;

            await progress.save();
            res.status(200).json({
                message:"course progress reseted.",
                data:progress
            ,error:null
            })
        }
        catch(error){
         console.log(error);
         return res.json({message:"Error on reseting Course progress.",error:error?.message})
     }
    }

    //update view
    static updateContentAsViewed=async(req,res)=>{
        try{
            const {userId,courseId,contentId}=req.body;
            let progress=await ProgressModel.findOne({userId,courseId});
            if(!progress){
                progress=new ProgressModel({
                    userId,
                    courseId,
                    contentProgress:[
                        {
                            contentId,
                            viewed:true,
                            dateViewed:new Date()
                        }
                    ]
                });
                await progress.save();
            }
            else{
                const contentProgress=progress?.contentProgress.find(item=>item?.contentId === contentId);
                if(contentProgress){
                    contentProgress.viewed=true;
                    contentProgress.dateViewed=new Date();

                }
                else{
                    progress.contentProgress.push({
                        contentId,
                        viewed:true,
                        dateViewed:new Date()
                    });
                }
                await progress.save();
            }
            const course=await CourseModel.findById(courseId);
            if(!course){
                return res.status(404).json({
                    message:"Course not found",
                    error:null
                })
            }
            //all content are viewed or not
            const allContentsViewed= progress?.contentProgress.length === course?.curriculum.length && progress?.contentProgress.every(item=>item?.viewed);
            if(allContentsViewed){
                progress.completed=true;
                progress.completionDate=new Date()
                await progress.save();
            }

            return res.status(200).json({
                message:"Content updated as viewed",
                data:progress,
                error:null
            });     
        }
        catch(error){
         console.log(error);
         return res.json({message:"Error on updating Course view.",error:error?.message})
     }
    }
}
export default CourseProgress;