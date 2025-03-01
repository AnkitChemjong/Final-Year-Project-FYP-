import React from 'react';
import CommonButton from '../CommonButton';
import { Table, TableCaption, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { formatForAllCourses } from '@/Utils';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';


export default function Courses() {

    const navigate=useNavigate();
    const handleNavigation=()=>{
        navigate("/createnewcourse");
    }
  return (
    <div className='flex flex-col h-screen w-screen'>
      <div className='relative md:left-10 md:top-5'>
        <p className='text-2xl font-bold'>All Courses</p>
      </div>

      <div className='w-full flex flex-row justify-evenly items-center relative md:right-44 md:mt-10'>
        <p className='text-2xl font-bold'>Total course Count={formatForAllCourses?.length || 0}</p>
        <CommonButton func={handleNavigation} text="Upload Course" />
      </div>

      <div className='flex justify-center items-center w-4/6 relative md:left-16 top-5'>
        <Table>
          <TableCaption className="caption-top">List of all courses</TableCaption>
          <TableHeader className="bg-gray-200 rounded-t-lg">
            <TableRow>
               { formatForAllCourses?.map((item, index) => (
                  <TableHead key={index} className="w-[100px] text-black first:rounded-tl-lg last:rounded-tr-lg">
                    {item}
                  </TableHead>
                ))
            }
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead colSpan={formatForAllCourses?.length || 1} className="text-center">
                No Data Available
              </TableHead>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
