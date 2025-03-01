import React,{ useContext,useState } from 'react'
import { UseContextApi } from '@/Components/ContextApi';
import { Card,CardContent,CardTitle,CardHeader } from '@/Components/ui/card';
import CommonButton from '@/Components/CommonButton';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { axiosService } from '@/Services';
import { Upload_Course_File } from '@/Routes';
import { toast } from 'react-toastify';
import ProgressBar from '@/Components/ProgressBar';


export default function CourseCurriculum() {
    const {courseCurriculumFormData,
      setCourseCurriculumFormData,mediaUploadProgress, setMediaUploadProgress
      ,mediaUploadProgressPercentage, 
      setMediaUploadProgressPercentage}=useContext(UseContextApi);
      
  const handleAddContent=()=>{
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
          ...courseCurriculumFormData[0]
      }
     ])
  }

  const handleTitleChange=async (event,lectureIndex)=>{
     let copyCourseCurricullumFormData=[...courseCurriculumFormData];

     copyCourseCurricullumFormData[lectureIndex]={
      ...copyCourseCurricullumFormData[lectureIndex],
      title:event.target.value
     }
    setCourseCurriculumFormData(copyCourseCurricullumFormData);
  }

  const handlePreviewChange=(currentValue,lectureIndex)=>{
    let copyCourseCurricullumFormData=[...courseCurriculumFormData];

    copyCourseCurricullumFormData[lectureIndex]={
     ...copyCourseCurricullumFormData[lectureIndex],
     freePreview:currentValue
    }
   setCourseCurriculumFormData(copyCourseCurricullumFormData);
  }

  const handleSingleFileUpload=async (event,lectureIndex)=>{
    try{
      const file=event.target.files[0];
      if(file){
       const formData=new FormData();
       formData.append('file',file);
       setMediaUploadProgress(true);
       const response=await axiosService.post(Upload_Course_File,formData,{
        withCredentials:true,
        onUploadProgress:(progressEvent)=>{
           const percentage=Math.round((100*progressEvent.loaded)/progressEvent.total);
          setMediaUploadProgressPercentage(percentage);
        }
       });
  
       if(response.status===200){
        let copyCourseCurricullumFormData=[...courseCurriculumFormData];

    copyCourseCurricullumFormData[lectureIndex]={
     ...copyCourseCurricullumFormData[lectureIndex],
     videoUrl:response?.data?.data?.url,
     public_id:response?.data?.data?.public_id
    }
   setCourseCurriculumFormData(copyCourseCurricullumFormData);
   setMediaUploadProgress(false);
   event.target.value="";
   toast.success(response?.data?.message)
       }
      }
    }
    catch(error){
      toast.error(error?.response?.data?.message);
    }
  }


  
  return (
    <Card>
        <CardHeader>
            <CardTitle>Create Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
            <CommonButton func={handleAddContent} text="Add Content"/>
            {
              mediaUploadProgress && 
              <ProgressBar isUploading={mediaUploadProgress}
               progress={mediaUploadProgressPercentage}
              />
            }
            <div className='mt-4 space-y-4'>
              {
                courseCurriculumFormData.map((item,index)=>{
                    return(
                        <div key={index} className='border p-5 rounded-md'>
                            <div className='flex gap-5 items-center'>
                                <h3 className='font-bold'>Lecture {index+1}</h3>
                                <div className='flex flex-col gap-1'>

                                 <Input
                                 name={`title-${index+1}`}
                                 placeholder="Enter lecture title"
                                 className="max-w-96"
                                 onChange={(event)=>handleTitleChange(event,index)}
                                 value={courseCurriculumFormData[index]?.title}
                                 />
                                </div>
                                 <div className='flex items-center space-x-2'>
                                      <Switch
                                        onCheckedChange={(value)=>handlePreviewChange(value,index)}
                                        checked={courseCurriculumFormData[index]?.freePreview}
                                        id={`freePreview-${index+1}`}

                                      />
                                      <Label htmlFor={`freePreview-${index+1}`}>
                                        Free Preview
                                      </Label>
                                 </div>
                            </div>
                          <div className='mt-6 flex flex-col'>
                            <Input
                            type="file"
                            accept="video/*" 
                            className="mb-4"
                            onChange={(event)=>handleSingleFileUpload(event,index)}
                            />
                          </div>
                        </div>
                    )
                })
              }
            </div>
        </CardContent>
    </Card>
  )
}