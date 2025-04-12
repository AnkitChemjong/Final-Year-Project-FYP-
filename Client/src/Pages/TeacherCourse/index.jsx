import React,{useContext, useEffect,useState} from 'react';
import TeacherNavbar from '@/Components/TeacherNavbar';
import TeacherCoursesData from '@/Components/TeacherCoursesData';
import { useSelector } from 'react-redux';
import { UseContextApi } from '@/Components/ContextApi';
import { Get_Teacher_Courses } from '@/Routes';
import { axiosService } from '@/Services';
import SkeletonCard from '@/Components/SkeletonCard';



export const getTeacherCoursesFromBackend=async(id)=>{
    try{
        const response=await axiosService.get(`${Get_Teacher_Courses}/${id}`);
        if(response.status === 200){
         return response?.data?.data;
        }
     }
     catch(error){
       console.log(error)
     }
}

export default function TeacherCourse() {
    const {teacherCourseList,setTeacherCourseList}=useContext(UseContextApi);
    const userStates=useSelector(state=>state?.user);
    const {data:user,loading}=userStates;
    const [load,setLoad]=useState(true);

    useEffect(()=>{
       if (user) {
              const getUsersCourses=async()=>{
          
                const result=await getTeacherCoursesFromBackend(user?._id);
                setTeacherCourseList(result);
              }
              getUsersCourses();
              };
    },[loading]);
    useEffect(()=>{
      setTimeout(()=>{
       setLoad(false);
      },1000);
   },[]);

    if(!user || load){
      return(
        <div className='flex flex-row gap-2 overflow-hidden min-h-screen bg-gray-50'>
                <TeacherNavbar />
                <SkeletonCard />
         </div>
      )
    }
  return (
     <div className={`flex flex-row overflow-hidden  ${user?.theme? "bg-gray-50":"bg-zinc-900 text-white"}`}>
              <TeacherNavbar />
              <div className='flex-1'>
               <TeacherCoursesData courseList={teacherCourseList} teacherData={user}/>
              </div>
            </div>
  )
}
