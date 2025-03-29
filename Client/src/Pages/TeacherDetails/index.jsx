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
import DialogForm from '@/Components/DialogForm';
import { hireTeacherComponents } from '@/Utils';
import verified from '@/assets/verified.json';

export default function TeacherDetails() {
    const {specificTeacherDetailsId,setSpecificTeacherDetailsId,
        specificTeacherDetails,setSpecificTeacherDetails,hireTeacherInitialStateData,setHireTeacherInitialStateData,
        }=useContext(UseContextApi);
    const userStates=useSelector(state=>state?.user);
    const {data:user,loading}=userStates;
    const {id}=useParams();
    const navigate=useNavigate();
    const [ hireDialog,setHireDialog]=useState(false);
    
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
      if(user && id){
        const finalData={studentId:user?._id,teacherId:id,...data};
        const response=await axiosService.post(Hire_Teacher,finalData);
        if(response.status === 200){
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
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
    <Navbar />
    <div className="container mx-auto px-4 py-12">
   
      <div className="flex flex-col md:flex-row gap-12 items-center">
     
        <div className="w-full md:w-1/3 flex flex-col items-center">
          {specificTeacherDetails?.teacherDetails?.userImage? <img
            src={specificTeacherDetails?.teacherDetails?.userImage.startsWith("http") ? specificTeacherDetails?.teacherDetails?.userImage:`${import.meta.env.VITE_BACKEND_URL}/${specificTeacherDetails?.teacherDetails?.userImage}`}
            alt="Teacher"
            className="w-64 h-64 rounded-full object-cover border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform duration-300"
          />:(
            <div className=' w-64 h-64 rounded-full flex items-center justify-center   border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform duration-300 text-8xl'>{specificTeacherDetails?.teacherDetails.userName.split("")[0].toUpperCase()}</div>
          )
            
          }
          <div className="mt-8 w-48">
            <LottieAnimation animationData={teacheranimation} width={200} height={200} speed={1} />
          </div>
        </div>

    
        <div className="w-full md:w-2/3 space-y-8 bg-white p-8 rounded-xl shadow-lg">
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
</ul>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
    <Button
      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      onClick={() =>setHireDialog(true)}
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
            <LottieAnimation animationData={graduationcourse} width={150} height={150} speed={1} />
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
