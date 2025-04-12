import React, { useState, useEffect, useContext } from 'react';
import TeacherNavbar from '@/Components/TeacherNavbar';
import { useNavigate } from 'react-router-dom';
import CommonButton from '@/Components/CommonButton';
import { useLocation } from 'react-router-dom';
import PaymentMessageDialog from '@/Components/PaymentMessageDialog';
import LottieAnimation from '@/Components/LottieAnimation';
import successpayment from '@/assets/successpayment.json';
import { toast } from 'react-toastify';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { useSelector } from 'react-redux';
import { Badge } from '@/Components/ui/badge';
import { useSocket } from '@/Services/Socket-Client-Provider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaMoneyBillWave, FaChartLine, FaStar, FaBook, FaUsers } from 'react-icons/fa';
import SkeletonCard from '@/Components/SkeletonCard';
import { UseContextApi } from '@/Components/ContextApi';
import { axiosService } from '@/Services';
import { Get_Teacher_Purchase_Data } from '@/Routes';
import dashboard  from '@/assets/dashboard.json';
import moment from 'moment';
import { Button } from '@/Components/ui/button';

export const getTeacherPurchaseData = async (id) => {
  try {
    const response = await axiosService.get(`${Get_Teacher_Purchase_Data}/${id}`);
    if (response?.status === 200) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching teacher purchase data:', error);
    return null;
  }
};

export const processEnrollmentData = (purchases) => {
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
    enrollments: 0
  }));

  if (!purchases?.length) return monthlyData;

  purchases.forEach(purchase => {
    const date = new Date(purchase.createdAt || purchase.orderDate);
    const month = date.getMonth();
    if (month >= 0 && month < 12) {
      monthlyData[month].enrollments += 1;
    }
  });

  return monthlyData;
};

