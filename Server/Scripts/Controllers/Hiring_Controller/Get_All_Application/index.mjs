import HireTeacher from "../../../Model/Hire_Teacher_Model/index.mjs";

const getAllHireApplication=async (req,res)=>{
try{
  const applications=await HireTeacher.find({}).populate('studentId').populate("teacherId").sort({ createdAt: -1 });

  if(applications?.length>0){
    return res.json({message:"Hire application successfully retrived",application:applications});
  }
  else{
    return res.json({message:"There are no hire Applications.",application:null});
  }
}
catch(error){
    return res.json({message:"Error on getting hiring application",application:null,error:error?.message})
}
}

export default getAllHireApplication;