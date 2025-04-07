import RateCourse from "../../../Model/Course_Rate_Model/index.mjs";

const rateTeacher=async(req,res)=>{
    try{
       const {teacherId,userId}=req.params;
       const {rating,comment}=req.body;
       if(!teacherId || !userId || rating === undefined || !comment){
        return res.status(400).json({message:"Data are missing",data:null})
       }
       
       const ratingData=await RateCourse.create({userId:userId,teacherId:teacherId,rating:rating,comment:comment});
       if(ratingData){
        return res.status(200).json({message:"Thankyou for your feedback."})
       }
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({message:"Error on rating teacher.",data:null,error:error?.message}); 
    }
};
export default rateTeacher;