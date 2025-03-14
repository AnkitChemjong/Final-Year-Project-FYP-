import React, { useEffect } from 'react';
import ResetForm from '@/Components/ResetForm';
import { axiosService } from '@/Services';
import { User_Check_Code_Route } from '@/Routes';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Components/Navbar';

export default function ResetCode() {
    const location=useLocation();
    const email=location?.state || null;
    //console.log(email);
    const navigate=useNavigate();
    const value=[
        {
            name:"code",
            label:"Code",
            placeHolder:"Enter the code",
        }
    ]
    const handleCheckCode=async (data)=>{
       try{
        const data1={...data,email:email}
         const returnData=await axiosService.post(User_Check_Code_Route,data1);
         if(returnData?.status===200){
         toast.success(returnData?.data?.message);
         navigate("/changePass",{state:email});
         }
         if(returnData?.status===400){
            toast.warn(returnData?.data?.message);
            navigate("/signin");
            }
        if(returnData?.status===401){
                toast.error(returnData?.data?.message);
                window.location.refresh();

                }

       }
       catch(error){
        console.log(error);
       }

    }
    useEffect(()=>{
          if(!email){
              navigate(-1);
          }
    },[email]);
  return (
    <div>
      <Navbar/>
      <ResetForm type="code" value={value} func={handleCheckCode}/>
    </div>
  )
}
