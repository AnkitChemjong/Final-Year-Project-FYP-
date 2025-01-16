import React,{useState} from 'react';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TfiGithub } from "react-icons/tfi";
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { loginForm } from '@/Utils';
import { Link } from 'react-router-dom';
import { signinValidation } from '@/FormValidation';
import { initialLogData } from '@/Utils';
import { handleGoogle } from '../ThirdAuth';
import { handleGithub } from '../ThirdAuth';
import { handleFacebook } from '../ThirdAuth';
import { DialogForm } from '../DialogForm';
import { axiosService } from "@/Services";
import { User_Token_Gen_Route } from '@/Routes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SigninForm({func}) {
  const navigate=useNavigate();
  const [dialog,setDialog]=useState(false);
  const toggleDialog=()=>{
    setDialog(!dialog)
  }
  const [error, setError] = useState({});
  const [data,setData]=useState(initialLogData);
  const handleChange=(e)=>{
      const {name,value}=e.target;
      setData((prev)=>({...prev,[name]:value}))
  }
  const onFormSubmit=(e)=>{
    e.preventDefault();
    setError(signinValidation(data));
    if(error.email === '' &&
      error.password === '' &&
      error.confirmPassword === ''){
      func(data);
    }}
    const handleEvent=async (data)=>{
      try{
            const returnData=await axiosService.post(User_Token_Gen_Route,data,{withCredentials:true,headers:{"Content-Type":"application/json"}});
             if(returnData.status===200){
                toast.success(returnData?.data?.message)
                navigate('/resetcode',{state:returnData?.data?.email});
             }
             if(returnData.status===400){
              toast.error(returnData?.data?.message)
              window.location.reload();

           }
      }
      catch(error){
        console.log(error);
      }
    }
  return (
    <main className='w-[100vw] flex justify-center items-center gap-20'>
            <img src="images/login.png" alt="photo for register" className='w-[500px] h-[500px] relative bottom-10'/>
          <div className='flex flex-col gap-6 justify-center items-center relative bottom-10'>
               <FaFacebook onClick={handleFacebook} className='cursor-pointer' size={30}/>
               <FcGoogle onClick={handleGoogle} className='cursor-pointer' size={30}/>
               <TfiGithub onClick={handleGithub} className='cursor-pointer' size={30}/>
          </div>
          <div className='flex flex-col gap-5 justify-center items-center'>
            
                <h1  className='font-bold text-3xl relative bottom-10'>Welcome Back</h1>
              <form onSubmit={onFormSubmit} className='flex flex-col justify-center items-center gap-4'>

            <div className='flex flex-col gap-2 relative bottom-10'>
            {
                loginForm.map((item,index)=>{
                    return (
                        <div key={index} className='flex flex-col gap-2'>
                         <Label>{item?.Label}:</Label>
                         <Input name={item?.name} placeholder={item?.placeholder} onChange={handleChange} className="rounded-full"/>
                         {error[item?.name]? <span className="text-xs text-red-700">{error[item?.name]}</span>:null}
                        </div>
                    )
                })
            }
            
            </div>
            <Link onClick={toggleDialog} className='text-green-600 relative bottom-10 hover:text-blue-700'>Forget Password?</Link>
            <DialogForm dialog={dialog} setDialog={setDialog} func={handleEvent}/>
             <Button className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700 relative bottom-10">Login</Button>
              </form>
             <div className='flex flex-row items-center justify-center gap-5 relative bottom-10'>
              <div className='h-1 w-24 bg-black'></div>
              <p>or</p>
              <div className='h-1 w-24 bg-black'></div>
             </div>
             <div className='flex flex-row items-center justify-center relative bottom-10'>
                <Link to="/signup" className='text-green-600 hover:text-blue-700'>Create New Account?</Link>
             </div>
          </div>
        </main>
      )
}
