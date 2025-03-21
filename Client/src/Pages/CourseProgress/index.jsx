import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UseContextApi } from "@/Components/ContextApi";
import { axiosService } from "@/Services";
import ProgressBar from "@/Components/ProgressBar";
import { Avatar,AvatarImage } from "@radix-ui/react-avatar";
import {
  Get_Course_Progress,
  Update_Content_As_Viewed,
  Reset_Course_Progress,
} from "@/Routes";
import { useSelector } from "react-redux";
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

export default function CourseProgress() {
  const navigate = useNavigate();
  const userStates = useSelector((state) => state?.user);
  const { data: user, loading } = userStates;
  const {
    courseProgress,
    setCourseProgress,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(UseContextApi);
  const { id } = useParams();
  const [lockView, setLockView] = useState(false);

  const [currentContent, setCurrentContent] = useState(null);
  const [courseCompletedDialog, setCourseCompletedDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(true);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
    }
  }, [showConfetti]);

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
        });
        if (response?.data?.completed) {
          setCurrentContent(response?.data?.courseDetails?.curriculum[0]);
          setCourseCompletedDialog(true);
          setShowConfetti(true);
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
        }
      }
    } catch (error) {
      console.log(error);
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
        console.log(error)
      }
      setMediaUploadProgressPercentage(50);
      if (data) {
        const value=URL.createObjectURL(data);
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

  return (
    <div className="flex flex-col h-screen ">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md"
            size="sm"
          >
            <FaChevronLeft className="h-4 w-4 mr-2" />
            Course Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {courseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setSideBarOpen(!sideBarOpen)}>
          {sideBarOpen ? (
            <FaChevronRight className="h-5 w-5" />
          ) : (
            <FaChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden mt-2">
        <div
          className={`flex-1 ${
            sideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayerReact
            width="100%"
            height="500px"
            url={currentContent?.videoUrl}
            onProgressUpdate={setCurrentContent}
            progressData={currentContent}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              {" "}
              {currentContent?.title}
            </h2>
          </div>
        </div>
        <div
          className={`fixed top-[73px] right-0 bottom-0 w-[400px] border-2 border-black transition-all duration-300 ${
            sideBarOpen ? "translate-x-0" : "translate-x-full"
          } rounded-md`}
        >
          <Tabs
            defaultValue="content"
            className="h-full flex flex-col bg-gray-200 rounded-md "
          >
            <TabsList className="grid w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className=" text-black rounded-tl-md rounded-bl-md  h-full"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className=" text-black rounded-tr-md rounded-br-md h-full"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="max-h-[500px] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {courseProgress?.courseDetails?.curriculum.map(
                    (item, index) => {
                      return (
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
                      );
                    }
                  )}
                </div>
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
                    <h1 className="text-xl font-bold mb-4">
                      About this course.
                    </h1>
                    <div className={`flex gap-2  items-center`}>
                      <p>Published By:</p>
                       <div onClick={()=>{
                        if(!courseProgress?.courseDetails?.creator?.userRole?.includes("admin")){
                          navigate(`/teacher/details/${courseProgress?.courseDetails?.creator?._id}`)
                        }
                        else{
                          toast.error("Cannot view Admin Details.")
                        }
                      }
                      }
                        className={`${courseProgress?.courseDetails?.creator?.userRole?.includes("admin")? "cursor-not-allowed":"cursor-pointer"} hover:scale-105 flex items-center  gap-2`}>
                          <Avatar className='w-10 h-10 rounded-full flex justify-center items-center border-2 border-black'>
                                  {courseProgress && (courseProgress?.courseDetails?.creator?.userImage ? 
                                  <AvatarImage 
                                  className="rounded-full"
                                  src={courseProgress?.courseDetails?.creator?.userImage.startsWith("http") ? courseProgress?.courseDetails?.creator?.userImage:`${import.meta.env.VITE_BACKEND_URL}/${courseProgress?.courseDetails?.creator?.userImage}`} 
                                  alt="navimage"  />:(
                                      <div className=' bg-white justify-center items-center px-5 py-3 rounded-full '>{courseProgress?.courseDetails?.creator?.userName?.split("")[0].toUpperCase()}</div>
                                  ))}
                                </Avatar>
                                <p>{courseProgress?.courseDetails?.creator?.userName}</p>
                       </div>
                    </div>
                    <div>
                    <h2 className="text-xl font-bold mb-4">
                      Description
                    </h2>
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
      </div>
      <CourseNotBoughtDialog lockView={lockView} setLockView={setLockView} />
      <CourseCompletedDialog
        courseCompletedDialog={courseCompletedDialog}
        setCourseCompletedDialog={setCourseCompletedDialog}
      />
    </div>
  );
}
