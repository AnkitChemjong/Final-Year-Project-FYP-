import React from 'react';
import TeacherNavbar from '@/Components/TeacherNavbar';
import { useNavigate } from 'react-router-dom';
import CommonButton from '@/Components/CommonButton';

export default function TeacherApplication() {
  const navigate=useNavigate();
  return (
    <div className='flex flex-row gap-2 overflow-hidden'>
      <TeacherNavbar />
      <div className='flex-1'>
       <CommonButton func={()=>navigate('/teacher/subscription')} text="take subscription" />
      </div>
    </div>
  );
}