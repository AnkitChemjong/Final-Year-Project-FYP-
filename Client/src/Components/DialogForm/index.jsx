import { useContext, useState, useEffect } from "react";
import CommonButton from "../CommonButton";
import CommonRenderFormInput from "../CommonRenderFormInput";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { changePasswordValidation,updateTeacherValidation, emailValidation,updateProfileInfoValidation,becomeTeacherValidation, hireTeacherValidation } from "@/FormValidation";
import { UseContextApi } from "../ContextApi";
import { hireTeacherInitialState } from "@/Utils";






export default function DialogForm({title,description,dialog,setDialog,func,type,initialState,componentInputs,accept}) {
  const {hireTeacherApplicationEditId,setHireTeacherApplicationEditId,hireTeacherInitialStateData,setHireTeacherInitialStateData}=useContext(UseContextApi);
    const [error, setError] = useState({});
  const [data,setData]=useState(initialState);
  useEffect(() => {
    if (dialog && hireTeacherApplicationEditId) {
      setData({
        hiringDate: hireTeacherInitialStateData?.hiringDate || '',
        startTime: hireTeacherInitialStateData?.startTime || '',
        endTime: hireTeacherInitialStateData?.endTime || '',
        hireDescription: hireTeacherInitialStateData?.hireDescription || '',
        ...hireTeacherInitialStateData
      });
    }else{setData(initialState);}
  }, [dialog, hireTeacherApplicationEditId, hireTeacherInitialStateData]);

  const handleSubmit=(e)=>{
    if(type === "hireteacher"){
     const errors=hireTeacherValidation(data);
      setError(errors);
      if(errors.hiringDate === ""
        && errors.startTime === ""
        && errors.endTime === ""
      ){
        func(data)
      }
    }
    if(type==="email"){
      const errors=emailValidation(data);
      setError(errors);
      if(!errors.email){
        func(data);
      }
    }
    if(type==="updateProfile"){
      const errors=updateProfileInfoValidation(data);
      console.log(data);
     setError(errors);
     if(errors.userName===""&&
      errors.address===""&&
      errors.phone===""&&
      errors.gender===""&&
      errors.DOB===""
     ){
      func(data);
     }
    }
    if(type==="updatePassword"){
      const errors=changePasswordValidation(data);
      setError(errors);
      if(errors.currentPassword==="" && 
        errors.newPassword==="" &&
        errors.confirmPassword===""
      ){

        func(data);
      }
    }
    if(type==="becomeTeacher"){
      const errors=becomeTeacherValidation(data)
      setError(errors);
      if(errors.cv===""){
        func(data);
      }
    }
    if(type==="updateCV"){
      const errors=becomeTeacherValidation(data)
      setError(errors);
      if(errors.cv===""){
        func(data);
      }
    }
    if(type==="updateTeacherInfo"){
      const errors=updateTeacherValidation(data)
      setError(errors);
      if(errors.avilability === "" &&
        errors.description === "" &&
        errors.feePerHour === ""
      ){
        func(data);
      }
    }
  }
  const handleOpenChange = (open) => {
    if (!open) {
    
      setDialog(false);
      setData(initialState);
      setError({});
      setHireTeacherInitialStateData(hireTeacherInitialState);
      setHireTeacherApplicationEditId(null);
    } else {
      setDialog(true);
    }
  };
  
  return (
    <Dialog open={dialog} onOpenChange={handleOpenChange}>

      <DialogContent className="w-full max-w-[500px] mx-auto"  showOverlay={false} >
       <ScrollArea className="max-h-[80vh]  overflow-y-auto px-5">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
        {
          componentInputs?.map((item,index)=>{
            return (
              <CommonRenderFormInput key={index} accept={accept} getCurrentControl={item} data={data} setData={setData} error={error}/>
            )
          })
        }
        </div>
        
        <DialogFooter>
          <CommonButton func={handleSubmit} text="Send"/>
        </DialogFooter>
       </ScrollArea>
      </DialogContent>
      
    </Dialog>
  )
}
