import React,{useState,useEffect,useContext} from 'react';
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
import homeanimation from '@/assets/homeanimation.json';
import { Card,CardContent,CardTitle,CardHeader} from '@/Components/ui/card';
import moment from 'moment';
import { FaStar} from "react-icons/fa";



export default function Home() {
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  const ratingState= useSelector(state=>state?.rating);
  const {data:rating,loading1}=ratingState;
  const {loadingStateCourse,setLoadingStateCourse}=useContext(UseContextApi);
  const [topSellerCourses,setTopSellerCourses]=useState([]);
  const navigate=useNavigate();

  const [topTestimonials, setTopTestimonials] = useState([]);
  
  useEffect(() => {
    if (rating?.length > 0) {
      const sorted = [...rating].sort((a, b) => b.rating - a.rating).slice(0, 3);
      setTopTestimonials(sorted);
    }
  }, [rating,loading1]);
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
  return (
    <main >
      <Navbar/>
        <div className="w-full h-screen bg-white">
          <div className='flex flex-row justify-evenly items-center md:-mt-8'>
            <div className='flex flex-col md:gap-20 -mt-15'>
            <div className='flex flex-col gap-2'>
            <h1 className='font-bold text-5xl'>Efficient Pathsala</h1>
            <h1 className='font-bold text-5xl'>provides efficiency</h1>
            <h1 className='font-bold text-5xl'>in learning</h1>
            </div>
            <div className='flex flex-col gap-2' >
            <h2 className='font-medium font-mono text-3xl'>Don't think twice and</h2>
            <h2 className='font-medium font-mono text-3xl'>start learning</h2>
            </div>
            <Button onClick={handleButtonClick} className="bg-green-600 text-white md:absolute bottom-5 px-10 py-5 animate-bounce hover:bg-blue-700 transition-all duration-3000 ease-in-out">Start</Button>
            </div>
            <div>
             
            </div> <LottieAnimation animationData={homeanimation} width={"md:w-[700px] w-[200px]"} height={"md:h-[550px] h-[200px]"} speed={1} />
          </div>
        </div>
        <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
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
        <h2 className="text-2xl font-bold mb-6">Top Courses</h2>
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
           loadingStateCourse?  <SkeletonCard/>:<h1 className="text-">No Courses Found</h1>
          )}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8 ">
  <h2 className="text-2xl font-bold mb-6">Student Testimonials</h2>
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="text-xl">
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
