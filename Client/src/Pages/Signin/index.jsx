import React,{useContext} from 'react'
import SigninForm from '@/Components/SigninForm';
import { useNavigate } from 'react-router-dom';
import { User_Login_Route } from '@/Routes';
import { toast } from 'react-toastify';
import { axiosService } from '@/Services';
import { useDispatch } from 'react-redux';
import { getUser } from '@/Store/Slices/User_Slice';
import Navbar from '@/Components/Navbar';
import { UseContextApi } from '@/Components/ContextApi';

export default function Signin() {
  const {setLoadingSpin}=useContext(UseContextApi);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handlePost=async (data)=>{
    try{
      setLoadingSpin(true);
       const returnData=await axiosService.post(User_Login_Route,data);
      if(returnData?.status===200){
        dispatch(getUser());
        setLoadingSpin(false);
         toast.success(returnData?.data?.message);
         if(returnData?.data?.user?.userRole?.includes("admin")){
          navigate('/admin/dashboard');
         }
         else{
           navigate('/')
         }
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
      <SigninForm func={handlePost}/>
    </div>
  )
}
