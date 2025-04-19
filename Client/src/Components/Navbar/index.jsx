import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineNotificationsActive } from "react-icons/md";
import Logout from "@/Components/LogoutFunc";
import { toast } from "react-toastify";
import { getUser } from "@/Store/Slices/User_Slice";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Get_User_Notification,
  Delete_Notification,
  Update_Notification,
  Toggle_Theme
} from "@/Routes";
import { UseContextApi } from "../ContextApi";
import { axiosService } from "@/Services";
import moment from "moment";
import { ScrollArea } from "../ui/scroll-area";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineMenu } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { RiLoginCircleLine } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const toggleTheme=async(id)=>{
  try{
    const response=await axiosService.post(`${Toggle_Theme}/${id}`);
    if(response?.status===200){
       toast.success(response?.data?.message);
    }  
  }
  catch(error){
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
}

export default function Navbar() {
  const {
    specificUserNotification,
    setSpecificUserNotification,
    unreadCount,
    setUnreadCount,
  } = useContext(UseContextApi);
  const proTog = useRef();
  const notifRef = useRef();
  const mobileNotifRef = useRef();
  const location = useLocation();
  const pagePath = location?.pathname?.split("/").pop();
  const homePath = location?.pathname?.split(" ").pop();
  const [toggl, setToggl] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showMobileNotif, setShowMobileNotif] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logedUserState = useSelector((state) => state?.user);
  const { data: logedUser, loading } = logedUserState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuSheet = useRef(null);
  const [theme, setTheme] = useState(true);

  useEffect(()=>{
    if(logedUser){
      setTheme(logedUser?.theme);
    }
  },[logedUser]);
  
  const toggleUserTheme=async()=>{
    if(logedUser){
      await toggleTheme(logedUser?._id);
      dispatch(getUser());
    }
  }
  useEffect(() => {
    if (theme === false) {
      document.body.classList.add("dark");
    } 
    else{
      document.body.classList.remove("dark");
    }
  }, [theme]);
  

  const { contextSafe } = useGSAP();

  const openMenu = contextSafe(() => {
    gsap.to(menuSheet.current, {
      x: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const closeMenu = contextSafe(() => {
    gsap.to(menuSheet.current, {
      x: "100%",
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    setMenuOpen(false);
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  };
  useEffect(()=>{
    const func=()=>{
      closeMenu();
    }
  document.addEventListener("mousedown",func)
  return ()=>{
    document.removeEventListener("mousedown",func)
  }},[]);

  const NavItem = [
    { name: "Home", path: "/", show: true, icon: <FaHome size={20} /> },
    { name: "Course", path: "/course", show: true, icon: <GiBookshelf size={20} /> },
    { name: "Teacher", path: "/teacher", show: true, icon: <FaChalkboardTeacher size={20} /> },
    { name: "Login", path: "/signin", show: !logedUser, icon: <IoIosLogIn size={20} /> },
    { name: "Register", path: "/signup", show: !logedUser, icon: <RiLoginCircleLine size={20} /> },
  ];

  const getUserNotification = async (id) => {
    try {
      const response = await axiosService.get(`${Get_User_Notification}/${id}`);
      if (response?.status === 200) {
        setSpecificUserNotification(response?.data?.data);
        setUnreadCount(
          response?.data?.data?.filter((item) => !item?.read).length
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    setUnreadCount(specificUserNotification?.filter(item => !item?.read).length);
  },[specificUserNotification]);

  const updateUserNotification = async (id) => {
    try {
      const response = await axiosService.patch(`${Update_Notification}/${id}`);
      if (response?.status === 200) {
        getUserNotification(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        navigate("/");
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
    setShowNotif((prev) => !prev);

    if (!showNotif && unreadCount > 0) {
      updateUserNotification(logedUser?._id);
    }
  };

  const handleToggleMobileNotif = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowMobileNotif((prev) => !prev);

    if (!showMobileNotif && unreadCount > 0) {
      updateUserNotification(logedUser?._id);
    }
  };

  const toggleProfile = (e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setShowNotif(false);
    setShowMobileNotif(false);
    setToggl((prev) => !prev);
  };

  const navigateToProfile = () => {
    setToggl(false);
    navigate("/profile");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        proTog.current &&
        !proTog.current.contains(event.target) &&
        !event.target.closest("[data-profile-button]")
      ) {
        setToggl(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        !event.target.closest("[data-notification-button]")
      ) {
        setShowNotif(false);
      }
      if (
        mobileNotifRef.current &&
        !mobileNotifRef.current.contains(event.target) &&
        !event.target.closest("[data-mobile-notification-button]")
      ) {
        setShowMobileNotif(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const deleteNotification = async ({ id = "", status }) => {
    try {
      if (logedUser && !loading) {
        const response = await axiosService.delete(Delete_Notification, {
          data: { id: id, userId: logedUser?._id, status: status },
        });
        if (response?.status === 200) {
          getUserNotification(logedUser?._id);
          toast.success(response?.data?.message);
          if (status === "all") {
            setShowNotif(false);
            setShowMobileNotif(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };



  const NotificationDropdown = () => (
    <div className={`absolute z-20 mt-2 w-72 ${theme? "bg-white":"bg-black"} rounded-md shadow-lg ring-1 ring-black/5 right-0`}>
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-medium">Notifications</h3>
          {specificUserNotification?.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification({
                  id: "nothing",
                  status: "all",
                });
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
            specificUserNotification.map((notif) => (
              <div
                key={notif._id}
                className={`px-4 py-3 border-b border-gray-100 ${
                  !notif.read ? "bg-blue-50" : ""
                } mt-5 rounded-md flex justify-between items-start group`}
              >
                <div className="flex-1">
                  <div>
                    <p className="text-sm font-medium">
                      {notif.title}
                    </p>
                    {notif?.courseTitle && (
                      <p className="text-sm font-medium">
                        {notif.courseTitle}
                      </p>
                    )}
                    {notif?.subscriptionType && (
                      <p className="text-sm font-medium">
                        {notif.subscriptionType}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {moment(notif.createdAt).format(
                      "MMM D, YYYY h:mm A"
                    )}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification({
                      id: notif._id,
                      status: "single",
                    });
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
  );

  return (
    <nav className={`flex flex-row flex-wrap justify-between items-center z-50 md:px-20 px-4 ${theme? "bg-white":"bg-slate-900"} shadow-sm sticky top-0 md:mb-5`}>
      <div className="flex flex-row justify-center items-center gap-1 md:gap-5">
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-20 h-20 md:w-[160px] md:h-[160px]"
        />
        <h1 className="font-bold text-lg md:text-3xl">E-Pathsala</h1>
      </div>

      
      <div className="md:hidden flex items-center gap-4">
        {logedUser && (
          <div ref={mobileNotifRef} className="relative">
            <button
              onClick={handleToggleMobileNotif}
              className={`p-2 rounded-full  ${theme? "hover:bg-gray-100":"bg-gray-100"} relative`}
              aria-label="Notifications"
              data-mobile-notification-button
            >
              {unreadCount > 0 ? (
                <>
                  <MdOutlineNotificationsActive className={`text-2xl  ${theme===false && "text-black"}`} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                </>
              ) : (
                <IoMdNotificationsOutline className={`text-2xl  ${theme===false && "text-black"}`} />
              )}
            </button>
            {showMobileNotif && <NotificationDropdown isMobile />}
          </div>
        )}
        
        {menuOpen ? (
          <AiOutlineClose 
            onClick={toggleMenu} 
            className="cursor-pointer text-blue-700" 
            size={24}
          />
        ) : (
          <AiOutlineMenu 
            onClick={toggleMenu} 
            className="cursor-pointer text-blue-700" 
            size={24}
          />
        )}
      </div>

      <div
        ref={menuSheet}
        className={`fixed top-0 right-0 w-64 h-full ${theme? "bg-white":"bg-black"} shadow-lg transform translate-x-full opacity-0 z-50 p-4`}
      >
        <div className="flex flex-col h-full ">
          <div className="flex justify-end mb-8">
            <AiOutlineClose 
              onClick={closeMenu} 
              className="cursor-pointer text-blue-700" 
              size={24}
            />
          </div>
          
          <div className="flex flex-col space-y-6 ">
            {NavItem.map(
              (item, index) =>
                item.show && (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={toggleMenu}
                    className={`flex items-center gap-3 text-lg hover:text-blue-600 ${theme===false && "text-white"} ${
                      pagePath === item.path || homePath === item.path 
                        ? "text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item?.icon}
                    {item.name}
                  </Link>
                )
            )}

            {logedUser && (
              <>
                <button
                  onClick={() => {
                    toggleMenu();
                    navigateToProfile();
                  }}
                  className={`flex items-center gap-3 text-lg hover:text-blue-600 ${
                    pagePath === "profile"
                      && "text-blue-700 font-medium"}`} 
                >
                  <FaRegUserCircle size={20} />
                  Your Profile
                </button>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="flex items-center gap-3 text-lg hover:text-blue-600"
                >
                  <TbLogout2 size={20} />
                  Log out
                </button>
                <button className="cursor-pointer" onClick={toggleUserTheme}>
  <div className={`py-1 px-5 border ${theme ? "border-black" : "border-white"} w-fit rounded-xl flex items-center gap-2`}>
    {
      theme
        ? <FaMoon className="text-black" size={15} />:<FaSun className="text-yellow-500" size={15} />
       
    }
    <span className={`text-sm  ${theme? "text-black":"text-white"}`}>{theme ? "Dark" : "Light"}</span>
  </div>
</button>


              </>
            )}
          </div>
        </div>
      </div>

      
      <div className="hidden md:flex flex-row justify-center items-center gap-6 lg:gap-10">
        {NavItem.map(
          (item, index) =>
            item.show && (
              <Link
                key={index}
                to={item.path}
                className={`text-[16px] lg:text-[18px] relative after:absolute after:-bottom-1 after:left-0 after:h-[4px]  ${theme? "after:bg-black":"after:bg-white"} hover:text-blue-600 flex items-center gap-1 ${
                  pagePath === item.path || homePath === item.path
                    ? "after:w-full text-blue-700"
                    : "after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                }`}
              >
                {item?.icon}
                {item.name}
              </Link>
            )
        )}

        {logedUser && (
          <>
            <div ref={notifRef} className="relative">
              <button
                onClick={handleToggleNotif}
                className={`p-2 rounded-full ${theme? "hover:bg-gray-100":"bg-gray-100"} relative`}
                aria-label="Notifications"
                data-notification-button
              >
                {unreadCount > 0 ? (
                  <>
                    <MdOutlineNotificationsActive className={`text-2xl ${theme===false && "text-black"}`} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </>
                ) : (
                  <IoMdNotificationsOutline className={`text-2xl ${theme===false && "text-black"} `} />
                )}
              </button>
              {showNotif && <NotificationDropdown />}
            </div>

            <div
              ref={proTog}
              onClick={toggleProfile}
              className="cursor-pointer"
              data-profile-button
            >
              <Avatar className={`w-10 h-10 rounded-full flex justify-center ${theme===false && "bg-white"} items-center border-2 border-blue-600`}>
                {logedUser?.userImage ? (
                  logedUser?.provider ? (
                    <AvatarImage
                      className="rounded-full"
                      src={logedUser?.userImage}
                      alt="Profile"
                    />
                  ) : (
                    <AvatarImage
                      className="rounded-full"
                      src={`${import.meta.env.VITE_BACKEND_URL}/${
                        logedUser?.userImage
                      }`}
                      alt="Profile"
                    />
                  )
                ) : (
                  <div className={`bg-white justify-center items-center px-5 py-3 rounded-full ${theme===false && 'text-black'}`}>
                    {logedUser?.userName?.[0]?.toUpperCase()}
                  </div>
                )}
              </Avatar>
            </div>
          </>
        )}

        {toggl && (
          <div className={`absolute right-3 z-10 mt-32 w-48 origin-top-right rounded-md ${theme===true && "bg-white"} ${theme===false && 'bg-black'} py-1 shadow-lg ring-1 ring-black/5 focus:outline-none`}>
            <div
              onClick={navigateToProfile}
              className={`px-4 py-2 text-sm  hover:bg-slate-100 cursor-pointer flex flex-row gap-2 items-center hover:text-blue-600 ${
                pagePath === "profile" && "text-blue-600"
              }`}
            >
              <FaRegUserCircle size={20}/>Your Profile
            </div>
            <div
              onClick={handleLogout}
              className={`px-4 py-2 text-sm  ${theme? "text-gray-700":"text-white"} hover:bg-slate-100 cursor-pointer hover:text-blue-600 flex flex-row gap-2 items-center`}
            >
              <TbLogout2 size={20}/>Log out
            </div>
            <button className="cursor-pointer" onClick={toggleUserTheme}>
  <div className={`py-1 px-5 border ${theme ? "border-black" : "border-white"} w-fit rounded-xl flex items-center gap-2`}>
    {
      theme
        ? <FaMoon className="text-black" size={15} />:<FaSun className="text-yellow-500" size={15} />
       
    }
    <span className={`text-sm  ${theme? "text-black":"text-white"}`}>{theme ? "Dark" : "Light"}</span>
  </div>
</button>
          </div>
        )}
      </div>
    </nav>
  );
}