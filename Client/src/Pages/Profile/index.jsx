import React from 'react';
import Navbar from '@/Components/Navbar';
import { useSelector,useDispatch } from 'react-redux';
import { FcGoogle } from "react-icons/fc";
import { FiPhoneCall } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";
import { GrCircleInformation } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import { BsGenderAmbiguous } from "react-icons/bs";
import { Button } from '@/Components/ui/button';


export default function Profile() {
   const user=useSelector(state=>state?.user?.data);
   const details=[
    {
      icon:FcGoogle,
      text:user?.email||"null",
      size:20
    },
    {
      icon:FiPhoneCall,
      text:user?.phone||"null",
      size:20
    },
    {
      icon:LuMapPin,
      text:user?.address||"null",
      size:20
    },
   ]
   const moreDetails=[
    {
      icon:BsGenderAmbiguous,
      text:user?.gender||"null",
      size:20
    },
    {
      icon:CiCalendarDate,
      text:user?.DOB||"null",
      size:20
    },
   ]

  return (
    <div>
      <Navbar/>
      <div className='w-[100vw] flex flex-col justify-center items-center pb-4' >
      <div className='w-full flex flex-row justify-between items-center'>
          <div className='w-1/2 h-64 border-b-2 border-black flex flex-col gap-10 justify-center items-center'>
              <div className='flex flex-row justify-between items-center gap-40'>
                <div className=''>
                {user && (user?.userImage? <div className='flex justify-center items-center'>
        <img src={`${user?.userImage}`||`${import.meta.env.VITE_BACKEND_URL}/${user?.userImage}`} alt="" className='w-24 h-24 rounded-full' />
        </div>:(
            <div id="user-menu-button" className=' bg-slate-400 flex justify-center items-center px-5 py-3 rounded-full'>{logedUser?.userName?.split("")[0].toUpperCase()}</div>
        ))}
                </div>
                <div className='flex flex-col justify-center items-center gap-2'>
                   <h1 className='text-3xl font-bold'>{user?.userName}</h1>
                  <div>
                    {
                      user?.userRole?.map((item,index)=>{
                        return(
                          <div key={index} className='w-20 h-10 flex justify-center items-center px-2 bg-green-600 rounded-2xl'>
                             <p className='text-white'>
                             {item}
                              </p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-center items-center md:gap-28'>
                  {
                    user?.userRole?.includes("teacher")?
                    <Button className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">Upload Course</Button>:
                  <Button className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">Become Teacher</Button>
                  }
                  <div className='flex flex-row justify-between items-center gap-16'>
                 {
                       details?.map((item,index)=>{
                        return(
                          <div key={index} className='flex flex-col justify-center items-center gap-2'>
                              <item.icon className='cursor-pointer' size={item?.size}/>
                              <p>{item?.text}</p>
                          </div>
                        )
                       })
                       
                 }
                  </div>
              </div>
          </div>
          <div className='w-1/2 h-64 border-l-2 border-b-2 border-black flex flex-col justify-center items-center gap-5'>
                <div className='flex flex-row md:gap-5 justify-center items-center border-b-2 border-black'>
                  <GrCircleInformation size={30}/>
                  <h1 className='text-3xl font-bold'>More Info</h1>
                </div>
                <div className='flex flex-col justify-between items-center gap-2'>
                 {
                       moreDetails?.map((item,index)=>{
                        return(
                          <div key={index} className='flex flex-row justify-center items-center gap-2'>
                              <item.icon className='cursor-pointer' size={item?.size}/>
                              <p>{item?.text}</p>
                          </div>
                        )
                       })
                       
                 }
                  </div>
                  <div className='w-full flex flex-row justify-center items-center md:gap-80'>
                  <Button className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">Update Info</Button>
                  {
                    user?.userRole?.includes("teacher") &&
                  <Button className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">My CV</Button>
                  }
                  </div>
          </div>
         </div>
         <div className='w-full flex flex-row justify-between items-center'>
          <div className='w-1/2 h-64 flex flex-col justify-center items-center'>
          <h1 className='text-3xl font-bold'>Purchased Course</h1>
          <div className='flex flex-col justify-center items-center mt-10'>
                   <p>Empty</p>
          </div>
          </div>
          <div className='w-1/2 h-64 border-l-2 border-black flex flex-col justify-center items-center'>
          <h1 className='text-3xl font-bold'>My Courses</h1>
          <div className='flex flex-col justify-center items-center mt-10'>
                   {user?.userRole?.includes("teacher")? <p>Empty</p>:<p>Become Teacher to Upload Course.</p>}
          </div>
          </div>
         </div>
        
      </div>
    </div>
  )
}
