import React,{useState,useRef} from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from 'react-redux';
import { getUser } from '@/Store/Slices/User_Slice';
import { useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa";
import { axiosService } from '@/Services';
import { Link } from 'react-router-dom';
import {
  User_Upload_Profile_Image,
  User_Delete_Profile_Image,
} from "@/Routes";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import Logout from '../LogoutFunc';
import { FaFileAlt } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { RiDashboardHorizontalLine } from "react-icons/ri";

export default function AdminNavbar() {
    const dispatch=useDispatch();
    const location=useLocation();
    const pagePath=location?.pathname?.split("/").pop();
      const upProfileImage = useRef();
       const [hover, setHover] = useState(false);
    const admin=useSelector(state=>state?.user?.data)
    const navigate=useNavigate();
  const adminNavItem=[
      {
        name:"Dashboard",
        path:"/admin/dashboard",
        pageName:"dashboard",
        icon:RiDashboardHorizontalLine
      },
      {
        name:"Customer",
        path:"/admin/customer",
        pageName:"customer",
        icon:FaRegUserCircle
      },
      {
        name:"Teacher",
        path:"/admin/teacher",
        pageName:"teacher",
        icon:FaChalkboardTeacher
      },
      {
        name:"Course",
        path:"/admin/course",
        pageName:"course",
        icon:MdOutlineLaptopChromebook
      },
      {
        name:"Application",
        path:"/admin/application",
        pageName:"application",
        icon:FaFileAlt
      }
    ]
  
  const handleLogout=async ()=>{
  try{
      const logoutData=await Logout();
      if(logoutData?.status===200){
          dispatch(getUser());
          navigate('/');
          toast.success(logoutData?.data?.message);
      }
      else{
        toast.error(logoutData?.data?.message);
      }
  }
  catch(error){
      console.log(error);
      toast.error("Something wrong while logging out")
  }
  }
  
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
        const response = await axiosService.delete(User_Delete_Profile_Image);
        console.log(response);
        if (response?.status === 200) {
          dispatch(getUser());
          toast.success(response?.data?.message);
        } else {
          toast.success(response?.data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };
  return (
      <div className='h-screen md:min-w-80 w-fit p-4 flex flex-col bg-white border-r-2 border-gray-200 rounded-tr-xl rounded-br-xl shadow-lg'>
  {/* Logo and Title */}
  <div className='flex flex-row justify-center items-center mb-8'>
    <img className='w-20 h-20 mr-2' src="/images/logo.png" alt="logo of efficient pathsalsa" />
    <h1 className='font-bold text-2xl text-blue-900'>E-Pathsala</h1>
  </div>

  <div className='flex flex-col gap-3'>
    {
                adminNavItem.map((item,index)=>{
                    return (
                         <Link key={index} to={item?.path} className={`text-[18px] relative p-2 rounded-lg hover:scale-105 hover:bg-blue-500 shadow-md transition-all 
                          duration-100 flex items-center md:gap-16 gap-1 cursor-pointer
                            ${pagePath === item?.pageName
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}>
                            <item.icon className='w-5 h-5 md:ml-2'/>
                            <p className='text-gray-800 text-lg'>
                            {item?.name}
                            </p>
                            </Link>
                    ) 
                })
            }
  </div>

  
  <div className='mt-auto p-2'>
    <div className='flex flex-row items-center gap-4 mb-4'>
      <div
        className="h-12 w-12 relative flex items-center justify-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Avatar className="h-12 w-12 rounded-full cursor-pointer flex justify-center items-center border-2 border-blue-900">
          {admin &&
            (admin?.userImage ? (
              <AvatarImage
                src={
                  admin?.userImage.startsWith("http")
                    ? admin?.userImage
                    : `${import.meta.env.VITE_BACKEND_URL}/${admin?.userImage}`
                }
                alt="profileImage"
                className="rounded-full"
              />
            ) : (
              <div className="bg-white w-full h-full flex justify-center items-center px-5 py-3 rounded-full">
                {admin?.userName?.split("")[0].toUpperCase()}
              </div>
            ))}
        </Avatar>
        {hover && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
            onClick={
              admin?.userImage
                ? handleProfileImageDelete
                : handleFileInputClick
            }
          >
            {admin?.userImage ? (
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
      <p className='text-lg text-black'>{admin?.userName}</p>
    </div>

   
    <div 
      className='flex flex-row items-center gap-3 text-black bg-blue-100 hover:scale-105 hover:text-blue-900 hover:bg-blue-200 p-2 rounded-lg  transition-transform duration-100 cursor-pointer'
      onClick={handleLogout}
    >
      <IoIosLogOut size={20} />
      <p className='text-lg'>Log Out</p>
    </div>
  </div>
</div>
  )
}
