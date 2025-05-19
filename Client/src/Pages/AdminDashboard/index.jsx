import React, { useContext, useEffect, useState } from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaUsers, FaChalkboardTeacher, FaGraduationCap, FaBook, FaChartLine, FaStar, FaMoneyBillWave, FaUserPlus } from 'react-icons/fa';
import { MdOnlinePrediction } from "react-icons/md";
import SkeletonCard from '@/Components/SkeletonCard';
import dashboard from '@/assets/dashboard.json';
import LottieAnimation from '@/Components/LottieAnimation';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { TbLockPassword } from "react-icons/tb";
import DialogForm from '@/Components/DialogForm';
import { changePasswordForm,changePasswordInitialState,updateProfileInitialState } from '@/Utils';
import { getAllUser } from '@/Store/Slices/Get_All_User';
import { User_Update_Pass_Route } from '@/Routes';
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { UseContextApi } from '@/Components/ContextApi';
import { getUser } from '@/Store/Slices/User_Slice';
import { getApplication } from '@/Store/Slices/ApplicationSlice';
import { getCourse } from '@/Store/Slices/Course_Slice';
import { Button } from '@/Components/ui/button';
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { toggleTheme } from '@/Components/Navbar';
import { MdSubscriptions } from "react-icons/md";




const processRegistrationData = (users) => {
  const monthlyData = Array(12).fill().map((_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
    students: 0,
    teachers: 0,
    admins: 0,
    total: 0
  }));

  users?.forEach(user => {
    const date = new Date(user.createdAt);
    const month = date.getMonth();
    
    if (user.userRole?.includes('admin')) {
      monthlyData[month].admins++;
    } else if (user.userRole?.includes('teacher')) {
      monthlyData[month].teachers++;
    } else {
      monthlyData[month].students++;
    }
    monthlyData[month].total++;
  });

  return monthlyData;
};

const processEarningsData = (purchases) => {
  const monthlyData = Array(12).fill().map((_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
    total: 0,
    site: 0,
    teacher: 0
  }));

  purchases?.forEach(purchase => {
    const date = new Date(purchase.createdAt || purchase.orderDate);
    const month = date.getMonth();
    
    monthlyData[month].total += Number(purchase.amountPaid) || 0;
    monthlyData[month].site += Number(purchase.siteAmount) || 0;
    monthlyData[month].teacher += Number(purchase.teacherAmount) || 0;
  });

  return monthlyData;
};

