import React,{useState,useEffect,useContext,useRef} from 'react';
import { Button } from '@/Components/ui/button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { courseCategories } from '@/Utils';
import { axiosService } from '@/Services';
import { Get_Top_Four_Courses,Get_Purchase_Detail } from '@/Routes';
import { UseContextApi } from '@/Components/ContextApi';
import SkeletonCard from '@/Components/SkeletonCard';
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import LottieAnimation from '@/Components/LottieAnimation';
import category from '@/assets/category.json';
import homeanimation from '@/assets/homeanimation.json';
import { Card,CardContent,CardTitle,CardHeader,CardDescription} from '@/Components/ui/card';
import moment from 'moment';
import { FaStar} from "react-icons/fa";
import teacher from '@/assets/teacher.json';
import graduationcourse from '@/assets/graduationcourse.json';
import student from '@/assets/student.json';
import { useGSAP } from "@gsap/react";
import { FaArrowRight } from "react-icons/fa";
import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  const ratingState= useSelector(state=>state?.rating);
  const {data:rating,loading1}=ratingState;
  const {loadingStateCourse,setLoadingStateCourse}=useContext(UseContextApi);
  const allUserState=useSelector(state=>state?.allUsers);
      const {data:allUser,loading2}=allUserState;
  const [topSellerCourses,setTopSellerCourses]=useState([]);
  const [instructors,setInstructors]=useState([]);
  const [topTestimonials, setTopTestimonials] = useState([]);
  const navigate=useNavigate();
  const mouseSVG=useRef();
  const buttonMove=useRef();
  
  useEffect(() => {
    if (rating?.length > 0 && allUser) {
      const sorted = [...rating]?.sort((a, b) => b.rating - a.rating).slice(0, 3);
      let oldestUsers;
      if(user){
        oldestUsers = [...allUser]?.filter(item=>item?.userRole?.includes('teacher') && item?._id!==user?._id)?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      else{
        oldestUsers = [...allUser]?.filter(item=>item?.userRole?.includes('teacher'))?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      setInstructors(oldestUsers);
      setTopTestimonials(sorted);
    }
  }, [rating,loading1,user]);
  const handleButtonClick=()=>{
  if(!loading && user){
      navigate("/course");
    }
    else{
      navigate("/signin");
    }
  }
  
  useEffect(()=>{
    const getTopSellerCourses=async()=>{
      try{
        const response=await axiosService.get(Get_Top_Four_Courses);
        if(response.status === 200){
          setTopSellerCourses(response?.data?.data);
          setLoadingStateCourse(false);
        }
      }
      catch(error){
       console.log(error);
      }
      finally{
        setLoadingStateCourse(false);
      }
     }
     if(topSellerCourses.length < 1 || topSellerCourses === null){
      getTopSellerCourses();
     }
  },[]);

  function handleNavigateToCoursesPage(getCurrentId) {
    //console.log(getCurrentId);
    localStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    localStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/course");
  }

  async function handleCourseNavigate(id) {
    try{
          if(!loading){
            if(!user){
              return navigate("/signup")
            }
            const response=await axiosService.get(`${Get_Purchase_Detail}/${id}/${user?._id}`);
            // console.log(response);
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

  const {contextSafe}=useGSAP();
  const onPositive=contextSafe(()=>{
 
    gsap.to(".word",{
      transform:"translateX(-200%)",
      duration:4,
      ease:"none",
      repeat:-1
    })
    gsap.to(".word>.h",{
        rotate:180
    })
    
  })
  const onNegative=contextSafe(()=>{
  
    gsap.to(".word",{
      transform:"translateX(0%)",
      duration:4,
      ease:"none",
      repeat:-1
    })
    gsap.to(".word>.h",{
        rotate:0
    })
    
  });
  useEffect(()=>{
    const func=(e)=>{
     
      if(e.deltaY>0){
        onPositive();
      }
      else{
        onNegative();
      }
    }
  window.addEventListener("wheel",func)
  return ()=>{
    window.removeEventListener("wheel",func)
  }
  
  },[]);

  useEffect(() => {
    const initial = 'M 10 100 Q 500 100 990 100';
    
    const handleClick = (e) => {
      const svgRect = mouseSVG.current.getBoundingClientRect();
      const clickX = e.clientX - svgRect.left;
      const clickY = e.clientY - svgRect.top;
      
      const clickedPath = `M 10 100 Q ${clickX} ${clickY} 990 100`;
      
      gsap.to(".hi", {
        attr: { d: clickedPath },
        duration: 0.3,
        ease: "power3.out"
      });
      
      setTimeout(() => {
        gsap.to(".hi", {
          attr: { d: initial },
          duration: 1.5,
          ease: "elastic.out(1,0.2)"
        });
      }, 500);
    };
    const handleMouseLeave = () => {
      gsap.to(".hi", {
        attr: { d: initial },
        duration: 1.5,
        ease: "elastic.out(0,4)"
      });
    };
  
    const svgElement = mouseSVG.current;
    svgElement.addEventListener('click', handleClick);
    svgElement.addEventListener('mouseleave', handleMouseLeave);
  
    return () => {
      svgElement.removeEventListener('click', handleClick);
      svgElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

const rotateImg = contextSafe(() => {
  gsap.to(buttonMove.current, {
    x: gsap.utils.random(-100, 200),
    y: gsap.utils.random(-50, 200),
    rotate: gsap.utils.random(-30, 30),
    duration: 0.5,
    ease: "power2.out"
  });
});
useEffect(() => {
  if (buttonMove.current) {
    const buttonAnimation = buttonMove.current;
    buttonAnimation.addEventListener('mouseenter', rotateImg);
    
    return () => {
      buttonAnimation.removeEventListener('mouseenter', rotateImg);
    };
  }
}, [rotateImg]);

  return (
    <main className='hello'>
      <Navbar/>
      <div className="w-full min-h-screen bg-white p-4">
  <div className="flex flex-col md:flex-row justify-center md:justify-evenly items-center md:items-start gap-8 md:gap-0 md:-mt-8">
    <div className="flex flex-col gap-6 md:gap-20 mt-0 md:mt-0 order-2 md:order-1 text-center md:text-left">
      <div className="flex flex-col gap-2 font-display">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl">Efficient Pathsala</h1>
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl">provides efficiency</h1>
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl">in learning</h1>
      </div>
      <div className="flex flex-col gap-2 font-heading">
        <h2 className="font-medium font-mono text-xl sm:text-2xl md:text-3xl">Don't think twice and</h2>
        <h2 className="font-medium font-mono text-xl sm:text-2xl md:text-3xl">start learning</h2>
      </div>
      <Button 
  ref={buttonMove}
  onClick={handleButtonClick} 
  className="bg-green-600 z-50 text-white px-8 py-4 md:px-10 md:py-5 md:absolute md:bottom-5 hover:bg-blue-700 transition-all duration-300 ease-in-out mx-auto md:mx-0 "
>
  Start
</Button>
    </div>
    <div className="order-1 md:order-2">
      <LottieAnimation 
        animationData={homeanimation} 
        width={"w-[250px] sm:w-[400px] md:w-[500px] lg:w-[700px]"} 
        height={"h-[200px] sm:h-[350px] md:h-[450px] lg:h-[550px]"} 
        speed={1} 
      />
    </div>
  </div>
  <svg 
    ref={mouseSVG}
    width="100%"
    height="100%" 
    viewBox="0 0 1000 200" 
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    className="cursor-pointer" 
  >
    <path 
      className="hi" 
      d="M 10 100 Q 500 100 990 100" 
      stroke="green" 
      strokeWidth="2"
      fill="transparent"
    />
  </svg>
</div>
        <div className="w-[100vw] bg-yellow-400 flex flex-row gap-8 overflow-hidden">
          {
            [...Array(7)].map((index)=>{
              return (
        <div key={index} className=" word flex flex-row items-center justify-center py-4 gap-5 shrink-0 -translate-x-96">
          <h1 className="text-2xl font-heading">Grab the opportunity!</h1>
          <FaArrowRight className="h"  size={25}/>
        </div>
              )
            })
          }
      </div>
        <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <div className='flex gap-2 items-center'>
        <h1 className='text-3xl font-bold font-heading'>Course Categories</h1>
          <LottieAnimation animationData={category} width={150} height={150} speed={1}/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem,index) => (
            <Button
            key={index}
              className="justify-start"
              variant="outline"
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
      <div className='flex gap-2 items-center'>
        <h1 className='text-3xl font-bold mb-2 font-heading'>Top Courses</h1>
          <LottieAnimation animationData={graduationcourse} width={150} height={150} speed={1}/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topSellerCourses && topSellerCourses.length > 0 ? (
            topSellerCourses.map((courseItem,index) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border-2 border-x-fuchsia-800 rounded-lg overflow-hidden hover:shadow-lg cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out "
                key={index}
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <div className='flex flex-row items-center gap-5'>
                  <Avatar className='w-10 h-10 rounded-full flex justify-center items-center'>
                          {courseItem?.creatorDetails?.userImage? 
                          <AvatarImage 
                          className="rounded-full"
                          src={courseItem?.creatorDetails?.userImage.startsWith("http") ? courseItem?.creatorDetails?.userImage:`${import.meta.env.VITE_BACKEND_URL}/${courseItem?.creatorDetails?.userImage}`} 
                          alt="creatorImage"  />:(
                              <div className=' bg-slate-400 justify-center items-center px-5 py-3 rounded-full '>{courseItem?.creatorDetails?.userName.split("")[0].toUpperCase()}</div>
                          )}
                        </Avatar>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.creatorDetails?.userName?.toUpperCase()}
                  </p>
                  </div>
                  
                  <p className="font-bold text-sm text-slate-600">
                  {courseItem?.category?.toUpperCase()}
                  </p>
          
                  <p className="font-bold text-sm text-slate-600">
                    Price: Rs. {courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
           loadingStateCourse?  <SkeletonCard/>:<h1 className="font-heading">No Courses Found</h1>
          )}
        </div>
      </section>
      
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 ">
          <div className="max-w-7xl mx-auto">
            <div className='flex items-center gap-2'>
                           <h2 className="text-2xl font-bold mb-2 font-heading ">Our Instructors</h2>
                           <LottieAnimation animationData={teacher} width={150} height={150} speed={1} />
                      </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {instructors.map((teacher, index) => (
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
            alt="Teacher Profile"
          />
        ) : (
          <div className="bg-primarr text-4xl font-bold flex justify-center items-center w-full h-full rounded-full">
            {teacher?.userName?.charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>
                  <CardTitle>{teacher?.userName}</CardTitle>
                  <CardDescription className="mt-2">
                    <p className="font-medium text-gray-900">{teacher?.teacherInfo?.category||"N/A"}</p>
                    <p className="text-gray-600">
  {teacher?.teacherInfo?.experience ? `${teacher?.teacherInfo?.experience} Yrs` : "N/A"} experience
</p>
                  </CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>
      <section className="py-12 px-4 lg:px-8 ">
  <div className='flex gap-2 items-center'>
        <h1 className='text-3xl font-bold font-heading'>Student Testimonials</h1>
          <LottieAnimation animationData={student} width={150} height={150} speed={1}/>
        </div>
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="text-xl font-">
        What Our Students Say
      </CardTitle>
    </CardHeader>
    <CardContent>
      {topTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTestimonials.map((feedback, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 hover:shadow-md  cursor-pointer bg-white
              hover:scale-105 transition-all ease-in-out"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-10 h-10 rounded-full cursor-pointer flex justify-center items-center border">
                    {feedback.userId?.userImage ? (
                      <AvatarImage
                        className="rounded-full"
                        src={
                          feedback.userId?.userImage?.startsWith("http")
                            ? feedback.userId?.userImage
                            : `${import.meta.env.VITE_BACKEND_URL}/${feedback.userId?.userImage}`
                        }
                        alt="userImage"
                      />
                    ) : (
                      <div className="bg-white justify-center items-center px-5 py-3 rounded-full">
                            {feedback.userId?.userName?.split("")[0].toUpperCase()}
                        </div>
                    )}
                  </Avatar>
                  <div>
                    <h4 className="font-medium line-clamp-1">
                      {feedback.userId?.userName || 'Anonymous User'}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      {moment(feedback.createdAt).format("MMM D, YYYY")}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-2 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i}
                      className={i < feedback.rating ? "text-yellow-400" : "text-gray-300"}
                      size={14}
                    />
                  ))}
                </div>
                
                <p className="text-gray-800 text-sm flex-grow line-clamp-4">
                  {feedback.comment || "No comment provided"}
                </p>
                
                <p className="text-xs text-gray-500 mt-2">
                  Rated course: {feedback.courseId?.title || "Unknown Course"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No testimonials yet. Be the first to share your experience!
        </p>
      )}
    </CardContent>
  </Card>
</section>
        <Footer/>
    </main>
  )
}
