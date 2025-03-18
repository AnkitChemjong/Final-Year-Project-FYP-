import React, { useContext } from 'react';
import CommonButton from '../CommonButton';
import { courseCurriculumInitialFormData, courseLandingInitialFormData, formatForAllCourses } from '@/Utils';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs,TabsContent,TabsList,TabsTrigger } from '../ui/tabs';
import CommonTableForCourse from '../CommonTableForCourse';
import { UseContextApi } from '../ContextApi';
import SkeletonCard from '../SkeletonCard';


export default function Courses() {
    const coursesState=useSelector(state=>state?.course);
    const {data:courses,loading}=coursesState;
    const {setCurrentEditedCourseId,setCourseLandingFormData,setCourseCurriculumFormData}=useContext(UseContextApi);
    const navigate=useNavigate();
    const handleNavigation=()=>{
        setCurrentEditedCourseId(null);
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate("/createnewcourse");
    }
  return (
    <div className='flex flex-col h-screen gap-2'>
      <div className='w-full flex flex-row justify-evenly items-center relative  md:top-10'>
        <p className='text-2xl font-bold'>All Courses</p>
        <CommonButton func={handleNavigation} text="Upload Course" />
      </div>
        <Tabs defaultValue='all' className='flex flex-col mt-10 relative   items-center '>
               <div className='py-3 border-b-2 border-stone-950'>
               <TabsList className="gap-10">
               <TabsTrigger value="all" >
                All
               </TabsTrigger>
               <TabsTrigger value="admin" >
                Admin
               </TabsTrigger>
               <TabsTrigger value="teacher" >
                Teacher
               </TabsTrigger>
               </TabsList>
               </div>
               {
                loading? <SkeletonCard />:(
                  <>
                  <TabsContent value="all">
                <CommonTableForCourse data={courses} type="all" header={formatForAllCourses}/>
               </TabsContent>
               <TabsContent value="admin">
               <CommonTableForCourse data={courses.filter(item=>item?.creator?.userRole?.includes("admin"))} type="admin created" header={formatForAllCourses}/>
               </TabsContent>
               <TabsContent value="teacher">
               <CommonTableForCourse data={courses.filter(item=>item?.creator?.userRole?.includes("teacher"))} type="teacher created" header={formatForAllCourses}/>
               </TabsContent>
                  </>
                )
               }
               
               </Tabs>
      </div>
  );
}
