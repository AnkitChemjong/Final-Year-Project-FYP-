import React, { useContext, useEffect,useState } from 'react';
import { Button } from '@/Components/ui/button';
import { FaChevronLeft ,FaChevronRight} from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { UseContextApi } from '@/Components/ContextApi';
import { axiosService } from '@/Services';
import { Get_Course_Progress, Update_Content_As_Viewed,Reset_Course_Progress } from '@/Routes';
import { useSelector } from 'react-redux';
import Confetti from 'react-confetti';
import VideoPlayerReact from '@/Components/VideoPlayerReact';
import CourseNotBoughtDialog from '@/Components/CourseNotBoughtDialog';
import CourseCompletedDialog from '@/Components/CourseCompletedDialog';
import { Tabs,TabsList,TabsTrigger,TabsContent } from '@/Components/ui/tabs';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { IoPlayCircleOutline } from "react-icons/io5";
import { BiCheckSquare } from "react-icons/bi";

export default function CourseProgress() {
    const navigate=useNavigate();
    const userStates = useSelector(state => state?.user);
        const { data: user, loading } = userStates; 
    const {courseProgress,setCourseProgress}=useContext(UseContextApi);
     const {id}=useParams();
     const [lockView,setLockView]=useState(false);

     const [currentContent,setCurrentContent]=useState(null);
     const [courseCompletedDialog,setCourseCompletedDialog]=useState(false);
     const [showConfetti,setShowConfetti]=useState(false);
     const [sideBarOpen,setSideBarOpen]=useState(true); 

     useEffect(()=>{
        if(showConfetti){
            setTimeout(()=>{
                setShowConfetti(false);
            },5000);
        }

     },[showConfetti]);


     const getCourseProgress=async()=>{
            const response=await axiosService.get(`${Get_Course_Progress}/${user?._id}/${id}`);
            if(response?.status === 200){
                if(!response?.data?.isPurchased){
                   setLockView(true);
                }
                else{
                    setCourseProgress({
                        courseDetails:response?.data?.courseDetails,
                        progress:response?.data?.progress,

                    });
                    if(response?.data?.completed){
                        setCurrentContent(response?.data?.courseDetails?.curriculum[0]);
                        setCourseCompletedDialog(true);
                        setShowConfetti(true);
                    }
                    if(response?.data?.progress.length === 0){
                        setCurrentContent(response?.data?.courseDetails?.curriculum[0])
                    }
                    else{
                           const lastIndexOfViewed = response?.data?.progress.reduceRight((acc,obj,index)=>{
                            return acc === -1 && obj.viewed ? index:acc;
                           },-1);
                           setCurrentContent(
                            response?.data?.courseDetails?.curriculum[
                              lastIndexOfViewed + 1
                            ]
                          );
                    }
                }
            }
    }

     useEffect(()=>{
        if(!loading && id){
        getCourseProgress();
        }
     },[id,loading]);
     

     const updateCourseProgress=async()=>{
        if(currentContent){
            const response=await axiosService.post(Update_Content_As_Viewed,{userId:user?._id,courseId:id,contentId:currentContent?._id});
            if(response.status === 200){
               getCourseProgress();
            }
        }
     }

     useEffect(()=>{
        if(!loading && id){
            if(currentContent?.progressValue === 1){
             updateCourseProgress()
            }
            if(currentContent?.videoTime > 0){
     
            }
        }
     },[currentContent,loading]);

     const resetCourse=async()=>{
        try{
          if(id){
            const response=await axiosService.post(Reset_Course_Progress,{userId:user?._id,courseId:id});
            if(response.status === 200){
              setCurrentContent(null);
              setShowConfetti(false);
              setCourseCompletedDialog(false);
              getCourseProgress();
            }
          }
        }
        catch(error){
          console.log(error);
        }
     }
     const playThisVideo=(item)=>{
      setCurrentContent(item);
     }

  return (
      <div className='flex flex-col h-screen '>
        {
            showConfetti && <Confetti/>
        }
        <div className='flex items-center justify-between p-4 border-b border-black'>
             <div className='flex items-center space-x-4'>
             <Button
            onClick={() => navigate("/studentCourse")}
            className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md"
            size="sm"
          >
            <FaChevronLeft className="h-4 w-4 mr-2" />
             Course Page
          </Button>
                    <h1 className='text-lg font-bold hidden md:block'>
                        {
                            courseProgress?.courseDetails?.title
                        }
                    </h1>
            </div>
                         <Button onClick={()=>setSideBarOpen(!sideBarOpen)}>
                          {
                            sideBarOpen?
                               <FaChevronRight className='h-5 w-5'/>:<FaChevronLeft className='h-5 w-5'/> 
                          }
                         </Button>
        </div>
        <div className='flex flex-1 overflow-hidden mt-2'>
          <div className={`flex-1 ${sideBarOpen? "mr-[400px]":""} transition-all duration-300`}>
            <VideoPlayerReact
             width='100%'
             height="500px"
             url={currentContent?.videoUrl}
             onProgressUpdate={setCurrentContent}
             progressData={currentContent}
            />
            <div className='p-6'>
              <h2 className='text-2xl font-bold mb-2'> {currentContent?.title}</h2>
            </div>
          </div>
      <div className={`fixed top-[73px] right-0 bottom-0 w-[400px] border-2 border-black transition-all duration-300 ${sideBarOpen? 'translate-x-0':'translate-x-full'} rounded-md`}>
         <Tabs defaultValue='content' className='h-full flex flex-col bg-gray-200 rounded-md '>
           <TabsList className="grid w-full grid-cols-2 p-0 h-14">
                 <TabsTrigger value="content" className=" text-black rounded-tl-md rounded-bl-md  h-full" >
                    Course Content
                 </TabsTrigger>
                 <TabsTrigger value="overview" className=" text-black rounded-tr-md rounded-br-md h-full">
                  Overview
                 </TabsTrigger>
           </TabsList>
           <TabsContent value="content">
             <ScrollArea className="max-h-[500px] overflow-y-auto">
               <div className='p-4 space-y-4'>
                {
                    courseProgress?.courseDetails?.curriculum.map((item,index)=>{
                        return(
                            <div key={index} onClick={()=>playThisVideo(item)} className='flex items-center space-x-2 text-sm font-bold cursor-pointer border-2 border-b-black py-1'>
                                {
                                    courseProgress?.progress?.find(courseItem=>courseItem.contentId === item._id)?.viewed?
                                    <BiCheckSquare className='h-4 w-4 text-green-600'/>:<IoPlayCircleOutline className='w-4 h-4'/>
                                }
                                <span>{item?.title}</span>
                            </div>
                        )
                    })
                }
              
               </div>
              
             </ScrollArea>
           </TabsContent>
           <TabsContent value="overview" className="flex-1 overflow-hidden">
             <ScrollArea className="h-full">
                <div className='p-4'>
                    <h2 className='text-xl font-bold mb-4'>About this course.</h2>
                    <p className='text-black'>
                        {courseProgress?.courseDetails?.description}
                    </p>

                </div>

             </ScrollArea>
           </TabsContent>
         </Tabs>
        </div>
        </div>
      <CourseNotBoughtDialog lockView={lockView} setLockView={setLockView} />
      <CourseCompletedDialog courseCompletedDialog={courseCompletedDialog} setCourseCompletedDialog={setCourseCompletedDialog} resetCourse={resetCourse}/>
      </div>
  )
}
