import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "@/Components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { GrCircleInformation } from "react-icons/gr";
import { TbLockPassword } from "react-icons/tb";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import DialogForCV from "@/Components/DialogForCV";
import Footer from "@/Components/Footer";
import { getCourse } from "@/Store/Slices/Course_Slice";
import { getAllUser } from "@/Store/Slices/Get_All_User";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteDialog from "@/Components/DeleteDialog";
import verified from '@/assets/verified.json';
import LottieAnimation from "@/Components/LottieAnimation";
import {
  User_Upload_Profile_Image,
  User_Delete_Profile_Image,
  User_Info_Update,
  User_Update_Pass_Route,
  User_Become_Teacher,
  Update_Teacher_Info,
  Delete_Single_Application
} from "@/Routes";
import HireApplication from "@/Components/Hire_Application";
import SkeletonCard from "@/Components/SkeletonCard";
import { IoMdStats } from "react-icons/io";
import { Badge } from "@/Components/ui/badge";
import { getUser } from "@/Store/Slices/User_Slice";
import { getApplication } from "@/Store/Slices/ApplicationSlice";
import { toast } from "react-toastify";
import { axiosService } from "@/Services";
import { Get_Student_Hire_Application } from "@/Routes";
import {
  updateProfileInitialState,
  changePasswordForm,
  changePasswordInitialState,
  becomeTeacherForm,
  becomeTeacherInitialState,
  updateTeacherInfoInitialState,
  updateTeacherInfoComponents
} from "@/Utils";
import DialogForm from "@/Components/DialogForm";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UseContextApi } from "@/Components/ContextApi";

export const getStudentHireApplication=async(id)=>{
  try{
     const response=await axiosService.get(`${Get_Student_Hire_Application}/${id}`);
     if(response.status === 200){
      return response?.data?.application;
     }
  }
  catch(error){
    console.log(error)
  }
}

