import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import Logout from '@/Components/LogoutFunc';
import { toast } from 'react-toastify';
import { getUser } from '@/Store/Slices/User_Slice';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Get_User_Notification, Delete_Notification,Update_Notification } from '@/Routes';
import { UseContextApi } from '../ContextApi';
import { axiosService } from '@/Services';
import moment from 'moment';
import { ScrollArea } from '../ui/scroll-area';
import { RiDeleteBin6Line } from "react-icons/ri";

export default function Navbar() {
  const { specificUserNotification, setSpecificUserNotification,unreadCount, setUnreadCount } = useContext(UseContextApi);
  const proTog = useRef();
  const notifRef = useRef();
  const location = useLocation();
  const pagePath = location?.pathname?.split("/").pop();
  const homePath = location?.pathname?.split(" ").pop();
  const [toggl, setToggl] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const logedUserState = useSelector((state) => state?.user);
  const { data: logedUser, loading } = logedUserState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const NavItem = [
    { name: "Home", path: "/", show: true },
    { name: "Course", path: "/course", show: true },
    { name: "Teacher", path: "/teacher", show: true },
    { name: "Login", path: "/signin", show: !logedUser },
    { name: "Register", path: "/signup", show: !logedUser },
  ];

  const getUserNotification = async (id) => {
    try {
      const response = await axiosService.get(`${Get_User_Notification}/${id}`);
      if (response?.status === 200) {
        setSpecificUserNotification(response?.data?.data);
        setUnreadCount(response?.data?.data?.filter(item => !item?.read).length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserNotification=async(id)=>{
    try {
      const response = await axiosService.patch(`${Update_Notification}/${id}`);
      if (response?.status === 200) {
        getUserNotification(id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => { 
    if (logedUser && !loading) {
      getUserNotification(logedUser?._id);
    }
  }, [logedUser, loading]);

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
      toast.error("Something wrong while logging out");
    }
  };

  const handleToggleNotif = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setToggl(false); 
    setShowNotif(prev => !prev);
    
    if (!showNotif && unreadCount > 0) {
      updateUserNotification(logedUser?._id);
    }
  };

  const toggleProfile = (e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setShowNotif(false);
    setToggl(prev => !prev);
  };

  const navigateToProfile = () => {
    setToggl(false);
    navigate('/profile');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (proTog.current && !proTog.current.contains(event.target) &&
          !event.target.closest('[data-profile-button]')) {
        setToggl(false);
      }
      if (notifRef.current && 
          !notifRef.current.contains(event.target) &&
          !event.target.closest('[data-notification-button]')) {
        setShowNotif(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  const deleteNotification=async({id="",status})=>{
    try{
      if(logedUser && !loading){
        const response=await axiosService.delete(Delete_Notification,{data:{id:id,userId:logedUser?._id,status:status}});
        if(response?.status === 200){
          getUserNotification(logedUser?._id);
          toast.success(response?.data?.message);
          if(status === "all"){
            setShowNotif(false);
          }
        }
      }

    }
    catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <nav className='flex flex-row flex-wrap justify-between items-center z-50 px-20 -mt-5'>
      <div className='flex flex-row justify-center items-center gap-5'>
        <img src="/images/logo.png" alt="logo" className='md:w-[160px] md:h-[160px]' />
        <h1 className='font-bold text-3xl'>E-Pathsala</h1>
      </div>
      
      <div className='flex flex-row justify-center items-center gap-20'>
        {NavItem.map((item, index) => item.show && (
          <Link
            key={index}
            to={item.path}
            className={`text-[18px] relative after:absolute after:-bottom-1 after:left-0 after:h-[4px] after:bg-black hover:text-blue-600 ${
              pagePath === item.path || homePath === item.path
                ? 'after:w-full text-blue-700'
                : 'after:w-0 after:transition-all after:duration-300 hover:after:w-full'
            }`}
          >
            {item.name}
          </Link>
        ))}

        {logedUser && (
          <>
            <div ref={notifRef} className="relative">
              <button
                onClick={handleToggleNotif}
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="Notifications"
                data-notification-button
              >
                {unreadCount > 0 ? (
                  <>
                    <MdOutlineNotificationsActive className="text-2xl text-gray-700" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </>
                ) : (
                  <IoMdNotificationsOutline className="text-2xl text-gray-700" />
                )}
              </button>

              {showNotif && (
  <div className="absolute right-0 z-20 mt-2 w-72 bg-white rounded-md shadow-lg ring-1 ring-black/5">
    <div className="py-1">
      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-medium">Notifications</h3>
        {specificUserNotification?.length > 0 && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification({id:"nothing",status:"all"});
            }}
            className="text-gray-500 hover:text-red-500 relative group"
          >
            <RiDeleteBin6Line size={16} />
            <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs py-1 px-2 rounded bottom-full left-1/2 transform -translate-x-1/2 mb-1 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800">
              Delete all
            </span>
          </button>
        )}
      </div>
      <ScrollArea className="max-h-40 overflow-auto">
        {specificUserNotification?.length > 0 ? (
          specificUserNotification.map(notif => (
            <div
              key={notif._id}
              className={`px-4 py-3 border-b border-gray-100 ${!notif.read ? 'bg-blue-50' : ''} mt-5 rounded-md flex justify-between items-start group`}
            >
              <div className="flex-1">
                <div>
                <p className="text-sm font-medium">{notif.title}</p>
                 {
                  notif?.courseTitle &&
                  <p className="text-sm font-medium">{notif.courseTitle}</p>
                 }
                 {
                  notif?.subscriptionType &&
                  <p className="text-sm font-medium">{notif.subscriptionType}</p>
                 }
                </div>
                <p className="text-xs text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {moment(notif.createdAt).format('MMM D, YYYY h:mm A')}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification({id:notif._id,status:"single"});
                }}
                className="text-gray-400 hover:text-red-500 ml-2 relative"
              >
                <RiDeleteBin6Line size={14} />
                <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs py-1 px-2 rounded bottom-full left-1/3 transform -translate-x-1/2 mb-1 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800">
                  Delete
                </span>
              </button>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-center text-sm text-gray-500">
            No notifications
          </div>
        )}
      </ScrollArea>
    </div>
  </div>
)}
            </div>

            <div 
              ref={proTog} 
              onClick={toggleProfile} 
              className='cursor-pointer'
              data-profile-button
            >
              <Avatar className='w-10 h-10 rounded-full flex justify-center items-center border-2 border-black'>
                {logedUser?.userImage ? (
                  <AvatarImage 
                    className="rounded-full"
                    src={logedUser.userImage.startsWith("http") 
                      ? logedUser.userImage 
                      : `${import.meta.env.VITE_BACKEND_URL}/${logedUser.userImage}`} 
                    alt="Profile" 
                  />
                ) : (
                  <div className='bg-white justify-center items-center px-5 py-3 rounded-full'>
                    {logedUser?.userName?.[0]?.toUpperCase()}
                  </div>
                )}
              </Avatar>
            </div>
          </>
        )}

        {toggl && (
          <div className="absolute right-3 z-10 mt-32 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div onClick={navigateToProfile} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 cursor-pointer">
              Your Profile
            </div>
            <div onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100">
              Log out
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}