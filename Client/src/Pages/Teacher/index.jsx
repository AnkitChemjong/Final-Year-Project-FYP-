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

export default function Teacher() {
  const {loadingStateCourse,setLoadingStateCourse,allTeachers,setAllTeachers}=useContext(UseContextApi);
    const navigate=useNavigate();
    const userState=useSelector((state)=>state?.user);
    const {data:user,loading1}=userState;
    const allUsersState=useSelector((state)=>state?.allUsers);
    const {data:allUsers,loading2}=allUsersState;

    const getTeacher=()=>{
        const roleTeacher=allUsers?.filter((item)=>item?.userRole.includes('teacher'));
        setLoadingStateCourse(false);
        setAllTeachers(roleTeacher);
    }
    useEffect(()=>{
      try{
        if(!loading2){
         getTeacher();
        }
      }
      catch(error){
        console.log(error);
      }
    },[allUsers,loading2]);

    const handleNavigate=(id)=>{
      if(id){
        navigate(`/teacher/details/${id}`)
      }
    };

    const searchTeachers=async (searchTerm)=>{
      try{
               setLoadingStateCourse(true);
               if(searchTerm.length>0){   
                const response=await axiosService.post(SEARCH_TEACHERS_ROUTES,{searchTerm});          
                if(response.status===200 && response?.data?.data){
                  setLoadingStateCourse(false);
                  setAllTeachers(response.data.data);
                }
               }
      }
      catch(e){
        console.log(e);
      }
      finally{
        setLoadingStateCourse(false);
      }
      }

  return (
    <div>
      <Navbar/>
      <Search searchFunc={searchTeachers} onChangeFunc={getTeacher} />
        <section className="py-12 px-4 lg:px-8 mt-5 mb-5">
               <h2 className="text-2xl font-bold mb-6">Our Instructors</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {allTeachers && allTeachers.length > 0 ? (
                   allTeachers.map((item,index) => (
                     <div
                       onClick={() => handleNavigate(item?._id)}
                       className="border rounded-lg overflow-hidden shadow cursor-pointer"
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
                           {item?.userName}
                         </p>
                         </div>
                       </div>
                     </div>
                   ))
                 ) : (
                  loadingStateCourse?  <SkeletonCard/>:<h1 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-bold font-mono text-slate-700'>No Teacher Found.</h1>
                 )}
               </div>
             </section>
      <Footer/>
    </div>
  )
}
