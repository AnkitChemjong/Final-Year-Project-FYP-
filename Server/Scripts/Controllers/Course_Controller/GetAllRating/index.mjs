import RateCourse from "../../../Model/Course_Rate_Model/index.mjs";

const getAllRatingData=async(req,res)=>{
    try{
        const allRating=await RateCourse.find({}).populate('userId').populate('courseId').populate('teacherId');
        if(allRating.length>0){
            return res.status(200).json({message:"all rating fetched successfully",data:allRating});

        }
        return res.status(200).json({message:"no rating data",data:null});
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on getting call ratings.",data:null,error:error?.message}); 
    }
}
export default getAllRatingData;