import React,{useEffect,useState,useContext} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SkeletonCard from '@/Components/SkeletonCard';
import { UseContextApi } from '@/Components/ContextApi';
import { Avatar,AvatarImage } from '@/Components/ui/avatar';
import Search from '@/Components/Search';
import { axiosService } from '@/Services';
import { SEARCH_TEACHERS_ROUTES } from '@/Routes';
import LottieAnimation from '@/Components/LottieAnimation';
import teacher from '@/assets/teacher.json';
import renderStars from '@/Components/RenderStars';



export default function Teacher() {
  const {loadingStateCourse,setLoadingStateCourse,allTeachers,setAllTeachers}=useContext(UseContextApi);
    const navigate=useNavigate();
    const userState=useSelector((state)=>state?.user);
    const {data:user,loading1}=userState;
    const allUsersState=useSelector((state)=>state?.allUsers);
    const {data:allUsers,loading2}=allUsersState;
    const ratingState=useSelector(state=>state?.rating);
        const {data:allRating,loading3}=ratingState;

    const getTeacher=()=>{
        const roleTeacher=allUsers?.filter((item)=>item?.userRole.includes('teacher') && item?._id !== user?._id);
        setAllTeachers(roleTeacher);
    }
    useEffect(() => {
      // console.log("hello")
      try {
        setLoadingStateCourse(true);
        if (!loading2 && allUsers) {
          getTeacher();
          setLoadingStateCourse(false); 
        }
      } catch (error) {
        console.log(error);
        setLoadingStateCourse(false); 
      }
    }, [allUsers, loading2,setLoadingStateCourse]);

    const handleNavigate=(id)=>{
      if(id){
        navigate(`/teacher/details/${id}`)
      }
    };

    const searchTeachers=async (searchTerm)=>{
      try{
               if(searchTerm.length>0){   
                const response=await axiosService.post(SEARCH_TEACHERS_ROUTES,{searchTerm});          
                if(response.status===200 && response?.data?.data){
                  setAllTeachers(response.data.data);
                }
               }
      }
      catch(e){
        console.log(e);
      }
      }
  
  if (loadingStateCourse || loading2) {
    return (
      <div>
        <Navbar />
        <SkeletonCard />
        <Footer />
      </div>
    );
  }
  return (
    <div>
      <Navbar/>
      <Search searchFunc={searchTeachers} onChangeFunc={getTeacher} />
        <section className="py-12 px-4 lg:px-8 mt-5 mb-5">
          <div className='flex items-center gap-2'>
               <h2 className="text-2xl font-bold mb-2 font-heading">Our Instructors</h2>
               <LottieAnimation animationData={teacher} width={150} height={150} speed={1} />
          </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {allTeachers?.length > 0 ? (
                   allTeachers.map((item,index) => (
                     <div
                       onClick={() => handleNavigate(item?._id)}
                       className="border rounded-lg overflow-hidden shadow cursor-pointer hover:scale-105 transform 
                       transition-transform duration-300 ease-in-out hover:bg-slate-100"
                       key={index}
                     >
                       <div className="p-4 flex flex-col gap-2">
                         <h3 className="font-bold mb-2">{item?.userName}</h3>
                         <div className='flex flex-row items-center gap-5'>
                         <Avatar className='w-10 h-10 rounded-full flex justify-center items-center'>
                                 {item?.userImage? 
                                 <AvatarImage 
                                 className="rounded-full"
                                 src={item?.userImage.startsWith("http") ? item?.userImage:`${import.meta.env.VITE_BACKEND_URL}/${item?.userImage}`} 
                                 alt="creatorImage"  />:(
                                     <div className=' bg-slate-400 justify-center items-center px-5 py-3 rounded-full '>{item?.userName.split("")[0].toUpperCase()}</div>
                                 )}
                               </Avatar>
                         <p className="text-sm text-gray-700 mb-2">
                           {item?.userName?.toUpperCase()}
                         </p>
                         </div>
                         <p className="text-sm text-gray-700 mb-2 flex flex-row items-center gap-1">
                          Rating: {(()=>{
                            const teacherRating=allRating?.filter(itemData=>itemData?.teacherId?._id===item?._id);
                            const teacherAvg=teacherRating?.reduce((sum,obj)=>sum+(obj?.rating||0)/teacherRating?.length,0)?.toFixed(2);
                            return (
                              renderStars(teacherAvg)
                            )

                          })()}
                         </p>
                         <p className="text-sm text-gray-700 mb-2">
                          Category: {`${item?.teacherInfo?.category? item?.teacherInfo?.category?.toUpperCase():"N/A"}`}
                         </p>
                       </div>
                     </div>
                   ))
                 ) : <h1 className='absolute top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-bold font-mono text-slate-700'>No Teacher Found.</h1>
                 }
               </div>
             </section>
             
      <Footer/>
    </div>
  )
}
