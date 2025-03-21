import React from 'react';
import TeacherNavbar from '@/Components/TeacherNavbar';

export default function TeacherApplication() {
  return (
    <div className='flex flex-row gap-2 overflow-hidden'>
      <TeacherNavbar />
      <div className='flex-1'>
       Diahboard
      </div>
    </div>
  );
}