import React,{useContext,useState} from 'react';
import { Card,CardContent,CardTitle,CardHeader } from '@/Components/ui/card';
import { UseContextApi } from '@/Components/ContextApi';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'react-toastify';
import { axiosService } from '@/Services';
import { Upload_Course_File } from '@/Routes';
import ProgressBar from '@/Components/ProgressBar';



export default function CourseSetting() {
     const {courseLandingFormData, setCourseLandingFormData
        ,mediaUploadProgress, setMediaUploadProgress
      ,mediaUploadProgressPercentage, 
      setMediaUploadProgressPercentage
     }=useContext(UseContextApi);
     const handleThumbnailUpload=async (e)=>{
        try{
            setMediaUploadProgress(true);
            const file=e.target.files[0];
            const formData=new FormData();
            formData.append("file",file);
            courseLandingFormData?.image && formData.append('public_id',courseLandingFormData?.image_public_id)
            const response=await axiosService.post(Upload_Course_File,formData,{
                    withCredentials:true,
                    headers:{"Content-Type":"multipart/form-data"},
                    onUploadProgress:(progressEvent)=>{
                        const percentage=Math.round((100*progressEvent.loaded)/progressEvent.total);
                       setMediaUploadProgressPercentage(percentage);
                     }
                   });
            if(response.status===200){
                setCourseLandingFormData({
                    ...courseLandingFormData,
                    image:response?.data?.data?.url,
                    image_public_id:response?.data?.data?.public_id
                })
                setMediaUploadProgress(false);
                e.target.value=""
                toast.success(response?.data?.message);
            }
        }
        catch(error){
            toast.error(error?.response?.data?.message);
        }
     }

  return (
   <Card>
    <CardHeader>
    <CardTitle>Course Setting</CardTitle>
    </CardHeader>
    <div className='p-5'>

     {
                  mediaUploadProgress && 
                  <ProgressBar isUploading={mediaUploadProgress}
                   progress={mediaUploadProgressPercentage}
                  />
    }
    </div>
    <CardContent>
        {
            courseLandingFormData?.image? (
               <img src={courseLandingFormData?.image} alt="thumbnail" className='w-2/3 h-2/3'/> 
            ):null
        }
        <div className='flex flex-col gap-3 mt-2'>
            <Label>{courseLandingFormData?.image? "Replace Thumbnail":"Upload Course Thumbnail"}</Label>
            <Input onChange={handleThumbnailUpload} type="file" accept="image/*"/>
        </div>
    </CardContent>
   </Card>
  )
}
