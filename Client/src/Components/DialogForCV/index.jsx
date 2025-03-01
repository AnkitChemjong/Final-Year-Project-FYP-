import React,{useState} from 'react';
import CommonButton from '../CommonButton';
import { DialogForm } from '../DialogForm';
import { User_Update_CV } from '@/Routes';
import { toast } from 'react-toastify';
import { getUser } from '@/Store/Slices/User_Slice';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { GoDownload } from "react-icons/go";
  import { handleDwn } from '@/Services';
  import { becomeTeacherForm,becomeTeacherInitialState } from '@/Utils';
import { useDispatch } from 'react-redux';
import { axiosService } from '@/Services';

export default function DialogForCV({dialog4,setDialog4,title,description,user}) {
    const dispatch=useDispatch();
    const [dialog,setDialog]=useState(false);
    const toggleDialog = () => {
        setDialog(!dialog);
      };

      const downloadFile = async (type,url) => {
        try {
            await handleDwn(type,url);
            setDialog4(false);
        } catch (error) {
            toast.error("Download failed", error);
            setDialog4(false);
        }
    };

    //update CV
      const handleEvent = async (data) => {
        try {
          const formData=new FormData();
          formData.append("cv",data.cv);    
          const response = await axiosService.patch(User_Update_CV, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
          console.log(response);
          if (response?.status === 200) {
            dispatch(getUser());
            setDialog(false);
            toast.success(response?.data?.message);
          } 
        } catch (error) {
           toast.error(error?.response?.data?.message);
        }
      };
  return (
    <Dialog open={dialog4} onOpenChange={(e)=>{
        setDialog4(e);
        }}>
       
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
        <div className='flex flex-row p-5 bg-red-300 rounded-2xl gap-5'>
          <div className="relative cursor-pointer before:content-['View_CV'] before:absolute before:-top-8 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">

             <p className='text-base cursor-pointer ' onClick={()=>downloadFile("view",user?.myCV)}>{user?.myCV?.split('/').pop()}</p>
          </div>
          <div className="relative cursor-pointer before:content-['Download_CV'] before:absolute before:-top-14 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">

             <GoDownload onClick={()=>downloadFile("download",user?.myCV)} className='cursor-pointer' size={30}/>
          </div>
        </div>
        </div>
        
        <DialogFooter>
          <CommonButton func={toggleDialog} text="Update CV"/>
          <DialogForm
                          title="Update CV"
                          description="Provide your valid CV in pdf format."
                          dialog={dialog}
                          setDialog={setDialog}
                          func={handleEvent}
                          type="updateCV"
                          accept="application/pdf"
                          componentInputs={becomeTeacherForm}
                          initialState={becomeTeacherInitialState}
                        />
        </DialogFooter>
      </DialogContent>
      
    </Dialog>
  )
}
