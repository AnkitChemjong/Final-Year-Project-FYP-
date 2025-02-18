import React, { useState,useEffect,useRef} from 'react';
import { Link,useLocation} from 'react-router-dom';
import { useSelector,useDispatch} from 'react-redux';
import Logout from '@/Components/LogoutFunc';
import { toast } from 'react-toastify';
import { getUser } from '@/Store/Slices/User_Slice';
import { useNavigate } from 'react-router-dom';
import { Avatar,AvatarImage } from '../ui/avatar';



export default function Navbar() {
 const proTog=useRef();
    const location=useLocation();
    const pagePath=location?.pathname?.split("/").pop();
    const homePath=location?.pathname?.split(" ").pop();
    const [toggl,setToggl]=useState(false);
    const logedUser=useSelector((state)=>state?.user?.data);
    const NavItem=
[ 
{
 name:"Home",
 path:"/",
 show:true
},
{
  name:"Course",
  path:"/course",
  show:true
},
{
  name:"Teacher",
  path:"/teacher",
  show:true
},
{
  name:"Login",
  path:"/signin",
  show:!logedUser
},
{
    name:"Register",
    path:"/signup",
    show:!logedUser
},

]
const dispatch=useDispatch();
const navigate=useNavigate();
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
  const tog = () => {
    if(toggl===false){
     
      setToggl(true);
    }
    else{
    
      setToggl(false);
    }
  };
  useEffect(() => {
    let timer;
  
    const listener = () => {
      if (document.hidden) {
        timer = setTimeout(() => {
          handleLogout();
        }, 15 * 60 * 1000); // 15 minutes
      } else {
        clearTimeout(timer);
      }
    };
  
    document.addEventListener('visibilitychange', listener);
  
    return () => {
      document.removeEventListener('visibilitychange', listener);
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (proTog.current && !proTog.current.contains(event.target)) {
        setToggl(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [toggl]);
  const profile= ()=>{
    tog();
    navigate('/profile');
  }
  return (
    <nav className='flex flex-row flex-wrap justify-between items-center z-50 px-2 -mt-5'>
      <div className='flex flex-row justify-center items-center gap-5'>
        <div>
         <img src="images/logo.png" alt="logo if efficient pathsalsa"  className='md:w-[160px] md:h-[160px]'/>
        </div>
        <h1 className='font-bold text-3xl'>E-Pathsala</h1>
      </div>
      <div className='flex flex-row justify-center items-center gap-20' >
        {
            NavItem.map((item,index)=>{
                return item.show? (
                     <Link key={index} to={item?.path} className={`text-[18px] relative after:absolute after:-bottom-1 after:left-0 after:h-[4px] after:bg-black hover:text-blue-600 ${
                        pagePath === item?.path || homePath === item?.path
                          ? ' after:w-full'
                          : 'after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:text-blue-600'
                      }`}>{item?.name}</Link>
                ) :null
            })
        }
        {
          logedUser && (
<div ref={proTog} onClick={tog} className='cursor-pointer'>
          <Avatar className='w-10 h-10 rounded-full flex justify-center items-center'>
        {logedUser && (logedUser?.userImage ? 
        <AvatarImage 
        src={logedUser?.userImage.startsWith("http") ? logedUser?.userImage:`${import.meta.env.VITE_BACKEND_URL}/${logedUser?.userImage}`} 
        alt="navimage"  />:(
            <div className=' bg-slate-400 flex justify-center items-center px-5 py-3 rounded-full '>{logedUser?.userName?.split("")[0].toUpperCase()}</div>
        ))}
      </Avatar>
        </div>
          )
        }
        
        {toggl && 
        <div className="absolute right-3 z-10 mt-32 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none" >
            <div onClick={profile}  className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 cursor-pointer" role="menuitem" >Your Profile</div>
            <div onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-100" role="menuitem" >Log out</div>
          </div>
        }
      </div>
    </nav>
  )
}
