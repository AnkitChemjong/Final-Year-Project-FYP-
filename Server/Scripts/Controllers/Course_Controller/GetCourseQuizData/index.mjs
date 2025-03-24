import CourseModel from "../../../Model/Course_Model/index.mjs";


const getCourseQuizData=async(req,res)=>{
try{
    const {id}=req.params;
    const result=await CourseModel.findById(id);
    if(result){
        return res.status(200).json({message:"Course quiz data successfully retruved.",data:result});
    }
    else{
        return res.status(400).json({message:"No course data found",data:null});
    }

}
catch(error){
    console.log(error);
    return res.status(500).json({message:"Error getting course Quiz data",error:error?.message})
}
}

export default getCourseQuizData;