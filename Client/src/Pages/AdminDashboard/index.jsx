import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/Components/AdminNavbar';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaUsers, FaChalkboardTeacher, FaGraduationCap, FaBook, FaChartLine, FaStar, FaMoneyBillWave, FaUserPlus } from 'react-icons/fa';
import { MdOnlinePrediction } from "react-icons/md";
import SkeletonCard from '@/Components/SkeletonCard';
import dashboard from '@/assets/dashboard.json';
import LottieAnimation from '@/Components/LottieAnimation';
import { useSelector } from 'react-redux';
import moment from 'moment';


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

  const [recentPurchases, setRecentPurchases] = useState(null);
  const [topPerformingCourse, setTopPerformingCourse] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const [purchaseForChart, setPurchaseForChart] = useState(null);
  const [courseForChart, setCourseForChart] = useState(null);
  const [load,setLoad]=useState(true);

  useEffect(() => {
    if (user && purchases && allCourse && allUser) {
      const recentPurchase = purchases?.slice(0, 5);
      const topCourses = allCourse
        ?.slice()
        ?.sort((a, b) => (b?.students?.length || 0) - (a?.students?.length || 0))
        ?.slice(0, 3);

      setRegistrationData(processRegistrationData(allUser));
      setEarningsData(processEarningsData(purchases));
      setCourseForChart(processEnrollmentData(allCourse));
      setPurchaseForChart(processEnrollmentData(purchases));
      setTopPerformingCourse(topCourses);
      setRecentPurchases(recentPurchase);
    }
  }, [user, purchases, allCourse, allUser]);
  useEffect(()=>{
     setTimeout(()=>{
      setLoad(false);
     },1000);
  },[]);

  if (!user || load) {
    return (
      <div className='flex flex-row h-screen bg-gray-50'>
        <AdminNavbar />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      <AdminNavbar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <ScrollArea className='flex-1 overflow-auto w-full'>
          <div className='p-6'>
            <div className='flex justify-between items-center mb-8'>
              <div className='flex gap-2 items-center'>
                <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
                <LottieAnimation animationData={dashboard} width={150} height={150} speed={1}/>
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
                  title: 'Total Earnings',
                  value1: purchases?.reduce((total, purchase) => total + (Number(purchase?.amountPaid) || 0), 0).toFixed(2),
                  value2: purchases?.reduce((total, purchase) => total + (Number(purchase?.siteAmount) || 0), 0).toFixed(2),
                  value3: purchases?.reduce((total, purchase) => total + (Number(purchase?.teacherAmount) || 0), 0).toFixed(2),
                  icon: <FaMoneyBillWave size={20} />,
                  bg: 'bg-indigo-100',
                  color: 'text-indigo-600',
                },
                {
                  title: 'This Month',
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
                }
              ].map((stat, index) => (
                <div key={index} className='bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-gray-500 text-sm font-medium'>{stat.title}</p>
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
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            
              <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>User Registrations</h3>
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
          
              <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Course Uploads</h3>
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

              <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
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

              <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Monthly Earnings</h3>
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

              

              
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Top Performing Courses</h3>
                  <div className='text-yellow-500'>
                    <FaStar size={18} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {topPerformingCourse && topPerformingCourse?.length > 0 ? (
                    topPerformingCourse?.map((course, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-800">{course?.title}</h4>
                          <span className="flex items-center text-sm bg-yellow-50 text-yellow-700 gap-1 px-2 py-1 rounded">
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

              <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Recent Purchases</h3>
                  <div className='text-green-500'>
                    <FaMoneyBillWave size={18} />
                  </div>
                </div>
                {recentPurchases && recentPurchases?.length > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Amount</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {recentPurchases.map((purchase, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>{purchase?.courseId?.title}</td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                              {moment(purchase?.createdAt || purchase?.orderDate).format("MMMM DD, YYYY")}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600'>
                              Rs.{Number(purchase?.amountPaid)?.toFixed(2)}
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
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}