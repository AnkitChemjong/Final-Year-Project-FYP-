import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Teacher() {
    const navigate=useNavigate();
    const user=useSelector((state)=>state?.user?.data)
   useEffect(()=>{
     if(!user){
        navigate('/')
     }
   },[])

  return (
    <div>
      
    </div>
  )
}
