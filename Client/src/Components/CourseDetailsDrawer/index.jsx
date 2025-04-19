import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter
} from "../ui/drawer";
import { GiCrossMark } from 'react-icons/gi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function CourseDetailsDrawer({
    handleDrawer, 
    setHandleDrawer, 
    data, 
    title, 
    description, 
    footer,
    setTemporaryCourseData,
    purchasedData = [],
    setPurchasedData
}) {
    const userState = useSelector(state => state?.user);
    const { data: user } = userState;
    const closeDrawer = () => {
        setHandleDrawer(false);
        setTemporaryCourseData(null);
        setPurchasedData([]);
    };

    // Calculate total earnings and students
    const totalEarnings = data?.pricing * (data?.students?.length || 0);
    const totalStudents = data?.students?.length || 0;

    const processEnrollmentData = () => {
        if (!Array.isArray(purchasedData) || purchasedData.length === 0) return [];
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Group enrollments by month
        const monthlyData = purchasedData.reduce((acc, purchase) => {
            try {
                if (!purchase?.createdAt) return acc;
                
                const date = new Date(purchase.createdAt);
                if (isNaN(date.getTime())) return acc;
                
                const month = date.getMonth();
                const monthName = monthNames[month];
                
                if (!acc[monthName]) {
                    acc[monthName] = {
                        name: monthName,
                        enrollments: 0
                    };
                }
                acc[monthName].enrollments += 1;
                return acc;
            } catch (error) {
                console.error("Error processing purchase data:", error);
                return acc;
            }
        }, {});

        const result = monthNames.map(month => ({
            name: month,
            enrollments: monthlyData[month]?.enrollments || 0
        }));
        
        return result;
    };

    const enrollmentData = processEnrollmentData();
    const hasChartData = enrollmentData.some(month => month.enrollments > 0);
    const hasPurchaseData = purchasedData?.length > 0;

    return (
        <Drawer open={handleDrawer} onOpenChange={(value) => {
            setHandleDrawer(value);
            if (!value) { 
                setTemporaryCourseData(null);
                setPurchasedData([]);
            }
        }}>
            <DrawerContent 
                showOverlay={false} 
                className="mx-auto max-h-[80vh] rounded-t-lg dark:bg-gray-800"
            >
                <div className="max-h-[78vh] overflow-y-auto">
                    <DrawerHeader className="flex justify-between items-start px-6 pt-4 pb-3 border-b sticky top-0 bg-white dark:bg-gray-800 dark:border-gray-700 z-10">
                        <div>
                            <DrawerTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 font-heading">
                                {data?.title || title || 'Course Details'}
                            </DrawerTitle>
                            {description && (
                                <DrawerDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                    {description}
                                </DrawerDescription>
                            )}
                        </div>
                        <button 
                            onClick={closeDrawer} 
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <GiCrossMark className='cursor-pointer hover:scale-105 ease-in-out transition-all' size={20} />
                        </button>
                    </DrawerHeader>

                    <div className="px-4 pb-4 space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 font-heading">Course Information</h3>
                                    <div className="space-y-1 text-sm">
                                        <p className="flex justify-between">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Category:</span>
                                            <span className="text-gray-800 dark:text-gray-100">{data?.category || 'N/A'}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Level:</span>
                                            <span className="text-gray-800 dark:text-gray-100">{data?.level || 'N/A'}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Price:</span>
                                            <span className="text-gray-800 dark:text-gray-100">Rs. {data?.pricing || '0'}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Language:</span>
                                            <span className="text-gray-800 dark:text-gray-100">{data?.primaryLanguage || 'N/A'}</span>
                                        </p>
                                        <p className="flex justify-between items-center">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${
                                                data?.isPublished 
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                                            }`}>
                                                {data?.isPublished ? 'Published' : 'Unpublished'}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 font-heading">Statistics</h3>
                                    <div className="space-y-1 text-sm">
                                        <p className="flex justify-between">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Total Enrollments:</span>
                                            <span className="text-gray-800 dark:text-gray-100">{totalStudents}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Total Earnings:</span>
                                            <span className="text-gray-800 dark:text-gray-100">Rs. {totalEarnings}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">Teacher Earnings (10%):</span>
                                            <span className="text-gray-800 dark:text-gray-100">Rs. {(totalEarnings * 0.1).toFixed(2)}</span>
                                        </p>
                                        {user?.userRole?.includes('admin') && (
                                            <p className="flex justify-between">
                                                <span className="font-medium text-gray-600 dark:text-gray-300">Site Earnings (90%):</span>
                                                <span className="text-gray-800 dark:text-gray-100">Rs. {(totalEarnings * 0.9).toFixed(2)}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {data?.curriculum?.length > 0 && (
                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-3 border dark:border-gray-600">
                                <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-2 font-heading">Curriculum ({data.curriculum?.length})</h3>
                                <div className="space-y-2">
                                    {data.curriculum.map((item, index) => (
                                        <div key={index} className="border-l-2 border-blue-500 dark:border-blue-400 pl-3 py-1">
                                            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.title || 'Untitled Section'}</p>
                                            {item.description && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{item.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-3 border dark:border-gray-600">
                            <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-2 font-heading">Enrollment Chart</h3>
                            <div className="h-52">
                                {hasChartData ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={enrollmentData}
                                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis 
                                                dataKey="name" 
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                axisLine={false}
                                            />
                                            <YAxis 
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                axisLine={false}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: '6px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    fontSize: '12px',
                                                    color: '#1f2937'
                                                }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '12px', color: '#1f2937' }} />
                                            <Bar 
                                                dataKey="enrollments" 
                                                fill="#6366f1" 
                                                name="Enrollments" 
                                                radius={[2, 2, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                                        No enrollment data available
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-3 border dark:border-gray-600">
                            <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-2 font-heading">
                                Recent Enrollments
                            </h3>
                            {hasPurchaseData ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                        <thead className="bg-gray-100 dark:bg-gray-600">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-black dark:text-gray-200 uppercase tracking-wider">Name</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-black dark:text-gray-200 uppercase tracking-wider">Email</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-black dark:text-gray-200 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                                            {purchasedData
                                                .slice(0, 5) 
                                                .map((purchase, index) => (
                                                <tr key={index} className="text-sm">
                                                    <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                                                        {purchase?.userId?.userName || 'Anonymous'}
                                                    </td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                        {purchase?.userId?.email || 'N/A'}
                                                    </td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                        {purchase?.createdAt ? 
                                                            moment(purchase?.createdAt).format("MMMM Do, YYYY") : 
                                                            'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-3">
                                    No recent enrollments
                                </div>
                            )}
                        </div>
                    </div>

                    {footer && (
                        <DrawerFooter className="px-4 py-3 border-t sticky bottom-0 bg-white dark:bg-gray-800 dark:border-gray-700">
                            {footer}
                        </DrawerFooter>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}