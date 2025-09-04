import React,{useState} from 'react';
import CommonButton from '../CommonButton';
import  DialogForm  from '../DialogForm';
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
  } from "@/Components/ui/dialog";
  import { GoDownload } from "react-icons/go";
  import { handleDwn } from '@/Services';
  import { becomeTeacherForm,becomeTeacherInitialState } from '@/Utils';
import { useDispatch } from 'react-redux';
import { axiosService } from '@/Services';
import { FaFileAlt } from 'react-icons/fa';

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
    <Dialog open={dialog4} onOpenChange={(e) => setDialog4(e)}>
  <DialogContent className="sm:max-w-[425px]"  showOverlay={false}>
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-gray-900">{title}</DialogTitle>
      <DialogDescription className="text-gray-600">
        {description}
      </DialogDescription>
    </DialogHeader>

    <div className="flex flex-col gap-4">
      <div className="flex flex-row p-4 bg-red-100 rounded-xl gap-4 items-center shadow-sm hover:shadow-md transition-shadow duration-300">
 
        <div className="relative cursor-pointer group">
          <div className="flex items-center gap-2">
            <FaFileAlt className="w-6 h-6 text-red-600" />
            <p
              className="text-base text-gray-700 hover:text-red-600 transition-colors duration-300"
              onClick={() => downloadFile("view", user?.myCV)}
            >
              {user?.myCV?.split('/').pop()}
            </p>
          </div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-white text-sm bg-slate-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            View CV
          </div>
        </div>

 
        <div className="relative cursor-pointer group">
          <GoDownload
            onClick={() => downloadFile("download", user?.myCV)}
            className="text-red-600 hover:text-red-700 transition-colors duration-300"
            size={24}
          />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-white text-sm bg-slate-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Download CV
          </div>
        </div>
      </div>
    </div>

   
    <DialogFooter className="mt-4">
      <CommonButton
        func={toggleDialog}
        text="Update CV"
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
      />
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
