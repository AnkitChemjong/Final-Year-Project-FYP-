import React,{ useContext } from 'react'
import { UseContextApi } from '@/Components/ContextApi';
import { Card,CardContent,CardTitle,CardHeader } from '@/Components/ui/card';
import CommonButton from '@/Components/CommonButton';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { axiosService } from '@/Services';
import { Upload_Course_File,Delete_Course_File } from '@/Routes';
import { toast } from 'react-toastify';
import ProgressBar from '@/Components/ProgressBar';
import VideoPlayer from '@/Components/VideoPlayer';

export default function CourseCurriculum() {
    const {courseCurriculumFormData,
      setCourseCurriculumFormData,mediaUploadProgress, setMediaUploadProgress
      ,mediaUploadProgressPercentage, 
      setMediaUploadProgressPercentage}=useContext(UseContextApi);
  const handleAddContent=()=>{
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        title: "",
        videoUrl: "",
        freePreview: false,
        public_id: ""
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

  const courseCurriculumFormDataValidation=()=>{
    return courseCurriculumFormData.every(item=>{
      return item && typeof item === 'object' &&
      item.title.trim() !== '' && item.videoUrl.trim() !== ''
    })
  }

  const handleReplaceVideo=async (lectureIndex)=>{
    try{
      setMediaUploadProgress(true);
      let copyCourseCurricullumFormData=[...courseCurriculumFormData];
      const getCurrentLecturePublicId=copyCourseCurricullumFormData[lectureIndex]?.public_id;
      const response=await axiosService.delete(`${Delete_Course_File}/${getCurrentLecturePublicId}`,{
        onUploadProgress:(progressEvent)=>{
          const percentage=Math.round((100*progressEvent.loaded)/progressEvent.total);
         setMediaUploadProgressPercentage(percentage);
       }
      });
      if(response.status===200){
        let copyCourseCurricullumFormData=[...courseCurriculumFormData];

        copyCourseCurricullumFormData[lectureIndex]={
         ...copyCourseCurricullumFormData[lectureIndex],
         videoUrl:"",
         public_id:""
        }
       setCourseCurriculumFormData(copyCourseCurricullumFormData);
       setMediaUploadProgress(false);
       toast.success(response?.data?.message)
      }
    }
    catch(error){
      toast.error(error?.response?.data?.error);
    }
  }

  const handleDeleteLecture=async (lectureIndex)=>{
    try{
      setMediaUploadProgress(true);
      let copyCourseCurricullumFormData=[...courseCurriculumFormData];
      const getCurrentLecturePublicId=copyCourseCurricullumFormData[lectureIndex]?.public_id;
      const response=await axiosService.delete(`${Delete_Course_File}/${getCurrentLecturePublicId}`,{
        onUploadProgress:(progressEvent)=>{
          const percentage=Math.round((100*progressEvent.loaded)/progressEvent.total);
         setMediaUploadProgressPercentage(percentage);
       }
      });
      if(response.status===200){
        let copyCourseCurricullumFormData=[...courseCurriculumFormData];
        if(copyCourseCurricullumFormData.length<=1){
          copyCourseCurricullumFormData[lectureIndex]={
           ...copyCourseCurricullumFormData[lectureIndex],
           title:"",
           videoUrl:"",
           freePreview:false,
           public_id:""
        }
      }
        else{
          copyCourseCurricullumFormData=copyCourseCurricullumFormData.filter(item=>item?.public_id!==getCurrentLecturePublicId);
        }
        setCourseCurriculumFormData(copyCourseCurricullumFormData);
        setMediaUploadProgress(false);
        toast.success(response?.data?.message)
        }
      }
    catch(error){
      toast.error(error?.response?.data?.error);
    }
  }



  
  return (
    <Card>
        <CardHeader>
            <CardTitle>Create Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
            <CommonButton disable={!courseCurriculumFormDataValidation() || mediaUploadProgress} func={handleAddContent} text="Add Content"/>
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
                            {
                              courseCurriculumFormData[index]?.videoUrl ?
                              (
                                <div className='flex gap-3'>
                                  <VideoPlayer url={courseCurriculumFormData[index]?.videoUrl}
                                   width='450px'
                                   height='200px'
                                  />
                                   <CommonButton func={()=>handleReplaceVideo(index)}  text="Replace Video"/>
                                   <CommonButton func={()=>handleDeleteLecture(index)}  text="Delete Content"/>
                                </div>
            
                              ):
                            <Input
                            type="file"
                            accept="video/*" 
                            className="mb-4"
                            onChange={(event)=>handleSingleFileUpload(event,index)}
                            />
                            }
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