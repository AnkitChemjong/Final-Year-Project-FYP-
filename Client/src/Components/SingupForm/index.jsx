import React,{useState,useEffect,useContext} from 'react';
import { registerForm } from '@/Utils';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TfiGithub } from "react-icons/tfi";
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Link } from 'react-router-dom';
import signupValidation from '@/FormValidation';
import { initialSignData } from '@/Utils';
import { handleGoogle } from '../ThirdAuth';
import { handleGithub } from '../ThirdAuth';
import { handleFacebook } from '../ThirdAuth';
import { UseContextApi } from '../ContextApi';
import { FiLoader } from "react-icons/fi";

export default function SignupForm({func}) {
const {loadingSpin}=useContext(UseContextApi);
const [error, setError] = useState({});
const [data,setData]=useState(initialSignData);
const handleChange=(e)=>{
    const {name,value}=e.target;
    setData((prev)=>({...prev,[name]:value}))
}

const onFormSubmit=(e)=>{
  
  e.preventDefault();
  const errors=signupValidation(data);
  setError(errors);
  if(errors.email === '' &&
    errors.userName === '' &&
    errors.password === '' &&
    errors.confirmPassword === ''){
    func(data);
  }
}


  return (
    <main className='w-[100vw] flex justify-center items-center gap-20'>
        <img src="images/signup.png" alt="photo for register" className='w-[500px] h-[500px] relative bottom-00'/>
      <div className='flex flex-col gap-6 justify-center items-center relative bottom-10'>
           <FaFacebook onClick={handleFacebook} className='cursor-pointer' size={30}/>
           <FcGoogle onClick={handleGoogle} className='cursor-pointer' size={30}/>
           <TfiGithub onClick={handleGithub} className='cursor-pointer' size={30}/>
      </div>
      <div className='flex flex-col gap-5 justify-center items-center '>
        <h1 className='font-bold text-3xl relative bottom-10'>Create New Account</h1>
        <form onSubmit={onFormSubmit} className='flex flex-col justify-center items-center gap-3'>
        <div className='flex flex-col gap-2 relative bottom-10'>
        {
            registerForm.map((item,index)=>{
                return (
                    <div key={index} className='flex flex-col gap-2'>
                     <Label>{item?.Label}:</Label>
                     <Input onChange={handleChange} name={item?.name} placeholder={item?.placeholder} className="rounded-full"/>
                     {error[item?.name]? <span className="text-xs text-red-700">{error[item?.name]}</span>:null}
                    </div>
                )
            })
        }
        </div>
         <Button disabled={loadingSpin} type="submit" className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700 relative bottom-10">{loadingSpin && <FiLoader className='w-6 h-6 animate-spin'/>}Register</Button>
        </form>
         <div className='flex flex-row items-center justify-center gap-5 relative bottom-10'>
          <div className='h-1 w-24 bg-black'></div>
          <p>or</p>
          <div className='h-1 w-24 bg-black'></div>
         </div>
         <div className='flex flex-row items-center justify-center relative bottom-10'>
            <Link to="/signin" className='text-green-600 hover:text-blue-700'>Already have account?</Link>
            
         </div>
      </div>
    </main>
  )
}
