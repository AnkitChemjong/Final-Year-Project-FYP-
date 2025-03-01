import React, { useRef, useState } from "react";
import Navbar from "@/Components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FiPhoneCall } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";
import { GrCircleInformation } from "react-icons/gr";
import { TbLockPassword } from "react-icons/tb";
import { CiCalendarDate } from "react-icons/ci";
import { BsGenderAmbiguous } from "react-icons/bs";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import DialogForCV from "@/Components/DialogForCV";
import {
  User_Upload_Profile_Image,
  User_Delete_Profile_Image,
  User_Info_Update,
  User_Update_Pass_Route,
  User_Become_Teacher
} from "@/Routes";
import { Badge } from "@/Components/ui/badge";
import { getUser } from "@/Store/Slices/User_Slice";
import { getApplication } from "@/Store/Slices/ApplicationSlice";
import { toast } from "react-toastify";
import { axiosService } from "@/Services";
import { updateProfileInitialState,changePasswordForm,changePasswordInitialState, becomeTeacherForm, becomeTeacherInitialState } from "@/Utils";
import { DialogForm } from "@/Components/DialogForm";
import moment from "moment";

export default function Profile() {
  const user = useSelector((state) => state?.user?.data);
  const userApplication=useSelector(state=>state?.application?.data);
  const [hover, setHover] = useState(false);
  const upProfileImage = useRef();
  const [dialog1, setDialog1] = useState(false);
  const [dialog2, setDialog2] = useState(false);
  const [dialog3, setDialog3] = useState(false);
  const [dialog4, setDialog4] = useState(false);
  const dispatch = useDispatch();
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
    },
  ];
  const details = [
    {
      icon: FcGoogle,
      text: user?.email || "null",
      size: 20,
    },
    {
      icon: FiPhoneCall,
      text: user?.phone || "null",
      size: 20,
    },
    {
      icon: LuMapPin,
      text: user?.address || "null",
      size: 20,
    },
  ];
  const moreDetails = [
    {
      icon: BsGenderAmbiguous,
      text: user?.gender || "null",
      size: 20,
    },
    {
      icon: CiCalendarDate,
      text: moment(user?.DOB).format("MMMM DD, YYYY") || "null",
      size: 20,
    },
  ];

  const handleFileInputClick = () => {
    upProfileImage.current.click();
  };
  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      //console.log(file);
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
          toast.success(response?.data?.message);
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const handleProfileImageDelete = async () => {
    try {
      const response = await axiosService.delete(User_Delete_Profile_Image, {
        withCredentials: true,
      });
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication());
        toast.success(response?.data?.message);
      } else {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleEvent1 = async (data) => {
    try {
      const response = await axiosService.patch(User_Info_Update, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication());
        setDialog1(false);
        toast.success(response?.data?.message);
      }
    } catch (error) {
       toast.error(error?.response?.data?.message);
    }
  };

  //for password change
  const handleEvent2 = async (data) => {
    try {
      const response = await axiosService.patch(User_Update_Pass_Route, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication())
        setDialog2(false);
        toast.success(response?.data?.message);
      } 
    } catch (error) {
       toast.error(error?.response?.data?.message);
    }
  };

  //for become teacher
  const handleEvent3 = async (data) => {
    try {
      const formData=new FormData();
      formData.append("cv",data.cv);
      const response = await axiosService.post(User_Become_Teacher, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (response?.status === 200) {
        dispatch(getUser());
        dispatch(getApplication())
        setDialog3(false);
        toast.success(response?.data?.message);
      } 
    } catch (error) {
       toast.error(error?.response?.data?.message);
    }
  };
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
  return (
    <div>
      <Navbar />
      <div className=" flex w-full p-2 justify-center items-center">
       {user?.DOB?  null:<span className="text-sm text-red-800">Complete your profile Info to become Teacher.</span>}
      </div>
      <div className="w-[100vw] flex flex-col justify-center items-center pb-4">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-1/2 h-64 border-b-2 border-black flex flex-col gap-10 justify-center items-center">
            <div className="flex flex-row justify-between items-center gap-40">
              <div
                className=" relative flex items-center justify-center"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <Avatar className="h-24 w-24 md:w-28 md:h-28 rounded-full cursor-pointer flex justify-center items-center">
                  {user &&
                    (user?.userImage ? (
                      <AvatarImage
                        src={
                          user?.userImage.startsWith("http")
                            ? user?.userImage
                            : `${import.meta.env.VITE_BACKEND_URL}/${
                                user?.userImage
                              }`
                        }
                        alt="profilepage"
                        className="rounded-full"
                      />
                    ) : (
                      <div className=" bg-slate-400 w-full h-full flex justify-center items-center px-5 py-3 rounded-full border-2 ">
                        {user?.userName?.split("")[0].toUpperCase()}
                      </div>
                    ))}
                </Avatar>
                {hover && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
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
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex flex-row justify-center items-center gap-5">
                  <h1 className="text-3xl font-bold">{user?.userName}</h1>
                  <div className="relative cursor-pointer before:content-['Change_Password'] before:absolute before:-top-8 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:-translate-y-5">
                    <TbLockPassword
                    onClick={toggleDialog2}
                      size={30}
                      className="text-gray-700 hover:text-black"
                    />
                    <DialogForm
                title="Update Your Password"
                description="Make new Password."
                dialog={dialog2}
                setDialog={setDialog2}
                func={handleEvent2}
                type="updatePassword"
                componentInputs={changePasswordForm}
                initialState={changePasswordInitialState}
              />
                  </div>
                </div>
                <div className=" flex flex-row gap-2">
                  {user?.userRole?.map((item, index) => {
                    return (
                      <Badge className="bg-green-600 px-2 cursor-pointer" key={index}>{item}</Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center md:gap-28">
              {user?.userRole?.includes("teacher") ? (
                <Button className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">
                  Upload Course
                </Button>
              ) : (
                <Button onClick={toggleDialog3} disabled={!user?.DOB|| userApplication?.find(data=>data?.user?._id===user?._id)} className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">
                  {userApplication?.find(data=>data?.user?._id===user?._id)? "Processing":"Become Teacher"}
                </Button>
              )}
              <DialogForm
                title="Become Teacher"
                description="Provide your valid CV in pdf format."
                dialog={dialog3}
                setDialog={setDialog3}
                func={handleEvent3}
                type="becomeTeacher"
                accept="application/pdf"
                componentInputs={becomeTeacherForm}
                initialState={becomeTeacherInitialState}
              />
              <div className="flex flex-row justify-between items-center gap-16">
                {details?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col justify-center items-center gap-2"
                    >
                      <item.icon className="cursor-pointer" size={item?.size} />
                      <p>{item?.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-1/2 h-64 border-l-2 border-b-2 border-black flex flex-col justify-center items-center gap-5">
            <div className="flex flex-row md:gap-5 justify-center items-center border-b-2 border-black">
              <GrCircleInformation size={30} />
              <h1 className="text-3xl font-bold">More Info</h1>
            </div>
            <div className="flex flex-col justify-between items-center gap-2">
              {moreDetails?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-row justify-center items-center gap-2"
                  >
                    <item.icon className="cursor-pointer" size={item?.size} />
                    <p>{item?.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex flex-row justify-center items-center md:gap-80">
              <Button
                onClick={toggleDialog1}
                className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700"
              >
                Update Info
              </Button>
              <DialogForm
                title="Update Profile Info"
                description="Enter New Profile Data."
                dialog={dialog1}
                setDialog={setDialog1}
                func={handleEvent1}
                type="updateProfile"
                componentInputs={updateProfileInputs}
                initialState={updateProfileInitialState}
              />
              {user?.userRole?.includes("teacher") && (
                <>
                <Button onClick={toggleDialog4} className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">
                  My CV
                </Button>
                <DialogForCV dialog4={dialog4} setDialog4={setDialog4} title={"Your CV"} description={"View and update your CV to keep your profile up-to-date."} user={user}/>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-1/2 h-64 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">Enrolled Courses</h1>
            <div className="flex flex-col justify-center items-center mt-10">
              <p>Empty</p>
            </div>
          </div>
          <div className="w-1/2 h-64 border-l-2 border-black flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <div className="flex flex-col justify-center items-center mt-10">
              {user?.userRole?.includes("teacher") ? (
                <p>Empty</p>
              ) : (
                <p>Become Teacher to Upload Course.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
