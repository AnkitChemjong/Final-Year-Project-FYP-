import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UseContextApi } from "@/Components/ContextApi";
import { axiosService } from "@/Services";
import ProgressBar from "@/Components/ProgressBar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Get_Course_Progress,
  Update_Content_As_Viewed,
  Reset_Course_Progress,
  Get_Student_Rating_Data
} from "@/Routes";
import { useDispatch, useSelector } from "react-redux";
import Confetti from "react-confetti";
import VideoPlayerReact from "@/Components/VideoPlayerReact";
import CourseNotBoughtDialog from "@/Components/CourseNotBoughtDialog";
import CourseCompletedDialog from "@/Components/CourseCompletedDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { IoPlayCircleOutline } from "react-icons/io5";
import { BiCheckSquare } from "react-icons/bi";
import { GoDownload } from "react-icons/go";
import { toast } from "react-toastify";
import supabaseClient from "@/Components/SupabaseClient";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { handleDwn } from "@/Services";
import { RateDialog } from "@/Components/RateDialog";
import { getAllRating } from "@/Store/Slices/Get_All_Rating";
import { getAllProgress } from "@/Store/Slices/Get_All_Progress";

export const getSingleRateData=async(userId,courseId)=>{
  try{
     const response=await axiosService.get(`${Get_Student_Rating_Data}/${userId}/${courseId}`);
     if(response?.status === 200){
      return response?.data?.data;
     }
  }
catch(error){
  console.log(error);
}
 }

