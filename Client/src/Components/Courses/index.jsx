import React, { useContext,useState,useEffect } from 'react';
import CommonButton from '../CommonButton';
import { courseCurriculumInitialFormData, courseLandingInitialFormData, formatForAllCourses, courseQuizInitialFormData } from '@/Utils';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CommonTableForCourse from '../CommonTableForCourse';
import { UseContextApi } from '../ContextApi';
import SkeletonCard from '../SkeletonCard';
import { ScrollArea } from '../ui/scroll-area';
import LottieAnimation from '@/Components/LottieAnimation';
import graduationcourse from '@/assets/graduationcourse.json';
import { FaBook, FaUserShield, FaChalkboardTeacher } from 'react-icons/fa';

export default function Courses() {
  const coursesState = useSelector(state => state?.course);
  const { data: courses, loading } = coursesState;
  const { setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData, courseQuizFormData, setCourseQuizFormData } = useContext(UseContextApi);
  const navigate = useNavigate();
  const [load,setLoad]=useState(true);

  const handleNavigation = () => {
    setCurrentEditedCourseId(null);
    setCourseQuizFormData(courseQuizInitialFormData);
    setCourseLandingFormData(courseLandingInitialFormData);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
    navigate("/createnewcourse");
  };
  useEffect(()=>{
    setTimeout(()=>{
     setLoad(false);
    },1000);
 },[]);

  const totalCourses = courses?.length || 0;
  const adminCreatedCourses = courses?.filter(item => item?.creator?.userRole?.includes("admin")).length || 0;
  const teacherCreatedCourses = courses?.filter(item => item?.creator?.userRole?.includes("teacher")).length || 0;
if(load){
  return(
    <SkeletonCard />
  )
}
  return (
    <ScrollArea className="max-h-screen overflow-auto">
      <div className="flex flex-col w-full p-6 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className='flex gap-1 items-center'>
            <h1 className="text-3xl font-bold text-gray-800">All Courses</h1>
            <LottieAnimation animationData={graduationcourse} width={150} height={150} speed={1}/>
          </div>
          <CommonButton
            func={handleNavigation}
            text="Upload New Course"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
          />
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Total Courses</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalCourses}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaBook className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

        
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Admin-Created Courses</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{adminCreatedCourses}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaUserShield className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">Teacher-Created Courses</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{teacherCreatedCourses}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaChalkboardTeacher className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center py-4 border-b border-gray-200">
            <TabsList className="flex gap-4 bg-white rounded-lg shadow-sm p-2">
              <TabsTrigger
                value="all"
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                ALL
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                ADMIN
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                TEACHER
              </TabsTrigger>
            </TabsList>
          </div>

          {loading ? (
            <SkeletonCard />
          ) : (
            <>
              <TabsContent value="all" className="mt-1">
                <CommonTableForCourse
                  data={courses}
                  type="all"
                  header={formatForAllCourses}
                  page="admin-page"
                />
              </TabsContent>
              <TabsContent value="admin" className="mt-1">
                <CommonTableForCourse
                  data={courses?.filter(item => item?.creator?.userRole?.includes("admin"))}
                  type="admin created"
                  header={formatForAllCourses}
                  page="admin-page"
                />
              </TabsContent>
              <TabsContent value="teacher" className="mt-1">
                <CommonTableForCourse
                  data={courses?.filter(item => item?.creator?.userRole?.includes("teacher"))}
                  type="teacher created"
                  header={formatForAllCourses}
                  page="admin-page"
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </ScrollArea>
  );
}