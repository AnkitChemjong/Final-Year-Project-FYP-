import React, { useContext, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import { Button } from '@/Components/ui/button';
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { UseContextApi } from '@/Components/ContextApi';
import { axiosService } from '@/Services';
import { Get_Course_Progress } from '@/Routes';
import { useSelector } from 'react-redux';

export default function CourseProgress() {
    const navigate=useNavigate();
    const userStates = useSelector(state => state?.user);
        const { data: user, loading } = userStates; 
    const {courseProgress,setCourseProgress}=useContext(UseContextApi);
     const {id}=useParams();

     useEffect(()=>{
        const getCourseProgress=async()=>{
            if(!loading && id){
                const response=await axiosService.get(`${Get_Course_Progress}/${user?._id}/${id}`);
                console.log(response);
            }
        }
        getCourseProgress();
     },[id]);

  return (
    <div>
      <Navbar/>
      <div className='flex flex-col h-screen '>
        <div className='flex items-center justify-between p-4 border-b border-black'>
             <div className='flex items-center space-x-4'>
                 <Button onClick={()=>navigate('/course')} className="bg-green-600 text-white px-5 py-2 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md " size="sm">
                    <FaChevronLeft className='h-4 w-4 mr-2'/>
                    Course
                    </Button> 
                    <h1></h1>
             </div>
        </div>
      </div>

    </div>
  )
}
