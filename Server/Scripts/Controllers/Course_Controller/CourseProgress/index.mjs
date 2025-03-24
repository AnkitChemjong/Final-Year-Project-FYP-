import ProgressModel from "../../../Model/Course_Progress_Model/index.mjs";
import CourseModel from "../../../Model/Course_Model/index.mjs";
import PurchasedCoursesModel from "../../../Model/Purchased_Courses_Model/index.mjs";
import User from "../../../Model/User_Model/index.mjs";
import fs from 'fs';


class CourseProgress{
    //get course progress
    static getCourseProgress=async(req,res)=>{
           try{
               const {userId,courseId}=req.params;
               
               const purchasedCourses=await PurchasedCoursesModel.findOne({userId});
               if(!purchasedCourses){
                return res.status(200).json({
                    isPurchased:false,
                    message: "Course should be purchased first.",
                    error:null
                })
               }
               const checkCoursePurchased=purchasedCourses?.courses?.findIndex((item=>item.courseId === courseId)) > -1;    

               if(!checkCoursePurchased){
                return res.status(200).json({
                    isPurchased:false,
                    message: "Course should be purchased first.",
                    error:null
                })
               }
               const courseProgress=await ProgressModel.findOne({userId,courseId}).populate('userId').populate('courseId');
               if(!courseProgress || courseProgress?.contentProgress.length === 0){
                  const courseDetails=await CourseModel.findById(courseId).populate("creator");
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
                    contentCompleted:false,
                    progress:[],
                    isPurchased:true,
                    completed:false
                  })
               }
               const courseDetails=await CourseModel.findById(courseId).populate('creator');
               return res.status(200).json({
                courseDetails,
                progress:courseProgress?.contentProgress,
                progressData:courseProgress,
                contentCompleted:courseProgress?.contentCompleted,
                completed:courseProgress?.completed,
                completionDate:courseProgress?.completionDate,
                isPurchased:true,
                error:null
               });

           }
           catch(error){
            console.log(error);
            return res.status(500).json({message:"Error on getting Course progress",error:error?.message})
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
            const filePath=`./Scripts/Upload/${progress?.certificate}`;
            fs.unlink(filePath,(err)=>{
                                        if (err) {
                                             console.error('Error deleting file:', err);
                                                 } else {
                                            console.log('File deleted successfully!');
                                            }
                            });
            const user=await User.findById(userId);
            user.courseCertificates=user.courseCertificates.filter((cert) => cert.certificate !== progress?.certificate);
            await user.save(); 
            await ProgressModel.deleteOne({userId,courseId});                              
            res.status(200).json({
                message:"course progress reseted.",
                data:progress
            ,error:null
            })
        }
        catch(error){
         console.log(error);
         return res.status(500).json({message:"Error on reseting Course progress.",error:error?.message})
     }
    }

    //update view
    static updateContentAsViewed = async (req, res) => {
        try {
            const { userId, courseId, contentId } = req.body;
    
            // Find or create progress document
            let progress = await ProgressModel.findOne({ userId, courseId });
            if (!progress) {
                progress = new ProgressModel({
                    userId,
                    courseId,
                    contentProgress: [
                        {
                            contentId,
                            viewed: true,
                            dateViewed: new Date(),
                        },
                    ],
                });
            } else {
                // Check if the content is already marked as viewed
                const contentProgress = progress.contentProgress.find(
                    (item) => item?.contentId === contentId
                );
    
                if (contentProgress) {
                    // Update existing content progress
                    contentProgress.viewed = true;
                    contentProgress.dateViewed = new Date();
                } else {
                    // Add new content progress
                    progress.contentProgress.push({
                        contentId,
                        viewed: true,
                        dateViewed: new Date(),
                    });
                }
            }
    
            // Save the updated progress
            await progress.save();
    
            // Fetch the course details
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    message: "Course not found",
                    error: null,
                });
            }
    
            // Check if all contents are viewed
            const allContentsViewed =
                progress.contentProgress.length === course.curriculum.length &&
                progress.contentProgress.every((item) => item.viewed);
    
            // Update contentCompleted if all contents are viewed
            if (allContentsViewed) {
                progress.contentCompleted = true;
                await progress.save();
            }
    
            // Check if the course is completed (all contents viewed and quiz passed)
            if(progress?.quizSubmitted){
                const checkQuizMark =progress.marksObtained >= course.quizData.passMark;
                if (allContentsViewed && checkQuizMark) {
                    progress.completed = true;
                    progress.completionDate = new Date();
                    await progress.save();
                }
            }
            return res.status(200).json({
                message: "Content updated as viewed",
                data: progress,
                error: null,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Error on updating Course view.",
                error: error?.message,
            });
        }
    };

     //update quiz
     static updateQuizData = async (req, res) => {
        try {
            const { userId, courseId, mark } = req.body;

             // Find or create progress document
             let progress = await ProgressModel.findOne({ userId, courseId }).populate('userId').populate('courseId');
             if(progress){
                if(progress?.marksObtained && progress?.marksObtained<=mark){
                    progress.marksObtained=mark;
                    await progress.save();
                    return res.status(201).json({message:"Your marks updated successfully.",progress})
                    
                }
                if(progress?.marksObtained && progress?.marksObtained>mark){
                    return res.status(201).json({message:"Your previous mark was better.",progress})
                    
                }

               if(!progress?.marksObtained){
                    progress.marksObtained=mark;
                    progress.quizSubmitted=true;
                    await progress.save();
                }
             }
            // Fetch the course details
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    message: "Course not found",
                    error: null,
                });
            }
    
            // Check if all contents are viewed
            const allContentsViewed =
                progress.contentProgress.length === course.curriculum.length &&
                progress.contentProgress.every((item) => item.viewed);
    
            // Check if the course is completed (all contents viewed and quiz passed)
            const checkQuizMark =mark >= course.quizData.passMark;
            if (allContentsViewed && checkQuizMark) {
                progress.quizCompletion=true;
                progress.completed = true;
                progress.completionDate = new Date();
                await progress.save();
            }
    
            return res.status(200).json({
                message: "quiz updated as done",
                data: progress,
                course,
                error: null,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Error on updating quiz.",
                error: error?.message,
            });
        }
    }; 
}
export default CourseProgress;