export default function CourseProgress() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const userStates = useSelector((state) => state?.user);
  const { data: user, loading } = userStates;
  const {
    courseProgress,
    setCourseProgress,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    showConfetti,
    setShowConfetti,
    courseCompletedDialog,
    setCourseCompletedDialog,
    showRateCourseDialog,setShowRateCourseDialog,
    userRatingData,setUserRatingData
  } = useContext(UseContextApi);
  const { id } = useParams();
  const [lockView, setLockView] = useState(false);

  const [currentContent, setCurrentContent] = useState(null);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [hasShownRating, setHasShownRating] = useState(false);
 

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
    }
  }, [showConfetti]);


  

  useEffect(()=>{
     const getData=async()=>{
       const data=await getSingleRateData(user?._id,id);
       setUserRatingData(data);
     }
    if(courseProgress?.progressData?.completed){
      getData();
    }
  },[courseProgress]);

  const getCourseProgress = async () => {
    const response = await axiosService.get(
      `${Get_Course_Progress}/${user?._id}/${id}`
    );
    if (response?.status === 200) {
      if (!response?.data?.isPurchased) {
        setLockView(true);
      } else {
        setCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
          progressData: response?.data?.progressData,
          contentCompleted: response?.data?.contentCompleted,
        });
        if (response?.data?.completed) {
          setCurrentContent(response?.data?.courseDetails?.curriculum[0]);
        }
        if (response?.data?.progress.length === 0) {
          setCurrentContent(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewed = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );
          setCurrentContent(
            response?.data?.courseDetails?.curriculum[lastIndexOfViewed + 1]
          );
        }
      }
    }
  };

  useEffect(() => {
    if (!loading && id) {
      getCourseProgress();
    }
  }, [id, loading]);

  const updateCourseProgress = async () => {
    if (currentContent) {
      const response = await axiosService.post(Update_Content_As_Viewed, {
        userId: user?._id,
        courseId: id,
        contentId: currentContent?._id,
      });
      if (response.status === 200) {
        getCourseProgress();
        dispatch(getAllProgress());
      }
    }
  };

  useEffect(() => {
    if (!loading && id) {
      if (currentContent?.progressValue === 1) {
        updateCourseProgress();
      }
      if (currentContent?.videoTime > 0) {
      }
    }
  }, [currentContent, loading]);

  const resetCourse = async () => {
    try {
      if (id) {
        const response = await axiosService.post(Reset_Course_Progress, {
          userId: user?._id,
          courseId: id,
        });
        if (response.status === 200) {
          setCurrentContent(null);
          setShowConfetti(false);
          setCourseCompletedDialog(false);
          getCourseProgress();
          dispatch(getAllProgress());
          dispatch(getAllRating());
          toast.success(response?.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const playThisVideo = (item) => {
    setCurrentContent(item);
  };

  const handleDownloadExtraResource = async (filePath) => {
    try {
      setMediaUploadProgress(true);
      setMediaUploadProgressPercentage(0);
      const fileName = filePath.split("/").pop();
      const { data, error } = await supabaseClient.storage
        .from("extra-resources")
        .download(filePath);

      if (error) {
        toast.error(error?.message);
        console.log(error);
      }
      setMediaUploadProgressPercentage(50);
      if (data) {
        const value = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = value;
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(value);
        setTimeout(() => setMediaUploadProgressPercentage(100), 100);
        toast.success("Resources Downloaded Successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error("error on downloading the resources.");
    } finally {
      setTimeout(() => setMediaUploadProgress(false), 500);
    }
  };

  const handleDownloadCertificate = async (filePath) => {
    try {
      setMediaUploadProgress(true);
      setMediaUploadProgressPercentage(0);
      await handleDwn('download',filePath);
      setMediaUploadProgressPercentage(50);
      setTimeout(() => setMediaUploadProgressPercentage(100), 100);
      toast.success("certificate Downloaded Successfully.");
      
    } catch (error) {
      console.log(error);
      toast.error("error on downloading certificate.");
    } finally {
      setTimeout(() => setMediaUploadProgress(false), 500);
    }
  };

  const handleCourseDialogClose = () => {
    //check for showing only once if the case of reopening the course complete is again and again
    if (!hasShownRating) {
      setShowRateCourseDialog(true);
      setHasShownRating(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-screen">
        {showConfetti && <Confetti />}
        <div className="flex items-center justify-between p-4 border-b border-black">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate(`/studentCourse`)}
              className="bg-green-600 font-playfair text-white px-5 py-5 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md"
              size="sm"
            >
              <FaChevronLeft className="h-4 w-4 mr-2" />
              Enrollded Courses
            </Button>
            <h1 className="text-lg font-bold hidden md:block">
              {courseProgress?.courseDetails?.title}
            </h1>
          </div>
          <div className="flex items center gap-2">
            {
             courseProgress?.progressData?.completed &&
            <Button onClick={resetCourse} className="font-playfair bg-green-600 text-white px-5 py-5 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md">
            Reset Course
          </Button>
            }
          <Button className="hover:scale-105 transform transition-transform duration-300 ease-in-out" onClick={() => setSideBarOpen(!sideBarOpen)}>
            {sideBarOpen ? (
              <FaChevronRight className="h-5 w-5" />
            ) : (
              <FaChevronLeft className="h-5 w-5" />
            )}
          </Button>
            </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          
          <div
             className={`flex-1 transition-all duration-300 ${
              sideBarOpen ? "w-[calc(100%-400px)]" : "w-full"
            }`}
          >
            <div className="p-4">
              <VideoPlayerReact
                width="100%"
                height="500px"
                url={currentContent?.videoUrl}
                onProgressUpdate={setCurrentContent}
                progressData={currentContent}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {currentContent?.title}
                </h2>
              </div>
            </div>
          </div>

          
          {sideBarOpen && (
            <div className={`sidebar w-[400px] border-2 border-black bg-gray-200 rounded-md transition-all duration-300 ${
              sideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
              <Tabs
                defaultValue="content"
                className="h-full flex flex-col bg-gray-200 rounded-md"
              >
                <TabsList className="grid w-full grid-cols-2 p-0 h-14">
                  <TabsTrigger
                    value="content"
                    className="text-black rounded-tl-md rounded-bl-md h-full font-heading"
                  >
                    Course Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="overview"
                    className="text-black rounded-tr-md rounded-br-md h-full font-heading"
                  >
                    Overview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <ScrollArea className="max-h-[500px] overflow-y-auto ">
                  {mediaUploadProgress && (
                      <div className="p-5">
                        <ProgressBar
                          isUploading={mediaUploadProgress}
                          progress={mediaUploadProgressPercentage}
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-4">
                      {courseProgress?.courseDetails?.curriculum.map(
                        (item, index) => (
                          <div
                            key={index}
                            onClick={() => playThisVideo(item)}
                            className="flex items-center space-x-2 text-sm font-bold cursor-pointer border-2 border-b-black py-1"
                          >
                            {courseProgress?.progress?.find(
                              (courseItem) => courseItem.contentId === item._id
                            )?.viewed ? (
                              <BiCheckSquare className="h-4 w-4 text-green-600" />
                            ) : (
                              <IoPlayCircleOutline className="w-4 h-4" />
                            )}
                            <span>{item?.title}</span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex justify-center mt-4">
                      {courseProgress?.contentCompleted && (
                        <Button
                          onClick={() =>
                            navigate(`/course/courseProgress/quiz/${id}`)
                          }
                          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                          {courseProgress?.progressData?.quizSubmitted
                            ? "View Exam Result"
                            : "Give Certification Exam"}
                        </Button>
                      )}
                    </div>

                    {courseProgress?.progressData?.certificate && (
  <div className="mt-6 p-4">
    <div className="bg-gray-400 p-5 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 font-heading">
      Download Your Certificate
    </h2>
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 transition-all">
      <p onClick={()=>handleDwn('view',courseProgress?.progressData?.certificate)} className="cursor-pointer text-gray-700 text-sm truncate flex-1 mr-4 font-playfair">
        {courseProgress?.progressData?.certificate.split("/").pop()}
      </p>
      <Button
        onClick={() =>
          handleDownloadCertificate(
            courseProgress?.progressData?.certificate
          )
        }
        className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-transform transform hover:scale-105"
        aria-label="Download Extra Resource"
      >
        <GoDownload className="w-5 h-5" />
      </Button>
    </div>
    </div>
   {(courseProgress?.progressData?.completed && userRatingData===null) &&
    <div className="flex items-center justify-center p-5">
      <Button
      onClick={()=>setShowRateCourseDialog(true)} 
      className="p-2 rounded-md bg-green-600 hover:bg-blue-600 text-white transition-transform transform hover:scale-105">
        Give Rating
      </Button>

    </div>}
  </div>
)}
  </ScrollArea>
                </TabsContent>
                <TabsContent value="overview">
                  <ScrollArea className="max-h-[500px] overflow-y-auto">
                    {mediaUploadProgress && (
                      <div className="p-5">
                        <ProgressBar
                          isUploading={mediaUploadProgress}
                          progress={mediaUploadProgressPercentage}
                        />
                      </div>
                    )}
                    <div className="p-4 flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold mb-4 font-heading">
                          About this course.
                        </h1>
                        <div className="flex gap-2 items-center">
                          <p>Published By:</p>
                          <div
                            onClick={() => {
                              if (
                                !courseProgress?.courseDetails?.creator?.userRole?.includes(
                                  "admin"
                                )
                              ) {
                                navigate(
                                  `/teacher/details/${courseProgress?.courseDetails?.creator?._id}`
                                );
                              } else {
                                toast.error("Cannot view Admin Details.");
                              }
                            }}
                            className={`${
                              courseProgress?.courseDetails?.creator?.userRole?.includes(
                                "admin"
                              )
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } hover:scale-105 flex items-center gap-2`}
                          >
                            <Avatar className="w-10 h-10 rounded-full flex justify-center items-center border-2 border-black">
                              {courseProgress &&
                                (courseProgress?.courseDetails?.creator
                                  ?.userImage ? (
                                  <AvatarImage
                                    className="rounded-full"
                                    src={
                                      courseProgress?.courseDetails?.creator?.userImage.startsWith(
                                        "http"
                                      )
                                        ? courseProgress?.courseDetails?.creator
                                            ?.userImage
                                        : `${
                                            import.meta.env.VITE_BACKEND_URL
                                          }/${
                                            courseProgress?.courseDetails?.creator
                                              ?.userImage
                                          }`
                                    }
                                    alt="navimage"
                                  />
                                ) : (
                                  <div className="bg-white justify-center items-center px-5 py-3 rounded-full">
                                    {courseProgress?.courseDetails?.creator?.userName
                                      ?.split("")[0]
                                      .toUpperCase()}
                                  </div>
                                ))}
                            </Avatar>
                            <p>
                              {courseProgress?.courseDetails?.creator?.userName}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold mb-4 font-heading">Description</h2>
                          <p className="text-black">
                            {courseProgress?.courseDetails?.description}
                          </p>
                        </div>
                      </div>
                      {courseProgress?.courseDetails?.extraResources && (
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                          <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Extra Resources :
                          </h2>
                          <div className="flex items-center justify-between p-3 bg-slate-300 rounded-md shadow-sm">
                            <p className="text-black text-sm truncate w-full">
                              {courseProgress?.courseDetails?.extraResources
                                .split("/")
                                .pop()}
                            </p>
                            <Button
                              onClick={() =>
                                handleDownloadExtraResource(
                                  courseProgress?.courseDetails?.extraResources
                                )
                              }
                              className="p-2 rounded-md bg-blue-300 hover:bg-blue-600 text-white transition"
                            >
                              <GoDownload className="w-5 h-5 text-black" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        {lockView && <CourseNotBoughtDialog lockView={lockView} setLockView={setLockView} />}
        {courseCompletedDialog && <CourseCompletedDialog
          courseCompletedDialog={courseCompletedDialog}
          setCourseCompletedDialog={setCourseCompletedDialog}
          onClose={handleCourseDialogClose}
        />}

        {showRateCourseDialog && <RateDialog open={showRateCourseDialog} onOpenChange={setShowRateCourseDialog} userId={user?._id} courseId={id} 
        onSubmitRating={()=>{}}  />}
      </div>
      <Footer />
    </div>
  );
}