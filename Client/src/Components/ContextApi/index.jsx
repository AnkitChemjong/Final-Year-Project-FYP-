import React, { useState } from 'react';
import { createContext } from 'react';
import { courseLandingInitialFormData,courseCurriculumInitialFormData } from '@/Utils';


export const UseContextApi=createContext();

export default function ContextApi({children}) {
    const [loading,setLoading]=useState(false);
    const [loadingStateCourse,setLoadingStateCourse]=useState(true);
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
  const [specificCourseDetails,setSpecificCourseDetails]=useState(null);
  const [specificCourseDetailsId,setSpecificCourseDetailsId]=useState(null);

  const [allCourses,setAllCourses]=useState([]);

  const [studentEnrolledCourses,setStudentEnrolledCourses]=useState([]);
  
  const [courseProgress,setCourseProgress]=useState({});
  return (
   <UseContextApi.Provider  value={{loading,setLoading,downloading,setDownloading,courseLandingFormData,
    setCourseLandingFormData,courseCurriculumFormData, 
    setCourseCurriculumFormData,
    mediaUploadProgress, setMediaUploadProgress,
    mediaUploadProgressPercentage, setMediaUploadProgressPercentage,
    currentEditedCourseId, setCurrentEditedCourseId,allCourses,setAllCourses,
    loadingStateCourse,setLoadingStateCourse,
    specificCourseDetails,setSpecificCourseDetails,
    specificCourseDetailsId,setSpecificCourseDetailsId,
    studentEnrolledCourses,setStudentEnrolledCourses,
    courseProgress,setCourseProgress}}>
     {children}
   </UseContextApi.Provider>
  )
}
