import React,{useContext,useState} from 'react';
import { Card,CardContent,CardTitle,CardHeader } from '@/Components/ui/card';
import { UseContextApi } from '@/Components/ContextApi';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'react-toastify';
import { axiosService } from '@/Services';
import { Upload_Course_File } from '@/Routes';
import ProgressBar from '@/Components/ProgressBar';
import { Switch } from '@/Components/ui/switch';
import supabaseClient from '@/Components/SupabaseClient';
import { GoFileZip } from "react-icons/go";

export default function CourseSetting({id=null}) {
     const {courseLandingFormData, setCourseLandingFormData
        ,mediaUploadProgress, setMediaUploadProgress
      ,mediaUploadProgressPercentage, 
      setMediaUploadProgressPercentage
     }=useContext(UseContextApi);
     const [extraResource,setExtraResource]=useState(false);
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
                toast.success(response?.data?.message);
            }
        }
        catch(error){
            toast.error(error?.response?.data?.message);
        }
        finally{
            setMediaUploadProgress(false);
                e.target.value=""
        }
     }

     const handleExtraResourceUpload = async (e) => {
        try {
            setMediaUploadProgress(true);
            setMediaUploadProgressPercentage(0);
    
            if (courseLandingFormData?.extraResources) {
                await supabaseClient.storage
                    .from('extra-resources')
                    .remove([courseLandingFormData?.extraResources]);
            }
    
            const file = e.target.files[0];
    
            setMediaUploadProgressPercentage(50);
    
            // Upload file to Supabase
            const { data, error } = await supabaseClient.storage
                .from("extra-resources")
                .upload(`/public/${Date.now()}-${file.name}`, file, {
                    cacheControl: "3600",
                    upsert: false,
                });
    
            if (data) {
                setTimeout(() => setMediaUploadProgressPercentage(100), 100);
    
                setCourseLandingFormData({
                    ...courseLandingFormData,
                    extraResources: data?.path,
                });
    
                toast.success("File uploaded to Supabase.");
            }
    
            if (error) {
                console.error(error);
                toast.error(error?.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => setMediaUploadProgress(false), 500);
            e.target.value = "";
        }
    };

    const setCoursePublished=(value)=>{
        setCourseLandingFormData({
            ...courseLandingFormData,
            isPublished: value,
        });
    }
    

  return (
   <Card>
    <CardHeader className="flex flex-row justify-between items-center">
    <CardTitle>Course Setting</CardTitle>
    {
        id &&
        <CardTitle className="flex flex-row items-center gap-2">
             <Label>{courseLandingFormData?.isPublished? "Unpublish Course":"Publish Course"} :</Label>
            <Switch onCheckedChange={(value)=>setCoursePublished(value)} checked={courseLandingFormData?.isPublished}/>
        </CardTitle>
    }
    </CardHeader>
    <div className='p-5'>

     {
                  mediaUploadProgress && 
                  <ProgressBar isUploading={mediaUploadProgress}
                   progress={mediaUploadProgressPercentage}
                  />
    }
    </div>
    <CardContent className="flex flex-col gap-4">
        {
            courseLandingFormData?.image? (
               <img src={courseLandingFormData?.image} alt="thumbnail" className='w-2/3 h-2/3'/> 
            ):null
        }
        <div className='flex flex-col gap-3 mt-2'>
            <Label>{courseLandingFormData?.image? "Replace Thumbnail":"Upload Course Thumbnail"} :</Label>
            <Input onChange={handleThumbnailUpload} type="file" accept="image/*"/>
        </div>
        
        <div className='flex flex-row gap-2'>
            <Label>{courseLandingFormData?.extraResources? "Replace Extra Resources":"Add Extra Resources"} :</Label>
            <Switch onCheckedChange={(value)=>setExtraResource(value)} checked={extraResource}/>
        </div>
        {
            extraResource && 
            <div className='flex flex-col gap-2'>
                <div className='flex items-center'>
                  <GoFileZip className='w-5 h-5 mr-1'/>
                <p className='text-sm text-bold text-gray-700'>Only Zip file is valid.</p>
                </div>
                <Input onChange={handleExtraResourceUpload} type="file" accept=".zip"/>
            </div>
        }
    </CardContent>
   </Card>
  )
}
