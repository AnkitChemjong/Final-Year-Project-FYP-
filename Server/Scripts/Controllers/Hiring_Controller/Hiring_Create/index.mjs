import HireTeacher from "../../../Model/Hire_Teacher_Model/index.mjs";

const hireTeacherCreate=async(req,res)=>{
    try{
        const data=req.body;
        if(data){
           const response= await HireTeacher.create(data);
           if(response){
            return res.status(200).json({message:"Process Completed Successfully.",data:response});
           }

        }
        else{
            return res.status(400).json({message:"Data is required."})
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on updating teacher info.",data:null,error:error?.message})
    }
}
export default hireTeacherCreate;