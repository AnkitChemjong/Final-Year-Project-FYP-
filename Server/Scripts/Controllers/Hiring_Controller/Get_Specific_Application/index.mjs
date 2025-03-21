import HireTeacher from "../../../Model/Hire_Teacher_Model/index.mjs";

class GetSpecificApplication{
    static getStudentApplication=async(req,res)=>{
        try{
            const {id}=req.params;
            if(!id){
              return res.status(400).json({message:"Student Id is required",application:null});
            }
            const applications=await HireTeacher.find({studentId:id}).populate('studentId').populate('teacherId').sort({createdAt:-1});
            if(!applications){
                return res.status(400).json({message:"No hire Data.",application:null});
            }
            return res.status(200).json({message:"Student's hire data is fetched successfully",application:applications});
        }
        catch(error){
            return res.json({message:"Error on getting student's hiring application",application:null,error:error?.message})
        }
    }
    static getTeacherApplication=async(req,res)=>{
        try{
            const {id}=req.params;
            if(!id){
              return res.status(400).json({message:"Teacher Id is required",application:null});
            }
            const applications=await HireTeacher.find({teacherId:id}).populate('studentId').populate('teacherId').sort({createdAt:-1});
            if(!applications){
                return res.status(400).json({message:"No hire Data.",application:null});
            }
            return res.status(200).json({message:"Teacher's hire data is fetched successfully",application:applications});
        }
        catch(error){
            return res.json({message:"Error on getting teacher's hiring application",application:null,error:error?.message})
        }
    }
}
export default GetSpecificApplication;