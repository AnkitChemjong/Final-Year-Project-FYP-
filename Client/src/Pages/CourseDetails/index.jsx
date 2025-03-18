import React, { useContext,useEffect,useState } from 'react';
import Navbar from '@/Components/Navbar';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
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
    CardHeader, CardTitle } from "@/components/ui/card";
import PaymentDialog from '@/Components/PaymentDialog';
import { Get_Course_Detail } from '@/Routes';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,} from "@/components/ui/dialog";
import { FaGlobeAsia } from "react-icons/fa";
import { axiosService } from '@/Services';

export default function CourseDetails() {
    const navigate=useNavigate();
    const userStates = useSelector(state => state.user);
        const { data: user, loading } = userStates; 
    const {specificCourseDetails,setSpecificCourseDetails,
        specificCourseDetailsId,setSpecificCourseDetailsId,
    }=useContext(UseContextApi);
    const [displayVideoFreePreview, setDisplayVideoFreePreview] =useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [openDialog,setOpenDialog]=useState(false);

  const toggleDialog=()=>{
    setOpenDialog(true);
  }

    useEffect(() => {
        if (!location.pathname.includes("course/details")){  
            setSpecificCourseDetails(null)
            setSpecificCourseDetailsId(null)
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

if(!setSpecificCourseDetails){
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
     <div className='mx-auto p-4'>
          <div className="bg-indigo-600 text-white p-8 rounded-t-lg" >
            <h1 className='text-3xl font-bold font-mono mb-4'>
                {specificCourseDetails?.title}
            </h1>
            <p className='text-xl mb-4 '>Subtitle: {specificCourseDetails?.subtitle}</p>
             <div className='flex items-center space-x-4 mt-2 text-sm'>
                <span>Published By : {specificCourseDetails?.creator?.userName}</span>
                <span>Published On : {moment(specificCourseDetails?.createdAt).format("MMMM DD, YYYY")}</span>
                <span className='flex items-center'>
                <FaGlobeAsia className='mr-1 h-4 w-4'/>
                  {specificCourseDetails?.primaryLanguage}
                </span>
                <span>
                  Enrolled {specificCourseDetails?.students?.length<=1? "Student":"Students"} :  {specificCourseDetails?.students?.length}
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
                    <CardTitle>
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
                    <CardTitle>Course Content</CardTitle>

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
                               <DialogTitle>Preview Free Video</DialogTitle>
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