export default function TeacherApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  const { teacherPurchaseData, setTeacherPurchaseData } = useContext(UseContextApi);

  const userState = useSelector(state => state?.user);
  const { data: user } = userState;
  const courseState = useSelector(state => state?.course);
  const { data: course } = courseState;
  const ratingState = useSelector(state => state?.rating);
  const { data: rating } = ratingState;

  const params = new URLSearchParams(location.search);
  const status = params.get('payment');
  const message = params.get('message');
  const amount = params.get('amount');
  const subscriptionType = params.get('subscriptionType');

  
  const [paymentMessageDialog, setPaymentMessageDialog] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [tostShown, setTostShown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [topPerformingCourse, setTopPerformingCourse] = useState(null);
  const [topCourseRating, setTopCourseRating] = useState(null);
  const [earningOfThisMonth, setEarningOfThisMonth] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [load,setLoad]=useState(true);

  const resetUserData = () => {
    setTeacherPurchaseData(null);
    setTopPerformingCourse(null);
    setTopCourseRating(null);
    setEarningOfThisMonth(0);
    setEnrollmentData([]);
    setIsLoading(true);
  };
  useEffect(() => {
    if (status === 'success' && user?._id) {
      socket?.emit('subscription-bought', {
        userId: user._id,
        title: "Subscription Purchase",
        message: "Your subscription purchase is successful.",
        type: 'subscription',
        subscriptionType
      });
      
      setPaymentMessage(message);
      setPaymentAmount(amount);
      setPaymentMessageDialog(true);
      
      if (!tostShown) {
        toast.success(message);
        setTostShown(true);
      }
    }
  }, [status, socket, user?._id]);


  useEffect(() => {
    if (!user?._id) return;

    const fetchTeacherData = async () => {
      try {
        resetUserData();
        const response = await getTeacherPurchaseData(user._id);
        setTeacherPurchaseData(response);
      } catch (error) {
        console.error('Error loading teacher data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();

    return () => {
      resetUserData();
    };
  }, [user?._id]);


  useEffect(() => {
    if (teacherPurchaseData?.purchase) {
      setEnrollmentData(processEnrollmentData(teacherPurchaseData?.purchase));
    } else {
      setEnrollmentData([]);
    }
  }, [teacherPurchaseData]);

 
  useEffect(() => {
    if (course && user?._id) {
      const topCourse = course
        .filter(item => item?.creator?._id === user._id)
        .reduce((max, current) => 
          (current?.students?.length || 0) > (max?.students?.length || 0) ? current : max, 
        null);
      setTopPerformingCourse(topCourse);
    }
  }, [course, user?._id]);

  useEffect(() => {
    if (topPerformingCourse && rating) {
      const courseRatings = rating?.filter(r => r?.courseId?._id === topPerformingCourse?._id);
      if (courseRatings.length > 0) {
        const avgRating = courseRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / courseRatings.length;
        setTopCourseRating(avgRating.toFixed(1));
      } else {
        setTopCourseRating(null);
      }
    }
  }, [topPerformingCourse, rating]);


  useEffect(() => {
    if (teacherPurchaseData?.purchase) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const earnings = teacherPurchaseData.purchase
        .filter(purchase => {
          const purchaseDate = new Date(purchase.orderDate || purchase.createdAt);
          return (
            purchaseDate.getMonth() === currentMonth &&
            purchaseDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, purchase) => sum + parseFloat(purchase.teacherAmount || 0), 0)
        .toFixed(2);

      setEarningOfThisMonth(earnings);
    }
  }, [teacherPurchaseData]);
  useEffect(()=>{
    setTimeout(()=>{
     setLoad(false);
    },1000);
 },[]);


  if (isLoading || !user || load) {
    return (
      <div className='flex flex-row gap-2 overflow-hidden min-h-screen bg-gray-50'>
        <TeacherNavbar />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className={`flex flex-row gap-2 overflow-hidden min-h-screen  ${user?.theme? "bg-gray-50":"bg-zinc-900"}`}>
      <TeacherNavbar />
      <ScrollArea className="max-h-screen overflow-auto">
        <div className='flex-1 p-6'>
          <div className='flex justify-between items-center mb-8'>
          <div className='flex gap-2 items-center'>
            <h1 className={`text-3xl font-bold  ${user?.theme? "text-gray-800":"text-white"} font-heading`}>Teacher Dashboard</h1>
          <LottieAnimation animationData={dashboard} width={150} height={150} speed={1}/>
        </div>
            <div className='flex items-center gap-4'>
              <CommonButton func={()=>navigate('/')}  text="Go Home"/>
              <Badge className='px-4 py-2 bg-green-600 hover:bg-blue-600 cursor-pointer'>
                {user?.subscription?.subscriptionType || 'Basic'}
              </Badge>
              <CommonButton
                func={() => navigate('/teacher/subscription')}
                text="Upgrade Subscription"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {[
              {
                title: 'Total Earnings',
                value: `Rs.${teacherPurchaseData?.totalEarnings?.toFixed(2) || '0.00'}`,
                icon: <FaMoneyBillWave size={24} />,
                bg: 'bg-green-100',
                color: 'text-green-600'
              },
              {
                title: 'This Month',
                value: `Rs.${earningOfThisMonth}`,
                icon: <FaMoneyBillWave size={24} />,
                bg: 'bg-blue-100',
                color: 'text-blue-600'
              },
              {
                title: 'Total Students',
                value: course?.filter(c => c?.creator?._id === user._id)
                  .reduce((sum, c) => sum + (c?.students?.length || 0), 0),
                icon: <FaUsers size={24} />,
                bg: 'bg-orange-100',
                color: 'text-orange-600'
              },
              {
                title: 'Courses Uploaded',
                value: course?.filter(c => c?.creator?._id === user._id).length,
                icon: <FaBook size={24} />,
                bg: 'bg-purple-100',
                color: 'text-purple-600'
              }
            ].map((stat, index) => (
              <div key={index} className={` ${user?.theme? "bg-white":"bg-black"} p-6 rounded-lg shadow-sm border border-gray-100`}>
                <div className={`flex items-center justify-between ${user?.theme? "":"text-white"}`}>
                  <div>
                    <p className=' font-medium'>{stat.title}</p>
                    <h3 className='text-2xl font-bold mt-2'>{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

        
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
         
            <div className={` ${user?.theme? "bg-white":"bg-black"} p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2 `}>
              <div className='flex items-center justify-between mb-4'>
                <h3 className={`text-lg font-semibold font-heading ${user?.theme? "":"text-white"}`}>Monthly Enrollments ({new Date().getFullYear()})</h3>
                <div className='text-blue-500'>
                  <FaChartLine size={20} />
                </div>
              </div>
              <div className='h-64'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} enrollments`, 'Enrollments']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="enrollments" 
                      fill="#8884d8" 
                      name="Enrollments"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

           
            <div className={` ${user?.theme? "bg-white":"bg-black text-white"} p-6 rounded-lg shadow-sm border border-gray-100`}>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold font-heading'>Top Performing Course</h3>
                <div className='text-yellow-500'>
                  <FaStar size={20} />
                </div>
              </div>
              
              {topPerformingCourse ? (
                <>
                  <h4 className='text-xl font-bold mb-2'>{topPerformingCourse.title}</h4>
                  <div className='space-y-3 mt-4'>
                    {[
                      {
                        label: 'Total course Earned',
                        value: `Rs.${
                          teacherPurchaseData?.purchase
                            ?.filter(p => p?.courseId === topPerformingCourse._id)
                            ?.reduce((sum, p) => sum + parseFloat(p?.amountPaid || 0), 0)
                            ?.toFixed(2) || '0.00'
                        }`
                      },
                      {
                        label: 'Earnings',
                        value: `Rs.${
                          teacherPurchaseData?.purchase
                            ?.filter(p => p?.courseId === topPerformingCourse._id)
                            ?.reduce((sum, p) => sum + parseFloat(p?.teacherAmount || 0), 0)
                            ?.toFixed(2) || '0.00'
                        }`
                      },
                      {
                        label: 'Students',
                        value: topPerformingCourse.students?.length || 0
                      },
                      {
                        label: 'Rating',
                        value: (
                          <>
                            ({topCourseRating || '0.0'} from {rating?.filter(r => r?.courseId?._id === topPerformingCourse._id).length} reviews)
                            <FaStar className='ml-1 text-yellow-400' />
                          </>
                        )
                      }
                    ].map((item, i) => (
                      <div key={i} className='flex justify-between text-gray-500'>
                        <span >{item.label}:</span>
                        <span className='font-medium'>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => navigate('/teacher/course')}
                    className='mt-6 w-full font-playfair py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition'
                  >
                    View All Courses
                  </Button>
                </>
              ) : (
                <p className='text-gray-500'>No course data available</p>
              )}
            </div>
          </div>

          <div className={` ${user?.theme? "bg-white":"bg-black text-white"} p-6 rounded-lg shadow-sm border border-gray-100`}>
            <h3 className='text-lg font-semibold mb-4 font-heading'>Recent Earnings</h3>
            
            {teacherPurchaseData?.purchase?.length ? (
              <div className='overflow-x-auto'>
                <ScrollArea className="max-h-96 overflow-auto">
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className={` ${user?.theme? "bg-gray-100":"bg-black"}`}>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Student</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Earnings</th>
                      </tr>
                    </thead>
                    <tbody className={` ${user?.theme? "bg-white":"bg-black"} divide-y divide-gray-200`}>
                      {teacherPurchaseData.purchase.slice(0, 5).map((purchase, i) => {
                        const courseData = course?.find(c => c._id === purchase.courseId);
                        return (
                          <tr key={i}>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              {courseData?.title || 'Unknown Course'}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              {purchase.userId?.email || 'Unknown User'}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              {moment(purchase?.createdAt||purchase?.orderDate).format("MMMM DD, YYYY")}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-green-600 font-medium'>
                              Rs.{parseFloat(purchase?.teacherAmount || 0).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            ) : (
              <div className='w-full p-2 text-center'>
                <p className='text-gray-500'>No recent earnings data</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <PaymentMessageDialog
        paymentMessageDialog={paymentMessageDialog}
        setPaymentMessageDialog={setPaymentMessageDialog}
        message={paymentMessage}
        icon={<LottieAnimation animationData={successpayment} width={150} height={150} speed={1} />}
        amount={paymentAmount}
      />
    </div>
  );
}