import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommonButton from "../CommonButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailValidation } from "@/FormValidation";



export function DialogForm({dialog,setDialog,func}) {
    const [error, setError] = useState({});
  const [email,setEmail]=useState("");
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit=(e)=>{
    setError(emailValidation(email));
    if(!error.email){
      func({email:email});
    }}
  return (
    <Dialog open={dialog} onOpenChange={(e)=>{
        setDialog(e);
        setError({});
        }}>
       
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Enter your registered email here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid py-4 gap-2 text-center">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input onChange={handleChange} id="email" name="email" type="email" className="col-span-3" />
          </div>
            {error.email? <span className="text-xs text-red-700">{error.email}</span>:null}
        </div>
        <DialogFooter>
          <CommonButton func={handleSubmit} text="Send"/>
        </DialogFooter>
      </DialogContent>
      
    </Dialog>
  )
}
