import React,{useContext,useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UseContextApi } from '@/Components/ContextApi';
import SkeletonCard from '@/Components/SkeletonCard';
import { Get_Teacher_Detail,Get_Purchase_Detail, Hire_Teacher } from '@/Routes';
import { axiosService } from '@/Services';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import teacheranimation from '@/assets/teacheranimation.json';
import graduationcourse from "@/assets/graduationcourse.json";
import LottieAnimation from '@/Components/LottieAnimation';
import moment from 'moment';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { useSelector } from 'react-redux';
import { handleDwn } from '@/Services';
import { toast } from 'react-toastify';
import { FaStar} from "react-icons/fa";
import DialogForm from '@/Components/DialogForm';
import { hireTeacherComponents } from '@/Utils';
import verified from '@/assets/verified.json';
import { RateDialog } from '@/Components/RateDialog';
import CommonButton from '@/Components/CommonButton';
import renderStars from '@/Components/RenderStars';
import { Card } from '@/Components/ui/Card';
import student from '@/assets/student.json';
import { Avatar,AvatarImage } from '@/Components/ui/avatar';
import { useSocket } from '@/Services/Socket-Client-Provider';


export default function TeacherDetails() {
    const {specificTeacherDetailsId,setSpecificTeacherDetailsId,
        specificTeacherDetails,setSpecificTeacherDetails,hireTeacherInitialStateData,setHireTeacherInitialStateData,
        loadingSpin,setLoadingSpin
        }=useContext(UseContextApi);
    const userStates=useSelector(state=>state?.user);
    const {data:user,loading}=userStates;
    const ratingState=useSelector(state=>state?.rating);
    const {data:allRating,loading1}=ratingState;
    const {id}=useParams();
    const navigate=useNavigate();
    const [ hireDialog,setHireDialog]=useState(false);
    const [togRating,setTogRating]=useState(false);
    const [teacherAverageRating,setTeacherAverageRating]=useState(null);
     const {socket}=useSocket();

    useEffect(()=>{

      if(user&&allRating){
        const teacherRating=allRating?.filter(item=>item?.teacherId?._id===id);
        if(teacherRating?.length>0){
          const averageRating=teacherRating?.reduce((sum,obj)=>sum+(obj?.rating||0)/teacherRating?.length,0)?.toFixed(2);
          setTeacherAverageRating(averageRating);
        }
      }
    },[user,allRating]);
    
        useEffect(()=>{
            const getTeacherDetail=async ()=>{
                if(id){
                    const response=await axiosService.get(`${Get_Teacher_Detail}/${id}`);
                    //console.log(response);
                    if(response.status===200){
                        setSpecificTeacherDetails(response?.data?.data);
                }
            }
            }
            if(specificTeacherDetailsId){
                getTeacherDetail();
            }
        },[specificTeacherDetailsId]);


    useEffect(()=>{
      if(!id){
        navigate(-1);
      }
      else{
        setSpecificTeacherDetailsId(id)
      }
    },[id]);


    const handleEvent=async(data)=>{
    try{
      setLoadingSpin(true);
      if(user && id){
        const finalData={studentId:user?._id,teacherId:id,...data};
        const response=await axiosService.post(Hire_Teacher,finalData);
        if(response.status === 200){
          socket?.emit("hire-teacher-message",{userId:id,title:"Hire Teacher",message:`${user?.userName} send you hire request.`,type:'message'});
          toast.success(response?.data?.message);
          navigate('/profile');
        }
      }
    }
    catch(error)
    {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
    finally{
      setHireDialog(false);
      setLoadingSpin(false);
    }
    }

    const handleNavigate=async(id)=>{
        try{
          if(!loading){
            const response=await axiosService.get(`${Get_Purchase_Detail}/${id}/${user?._id}`);
            if(response?.data?.data){
              navigate(`/courseProgress/${id}`);
    
            }
            else{
              navigate(`/course/details/${id}`);
            }
          }
        }
        catch(error){
          console.log(error);
        }
    
      }
      const downloadFile = async (type,url) => {
              try {
                if(specificTeacherDetails?.teacherDetails?.teacherInfo){
                  await handleDwn(type,url);
                }
                else{
                  toast.info("No Certificate Provided.")
                }
              } catch (error) {
                  toast.error("view failed");
                  console.log(error);
              }
          };

  if(!specificTeacherDetails){ 
    return (
      <div>
         <Navbar />
        <SkeletonCard/>
        <Footer />
      </div>

  )
  }
  return (
    <div className="min-h-screen">
    <Navbar />
    <div className="container mx-auto px-4 py-12">
   
      <div className="flex flex-col md:flex-row gap-12 items-center">
     
        <div className="w-full md:w-1/3 flex flex-col items-center bg-white rounded-full shadow-xl">
          {specificTeacherDetails?.teacherDetails?.userImage? <img
            src={specificTeacherDetails?.teacherDetails?.userImage.startsWith("http") ? specificTeacherDetails?.teacherDetails?.userImage:`${import.meta.env.VITE_BACKEND_URL}/${specificTeacherDetails?.teacherDetails?.userImage}`}
            alt="Teacher"
            className="w-64 h-64 rounded-full object-cover border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform duration-300"
          />:(
            <div className={`${user?.theme===false && "text-black"} w-64 h-64 rounded-full flex items-center justify-center    
            border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform duration-300 text-8xl`}>{specificTeacherDetails?.teacherDetails.userName.split("")[0].toUpperCase()}</div>
          )
            
          }
          <div className="mt-8 w-48">
            <LottieAnimation animationData={teacheranimation} width={200} height={200} speed={1} />
          </div>
        </div>

    
        <div className="w-full md:w-2/3 space-y-8 bg-gray-100 p-8 rounded-xl shadow-xl">
        <div className='flex gap-2 items-center'>
          <h1 className="text-5xl font-bold text-black">{specificTeacherDetails?.teacherDetails?.userName}</h1>
          {
            specificTeacherDetails?.teacherDetails && specificTeacherDetails?.teacherDetails?.subscription?.subscriptonType === 'elite' &&
          <LottieAnimation animationData={verified} width={100} height={100} speed={1}/>
          }
        </div>
          <p className="text-gray-700 text-lg">{specificTeacherDetails?.teacherDetails?.teacherInfo?.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Personal Details</h2>
              <ul className="space-y-3 text-gray-700">
                <li>📧 Email: {specificTeacherDetails?.teacherDetails?.email}</li>
                <li>👤 Gender: {specificTeacherDetails?.teacherDetails?.gender}</li>
                <li>📞 Phone: {specificTeacherDetails?.teacherDetails?.phone}</li>
                <li>🏠 Address: {specificTeacherDetails?.teacherDetails?.address}</li>
                <li>🎂 Date of Birth: {moment(specificTeacherDetails?.teacherDetails?.DOB).format("MMMM DD, YYYY")}</li>
                <li className='flex flex-row items-center gap-1'>⭐ Rating:{renderStars(teacherAverageRating)} (from {allRating?.filter(item=>item?.teacherId?._id===id)?.length ||0} {allRating?.filter(item=>item?.teacherId?._id===id)?.length>1? "Reviews":"Review"})</li>

              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Professional Details</h2>
              <ul className="space-y-3 text-gray-700">

  <li>
    <div className="flex flex-row items-center gap-2">
      <span>🎓</span> 
      <span>Degree:</span>
      <div className="flex flex-wrap gap-2">
        {specificTeacherDetails?.teacherDetails?.teacherInfo?.degree? specificTeacherDetails?.teacherDetails?.teacherInfo?.degree
          ?.split(",")
          .map((degree, index) => (
            <Badge key={index} className="bg-green-600 text-white px-1 py-1">
              {degree.trim()}
            </Badge>
          )): "N/A"}
      </div>
    </div>
  </li>


  <li>
    <div className="flex flex-row items-center gap-2">
      <span>🏫</span> 
      <span>College:</span>
      <span>{specificTeacherDetails?.teacherDetails?.teacherInfo?.college || "N/A"}</span>
    </div>
  </li>

  <li>
    <div className="flex flex-row items-center gap-2">
      <span>₹</span> 
      <span>Fee:</span>
      <span>{specificTeacherDetails?.teacherDetails?.teacherInfo?.feePerHour && `Rs.${specificTeacherDetails?.teacherDetails?.teacherInfo?.feePerHour} /hr` || "N/A"}</span>
    </div>
  </li>

  <li>
    <div className="flex flex-row items-center gap-2">
      <span>🏛️</span> 
      <span>University:</span>
      <span>{specificTeacherDetails?.teacherDetails?.teacherInfo?.university || "N/A"}</span>
    </div>
  </li>

  <li>
    <div className="flex flex-row items-center gap-2">
      <span>📅</span> 
      <span>Availability:</span>
      <div className="flex flex-wrap gap-2">
        {specificTeacherDetails?.teacherDetails?.teacherInfo?.avilability? specificTeacherDetails?.teacherDetails?.teacherInfo?.avilability
          ?.split(",")
          .map((avilability, index) => (
            <Badge key={index} className="bg-green-600 text-white px-3 py-1">
              {avilability.trim()}
            </Badge>
          )):"N/A"}
      </div>
    </div>
  </li>
<li>
    <div className="flex flex-row items-center gap-2">
      <span>📂</span> 
      <span>Category:</span>
      <span>{specificTeacherDetails?.teacherDetails?.teacherInfo?.category || "N/A"}</span>
    </div>
  </li>
  <li>
    <div className="flex flex-row items-center gap-2">
      <span>🗣️</span> 
      <span>Primary Language:</span>
      <span>{specificTeacherDetails?.teacherDetails?.teacherInfo?.primaryLanguage || "N/A"}</span>
    </div>
  </li>
  <li>
    <div className="flex flex-row items-center gap-2">
      <span>🏆</span> 
      <span>Experience:</span>
      <span>{specificTeacherDetails?.teacherDetails?.teacherInfo?.experience  || "N/A"} Yr</span>
    </div>
  </li>
</ul>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
    {!allRating?.find(item=>item?.userId?._id===user?._id && item?.teacherId?._id===specificTeacherDetails?.teacherDetails?._id) &&
    <CommonButton func={()=>setTogRating(true)} text="Give Rating"/>}
    <Button
      className="px-6 py-3 bg-green-500 font-playfair text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      onClick={() =>setHireDialog(true)}
    >
      Hire Teacher
    </Button>
    <Button
      className="px-6 py-3 bg-green-500 font-playfair text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      onClick={() =>downloadFile('view',specificTeacherDetails?.teacherDetails?.teacherInfo?.certificate)}
    >
      View Certificate
    </Button>
  </div>
        </div>
        
      </div>

     
      <div className="mt-16">
        <div className="flex items-center gap-1 md:gap-4 mb-8 overflow-hidden">
          <h2 className="text-4xl font-bold">Courses Created</h2>
            <LottieAnimation animationData={graduationcourse} width={150} height={150} speed={1} />
        </div>

        <div className="grid text-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {specificTeacherDetails?.teacherCourses?.length > 0 ? 
  (
    specificTeacherDetails?.teacherCourses?.map((course, index) =>{
      return (
      <div
        key={index}
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 transform hover:scale-105 flex flex-col items-center justify-center" // Added flexbox for centering
      >
        <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">{course?.title}</h3> 
        <p className="text-gray-700 mb-6 text-center">📚 {course?.curriculum?.length > 1 ? "Contents" : "Content"}: {course?.curriculum?.length}</p> 
        <Button onClick={()=>handleNavigate(course?._id)} className=" font-playfair w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
          View Course
        </Button>
      </div>
    )})
  ) : (
    <h1 className="text-center text-2xl font-bold  col-span-full">No Courses Created By Teacher.</h1> 
  )}
</div>



      </div>
      <section className="py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="flex gap-2 items-center">
      <h1 className="text-3xl font-bold mb-2">Student Saying</h1>
      <LottieAnimation animationData={student} width={150} height={150} speed={1} />
    </div>

 
    {(() => {
      const filteredRatings = allRating?.filter(item => item?.teacherId?._id === id);

      return filteredRatings && filteredRatings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRatings.map((feedback, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    {feedback?.userId?.userImage ? (
                      <AvatarImage
                        className={`${user?.theme===false && "bg-white"} rounded-full`}
                        src={
                          feedback?.userId?.userImage?.startsWith("http")
                            ? feedback?.userId?.userImage
                            : `${import.meta.env.VITE_BACKEND_URL}/${feedback?.userId?.userImage}`
                        }
                        alt={feedback?.userId?.userName}
                      />
                    ) : (
                      <div className="bg-primary/10 text-primary text-2xl font-bold flex justify-center items-center w-full h-full rounded-full">
                        {feedback?.userId?.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>

                  <div>
                    <p className="font-semibold text-gray-900">{feedback?.userId?.userName}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${i < feedback?.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{feedback?.rating}.0</span>
                    </div>
                  </div>
                </div>

                <blockquote className="text-gray-700 italic mb-4 flex-1">
                  "{feedback?.comment}"
                </blockquote>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-medium text-gray-900">{feedback?.teacherId?.userName}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FaStar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Be the first to share your experience with our Instructor!
          </p>
        </div>
      );
    })()}
  </div>
</section>

    </div>

    {togRating && <RateDialog open={togRating} onOpenChange={setTogRating} userId={user?._id} teacherId={id}/>}

    <DialogForm
            title="Hire Teacher."
            description="Fill all the Information as Instructed."
            dialog={hireDialog}
            setDialog={setHireDialog}
            func={handleEvent}
            type="hireteacher"
            componentInputs={hireTeacherComponents}
            initialState={hireTeacherInitialStateData}
          />
    <Footer />
  </div>
  )
}
