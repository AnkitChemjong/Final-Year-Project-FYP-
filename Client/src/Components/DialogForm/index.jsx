import { useState } from "react";
import CommonButton from "../CommonButton";
import CommonRenderFormInput from "../CommonRenderFormInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { emailValidation,updateProfileInfoValidation } from "@/FormValidation";



export function DialogForm({title,description,dialog,setDialog,func,type,initialState,componentInputs}) {
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
  }
  return (
    <Dialog open={dialog} onOpenChange={(e)=>{
        setDialog(e);
        setError({});
        setData(initialState)
        }}>
       
      <DialogContent className="sm:max-w-[425px]">
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
              <CommonRenderFormInput getCurrentControl={item} data={data} setData={setData} error={error}/>
            )
          })
        }
        </div>
        
        <DialogFooter>
          <CommonButton func={handleSubmit} text="Send"/>
        </DialogFooter>
      </DialogContent>
      
    </Dialog>
  )
}
