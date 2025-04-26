import React,{useState,useContext} from 'react';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TfiGithub } from "react-icons/tfi";
import { Button } from '@/Components/ui/button';
import { loginForm } from '@/Utils';
import { Link } from 'react-router-dom';
import { signinValidation } from '@/FormValidation';
import { initialLogData } from '@/Utils';
import { handleGoogle } from '../ThirdAuth';
import { handleGithub } from '../ThirdAuth';
import { handleFacebook } from '../ThirdAuth';
import  DialogForm  from '../DialogForm';
import { axiosService } from "@/Services";
import { User_Token_Gen_Route } from '@/Routes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { emailDialogInitialState,emailInputs } from '@/Utils';
import { UseContextApi } from '../ContextApi';
import { FiLoader } from "react-icons/fi";
import CommonRenderFormInput from '../CommonRenderFormInput';

export default function SigninForm({func}) {
  const {loadingSpin,setLoadingSpin}=useContext(UseContextApi);
  const navigate=useNavigate();
  const [dialog,setDialog]=useState(false);
  const toggleDialog=()=>{
    setDialog(!dialog)
  }
  const [error, setError] = useState({});
  const [data,setData]=useState(initialLogData);


  const onFormSubmit=(e)=>{
    e.preventDefault();
    const errors=signinValidation(data);
    setError(errors);
    if(errors.email === '' &&
      errors.password === '' &&
      errors.confirmPassword === ''){
      func(data);
    }}
    const handleEvent=async (data)=>{
      try{
        setLoadingSpin(true);
            const returnData=await axiosService.post(User_Token_Gen_Route,data,{withCredentials:true,headers:{"Content-Type":"application/json"}});
             if(returnData?.status===200){
                toast.success(returnData?.data?.message);
                navigate('/resetcode',{state:returnData?.data?.email});
             }    
      }
      catch(error){
        toast.error(error?.response?.data?.message)
      }
      finally{
        setLoadingSpin(false);
      }
    }
  return (
    <main className='w-full h-screen flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 xl:gap-7 p-4 overflow-hidden'>
    
      <div className='hidden lg:block flex-shrink-0'>
        <img 
          src="images/login.png" 
          alt="login illustration" 
          className='w-[280px] lg:w-[350px] xl:w-[420px] h-auto object-contain'
        />
      </div>
      
     
      <div className='flex lg:flex-col gap-4 lg:gap-5 justify-center items-center flex-shrink-0 order-first lg:order-none'>
        <FaFacebook 
          onClick={handleFacebook} 
          className='cursor-pointer text-blue-600 hover:scale-105 transition-all ease-in-out duration-200' 
          size={26}
        />
        <FcGoogle 
          onClick={handleGoogle} 
          className='cursor-pointer hover:scale-105 transition-all ease-in-out duration-200' 
          size={26}
        />
        <TfiGithub 
          onClick={handleGithub} 
          className='cursor-pointer hover:scale-105 transition-all ease-in-out duration-200' 
          size={26}
        />
      </div>
      
     
      <div className='w-full max-w-md flex flex-col justify-center items-center gap-4 lg:gap-5 overflow-y-auto py-4'>
      
        <h1 className='font-bold text-2xl sm:text-3xl text-center'>Welcome Back</h1>
        
       
        <form onSubmit={onFormSubmit} className='w-full flex flex-col justify-center items-center gap-4'>
          <div className='w-full flex flex-col gap-3'>
            {loginForm.map((item,index)=>{
              return (
                <CommonRenderFormInput key={index} getCurrentControl={item} data={data} setData={setData} error={error}/>
              )
            })}
          </div>
          
       
          <Link 
            onClick={toggleDialog} 
            className='text-green-600 hover:text-blue-700 text-sm sm:text-base transition-colors duration-200'
          >
            Forgot Password?
          </Link>
          
        
          {dialog && <DialogForm 
            title="Update Password" 
            description="Enter your registered email here." 
            dialog={dialog} 
            setDialog={setDialog} 
            func={handleEvent} 
            type="email" 
            componentInputs={emailInputs} 
            initialState={emailDialogInitialState}
          />}
          
          
          <Button 
            disabled={loadingSpin} 
            className="w-full bg-green-600 font-playfair hover:bg-green-700 text-white px-5 py-3 transition-colors duration-200"
          >
            {loadingSpin ? (
              <FiLoader className='w-5 h-5 animate-spin mr-2'/>
            ) : null}
            Login
          </Button>
        </form>
        
     
        <div className='w-full flex items-center my-2'>
          <div className='flex-1 h-px bg-gray-300'></div>
          <span className='px-3 text-sm text-gray-500'>or</span>
          <div className='flex-1 h-px bg-gray-300'></div>
        </div>
        
       
        <div className='w-full flex justify-center'>
          <Link 
            to="/signup" 
            className='text-green-600 hover:text-blue-700 text-sm sm:text-base transition-colors duration-200'
          >
            Create New Account?
          </Link>
        </div>
      </div>
    </main>
  )
}