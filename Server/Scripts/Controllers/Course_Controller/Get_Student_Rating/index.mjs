import RateCourse from "../../../Model/Course_Rate_Model/index.mjs";

const getStudentRating=async(req,res)=>{
    try{
       const {courseId,userId}=req.params;
       if(!courseId || !userId){
        return res.status(400).json({message:"Data are missing",data:null})
       }
       
       const ratingData=await RateCourse.findOne({userId:userId,courseId:courseId});
       return res.status(200).json({message:"Thankyou for your feedback.",data:ratingData})
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({message:"Error on getting rating course.",data:null,error:error?.message}); 
    }
};
export default getStudentRating;