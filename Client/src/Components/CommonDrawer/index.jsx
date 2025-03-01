import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
  } from "../ui/drawer";
import CommonButton from '../CommonButton';
import { GiCrossMark } from "react-icons/gi";
import { Avatar,AvatarImage,AvatarFallback } from '@radix-ui/react-avatar';
import { Update_Application } from '@/Routes';
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getApplication } from '@/Store/Slices/ApplicationSlice';
import { GoDownload } from "react-icons/go";
import { handleDwn } from '@/Services';


export default function CommonDrawer({handleDrawer,setHandleDrawer,data}) {
    const dispatch=useDispatch();

    const closeDrawer=()=>{
        setHandleDrawer(false);
    }
    const handleApplicationStatus=async (status,applicationData)=>{
        try{
             const response=await axiosService.patch(Update_Application,{application:applicationData,status},{withCredentials:true, headers: {
                "Content-Type": "application/json",
              }});
              if(response.status===200){
                setHandleDrawer(false);
                 dispatch(getApplication());
                toast.success(response?.data?.message);
              }
        }
        catch(error){
           toast.error(error?.response?.data?.message);
        }

    }
    const downloadFile = async (type,url) => {
        try {
            await handleDwn(type,url);
            setHandleDrawer(false) 
        } catch (error) {
            toast.error("Download failed", error);
            setHandleDrawer(false) 
        }
    };
  return (
    <div>
      <Drawer open={handleDrawer} onOpenChange={(value)=>{
        setHandleDrawer(value)
      }}>
  <DrawerContent>
    <DrawerHeader className="flex flex-row justify-between">
        <div className='flex flex-col gap-1'>
      <DrawerTitle>Application Details.</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </div>
      <div>
      <GiCrossMark onClick={closeDrawer} className='cursor-pointer' size={30}/>
      </div>
    </DrawerHeader>
    <div className='flex flex-row justify-evenly items-center md:mt-10'>
        <div className='flex flex-row justify-center items-center gap-2'>

            <Avatar className="h-14 w-14 md:w-14 md:h-14 rounded-full cursor-pointer flex justify-center items-center ">
                                  <AvatarImage
                                    src={
                                      data?.user?.userImage.startsWith("http")
                                        ? data?.user?.userImage
                                        : `${import.meta.env.VITE_BACKEND_URL}/${
                                            data?.user?.userImage
                                          }`
                                    }
                                    alt="profileimage"
                                    className='rounded-full'
                                  />
                                  <AvatarFallback>{data?.user?.userName?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                            <p className='text-lg '>{data?.user?.userName}</p>
        </div>
        <div className='flex flex-row p-5 bg-red-300 rounded-2xl gap-5'>
          <div className="relative cursor-pointer before:content-['View_CV'] before:absolute before:-top-8 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">

             <p className='text-base cursor-pointer ' onClick={()=>downloadFile("view",data?.userCV)}>{data?.userCV?.split('/').pop()}</p>
          </div>
          <div className="relative cursor-pointer before:content-['Download_CV'] before:absolute before:-top-14 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">

             <GoDownload onClick={()=>downloadFile("download",data?.userCV)} className='cursor-pointer' size={30}/>
          </div>
        </div>
       
       <div className='flex flex-row gap-5'>

        <div className='flex flex-col gap-5'>
            <CommonButton disable={data?.status==='rejected'||data?.status==='approved' || data?.status==='recruted'} func={()=>handleApplicationStatus("approve",data)} text="Approve"/>
            <CommonButton disable={data?.status ==='rejected' || data?.status==='recruted'} func={()=>handleApplicationStatus("reject",data)} text="Reject"/>
        </div>
              {
                data?.status==='approved' && 
                <CommonButton func={()=>handleApplicationStatus("recrute",data)} text="Recrute"/>
              }
       </div>
        
    </div>
    
    <DrawerFooter className="flex justify-center items-center">
      <p className='text-stone-600 text-sm'>Examine the CV, Envision the Future—Choose the Right Educator!</p>
  </DrawerFooter>
  </DrawerContent>
</Drawer>

    </div>
  )
}
