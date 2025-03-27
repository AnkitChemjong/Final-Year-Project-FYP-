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
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import moment from 'moment';

export default function DrawerForHireTeacherDataView({ handleDrawer, setHandleDrawer, data, title, description, footer }) {
    const closeDrawer = () => {
        setHandleDrawer(false);
    }

    return (
        <Drawer open={handleDrawer} onOpenChange={setHandleDrawer}>
            <DrawerContent className="h-[85vh] flex flex-col bg-white">
                
                <DrawerHeader className="flex flex-row justify-between items-start sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
                    <div className='flex flex-col gap-1'>
                        <DrawerTitle className="text-xl font-bold text-black">{title}</DrawerTitle>
                        <DrawerDescription className="text-gray-700">{description}</DrawerDescription>
                    </div>
                    <button 
                        onClick={closeDrawer} 
                        className="text-gray-800 hover:text-black transition-colors"
                        aria-label="Close drawer"
                    >
                        <GiCrossMark  className='cursor-pointer text-gray-700 hover:text-black hover:scale-105 ease-in-out transition-all'  size={24} />
                    </button>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className='flex flex-col items-center gap-6 md:flex-row'>
                            <div className="flex-shrink-0">
                                <Avatar className="h-24 w-24 rounded-full border-2 border-gray-300">
                                    {data?.studentId?.userImage ? 
                                    <AvatarImage
                                        src={
                                            data?.studentId?.userImage?.startsWith("http")
                                                ? data?.studentId?.userImage
                                                : `${import.meta.env.VITE_BACKEND_URL}/${data?.studentId?.userImage}`
                                        }
                                        alt="profileimage"
                                        className='rounded-full object-cover w-full h-full'
                                    /> : (
                                        <div className="bg-gray-100 w-full h-full flex justify-center items-center text-4xl font-bold text-gray-800">
                                            {data?.studentId?.userName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                </Avatar>
                            </div>
                            
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-black">{data?.studentId?.userName}</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-700 font-medium">Email</p>
                                        <p className="font-medium text-black truncate">{data?.studentId?.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-700 font-medium">Phone</p>
                                        <p className="font-medium text-black">{data?.studentId?.phone || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-700 font-medium">Gender</p>
                                        <p className="font-medium text-black">{data?.studentId?.gender || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-700 font-medium">Address</p>
                                        <p className="font-medium text-black">{data?.studentId?.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-bold text-black mb-4 pb-2 border-b border-gray-200">Hiring Details</h4>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700 font-medium">Request Date</p>
                                <p className="font-medium text-black">
                                    {moment(data?.createdAt).format("MMMM Do, YYYY")}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700 font-medium">Status</p>
                                <p className={`font-medium capitalize ${
                                    data?.status === 'approved' ? 'text-green-700' : 
                                    data?.status === 'rejected' ? 'text-red-700' : 'text-blue-700'
                                }`}>
                                    {data?.status}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700 font-medium">Hiring Date</p>
                                <p className="font-medium text-black">
                                    {moment(data?.hiringDate).format("MMMM Do, YYYY")}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700 font-medium">Time Slot</p>
                                <p className="font-medium text-black">
                                    {data?.startTime} - {data?.endTime}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-6 space-y-1">
                            <p className="text-sm text-gray-700 font-medium">Description</p>
                            <div className="mt-2 p-4 bg-gray-100 rounded-lg border border-gray-200">
                                <p className="text-black whitespace-pre-line">
                                    {data?.hireDescription || 'No description provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                    <p className='text-center text-black text-sm'>{footer}</p>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}