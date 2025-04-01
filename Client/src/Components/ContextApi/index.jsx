import React, { useState } from 'react';
import { createContext } from 'react';
import { courseLandingInitialFormData,courseCurriculumInitialFormData,hireTeacherInitialState,courseQuizInitialFormData } from '@/Utils';


export const UseContextApi=createContext();

export default function ContextApi({children}) {
  const [hireTeacherInitialStateData,setHireTeacherInitialStateData]=useState(hireTeacherInitialState);
  const [hireTeacherApplicationEditId,setHireTeacherApplicationEditId]=useState(null);

  const [studentHireApplicationList,setStudentHireApplicationList]=useState([]);
  const [teacherHireApplicationList,setTeacherHireApplicationList]=useState([]);
  const [teacherCourseList,setTeacherCourseList]=useState([]);

  const [courseQuizData,setCourseQuizData]=useState([]);

  const [showRateCourseDialog,setShowRateCourseDialog]=useState(false);

   const [userRatingData,setUserRatingData]=useState(null);



    const [loadingSpin,setLoadingSpin]=useState(false);
    const [loadingStateCourse,setLoadingStateCourse]=useState(true);
    const [courseLandingFormData, setCourseLandingFormData] = useState(
        courseLandingInitialFormData
      );
      const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
        courseCurriculumInitialFormData
      );
      const [courseQuizFormData, setCourseQuizFormData] = useState(
        courseQuizInitialFormData
      );
    const [downloading,setDownloading]=useState("");
    const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
  const [specificCourseDetails,setSpecificCourseDetails]=useState(null);
  const [specificCourseRating,setSpecificCourseRating]=useState([]);
  const [specificCourseDetailsId,setSpecificCourseDetailsId]=useState(null);

  const [specificTeacherDetails,setSpecificTeacherDetails]=useState(null);
  const [specificTeacherDetailsId,setSpecificTeacherDetailsId]=useState(null);

  const [allCourses,setAllCourses]=useState([]);
  const [allTeachers,setAllTeachers]=useState([]);

  const [extraResource,setExtraResource]=useState(null);
  

  const [studentEnrolledCourses,setStudentEnrolledCourses]=useState([]);
  
  const [courseProgress,setCourseProgress]=useState({});


  const [showConfetti,setShowConfetti]=useState(false);
  const [courseCompletedDialog, setCourseCompletedDialog]=useState(false);

  const [unreadCount, setUnreadCount] = useState(0);


  const [specificUserNotification,setSpecificUserNotification]=useState([]);


  const [allCustomer,setAllCustomer]=useState([]);
  const [allTeacher,setAllTeacher]=useState([]);
  return (
   <UseContextApi.Provider  value={{loadingSpin,setLoadingSpin,downloading,setDownloading,courseLandingFormData,
    setCourseLandingFormData,courseCurriculumFormData, 
    setCourseCurriculumFormData,
    mediaUploadProgress, setMediaUploadProgress,
    mediaUploadProgressPercentage, setMediaUploadProgressPercentage,
    currentEditedCourseId, setCurrentEditedCourseId,allCourses,setAllCourses,
    loadingStateCourse,setLoadingStateCourse,
    specificCourseDetails,setSpecificCourseDetails,
    specificCourseDetailsId,setSpecificCourseDetailsId,
    studentEnrolledCourses,setStudentEnrolledCourses,
    courseProgress,setCourseProgress,specificTeacherDetails,setSpecificTeacherDetails
    ,specificTeacherDetailsId,setSpecificTeacherDetailsId,allTeachers,setAllTeachers,
    studentHireApplicationList,setStudentHireApplicationList,hireTeacherInitialStateData,setHireTeacherInitialStateData,hireTeacherApplicationEditId,setHireTeacherApplicationEditId,
    teacherHireApplicationList,setTeacherHireApplicationList,
    teacherCourseList,setTeacherCourseList,courseQuizFormData, setCourseQuizFormData,
    courseQuizData,setCourseQuizData,showConfetti,setShowConfetti,
    courseCompletedDialog, setCourseCompletedDialog,
    showRateCourseDialog,setShowRateCourseDialog,
    userRatingData,setUserRatingData,
    specificCourseRating,setSpecificCourseRating,
    specificUserNotification,setSpecificUserNotification,
    unreadCount, setUnreadCount,
    allCustomer,setAllCustomer,allTeacher,setAllTeacher,
    extraResource,setExtraResource
   }}>
     {children}
   </UseContextApi.Provider>
  )
}
