import { uploadToCloudinary,deleteFromCloudinary } from "../../../Services/CourseService/index.mjs";
import fs from 'fs';

class CloudinaryControl{
 static uploadFileToCloudinary=async (req,res)=>{
        try{
            const user=req.user;
            const filePath=`Scripts/Upload/${user.userId}/CourseFile/${req.file.filename}`
            const response=await uploadToCloudinary(req.file.path);
            fs.unlink(filePath,(err)=>{
                    if (err) {
                        console.error('Error deleting file:', err);
                      } else {
                        console.log('File deleted successfully!');
                      }
                })
            return res.status(200).json({message:"File successfully Uploded.",data:response,error:null});
        }
        catch(error){
            console.log(error)
            return res.json({message:"Error on uploading file.",data:null,error:error?.message}); 
        }
    }

    static deleteFileFromCloudinary=async (req,res)=>{
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:"Public Id is needed.",error:"Id messing"});
            }
            await deleteFromCloudinary(id);
            return res.status(200).json({message:"File Successfully deleted.",error:null});
        }
        catch(error){
            console.log(error)
            return res.json({message:"Error on deleting file.",error:error?.message}); 
        }
    }
}

export default CloudinaryControl;