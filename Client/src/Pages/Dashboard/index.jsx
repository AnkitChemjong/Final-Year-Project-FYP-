import React,{useRef,useState} from 'react'
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from 'react-redux';
import { getUser } from '@/Store/Slices/User_Slice';
import { useNavigate } from 'react-router-dom';
import Logout from '@/Components/LogoutFunc';
import { IoIosLogOut } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa";
import { axiosService } from '@/Services';
import { Link } from 'react-router-dom';
import Applications from '@/Components/Applications';
import Courses from '@/Components/Courses';
import {
  User_Upload_Profile_Image,
  User_Delete_Profile_Image,
} from "@/Routes";
import { Avatar, AvatarImage,AvatarFallback } from "@/Components/ui/avatar";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"



export default function Dashboard() {
  const dispatch=useDispatch();
  const [tabValue,setTabValue]=useState("dashboard");
    const upProfileImage = useRef();
     const [hover, setHover] = useState(false);
  const admin=useSelector(state=>state?.user?.data)
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

const handleTabValue=(value)=>{
  setTabValue(value);
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
  <Tabs defaultValue={tabValue} value={tabValue} className="flex flex-row">
    <div className='h-screen md:min-w-80 w-fit p-2 flex flex-col bg-slate-300 rounded-tr-xl rounded-br-xl fixed'>
  <div className='flex flex-row justify-center items-center relative right-5 bottom-10'>
    <img className='w-40 h-40' src="images/logo.png" alt="logo of efficient pathsalsa" />
    <h1 className='font-bold text-2xl text-center'>E-Pathsala</h1>
  </div>
      <div className='flex flex-col gap-2'>
        <div>
          <Link className='text-lg cursor-pointer' onClick={()=>handleTabValue('dashboard')}>Dashboard</Link>
        </div>
        <div>
          <Link className='text-lg cursor-pointer' onClick={()=>handleTabValue('customers')}>Customers</Link>
        </div>
        <div>
          <Link className='text-lg cursor-pointer' onClick={()=>handleTabValue('teachers')}>Teachers</Link>
        </div>
        <div>
          <Link className='text-lg' onClick={()=>handleTabValue('courses')}>Courses</Link>
        </div>
        <div>
          <Link className='text-lg cursor-pointer' onClick={()=>handleTabValue('applications')}>Applications</Link>
        </div>
      </div>
  <div className='flex flex-col absolute bottom-0 p-5 gap-3'>
    <div className='flex flex-row justify-center items-center gap-5'>
      <div
                      className="h-12 w-12 md:w-12 md:h-12 relative flex items-center justify-center"
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      <Avatar className="h-12 w-12 md:w-12 md:h-12 rounded-full cursor-pointer flex justify-center items-center">
                        {admin &&
                          (admin?.userImage ? (
                            <AvatarImage
                              src={
                                admin?.userImage.startsWith("http")
                                  ? admin?.userImage
                                  : `${import.meta.env.VITE_BACKEND_URL}/${
                                     admin?.userImage
                                    }`
                              }
                              alt="profileImage"
                              className="rounded-full"
                            />
                          ) : (
                            <div className=" bg-slate-400 w-full h-full flex justify-center items-center px-5 py-3 rounded-full border-2 ">
                              {admin?.userName?.split("")[0].toUpperCase()}
                            </div>
                          ))}
                          <AvatarFallback>{admin?.userName?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      {hover && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
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
                    <p className='text-lg '>{admin?.userName}</p>
    </div>
                    
    <div className='flex flex-row gap-7'>
      <IoIosLogOut size={30}/>
      <p className='text-lg cursor-pointer' onClick={handleLogout}>Log Out</p>
    </div>
  </div>
</div>
<div className='flex h-screen w-screen justify-center items-center md:ml-80'>
<TabsContent value="dashboard">
  <p>Dashboard</p>
      </TabsContent>
      <TabsContent value="customers">
  <p>Customers</p>
    
</TabsContent>
<TabsContent value="teachers">
  <p>Teachers</p>
    
</TabsContent>
<TabsContent value="courses">
  <Courses/>
    
</TabsContent>
<TabsContent value="applications">
  <Applications/>  
</TabsContent>
</div>
</Tabs>
  )
}
