import HireTeacher from '../../../Model/Hire_Teacher_Model/index.mjs';



class DeleteHireApplication{
static deleteSingleApplication=async (req,res)=>{
    try{

        const {data}=req.body;
        await HireTeacher.findByIdAndDelete(data?._id);
        return res.status(200).json({message:"application successfully deleted.",error:null});
        
    }
    catch(error){
        return res.status(500).json({message:"Error on deleting application",error:error?.message})
    }

}
static deleteAllApplication=async (req,res)=>{
    try{
        const {status}=req.body;
        if(status==="all"){
            await HireTeacher.deleteMany({});   
            return res.status(200).json({message:"All application successfully deleted.",error:null});
        }
        else{
            await HireTeacher.deleteMany({status:status});
            return res.status(200).json({message:"All application successfully deleted.",error:null});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on deleting many application",error:error?.message});
    }

}

static deleteSelectedApplication=async (req,res)=>{
    try{
        const {data}=req.body;
            data.forEach(async (item)=>{
                await HireTeacher.findByIdAndDelete(item._id);
            })
            return res.status(200).json({message:"All selected application successfully deleted.",error:null});    
        }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on deleting selected application",error:error?.message});
    }

}
}
export default DeleteHireApplication;