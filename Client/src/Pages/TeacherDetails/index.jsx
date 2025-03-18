import React,{useContext,useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UseContextApi } from '@/Components/ContextApi';
import SkeletonCard from '@/Components/SkeletonCard';
import { Get_Teacher_Detail,Get_Purchase_Detail } from '@/Routes';
import { axiosService } from '@/Services';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Lottie from 'lottie-react';
import teacheranimation from '@/assets/teacheranimation.json';
import graduationcourse from "@/assets/graduationcourse.json";
import moment from 'moment';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { useSelector } from 'react-redux';
import { handleDwn } from '@/Services';
import { toast } from 'react-toastify';


export default function TeacherDetails() {
    const {specificTeacherDetailsId,setSpecificTeacherDetailsId,
        specificTeacherDetails,setSpecificTeacherDetails}=useContext(UseContextApi);
    const userStates=useSelector(state=>state?.user);
    const {data:user,loading}=userStates;
    const {id}=useParams();
    const navigate=useNavigate();
    
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
                  await handleDwn(type,url);
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
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
    <Navbar />
    <div className="container mx-auto px-4 py-12">
   
      <div className="flex flex-col md:flex-row gap-12 items-center">
     
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <img
            src={specificTeacherDetails?.teacherDetails?.userImage.startsWith("http") ? specificTeacherDetails?.teacherDetails?.userImage:`${import.meta.env.VITE_BACKEND_URL}/${specificTeacherDetails?.teacherDetails?.userImage}`}
            alt="Teacher"
            className="w-64 h-64 rounded-full object-cover border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="mt-8 w-48">
            <Lottie animationData={teacheranimation} loop={true} />
          </div>
        </div>

    
        <div className="w-full md:w-2/3 space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-5xl font-bold text-black">{specificTeacherDetails?.teacherDetails?.userName}</h1>
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
        {specificTeacherDetails?.teacherDetails?.teacherInfo?.degree
          ?.split(",")
          .map((degree, index) => (
            <Badge key={index} className="bg-green-600 text-white px-1 py-1">
              {degree.trim()}
            </Badge>
          ))}
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
        {specificTeacherDetails?.teacherDetails?.teacherInfo?.avilability
          ?.split(",")
          .map((avilability, index) => (
            <Badge key={index} className="bg-green-600 text-white px-3 py-1">
              {avilability.trim()}
            </Badge>
          ))}
      </div>
    </div>
  </li>
</ul>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
    <Button
      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      onClick={() => {
        console.log("Button 1 clicked");
      }}
    >
      Hire Teacher
    </Button>
    <Button
      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      onClick={() =>downloadFile('view',specificTeacherDetails?.teacherDetails?.teacherInfo?.certificate)}
    >
      View Certificate
    </Button>
  </div>
        </div>
        
      </div>

     
      <div className="mt-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-4xl font-bold text-black">Courses Created</h2>
          <div className="w-24">
            <Lottie animationData={graduationcourse} loop={true} />
          </div>
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
        <Button onClick={()=>handleNavigate(course?._id)} className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
          View Course
        </Button>
      </div>
    )})
  ) : (
    <h1 className="text-center text-2xl font-bold  text-slate-700 col-span-full">No Courses Created By Teacher.</h1> 
  )}
</div>


      </div>
    </div>
    <Footer />
  </div>

  )
}
