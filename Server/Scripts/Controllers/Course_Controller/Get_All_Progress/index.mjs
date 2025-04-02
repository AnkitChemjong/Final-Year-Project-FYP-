import ProgressModel from "../../../Model/Course_Progress_Model/index.mjs";

const getAllProgress=async(req,res)=>{
try{
     const result=await ProgressModel.find({});
     if(result.length>0){
        return res.status(200).json({message:"got all the progress.",data:result});

     }
     else{
        return res.status(200).json({message:"No progress.",data:result});
     }
}
catch(error){
    console.log(error);
    return res.status(200).json({message:"error on getting all progress.",error:error?.message});
}
}
export default getAllProgress;

