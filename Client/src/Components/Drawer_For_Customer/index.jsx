import React from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { GiCrossMark } from 'react-icons/gi';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import { useSelector } from 'react-redux';
import { Badge } from '../ui/badge';
import moment from 'moment';
import verified from '@/assets/verified.json';
import LottieAnimation from '../LottieAnimation';
import { FaMoneyBillWave} from 'react-icons/fa';
import { ScrollArea } from '../ui/scroll-area';
import { Table,TableHeader,TableBody,TableCell,TableRow ,TableHead} from '../ui/table';
import { subscriptionPayment } from '@/Utils';

export default function DrawerForCustomer({ 
    handleDrawer, 
    setHandleDrawer, 
    data, 
    title, 
    description, 
    footer,
    setTemporaryUserData,
    thisMonthEarn=0,
    setThisMonthEarning=()=>{},
    userSubscriptionData=[],
    setUserSubscriptionData=()=>{}
}) {
    const progressState = useSelector(state => state?.progress);
    const { data: progress,loading } = progressState;
    const purchasedCourseState = useSelector(state => state?.coursePurchased);
    const { data: purchasedCourse,loading1 } = purchasedCourseState;
    const courseState = useSelector(state => state?.course);
    const { data: allCourse,loading2 } = courseState;
    const onlineUserState = useSelector(state => state?.onlineUsers);
    const { data:onlineUser,loading3 } = onlineUserState;
    
    const closeDrawer = () => {
        setHandleDrawer(false);
        setTemporaryUserData(null);
        setThisMonthEarning(0);
        setUserSubscriptionData([]);
    };

    const userStats = [
        {
            label: 'Courses Completed',
            value: progress?.filter(item => item?.userId === data?._id && item?.completed === true)?.length || 0,
            icon: '✅'
        },
        ...(data?.userRole?.includes('teacher') ? [{
            label: 'Courses Uploaded',
            value: allCourse?.filter(item => item?.creator?._id === data?._id)?.length || 0,
            icon: '📤'
        }] : []),
        {
            label: 'Courses Purchased',
            value: purchasedCourse?.find(item => item?.userId === data?._id)?.courses?.length || 0,
            icon: '🛒'
        },
        {
            label: 'Certificates',
            value: data?.courseCertificates?.length || 0,
            icon: '📜'
        }
    ];

    return (
        <Drawer open={handleDrawer} onOpenChange={(value) => {
            setHandleDrawer(value);
            if (!value){ 
                setTemporaryUserData(null);
                setThisMonthEarning(0);
            }
        }}>
            <DrawerContent
                showOverlay={false}
                className="mx-auto bg-white dark:bg-slate-800"
            >
                <DrawerHeader className="flex justify-between items-start px-8 pt-6 pb-4">
                    <div>
                        <DrawerTitle className="text-2xl font-bold text-gray-800 dark:text-slate-100">
                            {title || 'User Details'}
                        </DrawerTitle>
                        {description && 
                            <DrawerDescription className="text-gray-500 dark:text-slate-300">
                                {description}
                            </DrawerDescription>
                        }
                    </div>
                    <button 
                        onClick={closeDrawer} 
                        className="text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                        <GiCrossMark className='cursor-pointer hover:scale-105 ease-in-out transition-all' size={24} />
                    </button>
                </DrawerHeader>

                <div className="px-8 pb-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-8">
                        <Avatar className="h-28 w-28 rounded-full border-4 border-gray-300 dark:border-slate-600 shadow-lg mb-4">
                            {data?.userImage ? 
                                <AvatarImage
                                    src={
                                        data?.userImage?.startsWith("http")
                                            ? data?.userImage
                                            : `${import.meta.env.VITE_BACKEND_URL}/${data?.userImage}`
                                    }
                                    alt="profile image"
                                    className='rounded-full object-cover w-full h-full'
                                /> : (
                                    <div className="border-2 border-gray-200 dark:border-slate-600 font-extrabold flex justify-center items-center w-full h-full rounded-full text-3xl text-gray-600 dark:text-slate-300">
                                        {data?.userName?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                )}
                            {onlineUser?.some(item=>item?._id===data?._id) &&
                                <div className='rounded-full w-5 h-5 bg-green-600 absolute bottom-2 right-4 cursor-pointer hover:scale-105'></div>
                            }
                        </Avatar>
                        <div className='flex gap-1 items-center justify-center'>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {data?.userName || 'No name provided'}
                            </h3>
                            {data?.subscription?.subscriptionType==='elite' &&
                                <LottieAnimation animationData={verified} width={50} height={50} speed={1}/>
                            }
                        </div>
                        <p className="text-md text-gray-500 dark:text-slate-300 flex items-center gap-1 mt-1">
                            📧 {data?.email || 'No email provided'}
                        </p>
                        
                        {data?.userRole?.includes('teacher') && data?.subscription?.subscriptionStatus === 'active' && (
                            <Badge className="bg-green-500 hover:bg-blue-600 text-white mt-3 px-3 py-1 text-sm">
                                {data?.subscription?.subscriptionType}
                            </Badge>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-slate-700 my-6"></div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {userStats.map((stat, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{stat.icon}</span>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-slate-300">{stat.label}</p>
                                        <p className="font-semibold text-gray-800 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Grid Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Basic Information</h4>
                            </div>
                            {[
                                { icon: '👤', label: 'Gender', value: data?.gender || "N/A" },
                                { icon: '🏠', label: 'Address', value: data?.address || "N/A" },
                                { icon: '📞', label: 'Phone', value: data?.phone || "N/A" },
                                { icon: '🎂', label: 'Date of Birth', 
                                  value: data?.DOB ? moment(data.DOB).format("MMMM Do, YYYY") : "N/A" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-gray-400 dark:text-slate-400">{item.icon}</span>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-slate-300">{item.label}</p>
                                        <p className="font-medium dark:text-white">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Account Details</h4>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-300">User ID</p>
                                <p className="font-medium text-sm break-all dark:text-white">{data?._id || 'Not available'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-slate-300">Account ID</p>
                                <p className="font-medium text-sm break-all dark:text-white">{data?.userId || 'Not available'}</p>
                            </div>
                        </div>
                        
                        {data?.subscription && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Subscription Details</h4>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-300">Subscription Status</p>
                                    <p className="font-medium text-sm break-all dark:text-white">{data?.subscription?.subscriptionStatus || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-300">{data?.subscription?.subscriptionStatus==="active"? "Subscription Type":"Previous Subscription Type"}</p>
                                    <p className="font-medium text-sm break-all dark:text-white">{data?.subscription?.subscriptionType || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-300">{data?.subscription?.subscriptionStatus==="active"? "Subscription Start Date":"Previous Subscription Start Date"}</p>
                                    <p className="font-medium text-sm break-all dark:text-white">{moment(data?.subscription?.subscriptionStartDate).format("MMM D, YYYY") || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-300">{data?.subscription?.subscriptionStatus==="active"? "Subscription End Date":"Subscription Ended Date"}</p>
                                    <p className="font-medium text-sm break-all dark:text-white">{moment(data?.subscription?.subscriptionEndDate).format("MMM D, YYYY") || 'N/A'}</p>
                                </div>
                                {data?.subscription?.subscriptionRenewDate && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-slate-300">{data?.subscription?.subscriptionStatus==="active"? "Subscription Renew Date":"Previous Subscription Renewed Date"}</p>
                                        <p className="font-medium text-sm break-all dark:text-white">{moment(data?.subscription?.subscriptionRenewDate).format("MMM D, YYYY") || 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Teacher Specific Section */}
                    {data?.userRole?.includes('teacher') && (
                        <>
                            <div className="border-t border-gray-200 dark:border-slate-700 my-6"></div>
                            
                            <div>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                                    <ul className="space-y-5">
                                        <h4 className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-4">Teacher Information</h4>
                                        {[
                                            { 
                                                icon: '🎓', 
                                                label: 'Degree', 
                                                value: data?.teacherInfo?.degree ? 
                                                    data.teacherInfo.degree.split(",").map((degree, index) => (
                                                        <Badge key={index} className="bg-green-600 hover:bg-blue-600 px-3 py-1 text-sm mr-2 mb-2">
                                                            {degree.trim()}
                                                        </Badge>
                                                    )) : 
                                                    <span className="text-gray-500 dark:text-slate-300">N/A</span>
                                            },
                                            { icon: '🏫', label: 'College', value: data?.teacherInfo?.college || "N/A" },
                                            { 
                                                icon: '₹', 
                                                label: 'Fee', 
                                                value: data?.teacherInfo?.feePerHour ? 
                                                    `₹${data.teacherInfo.feePerHour} /hr` : "N/A" 
                                            },
                                            { icon: '🏛️', label: 'University', value: data?.teacherInfo?.university || "N/A" },
                                            { 
                                                icon: '📅', 
                                                label: 'Availability', 
                                                value: data?.teacherInfo?.avilability ? 
                                                    data.teacherInfo.avilability.split(",").map((availability, index) => (
                                                        <Badge key={index} className="bg-green-600 hover:bg-blue-600 px-3 py-1 text-sm mr-2 mb-2">
                                                            {availability.trim()}
                                                        </Badge>
                                                    )) : 
                                                    <span className="text-gray-500 dark:text-slate-300">N/A</span>
                                            },
                                            { icon: '📂', label: 'Category', value: data?.teacherInfo?.category || "N/A" },
                                            { icon: '🗣️', label: 'Primary Language', value: data?.teacherInfo?.primaryLanguage || "N/A" },
                                            {icon:'🏆', label:'Experience' , value:`${data?.teacherInfo?.experience} Yr` || "N/A"}
                                        ].map((item, index) => (
                                            <li key={index}>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-gray-400 dark:text-slate-400 mt-1">{item.icon}</span>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-slate-300">{item.label}</p>
                                                        <div className="mt-1">
                                                            {typeof item.value === 'string' ? (
                                                                <p className="font-medium dark:text-white">{item.value}</p>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.value}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-4">Earning Information</h4>
                                        <ul className='flex flex-col gap-3'>
                                            <li>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-green-600 dark:text-green-400 mt-1"><FaMoneyBillWave size={24}/></span>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-slate-300">Total Earning Till Now</p>
                                                        <div className="mt-1">
                                                            {allCourse?.filter(item=>item?.creator?._id===data?._id)? (
                                                                <p className="font-medium dark:text-white">Rs.{allCourse?.filter(item=>item?.creator?._id===data?._id)?.reduce((sum,obj)=>sum+(obj?.students?.length*obj?.pricing||0),0)*(10/100)}</p>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1 dark:text-white">
                                                                    Rs.0
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-red-600 dark:text-red-400 mt-1"><FaMoneyBillWave size={24}/></span>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-slate-300">This month Earning</p>
                                                        <div className="mt-1">
                                                            {thisMonthEarn? (
                                                                <p className="font-medium dark:text-white">Rs.{thisMonthEarn}</p>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1 dark:text-white">
                                                                    Rs.0
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    {userSubscriptionData?.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-4">
                                                Subscription Purchase Details
                                            </h4>
                                            
                                            <ScrollArea className="max-h-60 overflow-auto border rounded-lg dark:border-slate-700">
                                                <Table className="p-5">
                                                    <TableHeader className="bg-gray-200 dark:bg-slate-700">
                                                        <TableRow>
                                                            {subscriptionPayment?.map(item=>(
                                                                <TableHead key={item} className="dark:text-white">{item}</TableHead>
                                                            ))}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {userSubscriptionData.map((subscription,index) => (
                                                            <TableRow key={subscription._id} className="dark:border-slate-700">
                                                                <TableCell className="font-medium dark:text-white">{index + 1}</TableCell>
                                                                <TableCell className="text-sm dark:text-white">
                                                                    {moment(subscription.orderDate).format("MMM D, YYYY")}
                                                                </TableCell>
                                                                <TableCell className="text-sm capitalize dark:text-white">
                                                                    {subscription.subscriptionType}
                                                                </TableCell>
                                                                <TableCell className="text-sm capitalize dark:text-white">
                                                                    {subscription.processFor}
                                                                </TableCell>
                                                                <TableCell className="text-sm dark:text-white">
                                                                    Rs. {subscription.amountPaid}
                                                                </TableCell>
                                                                <TableCell className="text-sm capitalize dark:text-white">
                                                                    {subscription.paymentMethod}
                                                                </TableCell>
                                                                <TableCell className="text-sm">
                                                                    <Badge 
                                                                        variant={subscription.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                                                        className={subscription.paymentStatus === 'paid' ? 
                                                                            'bg-green-500 hover:bg-green-600' : 
                                                                            'bg-yellow-500 hover:bg-yellow-600'
                                                                        }
                                                                    >
                                                                        {subscription.paymentStatus}
                                                                    </Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {footer && (
                    <DrawerFooter className="px-8 pb-6 bg-white dark:bg-slate-800">
                        {footer}
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}