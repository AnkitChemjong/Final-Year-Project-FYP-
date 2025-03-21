import React from "react";
import AdminNavbar from "@/Components/AdminNavbar";


export default function AdminDashboard() {
  return (
  <div className='flex flex-row gap-2 overflow-hidden'>
        <AdminNavbar/>
        <div className='flex-1'>
           Dashboard
        </div>
      </div>
  )
}
