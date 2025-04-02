import React, { useContext,useEffect } from 'react';
import TeacherNavbar from '@/Components/TeacherNavbar';
import TeacherHireRequestData from '@/Components/TeacherHireRequestData';
import { UseContextApi } from '@/Components/ContextApi';
import { useSelector } from 'react-redux';
import { Get_Teacher_Hire_Application } from '@/Routes';
import { axiosService } from '@/Services';
import SkeletonCard from '@/Components/SkeletonCard';

export const getTeacherHireApplication=async(id)=>{
  try{
     const response=await axiosService.get(`${Get_Teacher_Hire_Application}/${id}`);
     if(response.status === 200){
      return response?.data?.application;
     }
  }
  catch(error){
    console.log(error)
  }
}

export default function TeacherHireRequest() {
  const {teacherHireApplicationList,setTeacherHireApplicationList}=useContext(UseContextApi);
   const userStates=useSelector(state=>state?.user);
   const {data:user,loading}=userStates;
   useEffect(() => {
     if (user) {
       const getUsersRequestApplication=async()=>{
   
         const result=await getTeacherHireApplication(user?._id);
         setTeacherHireApplicationList(result);
       }
       getUsersRequestApplication();
       };
   
   },[loading]);

   if(!user || !teacherHireApplicationList){
    return(
      <div className='flex flex-row gap-2 overflow-hidden min-h-screen bg-gray-50'>
              <TeacherNavbar />
              <SkeletonCard />
       </div>
    )
  }

  return (
    <div className='flex flex-row gap-2 overflow-hidden bg-gray-50'>
          <TeacherNavbar />
          <div className='flex-1'>
           <TeacherHireRequestData applicationList={teacherHireApplicationList}/>
          </div>
        </div>
  )
}
