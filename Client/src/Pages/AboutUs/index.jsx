import React, { useState,useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FaStar} from "react-icons/fa";
import { bannerSlides,features } from '@/Utils';
import { useSelector } from 'react-redux';
import SkeletonCard from '@/Components/SkeletonCard';
import { Badge } from '@/Components/ui/badge';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import LottieAnimation from '@/Components/LottieAnimation';
import teacher from '@/assets/teacher.json';
import category from '@/assets/category.json';
import admin from '@/assets/admin.json';
import student from '@/assets/student.json';


export default function AboutUs() {
    const userState=useSelector(state=>state?.user);
    const {data:user,loading2}=userState;
    const allUserState=useSelector(state=>state?.allUsers);
    const {data:allUser,loading}=allUserState;
    const ratingState=useSelector(state=>state?.rating);
    const {data:ratings,loading1}=ratingState;
    const [teachers,setTeachers]=useState([]);
    const [topRating,setTopRating]=useState([]);
    const [adminsData,setAdminsData]=useState([]);
    const navigate=useNavigate();

    useEffect(()=>{
        if(allUser && user){
            const teacherData=allUser?.filter(item=>item?.userRole?.includes('teacher') && item?._id !== user?._id)?.slice(0,3);
            const adminData=allUser?.find(item=>item?.userRole?.includes('admin'));
            const ratingData=[...(ratings || [])]?.filter(item=>!item?.teacherId)?.sort((a, b) => b.rating - a.rating) .slice(0, 3);
            setTopRating(ratingData);
          setTeachers(teacherData);
          setAdminsData(adminData);

        }
    },[allUser,ratings]);

  if (!allUser || !user) {
      return (
        <div className='flex flex-col gap-2 overflow-hidden min-h-screen bg-gray-50'>
          <Navbar/>
          <SkeletonCard />
          <Footer />
        </div>
      );
    }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="w-full">
          <Carousel 
            className="w-full"
            opts={{
              loop: true,
              interval: 4000
            }}
          >
            <CarouselContent>
              {bannerSlides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className={`p-12 ${slide.bgColor} text-white text-center h-96 flex flex-col items-center justify-center`}>
                    <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-xl">{slide.description}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
          <div className='flex gap-2 items-center'>
        <h1 className='text-3xl font-bold mb-2'>What We Offer</h1>
          <LottieAnimation animationData={category} width={150} height={150} speed={1}/>
        </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow hover:scale-105 ease-in-out duration-100 cursor-pointer">
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className='flex gap-2 items-center'>
        <h1 className='text-3xl font-bold mb-2'>Meet Our Founder</h1>
          <LottieAnimation animationData={admin} width={150} height={150} speed={1}/>
        </div>
    <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-lg shadow-md">
      <Avatar className="w-40 h-40 rounded-full cursor-pointer flex justify-center items-center border-4 border-primary">
        {adminsData?.userImage ? (
          <AvatarImage
            className="rounded-full"
            src={
              adminsData?.userImage?.startsWith("http")
                ? adminsData?.userImage
                : `${import.meta.env.VITE_BACKEND_URL}/${adminsData?.userImage}`
            }
            alt="Admin Profile"
          />
        ) : (
          <div className="bg-primary text-white text-4xl font-bold flex justify-center items-center w-full h-full rounded-full">
            {adminsData?.userName?.charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>

      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{adminsData?.userName || "Admin"}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {adminsData?.userRole?.map((role, index) => (
              <Badge
                key={index} 
                className="px-3 py-1 bg-green-600 hover:bg-blue-600 cursor-pointer hover:scale-105 rounded-full text-sm font-medium"
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="flex items-center text-gray-700">
          📧
            {adminsData?.email || "admin@example.com"}
          </p>

          <p className="flex items-center text-gray-700">
          📅
            Admin since: {moment(adminsData?.createdAt).format("MMMM DD, YYYY")}
          </p>
          <p className="flex items-center text-gray-700">
          🎂
              DOB: {moment(adminsData?.DOB).format("MMMM DD, YYYY")}
          </p>
          <p className="flex items-center text-gray-700">
          👤
             Gender: {adminsData?.gender}
          </p>

          <p className="flex items-center text-gray-700">
          🟢
            Status: <span className="ml-1 text-green-600 font-medium">{adminsData?.status || "Active"}</span>
          </p>
        </div>

        <div className="pt-4">
          <p className="text-gray-600">
            Our visionary leader with extensive experience in education technology and platform development.
            Committed to providing quality learning experiences for all students.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 ">
          <div className="max-w-7xl mx-auto">
          <div className='flex items-center gap-2 '>
               <h2 className="text-2xl font-bold mb-2">Our Expert Instructors</h2>
               <LottieAnimation animationData={teacher} width={150} height={150} speed={1} />
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teachers.map((teacher, index) => (
                <Card onClick={()=>navigate(`/teacher/details/${teacher?._id}`)} key={index} className="text-center p-6 cursor-pointer hover:scale-105 transition-all ease-in-out duration-100">
                   <Avatar className="w-24 h-24 rounded-full cursor-pointer flex justify-center items-center border-4 border-primary">
        {teacher?.userImage ? (
          <AvatarImage
            className="rounded-full"
            src={
              teacher?.userImage?.startsWith("http")
                ? teacher?.userImage
                : `${import.meta.env.VITE_BACKEND_URL}/${teacher?.userImage}`
            }
            alt="Admin Profile"
          />
        ) : (
          <div className="bg-primarr text-4xl font-bold flex justify-center items-center w-full h-full rounded-full">
            {teacher?.userName?.charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>
                  <CardTitle>{teacher.userName}</CardTitle>
                  <CardDescription className="mt-2">
                    <p className="font-medium text-gray-900">{teacher?.category||"N/A"}</p>
                    <p className="text-gray-600">
  {teacher?.experience ? `${teacher?.experience} Yrs` : "N/A"} experience
</p>
                  </CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
  <div className='flex gap-2 items-center'>
        <h1 className='text-3xl font-bold mb-2'>Student Saying</h1>
          <LottieAnimation animationData={student} width={150} height={150} speed={1}/>
        </div>
    
    {topRating && topRating?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topRating.map((feedback, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={feedback?.courseId?.image} 
                alt={feedback?.courseId?.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => e.target.src = '/placeholder-course.jpg'}
              />
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  {feedback?.userId?.userImage ? (
                    <AvatarImage
                      className="rounded-full"
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
                <p className="font-medium text-gray-900">{feedback?.courseId?.title}</p>
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
          Be the first to share your experience with our courses!
        </p>
      </div>
    )}
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}