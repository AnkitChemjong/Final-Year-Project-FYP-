import React,{useContext} from 'react';
import SignupForm from '@/Components/SingupForm';
import { toast } from 'react-toastify';
import { axiosService } from '@/Services';
import { User_Temp_Route } from '@/Routes';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import { UseContextApi } from '@/Components/ContextApi';




export default function Signup() {
  const navigate=useNavigate();

  const {loadingSpin,setLoadingSpin}=useContext(UseContextApi);
  const handlePost=async (data)=>{
    try{
      setLoadingSpin(true);
       const returnData=await axiosService.post(User_Temp_Route,data);
      if(returnData?.status===200){
        setLoadingSpin(false);
        toast.success(returnData?.data?.message);
        navigate('/checktemp',{state:returnData?.data?.email});
      }
      if(returnData?.status===201){
        toast.error(returnData?.data?.message);
      }
    }
    catch(error){
         toast.error(error?.response?.data?.message);
    }
    finally{
      setLoadingSpin(false);
    }
  }
  return (
    <div>
      <Navbar/>
      <SignupForm func={handlePost}/>
    </div>
  )
}
