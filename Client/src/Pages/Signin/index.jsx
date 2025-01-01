import React from 'react'
import SigninForm from '@/Components/SigninForm';
import { useNavigate } from 'react-router-dom';
import { User_Login_Route } from '@/Routes';
import { toast } from 'react-toastify';
import { axiosService } from '@/Services';
import { useDispatch } from 'react-redux';
import { getUser } from '@/Store/Slices/User_Slice';

export default function Signin() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handlePost=async (data)=>{
    try{
       const returnData=await axiosService.post(User_Login_Route,data,{
        withCredentials:true,
        headers: { "Content-Type": "application/json" },
      });
      dispatch(getUser());
       toast.success(returnData?.data?.message);
       navigate('/')
    }
    catch(error){
         toast.error(error?.message || "Something went wrong!")
    }
  }
  return (
    <div>
      <SigninForm func={handlePost}/>
    </div>
  )
}
