import HireTeacher from "../../../Model/Hire_Teacher_Model/index.mjs";

class ManipulateApplication{

    static updateApplicationDetails=async(req,res)=>{
        try{
            const {id}=req.params;
            const data=req.body;
            if(!id){
              return res.status(400).json({message:"Application id is required.",application:null});
            }
            const applications=await HireTeacher.findByIdAndUpdate(id,{hiringDate:data?.hiringDate,startTime:data?.startTime,endTime:data?.endTime},{new:true,runValidators:true});
            if(!applications){
                return res.status(400).json({message:"error on updating hire application.",application:null});
            }
            return res.status(200).json({message:"Teacher's hire data is updated successfully",application:applications});
        }
        catch(error){
            console.log(error);
            return res.json({message:"Error on updating teacher's hiring application",application:null,error:error?.message})
        }
    }
    static getApplicationDetails=async(req,res)=>{
        try{
            const {id}=req.params;
            if(!id){
              return res.status(400).json({message:"Application Id is required",application:null});
            }
            const applications=await HireTeacher.findById(id).populate('studentId').populate('teacherId').sort({createdAt:-1});
            if(!applications){
                return res.status(400).json({message:"No hire Data.",application:null});
            }
            return res.status(200).json({message:" hire application data is fetched successfully",application:applications});
        }
        catch(error){
            return res.json({message:"Error on getting hiring application",application:null,error:error?.message})
        }
    }
}

export default ManipulateApplication;