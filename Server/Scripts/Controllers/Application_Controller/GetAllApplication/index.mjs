import BecomeTeacherApp from "../../../Model/Become_Teacher_Application/index.mjs";

const getAllApplication=async (req,res)=>{
try{
  const applications=await BecomeTeacherApp.find({}).populate('user').sort({ createdAt: -1 });

  if(applications.length>0){
    return res.json({message:"application successfully retrived",application:applications});
  }
  else{
    return res.json({message:"There are no Applications.",application:null});
  }
}
catch(error){
    return res.json({message:"Error on getting application",application:null,error:error?.message})
}
}

export default getAllApplication;