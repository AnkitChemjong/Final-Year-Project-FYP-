import React from 'react';
import ResetForm from '@/Components/ResetForm';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { User_Change_Pass_Route } from '@/Routes';
import { axiosService } from '@/Services';
import Navbar from '@/Components/Navbar';

export default function ChangePass() {
    const navigate=useNavigate();
    const location=useLocation();
    const email=location?.state || null;
    const value=[
        {
            name:"password",
            label:"Password",
            placeHolder:"Enter the password",
        },
        {
            name:"confirmPassword",
            label:"Confirm Password",
            placeHolder:"Confirm Password",
        }
    ]
    const handleEvent=async (data)=>{
           try{
            const data1={...data,email:email}
             const returnData=await axiosService.patch(User_Change_Pass_Route,data1);
             if(returnData?.status===200){
             toast.success(returnData?.data?.message);
             navigate("/signin");
             }
            if(returnData?.status===400){
                    toast.error(returnData?.data?.message);
                    window.location.refresh();
                    }
           }
           catch(error){
            console.log(error);
           }
    
        }
  return (
    <div>
      <Navbar/>
      <ResetForm type="password" value={value} func={handleEvent}/>
    </div>
  )
}
