import React, { useContext, useEffect,useState } from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import { useSelector } from 'react-redux';
import SkeletonCard from '@/Components/SkeletonCard';
import { UseContextApi } from '@/Components/ContextApi';
import AdminTeacherData from '@/Components/AdminTeacherData';
import { axiosService } from '@/Services';
import { Get_All_Teacher_Purchase_Data } from '@/Routes';

export const getAllTeacherPurchasedData=async(data)=>{
   try{
       const response=await axiosService.post(Get_All_Teacher_Purchase_Data,{data});
       if(response?.status === 200){
        return response?.data?.data;
       }
   }
   catch(error){
    console.log(error);
   }
}

export default function AdminTeacher() {
  const allUsersState=useSelector(state=>state?.allUsers);
  const {data:allUser,loading}=allUsersState;
   const userState=useSelector(state=>state?.user);
    const {data:user}=userState;
  const {allTeacher,setAllTeacher,allTeacherPurchaseData,setAllteacherPurchaseData}=useContext(UseContextApi);
  const [load,setLoad]=useState(true);
  useEffect(()=>{
    setTimeout(()=>{
     setLoad(false);
    },1000);
 },[]);
     useEffect(()=>{
        if(allUser){
          setAllTeacher(allUser?.filter(item=>item?.userRole?.includes('teacher')));
        }
     },[allUser]);

     useEffect(()=>{
        const getTheData=async()=>{
            const result=await getAllTeacherPurchasedData(allTeacher);
            setAllteacherPurchaseData(result);
        }
       if(allTeacher?.length>0){
        getTheData();
       }
     },[allTeacher]);

   if(loading || load){
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
    <div className={`flex flex-row overflow-hidden  ${user?.theme? "bg-gray-50":"bg-zinc-900 text-white"}`}>
          <AdminNavbar/>
          <div className='flex-1'>
          <AdminTeacherData teacherList={allTeacher} />
          </div>
        </div>
  )
}
