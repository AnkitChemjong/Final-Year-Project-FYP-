import React,{useState,useEffect} from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import Courses from '@/Components/Courses';
import { useSelector } from 'react-redux';
import SkeletonCard from '@/Components/SkeletonCard';

export default function AdminCourse() {
  const userState=useSelector(state=>state?.user);
  const {data:user,loading}=userState;
    const [load,setLoad]=useState(true);
    useEffect(()=>{
      setTimeout(()=>{
       setLoad(false);
      },1000);
   },[]);
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
      <Courses/>
      </div>
    </div>
  )
}
