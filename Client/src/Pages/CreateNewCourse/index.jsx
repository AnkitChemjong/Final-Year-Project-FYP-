import React,{useContext,useEffect} from 'react';
import CommonButton from '@/Components/CommonButton';
import { Card,CardContent } from '@/Components/ui/card';
import { Tabs,TabsList,TabsTrigger,TabsContent } from '@/Components/ui/tabs';
import CourseCurriculum from '@/Components/AddNewCourse/CourseCurriculum';
import CourseLanding from '@/Components/AddNewCourse/CourseLanding';
import CourseSetting from '@/Components/AddNewCourse/CourseSetting';
import { UseContextApi } from '@/Components/ContextApi';
import { axiosService } from '@/Services';
import { Add_New_Course, Update_Course } from '@/Routes';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/Utils';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourse } from '@/Store/Slices/Course_Slice';



export default function CreateNewCourse() {
  const {courseLandingFormData,courseCurriculumFormData,setCourseLandingFormData,setCourseCurriculumFormData
    ,currentEditedCourseId,setCurrentEditedCourseId
  }=useContext(UseContextApi);
  const user=useSelector(state=>state?.user?.data);
  const allCourse=useSelector(state=>state?.course?.data);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const params=useParams();
  

  const isEmpty = (value) => {
    if (value === null || value === undefined) return true; 
    if (Array.isArray(value)) return value.length === 0;
    return value === "";
  };
  
  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }
  
    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
        return false;
      }
      if (item.freePreview) {
        hasFreePreview = true;
      }
    }
  
    return hasFreePreview;
  };

  const handleAddNewCourse=async ()=>{
    try{
      const courseFinalData=
      {
        creator:user?._id,
        ...courseLandingFormData,
        students:[],
        curriculum:courseCurriculumFormData,
        isPublished:true
      }
        const response=currentEditedCourseId === null? await axiosService.post(Add_New_Course,courseFinalData):await axiosService.put(`${Update_Course}/${currentEditedCourseId}`,courseFinalData);
          if(response.status===200){
           setCourseLandingFormData(courseLandingInitialFormData);
           setCourseCurriculumFormData(courseCurriculumInitialFormData);
           setCurrentEditedCourseId(null);
           dispatch(getCourse());
          toast.success(response?.data?.message);
          navigate(-1);
          }
         
       }
       catch(error){
         toast.error(error?.response?.data?.message);
       }
  }
  useEffect(()=>{
    if(params?.courseId) setCurrentEditedCourseId(params?.courseId)
    },[params?.courseId]);

  const getCourseDetailsById=()=>{
    const courseDetails=allCourse.find((item)=>item._id===currentEditedCourseId);
    if(courseDetails){
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = courseDetails[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(courseDetails?.curriculum);
    }
  }
  useEffect(() => {
    if (currentEditedCourseId !== null) getCourseDetailsById();
  }, [currentEditedCourseId]);
  
  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between'>
          <h1 className='text-3xl font-bold mb-5'>Create New Course</h1>
           <CommonButton func={handleAddNewCourse} disable={!validateFormData()} text="Submit"/>
      </div>
      <Card>
        <CardContent>
            <div className='container mx-auto p-4'>
                   <Tabs defaultValue="curriculum" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                        <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                        <TabsTrigger value="setting">Setting</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curriculum">
                         <CourseCurriculum/>
                    </TabsContent>
                    <TabsContent value="course-landing-page">
                       <CourseLanding />
                    </TabsContent>
                    <TabsContent value="setting">
                      <CourseSetting />
                    </TabsContent>
                   </Tabs>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
