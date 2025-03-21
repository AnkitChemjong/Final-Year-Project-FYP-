import HireTeacher from '../../../Model/Hire_Teacher_Model/index.mjs';



class UpdateHireApplication{
static updateSingleApplication=async (req,res)=>{
    try{
        const {data,status}=req.body;
        if(data,status){
            await HireTeacher.findByIdAndUpdate(data?._id,{status:status},{runValidators:true});
            return res.status(200).json({message:"application successfully updated.",error:null});
        }
        else{
            return res.status(400).json({message:"Both data and status are required.",error:null});
        }
        
    }
    catch(error){
        return res.status(500).json({message:"Error on updating application",error:error?.message})
    }

}
static updateAllApplication=async (req,res)=>{
    try{
        const {data,status}=req.body;
        if(data,status){

            data.forEach(async (item)=>{
                await HireTeacher.findByIdAndUpdate(item?._id,{status:status},{runValidators:true});
            });
            return res.status(200).json({message:"All application successfully updated.",error:null});
        }
        else{
            return res.status(400).json({message:"Both data and status are required.",error:null});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on updating many application",error:error?.message});
    }

}

static updateSelectedApplication=async (req,res)=>{
    try{

        const {data,status}=req.body;
        if(data,status){

            data.forEach(async (item)=>{
                await HireTeacher.findByIdAndUpdate(item?._id,{status:status},{runValidators:true});
            })
            return res.status(200).json({message:"All selected application successfully updated.",error:null});    
        }
        else{
            return res.status(400).json({message:"Both data and status are required.",error:null});
        }
        }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on updating selected application",error:error?.message});
    }

}
}
export default UpdateHireApplication;