import { v2 as cloudinary } from 'cloudinary';

//configuration
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

export const uploadToCloudinary=async (filePath)=>{
try{
  const response=await cloudinary.uploader.upload(filePath,{
    resource_type:'auto'
  });
  return response;
}
catch(error){
    console.log(error);
    throw new Error("Error while uploding to Cloudinary...")
}
};

export const deleteFromCloudinary=async(publicId)=>{
    try{
         await cloudinary.uploader.destroy(publicId);
        
      }
      catch(error){
          console.log(error);
          throw new Error("Error while deleting from Cloudinary...")
      }
}