import React from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import Applications from '@/Components/Applications';

export default function AdminApplicatin() {
  return (
    <div className='flex flex-row gap-2 overflow-hidden bg-gray-50'>
          <AdminNavbar/>
          <div className='flex-1'>
          <Applications/>
          </div>
        </div>
  )
}
