import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import { GiCrossMark } from "react-icons/gi";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import moment from 'moment';

export default function DrawerForHireTeacherDataView({ 
    handleDrawer, 
    setHandleDrawer, 
    data, 
    title, 
    description, 
    footer 
}) {
    const closeDrawer = () => {
        setHandleDrawer(false);
    }

    return (
        <Drawer open={handleDrawer} onOpenChange={setHandleDrawer}>
            <DrawerContent 
                showOverlay={false} 
                className="h-[85vh] flex flex-col bg-white dark:bg-gray-900"
            >
                {/* Header Section */}
                <DrawerHeader className="flex flex-row justify-between items-start sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <div className='flex flex-col gap-1'>
                        <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </DrawerTitle>
                        <DrawerDescription className="text-gray-600 dark:text-gray-300">
                            {description}
                        </DrawerDescription>
                    </div>
                    <button 
                        onClick={closeDrawer} 
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        aria-label="Close drawer"
                    >
                        <GiCrossMark 
                            className='cursor-pointer hover:scale-105 ease-in-out transition-all' 
                            size={24} 
                        />
                    </button>
                </DrawerHeader>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className='flex flex-col items-center gap-6 md:flex-row'>
                            <div className="flex-shrink-0">
                                <Avatar className="h-24 w-24 rounded-full border-2 border-gray-200 dark:border-gray-600">
                                    {data?.studentId?.userImage ? (
                                        <AvatarImage
                                            src={
                                                data?.studentId?.userImage?.startsWith("http")
                                                    ? data?.studentId?.userImage
                                                    : `${import.meta.env.VITE_BACKEND_URL}/${data?.studentId?.userImage}`
                                            }
                                            alt="Profile image"
                                            className='rounded-full object-cover'
                                        />
                                    ) : (
                                        <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-3xl font-bold">
                                            {data?.studentId?.userName?.charAt(0)?.toUpperCase() || "?"}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </div>
                            
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data?.studentId?.userName}
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {[
                                        { label: "Email", value: data?.studentId?.email },
                                        { label: "Phone", value: data?.studentId?.phone || 'N/A' },
                                        { label: "Gender", value: data?.studentId?.gender || 'N/A' },
                                        { label: "Address", value: data?.studentId?.address || 'N/A' }
                                    ].map((item, index) => (
                                        <div key={index} className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {item.label}
                                            </p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hiring Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                            Hiring Details
                        </h4>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {[
                                { 
                                    label: "Request Date", 
                                    value: moment(data?.createdAt).format("MMMM Do, YYYY") 
                                },
                                { 
                                    label: "Status", 
                                    value: data?.status,
                                    className: `capitalize font-medium ${
                                        data?.status === 'approved' ? 'text-green-600 dark:text-green-400' : 
                                        data?.status === 'rejected' ? 'text-red-600 dark:text-red-400' : 
                                        'text-blue-600 dark:text-blue-400'
                                    }`
                                },
                                { 
                                    label: "Hiring Date", 
                                    value: data?.hiringDate ? moment(data?.hiringDate).format("MMMM Do, YYYY") : 'N/A' 
                                },
                                { 
                                    label: "Time Slot", 
                                    value: data?.startTime && data?.endTime ? `${data.startTime} - ${data.endTime}` : 'N/A' 
                                }
                            ].map((item, index) => (
                                <div key={index} className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {item.label}
                                    </p>
                                    <p className={`${item.className || 'font-medium text-gray-900 dark:text-gray-100'}`}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 space-y-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Description
                            </p>
                            <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                                    {data?.hireDescription || 'No description provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <DrawerFooter className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                    <p className='text-center text-gray-600 dark:text-gray-300 text-sm'>
                        {footer}
                    </p>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}