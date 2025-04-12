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
import { Button } from '@/Components/ui/button';
import { FaChevronLeft } from "react-icons/fa";
import AddQuiz from '@/Components/AddNewCourse/AddQuiz';
import supabaseClient from '@/Components/SupabaseClient';





export default function CreateNewCourse() {
  const {courseLandingFormData,courseCurriculumFormData,setCourseLandingFormData,setCourseCurriculumFormData
    ,currentEditedCourseId,setCurrentEditedCourseId,courseQuizFormData, setCourseQuizFormData,loadingSpin,setLoadingSpin
    ,extraResource,setExtraResource
  }=useContext(UseContextApi);
  const user=useSelector(state=>state?.user?.data);
  const useStates=useSelector(state=>state?.course);
  const {data:allCourse,loading}=useStates;
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

  if (courseQuizFormData.length === 0) {
    return false;
  }

  for (const item of courseQuizFormData) {
    if (
      isEmpty(item.question) ||
      isEmpty(item.optionA) ||
      isEmpty(item.optionB) ||
      isEmpty(item.optionC) ||
      isEmpty(item.optionD) ||
      isEmpty(item.answer)
    ) {
      return false;
    }
  }
    return hasFreePreview;
  };

  const handleAddNewCourse=async ()=>{
    try{
      setLoadingSpin(true);
      const courseFinalData=
      {
        creator:user?._id,
        ...courseLandingFormData,
        students:[],
        curriculum:courseCurriculumFormData,
        quizData:{
          passMark:courseQuizFormData.length * 10 * 0.7,
          question:courseQuizFormData
        }
      }
      //console.log(courseFinalData);
        const response=currentEditedCourseId === null? await axiosService.post(Add_New_Course,courseFinalData):await axiosService.put(`${Update_Course}/${currentEditedCourseId}`,courseFinalData);
          if(response.status===200){
            if(response?.data?.data?.extraResources !== extraResource){
                await supabaseClient.storage
                    .from('extra-resources')
                    .remove([extraResource]);
            }
            setLoadingSpin(false);
           setCourseLandingFormData(courseLandingInitialFormData);
           setCourseCurriculumFormData(courseCurriculumInitialFormData);
           setCurrentEditedCourseId(null);
           dispatch(getCourse());
           setExtraResource(null);
          toast.success(response?.data?.message);
          navigate(-1);
          }
         
       }
       catch(error){
        setLoadingSpin(false);
         toast.error(error?.response?.data?.message);
       }
  }
  useEffect(()=>{
    if(params?.courseId) setCurrentEditedCourseId(params?.courseId)
    },[params?.courseId]);

  const getCourseDetailsById=()=>{
    const courseDetails=allCourse?.find((item)=>item._id===currentEditedCourseId);
    if(courseDetails){
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = courseDetails[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});
       if(courseDetails?.extraResources){
        setExtraResource(courseDetails?.extraResources);
       }
       else{
        setExtraResource(null);
       }
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(courseDetails?.curriculum);
    }
  }
  useEffect(() => {
    if (currentEditedCourseId !== null && !loading) getCourseDetailsById();
  }, [currentEditedCourseId,loading]);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between'>
           <Button onClick={()=>navigate(-1)} className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md">
             <FaChevronLeft className='w-4 h-4 mr-2'/>
             Return
           </Button>
          <h1 className='text-3xl font-bold mb-5 font-heading'>Create New Course</h1>
           <CommonButton func={handleAddNewCourse} disable={!validateFormData() || loadingSpin} text= "Submit"/>
      </div>
      <Card>
        <CardContent>
            <div className='container mx-auto p-4'>
                   <Tabs defaultValue="curriculum" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="curriculum font-heading">Curriculum</TabsTrigger>
                        <TabsTrigger value="course-landing-page font-heading">Course Landing Page</TabsTrigger>
                        <TabsTrigger value="setting font-heading">Setting</TabsTrigger>
                        <TabsTrigger value="quiz font-heading">Add Quiz</TabsTrigger>
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
                    <TabsContent value="quiz">
                      <AddQuiz />
                    </TabsContent>
                   </Tabs>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
