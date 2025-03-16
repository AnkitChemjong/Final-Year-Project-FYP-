import { uploadToCloudinary } from "../../../Services/CourseService/index.mjs";
import fs from "fs";


const bulkUpload=async(req,res)=>{
    try{
        const user=req.user;
       const uploadPromise=req.files.map(async (fileItem)=>{
        const filePath=`Scripts/Upload/${user.userId}/CourseFile/${fileItem.filename}`;
         const response= await uploadToCloudinary(fileItem.path);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully!');
                }
            });
            return response;
    });
       const response=await Promise.all(uploadPromise);
       res.status(200).json({
        message:"Bulk uploaded Successfully",
        data:response,
        error:null
       })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on bulk uploading.",data:null,error:error?.message});  
    }
}

export default bulkUpload;