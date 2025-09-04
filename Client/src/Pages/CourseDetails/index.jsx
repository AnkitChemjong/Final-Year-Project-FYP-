import React, { useContext,useEffect,useState } from 'react';
import Navbar from '@/Components/Navbar';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Avatar,AvatarImage } from '@/Components/ui/avatar';
import SkeletonCard from '@/Components/SkeletonCard';
import { UseContextApi } from '@/Components/ContextApi';
import { BiCheckSquare } from "react-icons/bi";
import Footer from '@/Components/Footer';
import { IoPlayCircleOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import CommonButton from '@/Components/CommonButton';
import moment from 'moment';
import VideoPlayerReact from '@/Components/VideoPlayerReact';
import { Card, CardContent, 
    CardHeader, CardTitle } from "@/Components/ui/card";
import PaymentDialog from '@/Components/PaymentDialog';
import { Get_Course_Detail } from '@/Routes';
import { FaStar} from "react-icons/fa";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,} from "@/Components/ui/dialog";
import { FaGlobeAsia } from "react-icons/fa";
import { axiosService } from '@/Services';
import renderStars from '@/Components/RenderStars';

export default function CourseDetails() {
    const navigate=useNavigate();
    const userStates = useSelector(state => state.user);
        const { data: user, loading } = userStates; 
    const {specificCourseDetails,setSpecificCourseDetails,
        specificCourseDetailsId,setSpecificCourseDetailsId,
        specificCourseRating,setSpecificCourseRating
    }=useContext(UseContextApi);
    const [displayVideoFreePreview, setDisplayVideoFreePreview] =useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [openDialog,setOpenDialog]=useState(false);
  const [load,setLoad]=useState(true);
  useEffect(()=>{
    setTimeout(()=>{
     setLoad(false);
    },1000);
 },[]);
  


  const toggleDialog=()=>{
    setOpenDialog(true);
  }

    useEffect(() => {
        if (!location.pathname.includes("course/details")){  
            setSpecificCourseDetails(null);
            setSpecificCourseDetailsId(null);
            setSpecificCourseRating([]);
        }
           
      }, [location.pathname]);

    const {id}=useParams();
    
  
    useEffect(()=>{
        if(id)setSpecificCourseDetailsId(id);
    },[]);

    useEffect(()=>{
        const getCourseDetail=async ()=>{
            if(!loading){
                const response=await axiosService.get(`${Get_Course_Detail}/${specificCourseDetailsId}/${user._id}`);
                //console.log(response);
                if(response.status===200 && !response?.data?.coursePurchased){
                    setSpecificCourseDetails(response?.data?.data);
                    setSpecificCourseRating(response?.data?.ratingData);
            }
            else{
                setSpecificCourseDetails(null);
                navigate(`/courseProgress/${specificCourseDetailsId}`);
            }
        }
        }
        if(specificCourseDetailsId){
            getCourseDetail();
        }
    },[specificCourseDetailsId,loading]);

    const handleFreePreview=(videoInfo)=>{
     if(videoInfo){
        setDisplayVideoFreePreview(videoInfo?.videoUrl);
        setShowFreePreviewDialog(true);
     }
    }
    //console.log(specificCourseDetails);

    const averageRating = specificCourseRating.length > 0 
    ? specificCourseRating.reduce((acc, curr) => acc + curr.rating, 0) / specificCourseRating.length
    : 0;
    //console.log(specificCourseDetails);

if(!user || load){
    return (
      <div>
         <Navbar />
        <SkeletonCard/>
        <Footer />
      </div>

  )
  }
return (
    <div>
    <Navbar/>
    <div className='mx-auto p-2 sm:p-4 max-w-7xl'>
  <div className="bg-indigo-600 text-white p-4 sm:p-6 md:p-8 rounded-t-lg">
    <h1 className='text-xl sm:text-2xl md:text-3xl font-bold font-mono mb-2 sm:mb-3 md:mb-4'>
      {specificCourseDetails?.title}
    </h1>
    <p className='text-base sm:text-lg md:text-xl mb-3 sm:mb-4'>Subtitle: {specificCourseDetails?.subtitle}</p>
    
    <div className='flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm'>
      <span className="flex items-center">
        Published By: {specificCourseDetails?.creator?.userName}
      </span>
      <span className="flex items-center">
        Published On: {moment(specificCourseDetails?.createdAt).format("MMMM DD, YYYY")}
      </span>
      <span className='flex items-center'>
        <FaGlobeAsia className='mr-1 h-3 w-3 sm:h-4 sm:w-4'/>
        {specificCourseDetails?.primaryLanguage}
      </span>
      <span>
        Enrolled {specificCourseDetails?.students?.length <= 1 ? "Student" : "Students"}: {specificCourseDetails?.students?.length}
      </span>
      <span className="flex flex-wrap items-center gap-1">
        Rating:
        <span className="flex">
          {renderStars(averageRating)}
        </span>
        <span className="text-xs sm:text-sm">
          {specificCourseRating.length > 0 
            ? `(${averageRating.toFixed(1)} from ${specificCourseRating.length} review${specificCourseRating.length !== 1 ? 's' : ''})`
            : '(No ratings yet)'}
        </span>
      </span>
    </div>
  </div>
</div>
     <div className='flex flex-col md:flex-row gap-8 mt-8'>
        <main className='flex-grow ml-3'>
        <Card className="mb-8">
                <CardHeader>
                    <CardTitle>
                    Course Description
                    </CardTitle>
                </CardHeader>
                <CardContent>
                   {
                    specificCourseDetails?.description
                   }
                </CardContent>

            </Card>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-heading">
                    Key Learning Outcomes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        {
                            specificCourseDetails?.objectives.split(',').map((item,index)=>{
                                return(
                                    <li key={index} className='flex items-center'>
                                        <BiCheckSquare className='mr-2 h-5 w-5 text-green-500 flex-shrink-0'/>
                                         <span>
                                            {item}
                                         </span>
                                    </li>
                                )
                            })
                        }

                    </ul>
                </CardContent>

            </Card>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-heading">Course Content</CardTitle>

                </CardHeader>
                <CardContent>
                    {
                        specificCourseDetails?.curriculum?.map((item,index)=>{
                            return(
                                <li key={index} className={`${item?.freePreview? 'cursor-pointer':'cursor-not-allowed'} flex items-center mb-4 `}
                                 onClick={item?.freePreview?()=>handleFreePreview(item):null}
                                >
                                  {
                                    item?.freePreview? <IoPlayCircleOutline className='mr-2 h-4 w-4'/>:<CiLock className='mr-2 h-4 w-4'/>
                                  }
                                  <span className={`${item?.freePreview && "hover:scale-110"}`}>{item?.title}</span>
                                </li>
                            )
                        })
                    }
                    <Dialog open={showFreePreviewDialog} onOpenChange={()=>{
                        setShowFreePreviewDialog(false);
                        setDisplayVideoFreePreview(null);
                        }}>

                        <DialogContent className="w-[600px]">
                            <DialogHeader>
                               <DialogTitle className="font-heading">Preview Free Video</DialogTitle>
                            </DialogHeader>
                    <div className='aspect-video rounded-lg flex items-center justify-center'>
                      <VideoPlayerReact url={displayVideoFreePreview? displayVideoFreePreview:null}
                      width='450px'
                      height='200px'
                      />
                    </div>
                    <div className='flex flex-col gap-2'>
                        {
                            specificCourseDetails?.curriculum?.filter(item=>item.freePreview).
                            map(filteredItem=>{
                                return(
                                    <div key={filteredItem?.title} onClick={()=>handleFreePreview(filteredItem)} className='flex flex-row items-center gap-1'>
                                        <IoPlayCircleOutline className='mr-2 h-4 w-4 cursor-pointer'/>
                                    <p
                                         className='cursor-pointer text-base font-normal hover:scale-110'>
                                            {filteredItem?.title}
                                    </p>
                                    </div>
                                )
                                })
                        }
                    </div>
                        
                               <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <CommonButton func={()=>{
                                    setShowFreePreviewDialog(false);
                        setDisplayVideoFreePreview(null);}} text="close"/>
                                </DialogClose>
                               </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>

                </Card>

                <Card className="mb-8">
    <CardHeader>
        <CardTitle className="font-heading">
            Some Students Feedbacks
        </CardTitle>
    </CardHeader>
    <CardContent>
        {specificCourseRating.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specificCourseRating.map((feedback, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col h-full">
                            <div className="flex items-start gap-3 mb-3">
                                <Avatar className="w-10 h-10 rounded-full cursor-pointer flex justify-center items-center border-2 border-black">
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
                            
                            <p className="text-gray-800 text-sm flex-grow line-clamp-3">
                                {feedback.comment || "No comment provided"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">
                No feedbacks yet. Be the first to review!
            </p>
        )}
    </CardContent>
</Card>

        </main>
        <aside className='w-full md:w-[500px]'>
           <Card className="sticky top-4">
            <CardContent className="p-6">
                    <div className='aspect-video mb-4 rounded-lg flex items-center justify-center'>
                      <VideoPlayerReact url={specificCourseDetails?.curriculum[specificCourseDetails?.curriculum?.findIndex(item=>item.freePreview)].videoUrl}
                      width='450px'
                      height='200px'
                      />
                    </div>
                    <div className='mb-4'>
                        <span className='text-2xl font-bold'>
                           Rs. {specificCourseDetails?.pricing}
                        </span>
                   
                    </div>
                    <PaymentDialog openDialog={openDialog} setOpenDialog={setOpenDialog} courseDetail={specificCourseDetails}/>
                    <CommonButton func={toggleDialog} text="Buy Now"/>
            </CardContent>

           </Card>
        </aside>

     </div>
     <Footer/>
    </div>
  )
}
