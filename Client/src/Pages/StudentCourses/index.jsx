import React,{useEffect,useContext,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '@/Components/Navbar';
import { UseContextApi } from '@/Components/ContextApi';
import { axiosService } from '@/Services';
import { Get_Enrolled_Course } from '@/Routes';
import { Card,CardContent,CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { IoStopwatchOutline } from "react-icons/io5";
import Footer from '@/Components/Footer';
import SkeletonCard from '@/Components/SkeletonCard';
import PaymentMessageDialog from '@/Components/PaymentMessageDialog';
import LottieAnimation from '@/Components/LottieAnimation';
import successpayment from '@/assets/successpayment.json';
import { useSocket } from '@/Services/Socket-Client-Provider';
import { getAllPurchasedCourse } from '@/Store/Slices/Get_All_Purchased_Course_Model';

export default function StudentCourses() {
    const userStates = useSelector(state => state?.user);
    const { data: user, loading } = userStates; 
    const progressState=useSelector(state=>state?.progress);
      const {data:allProgress,loading3}=progressState;
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status=params.get('payment');
  const message=params.get('message');
  const amount=params.get('amount');
  const creatorId=params.get('creatorId');
  const courseTitle=params.get('courseTitle');
  const [paymentMessageDialog,setPaymentMessageDialog]=useState(false);
  const [paymentMessage,setPaymentMessage]=useState("");
  const [paymentAmount,setPaymentAmount]=useState("");
  const [tostShown,setTostShown]=useState(false);
  const [userProgress,setUserProgress]=useState([]);

  const {studentEnrolledCourses,setStudentEnrolledCourses,loadingStateCourse,setLoadingStateCourse}=useContext(UseContextApi);
  const {socket}=useSocket();
  
 useEffect(()=>{
  if(user&&allProgress){
    const userProgressData=allProgress?.filter(item=>item?.userId===user?._id);
    setUserProgress(userProgressData);
  }

 },[user,allProgress])
  useEffect(()=>{
      const getStudentEnrolledCourses=async()=>{
        try{
            if(!loading){
                const response=await axiosService.get(`${Get_Enrolled_Course}/${user?._id}`);
                //console.log(response.data.data);
                if(response.status === 200){
                    setStudentEnrolledCourses(response?.data?.data);
                    setLoadingStateCourse(false);
                }
            }
        } 
        catch(error){
            console.log(error);
        }
        finally{
          setLoadingStateCourse(false);
        }
      }
      if(studentEnrolledCourses.length<=0){
          getStudentEnrolledCourses();
    }
  },[loading]); 

  useEffect(() => {
    if (status && status === 'success') {
      socket?.emit('course-bought-teacher',{userId:creatorId,title:"Course Purchase",message:`${user?.userName} bought your course.`,type:'course',courseTitle:courseTitle});
      socket?.emit('course-bought-student',{userId:user?._id,title:"Course Purchase complete",message:`Your course purchase is completed.`,type:'course',courseTitle:courseTitle});
      setPaymentMessage(message);
      setPaymentAmount(amount);
      setPaymentMessageDialog(true);
      dispatch(getAllPurchasedCourse());
      if(!tostShown){
        toast.success(message);
        setTostShown(true);
      }
    }
  }, [status,socket]);
  return (
    <div>
        <Navbar />
      <div className='p-4'>
        <h1 className='text-center text-3xl font-bold mb-8 font-heading'>My Enrolled Courses</h1>
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
                                     <p className='text-sm text-gray-700 mb-2'>Status: {userProgress?.find(itemData=>itemData?.userId===user?._id&&itemData?.courseId===course?.courseId)?.completed? "Completed":"Learning"}</p>
                               </CardContent>
                               <CardFooter>
                                 <Button onClick={()=>navigate(`/courseProgress/${course?.courseId}`)} className="flex-1 bg-green-600 text-white hover:bg-blue-700 font-playfair">
                                     <IoStopwatchOutline className='mr-2 h-4 w-4'/>
                                     {userProgress?.find(item=>item?.courseId===course?.courseId)?  (userProgress?.find(itemData=>itemData?.userId===user?._id&&itemData?.courseId===course?.courseId)?.completed? "Completed":"Continue Learning"):"Start Learning"}
                                 </Button>
                               </CardFooter>
                           </Card>
                        )
                    })
                ):(loadingStateCourse? 
                    <SkeletonCard/>:<h1 className='text-3xl font-bold'>No Enrolled Courses.</h1>)
            }

        </div>

      </div>
      <PaymentMessageDialog
      paymentMessageDialog={paymentMessageDialog}
      setPaymentMessageDialog={setPaymentMessageDialog}
      message={paymentMessage}
      icon={<LottieAnimation animationData={successpayment} width={150} height={150} speed={1} />}
      amount={paymentAmount}
      />
      <Footer/>
    </div>
  )
}
