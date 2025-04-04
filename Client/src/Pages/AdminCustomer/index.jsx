import React, { useContext, useEffect,useState } from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import { useSelector } from 'react-redux';
import SkeletonCard from '@/Components/SkeletonCard';
import { UseContextApi } from '@/Components/ContextApi';
import AdminCustomerData from '@/Components/AdminCustomerData';

export default function AdminCustomer() {
  const allUsersState=useSelector(state=>state?.allUsers);
  const {data:allUser,loading}=allUsersState;
  const {allCustomer,setAllCustomer}=useContext(UseContextApi);
  const [load,setLoad]=useState(true);

     useEffect(()=>{
        if(allUser){
          setAllCustomer(allUser?.filter(item=>!item?.userRole?.includes('admin')));
        }
     },[allUser]);
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
    <div className='flex flex-row gap-2 overflow-hidden bg-gray-50'>
          <AdminNavbar/>
          <div className='flex-1'>
          <AdminCustomerData customerList={allCustomer} />
          </div>
        </div>
  )
}
