import React from 'react';
import SignupForm from '@/Components/SingupForm';
import { toast } from 'react-toastify';
import { axiosService } from '@/Services';
import { User_Route } from '@/Routes';
import { useNavigate } from 'react-router-dom';


export default function Signup() {
  const navigate=useNavigate();
  const handlePost=async (data)=>{
    try{
       const returnData=await axiosService.post(User_Route,data,{
        headers: { "Content-Type": "application/json" },
      });
       toast.success(returnData?.data?.message);
       navigate('/signin')
    }
    catch(error){
         toast.error(error?.message || "Something went wrong!")
    }
  }
  return (
    <div>
      <SignupForm func={handlePost}/>
    </div>
  )
}
