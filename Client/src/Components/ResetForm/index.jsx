import React,{useState} from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { codeValidation } from '@/FormValidation';
import { passwordValidation } from '@/FormValidation';
import CommonButton from '../CommonButton';

export default function ResetForm({type,value,func}) {
    const [error, setError] = useState({});
      const [data,setData]=useState({
        code:"",
        password:"",
        confirmPassword:""
      });
      const handleChange = (e) => {
        const {name,value}=e.target;
        setData((prev)=>({...prev,[name]:value}));
      };
      const handleSubmit=(e)=>{
        if(type==="code"){
            const errors=codeValidation(data);
            setError(errors);
            if(!errors?.code){
             func({code:data?.code})
            }}
            if(type==="password"){
                const errors=passwordValidation(data);
                setError(errors);
                if(errors?.password === ""
                      && errors?.confirmPassword===""
                ){
                    func({password:data?.password});
                   }}
            }

  return (
        <div className='flex flex-col gap-5 justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  md:p-5 '>
          <img src="" alt="" />
          <div className='flex flex-col gap-2'>
            {value?.map((item,index)=>{
                return(
                    <div className='flex flex-col gap-2 justify-center items-center'>
                   <div key={index} className='flex flex-row relative justify-center items-center gap-2'>
                        <Label >{item?.label}:</Label>
                        <Input type="password" onChange={handleChange} name={item?.name} placeholder={item?.placeHolder} className="rounded-full"/>
                    </div>
                        {error[item?.name]? <span className="text-xs text-red-700">{error[item?.name]}</span>:null}
                    </div>
                )

    })}
           <CommonButton func={handleSubmit} text="Submit"/>
          </div>
        </div>
    
  )
}
