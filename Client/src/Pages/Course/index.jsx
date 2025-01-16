import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Components/Navbar';

export default function Course() {
    const navigate=useNavigate();
    const user=useSelector((state)=>state?.user?.data)

  return (
    <div>
      <Navbar/>
  
    </div>
  )
}
