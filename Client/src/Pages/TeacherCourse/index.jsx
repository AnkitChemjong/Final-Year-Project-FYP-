import React,{useContext, useEffect} from 'react';
import TeacherNavbar from '@/Components/TeacherNavbar';
import TeacherCoursesData from '@/Components/TeacherCoursesData';
import { useSelector } from 'react-redux';
import { UseContextApi } from '@/Components/ContextApi';
import { Get_Teacher_Courses } from '@/Routes';
import { axiosService } from '@/Services';



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

    useEffect(()=>{
       if (user) {
              const getUsersCourses=async()=>{
          
                const result=await getTeacherCoursesFromBackend(user?._id);
                setTeacherCourseList(result);
              }
              getUsersCourses();
              };
    },[loading]);

  return (
     <div className='flex flex-row gap-2 overflow-hidden'>
              <TeacherNavbar />
              <div className='flex-1'>
               <TeacherCoursesData courseList={teacherCourseList} teacherData={user}/>
              </div>
            </div>
  )
}