export default function Profile() {
  const userStates = useSelector((state) => state?.user);
  const { data: user, loading } = userStates;
  const userApplicationStates = useSelector((state) => state?.application);
  const {data:userApplication,loading1}=userApplicationStates;
  const progressState=useSelector(state=>state?.progress);
  const {data:progress,loading2}=progressState;
  const purchasedCourseState=useSelector(state=>state?.coursePurchased);
  const {data:purchasedCourse,loading3}=purchasedCourseState;
  const courseState=useSelector(state=>state?.course);
  const {data:allCourse,loading4}=courseState;
  const [userApplicationData,setUserApplicationData]=useState(null);
  const [hover, setHover] = useState(false);
  const upProfileImage = useRef();
  const [dialog1, setDialog1] = useState(false); // Update Profile Dialog
  const [dialog2, setDialog2] = useState(false); // Password Change Dialog
  const [dialog3, setDialog3] = useState(false); // Become Teacher Dialog
  const [dialog4, setDialog4] = useState(false); // My CV Dialog
  const [dialog5, setDialog5] = useState(false); // Update Teachr Info Dialog
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [dialog6, setDialog6] = useState(false);
  const {studentHireApplicationList,setStudentHireApplicationList}=useContext(UseContextApi);

  useEffect(()=>{
     if(user && userApplication){
      const application= userApplication?.find((data) => data?.user?._id === user?._id)
      setUserApplicationData(application);
     }
  },[userApplication,user]);

  useEffect(() => {
    if (user) {
      const getUsersRequestApplication=async()=>{
        const result=await getStudentHireApplication(user?._id);
        setStudentHireApplicationList(result);
      }
      getUsersRequestApplication();
    };
  },[loading]);

  const updateProfileInputs = [
    {
      label: "User Name",
      name: "userName",
      placeholder: user?.userName,
      type: "text",
      componentType: "input",
    },
    {
      label: "Address",
      name: "address",
      placeholder: user?.address || "Enter Your Address.",
      type: "text",
      componentType: "input",
    },
    {
      label: "Phone",
      name: "phone",
      placeholder: user?.phone || "Enter Your Contact Number.",
      type: "number",
      componentType: "input",
    },
    {
      label: "Gender",
      name: "gender",
      type: "radio",
      componentType: "gender",
    },
    {
      label: "Date Of Birth",
      name: "DOB",
      type: "date",
      componentType: "date",
    }
  ];

  const details = [
    {
      icon: "📧",
      text: user?.email || "null",
      size: 20,
    },
    {
      icon: "📞",
      text: user?.phone || "null",
      size: 20,
    },
    {
      icon: "🏠",
      text: user?.address || "null",
      size: 20,
    },
  ];

  const moreDetails = [
    {
      icon: "👤",
      text: user?.gender || "null",
      size: 20,
    },
    {
      icon: "🎂",
      text: user?.DOB? moment(user?.DOB).format("MMMM DD, YYYY"): "null",
      size: 20,
    }
  ];

  const handleFileInputClick = () => {
    upProfileImage.current.click();
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profile-image", file);
        const response = await axiosService.patch(
          User_Upload_Profile_Image,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          dispatch(getUser());
          dispatch(getApplication());
          dispatch(getAllUser());
          dispatch(getCourse());
          toast.success(response?.data?.message);
        }
      } else {
        toast.error("No file selected.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleProfileImageDelete = async () => {
    try {
      const response = await axiosService.delete(User_Delete_Profile_Image);
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication());
        dispatch(getAllUser());
        dispatch(getCourse());
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleEvent1 = async (data) => {
    try {
      const response = await axiosService.patch(User_Info_Update, data);
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication());
        dispatch(getCourse());
        dispatch(getAllUser());
        setDialog1(false);
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEvent2 = async (data) => {
    try {
      const response = await axiosService.patch(User_Update_Pass_Route, data);
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication());
        dispatch(getCourse());
        dispatch(getAllUser());
        setDialog2(false);
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEvent3 = async (data) => {
    try {
      const formData = new FormData();
      formData.append("cv", data?.cv);
      const response = await axiosService.post(User_Become_Teacher, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication());
        dispatch(getCourse());
        dispatch(getAllUser());
        setDialog3(false);
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEvent4 = async (data) => {
    try {
      const formData = new FormData();
      formData.append("certificate", data?.certificate);
      formData.append("feePerHour",data?.feePerHour);
      formData.append("degree", data?.degree);
      formData.append("avilability", data?.avilability);
      formData.append("description", data?.description);
      formData.append("college", data?.college);
      formData.append("university", data?.university);
      formData.append("category",data?.category);
      formData.append("primaryLanguage",data?.primaryLanguage);
      formData.append("experience",data?.experience);
      if(user){
        const response = await axiosService.post(`${Update_Teacher_Info}/${user?._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response?.status === 200) {
          dispatch(getUser());
          dispatch(getApplication());
          dispatch(getCourse());
          dispatch(getAllUser());
          setDialog5(false);
          toast.success(response?.data?.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDeleteApplication=async()=>{
    try{
      if(userApplicationData){
        const response=await axiosService.delete(Delete_Single_Application,{data:{data:userApplicationData}},{withCredentials:true, headers: {
          "Content-Type": "application/json"
        }});
        if(response.status===200){
          dispatch(getApplication());
          setDialog6(false);
          toast.success(response?.data?.message);
        }
      }
      else{
        toast.error("no application data to delete.")
      }
    }
    catch(error){
      toast.error(error?.response?.data?.message);
    }
  }

  const toggleDialog1 = () => {
    setDialog1(!dialog1);
  };

  const toggleDialog2 = () => {
    setDialog2(!dialog2);
  };

  const toggleDialog3 = () => {
    setDialog3(!dialog3);
  };

  const toggleDialog4 = () => {
    setDialog4(!dialog4);
  };
  const toggleDialog5 = () => {
    setDialog5(!dialog5);
  };
  const toggleDialog6= () => {
    setDialog6(!dialog6);
  };

  if(!user || !allCourse || !purchasedCourse){
    return(
      <div>
        <Navbar />
        <SkeletonCard />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {!user?.DOB && (
          <div className="flex w-full p-2 gap-3 justify-center items-center bg-blue-200 rounded-lg mb-1">
            <GrCircleInformation className="w-5 h-5 text-red-800"/>
            <span className="text-sm text-red-800">
              Complete your profile info to become a Teacher.
            </span>
          </div>
        )}
        {
          (user?.userRole?.includes("teacher") && !user?.teacherInfo) && 
          <div className="flex w-full p-3 gap-3 justify-center items-center bg-blue-200 rounded-lg mb-1">
            <GrCircleInformation className="w-5 h-5 text-red-800"/>
            <span className="text-sm text-red-800">
              Please Complete your Teacher info.
            </span>
          </div>   
        }
        
        <div className="w-full px-4 py-8 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
           
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
              <div className="flex flex-col items-center">
                <div
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <Avatar className="h-32 w-32 rounded-full cursor-pointer flex justify-center items-center border-4 border-blue-500">
                    {user?.userImage ? (
                      <AvatarImage
                        src={
                          user?.userImage.startsWith("http")
                            ? user?.userImage
                            : `${import.meta.env.VITE_BACKEND_URL}/${user?.userImage}`
                        }
                        alt="profile"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-blue-100 w-full h-full flex justify-center items-center text-4xl font-bold text-blue-700">
                        {user?.userName?.split("")[0].toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  {hover && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                      onClick={
                        user?.userImage
                          ? handleProfileImageDelete
                          : handleFileInputClick
                      }
                    >
                      {user?.userImage ? (
                        <FaTrash className="text-white text-3xl cursor-pointer" />
                      ) : (
                        <FaPlus className="text-white text-3xl cursor-pointer" />
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={upProfileImage}
                    onChange={handleImageChange}
                    className="hidden"
                    name="profile-image"
                    accept=".png, .jpg, .jpeg, .svg, .webp"
                  />
                </div>
              </div>

             
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex gap-2 items-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user?.userName}
                  </h1>
                  {!loading && user?.subscription?.subscriptionType === 'elite' &&
                    <LottieAnimation animationData={verified} width={50} height={50} speed={1} />
                  }
                </div>
                
                <div className="flex gap-2 items-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    {user?.userRole?.map((item, index) => (
                      <Badge
                        key={index}
                        className="bg-green-600 text-white px-3 py-1"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <div className="relative cursor-pointer group">
                    <TbLockPassword
                      onClick={toggleDialog2}
                      size={24}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-white text-xs bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      Change Password
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="flex flex-col gap-3">
                {details?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm text-gray-700">{item?.text}</p>
                  </div>
                ))}
              </div>

            
              <div className="flex justify-center">
                <Button
                  onClick={toggleDialog1}
                  className="bg-green-600 text-white px-6 py-3 hover:scale-105 hover:bg-blue-700 transition-colors duration-300 shadow-md w-full sm:w-auto"
                >
                  Update Info
                </Button>
              </div>
            </div>

        
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <GrCircleInformation size={24} className="text-green-600" />
                  <h1 className="text-2xl font-bold text-gray-900">More Info</h1>
                </div>
                <div className="flex flex-col gap-2">
                  {moreDetails?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <p className="text-sm text-gray-700">{item?.text}</p>
                    </div>
                  ))}
                </div>
              </div>

        
              {user?.userRole?.includes("teacher") && user?.teacherInfo && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <GrCircleInformation size={24} className="text-green-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Teacher Info</h1>
                  </div>
                  <div className="flex flex-col gap-2">
                    {user?.teacherInfo?.degree && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🎓</span>
                          <p className="text-sm text-gray-700 font-semibold">Degree:</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user?.teacherInfo?.degree?.split(",").map((item, index) => (
                            <Badge className="bg-green-600 text-white px-2 py-1 text-xs" key={index}>
                              {item.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {user?.teacherInfo?.avilability && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📅</span>
                          <p className="text-sm text-gray-700 font-semibold">Availability:</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user?.teacherInfo?.avilability?.split(",").map((item, index) => (
                            <Badge className="bg-green-600 text-white px-2 py-1 text-xs" key={index}>
                              {item.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {user?.teacherInfo?.description && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <GrCircleInformation className="text-blue-600" size={16} />
                          <p className="text-sm text-gray-700 font-semibold">Description:</p>
                        </div>
                        <div className="w-full max-h-32 overflow-y-auto bg-gray-100 p-2 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {user?.teacherInfo?.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {user?.teacherInfo?.college && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🏫</span>
                        <p className="text-sm text-gray-700">
                          <strong>College:</strong> {user?.teacherInfo?.college}
                        </p>
                      </div>
                    )}

                    {user?.teacherInfo?.university && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🏛️</span>
                        <p className="text-sm text-gray-700">
                          <strong>University:</strong> {user?.teacherInfo?.university}
                        </p>
                      </div>
                    )}

                    {user?.teacherInfo?.feePerHour && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">₹</span>
                        <p className="text-sm text-gray-700">
                          <strong>Fee: Rs.</strong> {`${user?.teacherInfo?.feePerHour} /hr`}
                        </p>
                      </div>
                    )}

                    {user?.teacherInfo?.category && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📂</span>
                        <p className="text-sm text-gray-700">
                          <strong>Category:</strong> {user?.teacherInfo?.category}
                        </p>
                      </div>
                    )}

                    {user?.teacherInfo?.primaryLanguage && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🗣️</span>
                        <p className="text-sm text-gray-700">
                          <strong>Primary Language:</strong> {user?.teacherInfo?.primaryLanguage}
                        </p>
                      </div>
                    )}

                    {user?.teacherInfo?.experience && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🏆</span>
                        <p className="text-sm text-gray-700">
                          <strong>Experience:</strong> {user?.teacherInfo?.experience} Yr
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Teacher Info Update Button */}
              {user?.userRole?.includes("teacher") && (
                <div className="flex justify-center">
                  <Button
                    onClick={toggleDialog5}
                    className="bg-green-600 text-white px-6 py-3 hover:scale-105 hover:bg-blue-700 transition-colors duration-300 shadow-md w-full sm:w-auto"
                  >
                    Update TeacherInfo
                  </Button>
                </div>
              )}
            </div>

         
            <div className="w-full lg:w-1/3 flex flex-col gap-6 bg-gray-100 rounded-xl p-6">
         
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <IoMdStats size={24} color="green"/>
                  <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Courses Completed</span>
                    <span className="text-xl font-bold text-blue-600">
                      {progress?.filter(item=>item?.userId === user?._id && item?.completed === true)?.length}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Courses Bought</span>
                    <span className="text-xl font-bold text-blue-600">
                      {purchasedCourse?.find(item=>item?.userId === user?._id)?.courses?.length || 0}
                    </span>
                  </div>
                  {user?.userRole?.includes("teacher") && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Courses Uploaded</span>
                      <span className="text-xl font-bold text-blue-600">
                        {allCourse?.filter(item=>item?.creator?._id === user?._id)?.length}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Certificates</span>
                    <span className="text-xl font-bold text-blue-600">
                      {user?.courseCertificates?.length}
                    </span>
                  </div>
                </div>
              </div>

        
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {user?.userRole?.includes("teacher") ? (
                    <Button 
                      onClick={()=>navigate('/teacher/dashboard')} 
                      className="bg-green-600 hover:scale-105 text-white px-4 py-2 hover:bg-blue-700 transition-colors duration-300 shadow-md w-full sm:w-auto"
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <Button
                      onClick={toggleDialog3}
                      disabled={!user?.DOB || userApplicationData}
                      className="bg-green-600 text-white px-4 py-2 hover:bg-blue-700 hover:scale-105 transition-colors duration-300 shadow-md w-full sm:w-auto"
                    >
                      {userApplicationData ? "Processing" : "Become Teacher"}
                    </Button>
                  )}
                  
                  {user?.userRole?.includes("teacher") && (
                    <Button
                      onClick={toggleDialog4}
                      className="bg-green-600 text-white px-4 py-2 hover:bg-blue-700 hover:scale-105 transition-colors duration-300 shadow-md w-full sm:w-auto"
                    >
                      My CV
                    </Button>
                  )}
                  
                  <Button
                    onClick={()=>navigate("/studentCourse")}
                    className="bg-green-600 text-white px-4 py-2 hover:bg-blue-700 hover:scale-105 transition-colors duration-300 shadow-md w-full sm:w-auto"
                  >
                    Enrolled Courses
                  </Button>
                </div>
              </div>

            
              {userApplicationData && (
                <div className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 mt-2">
                  <h2 className="text-lg font-semibold text-slate-800 mb-2 text-center">
                    Your Application to Become a Teacher
                  </h2>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            userApplicationData?.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : userApplicationData?.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {userApplicationData?.status}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Created At:</span>{" "}
                        {moment(userApplicationData?.createdAt).format("MMMM DD, YYYY")}
                      </p>
                    </div>
                    <button 
                      onClick={toggleDialog6} 
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors duration-200"
                      aria-label="Delete application"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
     
      <HireApplication applicationList={studentHireApplicationList}/>

      
      {/* Dialogs */}
      {dialog1 && <DialogForm
        title="Update Profile Info"
        description="Enter New Profile Data."
        dialog={dialog1}
        setDialog={setDialog1}
        func={handleEvent1}
        type="updateProfile"
        componentInputs={updateProfileInputs}
        initialState={updateProfileInitialState}
      />}
      
      {dialog5 && <DialogForm
        title="Update Teacher Info"
        description="Enter New Data. Files should be in single pdf format."
        dialog={dialog5}
        setDialog={setDialog5}
        func={handleEvent4}
        type="updateTeacherInfo"
        componentInputs={updateTeacherInfoComponents}
        initialState={updateTeacherInfoInitialState}
        accept="application/pdf"
      />}
      
      {dialog2 && <DialogForm
        title="Update Your Password"
        description="Make new Password."
        dialog={dialog2}
        setDialog={setDialog2}
        func={handleEvent2}
        type="updatePassword"
        componentInputs={changePasswordForm}
        initialState={changePasswordInitialState}
      />}
      
      {dialog3 && <DialogForm
        title="Become Teacher"
        description="Provide your valid CV in pdf format."
        dialog={dialog3}
        setDialog={setDialog3}
        func={handleEvent3}
        type="becomeTeacher"
        accept="application/pdf"
        componentInputs={becomeTeacherForm}
        initialState={becomeTeacherInitialState}
      />}
      
      {dialog4 && <DialogForCV
        dialog4={dialog4}
        setDialog4={setDialog4}
        title="Your CV"
        description="View and update your CV to keep your profile up-to-date."
        user={user}
      />}
      
      {dialog6 && <DeleteDialog
        deleteDialog={dialog6}
        setDeleteDialog={setDialog6}
        title={"Delete Become Teacher Application."}
        description={"The process cannot be undone after deletion."}
        func={handleDeleteApplication}
      />}

      <Footer />
    </div>
  );
}