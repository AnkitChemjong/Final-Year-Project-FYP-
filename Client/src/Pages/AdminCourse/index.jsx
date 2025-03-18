import React from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import Courses from '@/Components/Courses';

export default function AdminCourse() {
  return (
    <div className='flex flex-row gap-2 overflow-hidden'>
      <AdminNavbar/>
      <div className='flex-1'>
      <Courses/>
      </div>
    </div>
  )
}
