import React, { useContext, useEffect } from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import { useSelector } from 'react-redux';
import SkeletonCard from '@/Components/SkeletonCard';
import { UseContextApi } from '@/Components/ContextApi';
import AdminTeacherData from '@/Components/AdminTeacherData';

export default function AdminTeacher() {
  const allUsersState=useSelector(state=>state?.allUsers);
  const {data:allUser,loading}=allUsersState;
  const {allTeacher,setAllTeacher}=useContext(UseContextApi);

     useEffect(()=>{
        if(allUser){
          setAllTeacher(allUser?.filter(item=>item?.userRole?.includes('teacher')));
        }
     },[allUser]);

   if(loading || allTeacher?.length===0){
    return (
      <div className='flex flex-row gap-2 overflow-hidden'>
      <AdminNavbar/>
      <div className='flex-1'>
        <SkeletonCard/>
      </div>
    </div>
    )
   }
  return (
    <div className='flex flex-row gap-2 overflow-hidden'>
          <AdminNavbar/>
          <div className='flex-1'>
          <AdminTeacherData teacherList={allTeacher} />
          </div>
        </div>
  )
}
