import PurchasedCoursesModel from "../../../Model/Purchased_Courses_Model/index.mjs";

const getAllPurchasedCourse=async(req,res)=>{
try{
     const result=await PurchasedCoursesModel.find({});
     if(result.length>0){
        return res.status(200).json({message:"got all the purchased courses",data:result});

     }
     else{
        return res.status(200).json({message:"No purchased course",data:result});
     }
}
catch(error){
    console.log(error);
    return res.status(200).json({message:"error on getting all purchased courses.",error:error?.message});
}
}
export default getAllPurchasedCourse;

