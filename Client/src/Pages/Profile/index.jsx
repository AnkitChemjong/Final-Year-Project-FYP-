import React from 'react';
import { Button } from '@/Components/ui/button';
import Logout from '@/Components/LogoutFunc';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getUser } from '@/Store/Slices/User_Slice';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
const handleLogout=async ()=>{
try{
    const logoutData=await Logout();
    if(logoutData?.status===200){
        dispatch(getUser());
        navigate('/');
        toast.success(logoutData?.data?.message);
    }
    else{
      toast.error(logoutData?.data?.message);
    }
}
catch(error){
    console.log(error);
    toast.error("Something wrong while logging out")
}
}
  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}
