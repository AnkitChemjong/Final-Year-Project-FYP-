import React, { useContext, useEffect } from 'react';
import ResetForm from '@/Components/ResetForm';
import { axiosService } from '@/Services';
import { User_Temp_Code_Route } from '@/Routes';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import { UseContextApi } from '@/Components/ContextApi';

export default function CheckTempUserCode() {
    const location=useLocation();
    const email=location?.state || null;
    //console.log(email);
    const navigate=useNavigate();
    const {loadingSpin,setLoadingSpin}=useContext(UseContextApi);
    const value=[
        {
            name:"code",
            label:"Code",
            placeHolder:"Enter the code",
        }
    ]
    const handleCheckCode=async (data)=>{
       try{
        setLoadingSpin(true);
        const data1={...data,email:email}
         const returnData=await axiosService.post(User_Temp_Code_Route,data1);
         if(returnData?.status===200){
         toast.success(returnData?.data?.message);
         navigate("/signin");
         }
         if(returnData?.status===201){
            toast.warn(returnData?.data?.message);
            navigate("/signup");
            }
       }
       catch(error){
        console.log(error);
        toast.error(error?.response?.data?.message);
       }
       finally{
        setLoadingSpin(false);
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
