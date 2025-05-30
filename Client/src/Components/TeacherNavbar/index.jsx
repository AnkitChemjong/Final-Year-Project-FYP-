import React, { useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@/Store/Slices/User_Slice';
import { IoIosLogOut, IoMdMenu, IoMdClose } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa";
import { axiosService } from '@/Services';
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import Logout from '../LogoutFunc';
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { MdOutlineContactMail } from "react-icons/md";
import {
    User_Upload_Profile_Image,
    User_Delete_Profile_Image,
  } from "@/Routes";

export default function TeacherNavbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const pagePath = location?.pathname?.split("/").pop();
  const upProfileImage = useRef();
  const [hover, setHover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const teacher = useSelector(state => state?.user?.data);
  const navigate = useNavigate();

  // Teacher-specific navigation items
  const teacherNavItem = [
    {
      name: "Dashboard",
      path: "/teacher/dashboard",
      pageName: "dashboard",
      icon: RiDashboardHorizontalLine
    },
    {
      name: "Hire Request",
      path: "/teacher/hireapplication",
      pageName: "hireapplication",
      icon: MdOutlineContactMail
    },
    {
      name: "Courses",
      path: "/teacher/course",
      pageName: "course",
      icon: MdOutlineLaptopChromebook
    }
  ];

  const handleLogout = async () => {
    try {
      const logoutData = await Logout();
      if (logoutData?.status === 200) {
        dispatch(getUser());
        navigate('/');
        toast.success(logoutData?.data?.message);
      } else {
        toast.error(logoutData?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while logging out");
    }
  };

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
          toast.success(response?.data?.message);
        }
      } else {
        toast.error("No file selected");
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
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 ${teacher?.theme ? "bg-white" : "bg-slate-900"} p-4 flex justify-between items-center border-b-2 border-gray-200 shadow-md`}>
        <div className='flex items-center'>
          <img className='w-10 h-10 mr-2' src="/images/logo.png" alt="logo of efficient pathsalsa" />
          <h1 className={`font-bold text-xl ${teacher?.theme ? "text-blue-900" : "text-white"} font-heading`}>E-Pathsala</h1>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className={`p-2 rounded-lg ${teacher?.theme ? "text-blue-900" : "text-white"}`}
        >
          {mobileMenuOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile */}
      <div 
        className={`fixed md:relative z-40 h-full md:h-screen md:min-w-80 w-72 p-4 flex flex-col ${teacher?.theme ? "bg-white" : "bg-slate-900"} border-r-2 border-gray-200 rounded-tr-xl rounded-br-xl shadow-lg transition-all duration-300 overflow-y-auto
          ${mobileMenuOpen ? "left-0" : "-left-72 md:left-0"}`}
        style={{ 
          top: mobileMenuOpen ? '64px' : '0',
          height: mobileMenuOpen ? 'calc(100vh - 64px)' : '100vh'
        }}
      >
        {/* Logo - Hidden on mobile since we have it in the header */}
        <div className='hidden md:flex flex-row justify-center items-center mb-8'>
          <img className='w-20 h-20 mr-2' src="/images/logo.png" alt="logo of efficient pathsalsa" />
          <h1 className={`font-bold text-2xl ${teacher?.theme ? "text-blue-900" : "text-white"} font-heading`}>E-Pathsala</h1>
        </div>

        <div className='flex flex-col gap-3 mt-4 md:mt-0'>
          {teacherNavItem.map((item, index) => (
            <Link
              key={index}
              to={item?.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-[18px] relative p-2 rounded-lg hover:scale-105 hover:bg-blue-500 shadow-md transition-all 
                duration-100 flex items-center md:gap-16 gap-1 cursor-pointer
                ${pagePath === item?.pageName ? 'bg-blue-500' : 'bg-green-500'}`}
            >
              <item.icon className='w-5 h-5 md:ml-2' />
              <p className='text-gray-800 text-lg'>{item?.name}</p>
            </Link>
          ))}
        </div>

        <div className='mt-auto p-2 mb-4'>
          <div className='flex flex-row items-center gap-4 mb-4'>
            <div
              className="h-12 w-12 relative flex items-center justify-center"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Avatar className={`h-12 w-12 rounded-full cursor-pointer flex justify-center items-center border-2 border-blue-900 ${teacher?.theme===false && "bg-white"}`}>
                {teacher &&
                  (teacher?.userImage ? (
                    <AvatarImage
                      src={
                        teacher?.userImage.startsWith("http")
                          ? teacher?.userImage
                          : `${import.meta.env.VITE_BACKEND_URL}/${teacher?.userImage}`
                      }
                      alt="profileImage"
                      className="rounded-full"
                    />
                  ) : (
                    <div className={`bg-white w-full h-full flex justify-center items-center px-5 py-3 rounded-full ${teacher?.theme===false && "text-black"}`}>
                      {teacher?.userName?.split("")[0].toUpperCase()}
                    </div>
                  ))}
              </Avatar>
              {hover && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                  onClick={
                    teacher?.userImage
                      ? handleProfileImageDelete
                      : handleFileInputClick
                  }
                >
                  {teacher?.userImage ? (
                    <FaTrash className="text-white text-lg cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-lg cursor-pointer" />
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
            <p className='text-lg '>{teacher?.userName}</p>
          </div>

          <div
            className={`flex flex-row items-center gap-3 ${teacher?.theme ? "bg-blue-100" : "bg-slate-800"} hover:scale-105 hover:text-blue-900 hover:bg-blue-200 p-2 rounded-lg transition-transform duration-100 cursor-pointer`}
            onClick={handleLogout}
          >
            <IoIosLogOut size={20} />
            <p className='text-lg'>Log Out</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}