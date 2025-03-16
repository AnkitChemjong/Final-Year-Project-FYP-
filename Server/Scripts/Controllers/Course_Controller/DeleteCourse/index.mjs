import CourseModel from "../../../Model/Course_Model/index.mjs";
import { deleteFromCloudinary } from "../../../Services/CourseService/index.mjs";

class DeleteCourse{
static deleteSingleCourse=async (req,res)=>{
    try{
        const {data}=req.body;
        await deleteFromCloudinary(data?.image_public_id);
        data?.curriculum.forEach(async (item)=>{
           await deleteFromCloudinary(item?.videoUrl);
        });
        await CourseModel.findByIdAndDelete(data._id);
        return res.status(200).json({message:"Course successfully deleted.",error:null});
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on deleting Course",error:error?.message})
    }

}
static deleteAllCourses=async (req,res)=>{
    try{

        const {status,data}=req.body;
        if(status==="all"){
            const allCourses=await CourseModel.find({});
            allCourses.forEach(async (item)=>{
                await deleteFromCloudinary(item?.image_public_id);
                item?.curriculum?.forEach(async (item1)=>{
                    await deleteFromCloudinary(item1?.videoUrl);
                })
            })
            
            await CourseModel.deleteMany({});   
            return res.status(200).json({message:"All Courses successfully deleted.",error:null});
        }
        else{
            data.forEach(async (item)=>{
            await deleteFromCloudinary(item?.image_public_id);
            item?.curriculum?.forEach(async (item1)=>{
                    await deleteFromCloudinary(item1?.videoUrl);
                })
            const courses=await CourseModel.findByIdAndDelete(item._id);   
            })
            return res.status(200).json({message:"All application successfully deleted.",error:null});
        }
        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on deleting many application",error:error?.message});
    }

}

static deleteSelectedCourses = async (req, res) => {
    try {
        const { data } = req.body;

        // Use map to create an array of promises
        const deletionPromises = data.map(async (item) => {
            await deleteFromCloudinary(item?.image_public_id);
            
            await Promise.all(
                item?.curriculum.map(async (item1) => {
                    await deleteFromCloudinary(item1?.videoUrl);
                })
            );

            await CourseModel.findByIdAndDelete(item._id);
        });

        // Wait for all deletions to finish
        await Promise.all(deletionPromises);

        return res.status(200).json({ message: "All selected courses successfully deleted.", error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error on deleting selected courses.", error: error?.message });
    }
};

}
export default DeleteCourse;