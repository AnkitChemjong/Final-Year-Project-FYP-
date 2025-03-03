import { uploadToCloudinary } from "../../../Services/CourseService/index.mjs";


const bulkUpload=async(req,res)=>{
    try{
       const uploadPromise=req.files.map(fileItem=>uploadToCloudinary(fileItem.path));
       const response=await Promise.all(uploadPromise);
       res.status(200).json({
        message:"Bulk uploaded Successfully",
        data:response,
        error:null
       })
    }
    catch(error){
        console.log(error)
        return res.json({message:"Error on bulk uploading.",data:null,error:error?.message});  
    }
}

export default bulkUpload;