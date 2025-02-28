import React, { useState } from 'react';
import { createContext } from 'react';
import { courseLandingInitialFormData,courseCurriculumInitialFormData } from '@/Utils';

export const UseContextApi=createContext();

export default function ContextApi({children}) {
    const [loading,setLoading]=useState(false);
    const [courseLandingFormData, setCourseLandingFormData] = useState(
        courseLandingInitialFormData
      );
      const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
        courseCurriculumInitialFormData
      );
    const [downloading,setDownloading]=useState("");
    const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
  return (
   <UseContextApi.Provider  value={{loading,setLoading,downloading,setDownloading,courseLandingFormData,
    setCourseLandingFormData,courseCurriculumFormData, 
    setCourseCurriculumFormData,
    mediaUploadProgress, setMediaUploadProgress,
    mediaUploadProgressPercentage, setMediaUploadProgressPercentage,
    currentEditedCourseId, setCurrentEditedCourseId}}>
     {children}
   </UseContextApi.Provider>
  )
}