const processEnrollmentData = (data) => {
  const monthlyData = Array(12).fill().map((_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
    enrollments: 0
  }));

  data?.forEach(item => {
    const date = new Date(item.createdAt || item.orderDate);
    const month = date.getMonth();
    if (month >= 0 && month < 12) {
      monthlyData[month].enrollments += 1;
    }
  });

  return monthlyData;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-medium">
                {item.name.includes('Earnings') || item.name.includes('total') || item.name.includes('site') || item.name.includes('teacher') 
                  ? `Rs.${item.value.toLocaleString()}`
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const processSubscriptionData = (subscriptions) => {
  const monthlyData = Array(12).fill().map((_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
    subscriptions: 0
  }));

  subscriptions?.forEach(subscription => {
    const date = new Date(subscription.createdAt || subscription.orderDate);
    const month = date.getMonth();
    if (month >= 0 && month < 12) {
      monthlyData[month].subscriptions += Number(subscription.amountPaid) || 0;
    }
  });

  return monthlyData;
};
export default function AdminDashboard() {
  const userState = useSelector(state => state?.user);
  const { data: user } = userState;
  const onlineUserState = useSelector(state => state?.onlineUsers);
  const { data: onlineUser } = onlineUserState;
  const allCourseState = useSelector(state => state?.course);
  const { data: allCourse } = allCourseState;
  const allUserState = useSelector(state => state?.allUsers);
  const { data: allUser } = allUserState;
  const purchaseState = useSelector(state => state?.purchase);
  const { data: purchases } = purchaseState;
  const ratingState = useSelector(state => state?.rating);
  const { data: rating } = ratingState;
  const subscriptionState = useSelector(state => state?.subscriptionPayment);
    const { data: subscriptionData } = subscriptionState;
  const{setLoadingSpin}=useContext(UseContextApi);

  const [recentPurchases, setRecentPurchases] = useState(null);
  const [topPerformingCourse, setTopPerformingCourse] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const [purchaseForChart, setPurchaseForChart] = useState(null);
  const [courseForChart, setCourseForChart] = useState(null);
  const [load,setLoad]=useState(true);
  const [dialog1, setDialog1] = useState(false);
  const [dialog2,setDialog2]=useState(false);
  const [subscriptionChartData, setSubscriptionChartData] = useState(null);
  const [recentSubscriptions, setRecentSubscriptions] = useState(null);
  const dispatch=useDispatch();


  const toggleUserTheme=async()=>{
    if(user){
      await toggleTheme(user?._id);
      dispatch(getUser());
    }
  }


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

  useEffect(() => {
    if (user && purchases && allCourse && allUser && subscriptionData) {
      const recentPurchase = purchases?.slice(0, 5);
      const recentSubscription = subscriptionData?.slice(0, 5);
      const topCourses = allCourse
        ?.slice()
        ?.sort((a, b) => (b?.students?.length || 0) - (a?.students?.length || 0))
        ?.slice(0, 3);

      setRegistrationData(processRegistrationData(allUser));
      setSubscriptionChartData(processSubscriptionData(subscriptionData));
      setEarningsData(processEarningsData(purchases));
      setCourseForChart(processEnrollmentData(allCourse));
      setPurchaseForChart(processEnrollmentData(purchases));
      setTopPerformingCourse(topCourses);
      setRecentPurchases(recentPurchase);
      setRecentSubscriptions(recentSubscription);
    }
  }, [user, purchases, allCourse, allUser]);
  useEffect(()=>{
     setTimeout(()=>{
      setLoad(false);
     },1000);
  },[]);
  const toggleDialog1 = () => {
    setDialog1(!dialog1);
  };
  const toggleDialog2 = () => {
    setDialog2(!dialog2);
  };
  
  const handleEvent2 = async (data) => {
    try {
      setLoadingSpin(true);
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
    finally{
      setLoadingSpin(false);
    }
  };
 
  const handleEvent1 = async (data) => {
    try {
      setLoadingSpin(true);
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
    finally{
      setLoadingSpin(false);
    }
  };

  if (!user || load) {
    return (
      <div className='flex flex-row h-screen bg-gray-50'>
        <AdminNavbar />
        <SkeletonCard />
      </div>
    );
  }
  return (
    <div className={`flex h-screen  ${user?.theme===true && "bg-gray-50"} ${user?.theme===false && "bg-zinc-900"}`}>
      <AdminNavbar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <ScrollArea className='flex-1 overflow-auto w-full'>
          <div className='p-6'>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">

  <div className="flex items-center gap-2 sm:gap-4">
    <h1 className={`text-2xl md:text-3xl font-bold ${user?.theme & "text-gray-800"} ${user?.theme===false && " text-white"} dark:text-gray-100 font-heading`}>
      Admin Dashboard
    </h1>
    <LottieAnimation 
      animationData={dashboard} 
      width={120} 
      height={120} 
      speed={1}
      className="hidden sm:block"
    />
  </div>


  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 mr-6">
  <button className="cursor-pointer" onClick={toggleUserTheme}>
  <div className={`py-1 px-5 border ${user?.theme ? "border-black" : "border-white"} w-fit rounded-xl flex items-center gap-2`}>
    {
      user?.theme
        ? <FaMoon className="text-black" size={15} />:<FaSun className="text-yellow-500" size={15} />
       
    }
    <span className={`text-sm  ${user?.theme? "text-black":"text-white"}`}>{user?.theme ? "Dark" : "Light"}</span>
  </div>
</button>
    <Button
      onClick={toggleDialog1}
      className="w-full sm:w-auto flex items-center justify-center gap-2 font-playfair bg-green-600 hover:bg-green-700 text-white px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg rounded-lg transform hover:scale-[1.02]"
      aria-label="Update information"
    >
      <span>Update Info</span>
    </Button>


    <div className="relative group w-full sm:w-auto">
      <Button
        onClick={toggleDialog2}
        variant="ghost"
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 rounded-lg"
        aria-label="Change password"
      >
        <TbLockPassword size={30} />
      </Button>
      
 
      <div className="hidden sm:block absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-white text-xs bg-gray-800 dark:bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Change Password
      </div>
    </div>
  </div>
</div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              {[
                {
                  title: 'Total Users',
                  value: allUser?.length || 0,
                  icon: <FaUsers size={20} />,
                  bg: 'bg-blue-100',
                  color: 'text-blue-600',
                },
                {
                  title: 'Teachers',
                  value: allUser?.filter(item => item?.userRole?.includes('teacher'))?.length || 0,
                  icon: <FaChalkboardTeacher size={20} />,
                  bg: 'bg-purple-100',
                  color: 'text-purple-600',
                },
                {
                  title: 'Students',
                  value: allUser?.filter(item => !item?.userRole?.includes('teacher') && !item?.userRole?.includes('admin'))?.length || 0,
                  icon: <FaGraduationCap size={20} />,
                  bg: 'bg-green-100',
                  color: 'text-green-600',
                },
                {
                  title: 'Online Users',
                  value: onlineUser?.length || 0,
                  icon: <MdOnlinePrediction size={20} />,
                  bg: 'bg-green-100',
                  color: 'text-green-600'
                },
                {
                  title: 'Total Courses',
                  value: allCourse?.length || 0,
                  icon: <FaBook size={20} />,
                  bg: 'bg-gray-100',
                  color: 'text-gray-800',
                },
                {
                  title: 'Active Users',
                  value: allUser?.filter(item => item?.status === 'active')?.length || 0,
                  icon: <FaUserPlus size={20} />,
                  bg: 'bg-orange-100',
                  color: 'text-orange-600',
                },
                {
                  title: 'Total Course Earnings',
                  value1: purchases?.reduce((total, purchase) => total + (Number(purchase?.amountPaid) || 0), 0).toFixed(2),
                  value2: purchases?.reduce((total, purchase) => total + (Number(purchase?.siteAmount) || 0), 0).toFixed(2),
                  value3: purchases?.reduce((total, purchase) => total + (Number(purchase?.teacherAmount) || 0), 0).toFixed(2),
                  icon: <FaMoneyBillWave size={20} />,
                  bg: 'bg-indigo-100',
                  color: 'text-indigo-600',
                },
                {
                  title: 'This Month Course Earning',
                  value1: purchases
                    ?.filter(purchase => {
                      const purchaseDate = new Date(purchase?.createdAt || purchase?.orderDate);
                      const now = new Date();
                      return purchaseDate.getMonth() === now.getMonth() && 
                            purchaseDate.getFullYear() === now.getFullYear();
                    })
                    ?.reduce((total, purchase) => total + (Number(purchase?.amountPaid) || 0), 0)
                    .toFixed(2),
                  value2: purchases
                    ?.filter(purchase => {
                      const purchaseDate = new Date(purchase?.createdAt || purchase?.orderDate);
                      const now = new Date();
                      return purchaseDate.getMonth() === now.getMonth() && 
                            purchaseDate.getFullYear() === now.getFullYear();
                    })
                    ?.reduce((total, purchase) => total + (Number(purchase?.siteAmount) || 0), 0)
                    .toFixed(2),
                  value3: purchases
                    ?.filter(purchase => {
                      const purchaseDate = new Date(purchase?.createdAt || purchase?.orderDate);
                      const now = new Date();
                      return purchaseDate.getMonth() === now.getMonth() && 
                            purchaseDate.getFullYear() === now.getFullYear();
                    })
                    ?.reduce((total, purchase) => total + (Number(purchase?.teacherAmount) || 0), 0)
                    .toFixed(2),
                  icon: <FaMoneyBillWave size={20} />,
                  bg: 'bg-pink-100',
                  color: 'text-pink-600',
                },
                
                {
                  title: 'Subscription Earning',
                  value1: subscriptionData?.reduce((acc,obj)=>acc+Number(obj?.amountPaid||0),0)|| 0,
                  value4:subscriptionData?.filter(item=>{
                    const purchaseDate = new Date(item?.createdAt || item?.orderDate);
                      const now = new Date();
                      return purchaseDate.getMonth() === now.getMonth() && 
                            purchaseDate.getFullYear() === now.getFullYear();
                  })?.reduce((acc,obj)=>acc+Number(obj?.amountPaid||0),0)|| 0,
                  icon: <MdSubscriptions size={20} />,
                  bg: 'bg-orange-100',
                  color: 'text-orange-600',
                },
                {
                  title: 'All Total Earning',
                  value1: Number(subscriptionData?.reduce((acc,obj)=>acc+Number(obj?.amountPaid||0),0)|| 0) + Number(purchases?.reduce((total, purchase) => total + (Number(purchase?.amountPaid) || 0), 0).toFixed(2)),
                  value4:Number(subscriptionData?.filter(item=>{
                    const purchaseDate = new Date(item?.createdAt || item?.orderDate);
                      const now = new Date();
                      return purchaseDate.getMonth() === now.getMonth() && 
                            purchaseDate.getFullYear() === now.getFullYear();
                  })?.reduce((acc,obj)=>acc+Number(obj?.amountPaid||0),0)|| 0)+ Number(purchases
                    ?.filter(purchase => {
                      const purchaseDate = new Date(purchase?.createdAt || purchase?.orderDate);
                      const now = new Date();
                      return purchaseDate.getMonth() === now.getMonth() && 
                            purchaseDate.getFullYear() === now.getFullYear();
                    })
                    ?.reduce((total, purchase) => total + (Number(purchase?.amountPaid) || 0), 0)
                    .toFixed(2)),
                  icon: <FaMoneyBillWave size={20} />,
                  bg: 'bg-green-100',
                  color: 'text-orange-600',
                }
              ].map((stat, index) => (
                <div key={index} className={` ${user?.theme && "bg-white"} ${user?.theme === false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className=' text-sm font-medium'>{stat.title}</p>
                      <h3 className='text-2xl font-bold mt-1'>{stat?.value}</h3>
                      {stat?.value1 && 
                        <p className='text-sm font-bold mt-1'>Total: Rs.{stat?.value1}</p>
                      }
                      {stat?.value2 && 
                        <p className='text-sm font-bold mt-1'>Site: Rs.{stat?.value2}</p>
                      }
                      {stat?.value3 && 
                        <p className='text-sm font-bold mt-1'>Teacher: Rs.{stat?.value3}</p>
                      }
                      {stat?.value4 && 
                        <p className='text-sm font-bold mt-1'>This Month: Rs.{stat?.value4}</p>
                      }
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            
              <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100`}>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold font-heading'>User Registrations</h3>
                  <div className='text-orange-500'>
                    <FaUserPlus size={18} />
                  </div>
                </div>
                <div className='h-[250px]'>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="students" 
                        stroke="#3b82f6" 
                        name="Students"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="teachers" 
                        stroke="#8b5cf6" 
                        name="Teachers"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="admins" 
                        stroke="#f97316" 
                        name="Admins"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
          
              <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"}  p-5 rounded-xl shadow-sm border border-gray-100`}>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold font-heading'>Course Uploads</h3>
                  <div className='text-blue-500'>
                    <FaChartLine size={18} />
                  </div>
                </div>
                <div className='h-[250px]'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courseForChart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} courses`, 'Courses']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="enrollments" 
                        fill="#8884d8" 
                        name="Course Uploads"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100`}>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Monthly Enrollments</h3>
                  <div className='text-blue-500'>
                    <FaChartLine size={18} />
                  </div>
                </div>
                <div className='h-[250px]'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={purchaseForChart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} enrollments`, 'Enrollments']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="enrollments" 
                        fill="#6366f1" 
                        name="Enrollments"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100`}>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold font-heading'>Monthly Earnings Of Course</h3>
                  <div className='text-green-500'>
                    <FaMoneyBillWave size={18} />
                  </div>
                </div>
                <div className='h-[250px]'>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#10b981" 
                        name="Total Earnings"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="site" 
                        stroke="#3b82f6" 
                        name="Site Earnings"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="teacher" 
                        stroke="#8b5cf6" 
                        name="Teacher Earnings"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              
            {/* New Subscription Chart */}
            <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100 mb-8`}>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold font-heading'>Monthly Subscription Earnings</h3>
                <div className='text-orange-500'>
                  <MdSubscriptions size={18} />
                </div>
              </div>
              <div className='h-[250px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={subscriptionChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`Rs.${value.toLocaleString()}`, 'Earnings']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="subscriptions" 
                      stroke="#f97316" 
                      name="Subscription Earnings"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100`}>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold font-heading'>Top Performing Courses</h3>
                  <div className='text-yellow-500'>
                    <FaStar size={18} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {topPerformingCourse && topPerformingCourse?.length > 0 ? (
                    topPerformingCourse?.map((course, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{course?.title}</h4>
                          <span className={`flex items-center text-sm ${user?.theme & "bg-yellow-50"} ${user?.theme===false && "bg-black "} text-yellow-700 gap-1 px-2 py-1 rounded`}>
                            {(() => {
                              const courseRatings = rating?.filter(item => item?.courseId?._id === course?._id) || [];
                              if (courseRatings?.length === 0) return 0;
                              const sum = courseRatings?.reduce((acc, curr) => acc + curr.rating, 0);
                              return (sum / courseRatings?.length).toFixed(1);
                            })()}
                            <FaStar className="mr-1 text-yellow-400 text-xs" />
                            ({rating?.filter(r => r?.courseId?._id === course?._id)?.length || 0} Reviews)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Students</span>
                            <span className="font-medium">{course?.students?.length || 0}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Reviews</span>
                            <span className="font-medium">{rating?.filter(item => item?.courseId?._id === course?._id)?.length || 0}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Earnings</span>
                            <span className="font-medium text-green-600">
                              Rs.{((course?.students?.length || 0) * Number(course?.pricing || 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='w-full p-2 text-center'>
                      <p className='text-gray-500'>No data to show.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100`}>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold font-heading'>Recent Purchased Courses</h3>
                  <div className='text-green-500'>
                    <FaMoneyBillWave size={18}/>
                  </div>
                </div>
                {recentPurchases && recentPurchases?.length > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className={`min-w-full divide-y divide-gray-200 `}>
                      <thead className={` ${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"}`}>
                        <tr>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Amount</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Creator</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Purchased by</th>
                        </tr>
                      </thead>
                      <tbody className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} divide-y divide-gray-200`}>
                        {recentPurchases.map((purchase, index) => (
                          <tr key={index} >
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium '>{purchase?.courseId?.title}</td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm '>
                              {moment(purchase?.createdAt || purchase?.orderDate).format("MMMM DD, YYYY")}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600'>
                              Rs.{Number(purchase?.amountPaid)?.toFixed(2)}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600'>
                              {purchase?.courseId?.creator?.userName}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600'>
                              {purchase?.userId?.userName}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='w-full p-2 text-center'>
                    <p className='text-gray-500'>No recent purchases data</p>
                  </div>
                )}
              </div>

              <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-5 rounded-xl shadow-sm border border-gray-100`}>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold font-heading'>Recent Subscription Purchases</h3>
                  <div className='text-orange-500'>
                    <MdSubscriptions size={18}/>
                  </div>
                </div>
                {recentSubscriptions && recentSubscriptions?.length > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className={`min-w-full divide-y divide-gray-200 `}>
                      <thead className={` ${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"}`}>
                        <tr>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Type</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Amount</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Purchased By</th>
                        </tr>
                      </thead>
                      <tbody className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} divide-y divide-gray-200`}>
                        {recentSubscriptions.map((purchase, index) => (
                          <tr key={index}>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium '>{purchase?.subscriptionType}</td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm '>
                              {moment(purchase?.createdAt || purchase?.orderDate).format("MMMM DD, YYYY")}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600'>
                              Rs.{Number(purchase?.amountPaid)?.toFixed(2)}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600'>
                              {purchase?.userId?.userName}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='w-full p-2 text-center'>
                    <p className='text-gray-500'>No recent Subscription data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
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
      </div>
    </div>
  );
}