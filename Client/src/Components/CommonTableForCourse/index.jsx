import React, { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, } from '../ui/table';  
import moment from 'moment';
import { RiDeleteBin6Line } from "react-icons/ri";
import { } from '@/Routes';
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getCourse } from '@/Store/Slices/Course_Slice';
import { Delete_All_Course,Delete_Selected_Course,Delete_Single_Course } from '@/Routes';
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


export default function CommonTableForCourse({data,header,type}){
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [selectedCourse,setSelectedCourse]=useState([]);

  const deleteCourse=async ({data=null,type,status})=>{
    try{
      if(type === "all" ){
        if(selectedCourse.length<1){
          const response=await axiosService.delete(Delete_All_Course,{data:{status,data}},{withCredentials:true, headers: {
            "Content-Type": "application/json"
    }});
    if(response.status===200){
      dispatch(getCourse());
      toast.success(response?.data?.message);
    }
        }
        
        else{
              const response=await axiosService.delete(Delete_Selected_Course,{data:{data:selectedCourse}},{withCredentials:true,
                headers: {
                  "Content-Type": "application/json"
          }
              });
              if(response.status===200){
                setSelectedCourse([]);
                dispatch(getCourse());
                toast.success(response?.data?.message);
              }
    
          }
      }   
      else{
        const response=await axiosService.delete(Delete_Single_Course,{data:{data}},{withCredentials:true, headers: {
                "Content-Type": "application/json"
        }});
        if(response.status===200){
          dispatch(getCourse());
          toast.success(response?.data?.message);
        }
          
        }
      }
        catch(error){
      toast.error(error?.response?.data?.message);
    }
  }

  const handleAddCourse = (data, checked) => {
    if (checked) {
      setSelectedCourse((prev) => [...prev, data]); 
    } else {
      setSelectedCourse((prev) => prev.filter((app) => app !== data)); 
    }
  };

  const handleCourseEditId=(id)=>{
    navigate(`/edit_course/${id}`);
   }

  
  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <p className=" text-slate-500 text-sm">A list of {type} Courses.</p>
        {
            data && data.length >=1? 
            (
                <>
        <div className="flex flex-row justify-evenly items-center w-full">
          <div className='flex flex-row gap-2'>
          <p className="text-black">Total Courses =</p>
          <p className=" text-black">{data?.length}</p>
          </div>
          <div className="relative cursor-pointer before:content-['Delete-All'] before:absolute before:-top-14 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">
          <RiDeleteBin6Line onClick={()=>deleteCourse({type:"all",status:type,data})} className='cursor-pointer text-black' size={20}/>
          </div>
        </div>
            <Table >
           <TableHeader className="bg-gray-200 rounded-t-lg">
       <TableRow>
         {header && header.map((item, index) => (
           <TableHead 
             key={index} 
             className="w-[100px] text-black first:rounded-tl-lg last:rounded-tr-lg"
           >
             {item}
           </TableHead>
         ))}
       </TableRow>
     </TableHeader>
           
           <TableBody>
             {data.map((item,index) => (
               <TableRow key={index}>
                 <TableCell className="font-medium">
                   <Checkbox checked={selectedCourse.includes(item)} onCheckedChange={(checked)=>handleAddCourse(item,checked)}/>
                 </TableCell>
                 <TableCell>{data?.indexOf(item)+1}</TableCell>
                 <TableCell>{item?.title}</TableCell>
                 <TableCell>Rs. {item?.pricing}</TableCell>
                 <TableCell className="text-center">{item?.students.length}</TableCell>
                 <TableCell>{moment(item?.createdAt).format("MMMM DD, YYYY")}</TableCell>
                 <TableCell className="text-center">Rs.{item?.students.length*item?.pricing}</TableCell>
                 <TableCell className="text-right flex flex-row gap-5 justify-center items-center">
                   <FaRegEdit className='cursor-pointer' onClick={()=>handleCourseEditId(item?._id)} size={20}/>
                 <RiDeleteBin6Line onClick={()=>deleteCourse({data:item,type:"single"})} className='cursor-pointer' size={20}/>
                 </TableCell>
                 
               </TableRow>
             ))}
           </TableBody>
         </Table>
            </>
         )
         :
         (
            <p className=" text-slate-500 text-sm">No Courses Avilable.</p>
         )
        }

    </div>
  )
}
