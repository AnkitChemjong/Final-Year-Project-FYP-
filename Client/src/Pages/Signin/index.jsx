import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TfiGithub } from "react-icons/tfi";
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { loginForm } from '@/Utils';
import { Link } from 'react-router-dom';

export default function Signin() {
  return (
    <main className='w-[100vw] h-[100vh] flex justify-center items-center gap-20'>
          <div>
            <img src="images/login.png" alt="photo for register" className='w-[500px] h-[500px]'/>
          </div>
          <div className='flex flex-col gap-6 justify-center items-center'>
               <FaFacebook className='cursor-pointer' size={30}/>
               <FcGoogle className='cursor-pointer' size={30}/>
               <TfiGithub className='cursor-pointer' size={30}/>
          </div>
          <div className='flex flex-col gap-5 justify-center items-center'>
            
                <h1  className='font-bold text-3xl relative bottom-20'>Welcome Back</h1>
               
            <div className='flex flex-col gap-2 relative bottom-16'>
            {
                loginForm.map((item,index)=>{
                    return (
                        <div key={index} className='flex flex-col gap-2'>
                         <Label>{item?.Label}:</Label>
                         <Input name={item?.name} placeholder={item?.placeholder} className="rounded-full"/>
                        </div>
                    )
                })
            }
            
            </div>
            <Link to="signup" className='text-green-600 relative bottom-16'>Forget Password?</Link>
             <Button className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700 relative bottom-16">Login</Button>
             <div className='flex flex-row items-center justify-center gap-5 relative bottom-16'>
              <div className='h-1 w-24 bg-black'></div>
              <p>or</p>
              <div className='h-1 w-24 bg-black'></div>
             </div>
             <div className='flex flex-row items-center justify-center relative bottom-16'>
                <Link to="signup" className='text-green-600'>Create New Account?</Link>
             </div>
          </div>
        </main>
      )
}
