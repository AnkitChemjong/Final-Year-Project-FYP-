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
import CommonRenderFormInput from '../CommonRenderFormInput';

export default function SignupForm({func}) {
  const {loadingSpin}=useContext(UseContextApi);
  const [error, setError] = useState({});
  const [data,setData]=useState(initialSignData);
  

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
    <main className='w-full min-h-screen flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-10 xl:gap-20 p-4'>
   
      <div className='hidden lg:block'>
        <img 
          src="images/signup.png" 
          alt="photo for register" 
          className='w-[300px] lg:w-[400px] xl:w-[500px] h-auto'
        />
      </div>
      
      
      <div className='flex lg:flex-col gap-4 sm:gap-6 justify-center items-center order-first lg:order-none mb-4 lg:mb-0'>
        <FaFacebook 
          onClick={handleFacebook} 
          className='cursor-pointer text-blue-600 hover:scale-105 transition-all ease-in-out' 
          size={24}
        />
        <FcGoogle 
          onClick={handleGoogle} 
          className='cursor-pointer hover:scale-105 transition-all ease-in-out' 
          size={24}
        />
        <TfiGithub 
          onClick={handleGithub} 
          className='cursor-pointer hover:scale-105 transition-all ease-in-out' 
          size={24}
        />
      </div>
      <div className='w-full max-w-md flex flex-col gap-4 sm:gap-5 justify-center items-center'>
        <h1 className='font-bold text-2xl sm:text-3xl mb-2 sm:mb-4'>Create New Account</h1>
        
        <form onSubmit={onFormSubmit} className='w-full flex flex-col justify-center items-center gap-3 sm:gap-4'>
          <div className='w-full flex flex-col gap-2 sm:gap-3'>
            {registerForm.map((item,index)=>{
              return (
                <CommonRenderFormInput key={index} getCurrentControl={item} data={data} setData={setData} error={error}/>
              )
            })}
          </div>
          
          <Button 
            disabled={loadingSpin} 
            type="submit" 
            className="w-full bg-green-600 text-white px-5 py-3 hover:bg-blue-700 font-playfair"
          >
            {loadingSpin && <FiLoader className='w-6 h-6 animate-spin mr-2'/>}
            Register
          </Button>
        </form>
        <div className='w-full flex flex-row items-center justify-center gap-2 sm:gap-4 my-2'>
          <div className='h-px flex-1 bg-gray-300'></div>
          <p className='text-sm sm:text-base px-2'>or</p>
          <div className='h-px flex-1 bg-gray-300'></div>
        </div>
        
        <div className='w-full flex flex-row items-center justify-center'>
          <Link 
            to="/signin" 
            className='text-green-600 hover:text-blue-700 text-sm sm:text-base'
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </main>
  )
}