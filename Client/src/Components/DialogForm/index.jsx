import { useState } from "react";
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
import { changePasswordValidation,updateTeacherValidation, emailValidation,updateProfileInfoValidation,becomeTeacherValidation } from "@/FormValidation";



export default function DialogForm({title,description,dialog,setDialog,func,type,initialState,componentInputs,accept}) {
    const [error, setError] = useState({});
  const [data,setData]=useState(initialState);
  const handleSubmit=(e)=>{
    if(type==="email"){
      setError(emailValidation(data));
      if(!error.email){
        func(data);
      }
    }
    if(type==="updateProfile"){
     setError(updateProfileInfoValidation(data));
     if(error.userName===""&&
      error.address===""&&
      error.phone===""&&
      error.gender===""&&
      error.DOB===""
     ){
      func(data);
     }
    }
    if(type==="updatePassword"){
      setError(changePasswordValidation(data));
      if(error.currentPassword==="" && 
        error.newPassword==="" &&
        error.confirmPassword===""
      ){

        func(data);
      }
    }
    if(type==="becomeTeacher"){
      setError(becomeTeacherValidation(data));
      if(error.cv===""){
        func(data);
      }
    }
    if(type==="updateCV"){
      setError(becomeTeacherValidation(data));
      if(error.cv===""){
        func(data);
      }
    }
    if(type==="updateTeacherInfo"){
      setError(updateTeacherValidation(data));
      if(error.avilability === "" &&
        error.description === ""
      ){
        console.log("hello")
        func(data);
      }
    }
  }
  return (
    <Dialog open={dialog} onOpenChange={(e)=>{
        setDialog(e);
        setError({});
        setData(initialState)
        }}>

      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]"  showOverlay={false} >
       <ScrollArea className="h-[400px] md:max-h-[600px]  overflow-y-auto px-5">
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
