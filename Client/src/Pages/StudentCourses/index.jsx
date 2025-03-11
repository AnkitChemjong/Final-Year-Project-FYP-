import React,{useEffect,useContext} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonSkeleton from '@/Components/CommonSkeleton';
import Navbar from '@/Components/Navbar';
import { UseContextApi } from '@/Components/ContextApi';
import { axiosService } from '@/Services';
import { Get_Enrolled_Course } from '@/Routes';
import { Card,CardContent,CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { IoStopwatchOutline } from "react-icons/io5";
import { Skeleton } from '@/Components/ui/skeleton';


export default function StudentCourses() {
    const userStates = useSelector(state => state?.user);
    const { data: user, loading } = userStates; 
    const navigate=useNavigate();
    const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status=params.get('payment');
  const message=params.get('message');

  const {studentEnrolledCourses,setStudentEnrolledCourses,loadingStateCourse,setLoadingStateCourse}=useContext(UseContextApi);
  

  useEffect(()=>{
      const getStudentEnrolledCourses=async()=>{
        try{
            if(!loading){
                const response=await axiosService.get(`${Get_Enrolled_Course}/${user?._id}`);
                console.log(response.data.data);
                if(response.status === 200){
                    setStudentEnrolledCourses(response?.data?.data);
                    setLoadingStateCourse(false);
                }
            }
        } 
        catch(error){
            console.log(error);
        }
      }
      if(studentEnrolledCourses.length<=0){
          getStudentEnrolledCourses();
    }
  },[]); 
  useEffect(() => {
    if (status && status === 'success' ) {
      toast.success(message);
      navigate(location.pathname,{ replace: true })
    }
  }, [status]);
  return (
    <div>
        <Navbar />
      <div className='p-4'>
        <h1 className='text-center text-3xl font-bold mb-8'>My Enrolled Courses</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 md:px-5 lg:grid-cols-4 lg:px-10 gap-5'>
            {
                studentEnrolledCourses && studentEnrolledCourses.length > 0? 
                (
                    studentEnrolledCourses.map((course,index)=>{
                        return(
                           <Card key={index} className="flex flex-col cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md">
                               <CardContent className="p-4 flex-grow">
                                     <img src={course?.courseImage} alt={course?.title} 
                                      className='h-52 w-full object-cover rounded-md mb-4'
                                     />
                                     <h3 className='font-bold mb-1'>{course?.title}</h3>
                                     <p className='text-sm text-gray-700 mb-2'>{course?.instructorName}</p>
                               </CardContent>
                               <CardFooter>
                                 <Button onClick={()=>navigate(`/courseProgress/${course?.courseId}`)} className="flex-1 bg-green-600 text-white hover:bg-blue-700">
                                     <IoStopwatchOutline className='mr-2 h-4 w-4'/>
                                     Start Learning
                                 </Button>
                               </CardFooter>
                           </Card>
                        )
                    })
                ):(loadingStateCourse? 
                    <Skeleton className=" bg-black flex justify-center items-center"/>:<h1 className='text-3xl font-bold'>No Enrolled Courses.</h1>)
            }

        </div>

      </div>
    </div>
  )
}
