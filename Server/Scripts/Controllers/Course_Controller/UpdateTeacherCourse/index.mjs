import CourseModel from "../../../Model/Course_Model/index.mjs";


class UpdateCouseIsPublished{
static updateSingleCourse=async (req,res)=>{
    try{
        const {data,status}=req.body;
        if(data,status.toString()){
            await CourseModel.findByIdAndUpdate(data?._id,{isPublished:status},{runValidators:true});
            return res.status(200).json({message:"Course updated successfully updated.",error:null});
        }
        else{
            return res.status(400).json({message:"Both data and status are required.",error:null});
        }
        
    }
    catch(error){
        return res.status(500).json({message:"Error on updating course.",error:error?.message})
    }

}
static updateAllCourses=async (req,res)=>{
    try{
        const {data,status}=req.body;
        if(data,status.toString()){

            data.forEach(async (item)=>{
                await CourseModel.findByIdAndUpdate(item?._id,{isPublished:status},{runValidators:true});
            });
            return res.status(200).json({message:"All courses successfully updated.",error:null});
        }
        else{
            return res.status(400).json({message:"Both data and status are required.",error:null});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on updating many courses",error:error?.message});
    }

}

static updateSelectedCourses=async (req,res)=>{
    try{

        const {data,status}=req.body;
        if(data,status.toString()){

            data.forEach(async (item)=>{
                await CourseModel.findByIdAndUpdate(item?._id,{isPublished:status},{runValidators:true});
            })
            return res.status(200).json({message:"All selected courses successfully updated.",error:null});    
        }
        else{
            return res.status(400).json({message:"Both data and status are required.",error:null});
        }
        }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on updating selected courses",error:error?.message});
    }

}
}
export default UpdateCouseIsPublished;