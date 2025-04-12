import React, { useContext } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import CommonButton from '../CommonButton';
import { GiCrossMark } from "react-icons/gi";
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Update_Application } from '@/Routes';
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getApplication } from '@/Store/Slices/ApplicationSlice';
import { GoDownload } from "react-icons/go";
import { handleDwn } from '@/Services';
import moment from 'moment';
import { UseContextApi } from '../ContextApi';

export default function CommonDrawer({ handleDrawer, setHandleDrawer, data }) {
    const dispatch = useDispatch();
    const {setLoadingSpin}=useContext(UseContextApi);

    const closeDrawer = () => {
        setHandleDrawer(false);
    }

    const handleApplicationStatus = async (status, applicationData) => {
        try {
            setLoadingSpin(true);
            const response = await axiosService.patch(Update_Application, { application: applicationData, status }, {
                withCredentials: true, headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.status === 200) {
                setHandleDrawer(false);
                dispatch(getApplication());
                toast.success(response?.data?.message);
            }
        }
        catch (error) {
            toast.error(error?.response?.data?.message);
        }
        finally{
            setLoadingSpin(false);
        }
    }

    const downloadFile = async (type, url) => {
        try {
            await handleDwn(type, url);
            setHandleDrawer(false)
        } catch (error) {
            toast.error("Download failed", error);
            setHandleDrawer(false)
        }
    };

    return (
        <Drawer open={handleDrawer} onOpenChange={(value) => {
            setHandleDrawer(value)
        }}>
            <DrawerContent className="max-h-[90vh] bg-white">
                <DrawerHeader className="flex flex-row justify-between items-center border-b border-gray-200 px-6 py-4">
                    <div className='flex flex-col gap-1'>
                        <DrawerTitle className="text-xl font-bold text-black">Application Details</DrawerTitle>
                        <DrawerDescription className="text-gray-700">Review and manage this application</DrawerDescription>
                    </div>
                    <GiCrossMark onClick={closeDrawer} className='cursor-pointer text-gray-700 hover:text-black hover:scale-105 ease-in-out transition-all' size={24} />
                </DrawerHeader>

                <div className="px-6 py-4 space-y-6">
                  
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24 cursor-pointer rounded-full border-2 border-gray-300">
                           {data?.user?.userImage? <AvatarImage
                                src={
                                    data?.user?.userImage?.startsWith("http")
                                        ? data?.user?.userImage
                                        : `${import.meta.env.VITE_BACKEND_URL}/${data?.user?.userImage}`
                                }
                                alt="profileimage"
                                className='rounded-full object-cover'
                            />:(
                              <div className="bg-gray-100 w-full h-full flex justify-center items-center text-4xl font-bold text-gray-800 rounded-full">
                              {data?.user?.userName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                            )}
                            
                        </Avatar>

                        <div className="flex-1 w-full">
                            <h3 className="text-2xl font-bold text-black text-center md:text-left">{data?.user?.userName}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className="text-sm text-gray-700 font-medium">Email</p>
                                    <p className="font-medium text-black">{data?.user?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700 font-medium">Phone</p>
                                    <p className="font-medium text-black">{data?.user?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700 font-medium">Date of Birth</p>
                                    <p className="font-medium text-black">
                                        {data?.user?.DOB ? moment(data.user.DOB).format("MMMM Do, YYYY") : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700 font-medium">Gender</p>
                                    <p className="font-medium text-black">{data?.user?.gender || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
                        <div className="flex items-center gap-6">
                          
                            <div className="relative group">
                                <p 
                                    className="text-blue-700 hover:text-blue-900 cursor-pointer underline"
                                    onClick={() => downloadFile("view", data?.userCV)}
                                >
                                    {data?.userCV?.split('/').pop()}
                                </p>
                                <div className="
                                    absolute -top-8 left-1/2 transform -translate-x-1/2 
                                    bg-black text-white text-xs px-2 py-1 rounded 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                    before:absolute before:content-[''] before:border-4 before:border-transparent 
                                    before:border-t-black before:top-full before:left-1/2 before:-translate-x-1/2
                                ">
                                    View CV
                                </div>
                            </div>
                            
                           
                            <div className="relative group">
                                <button 
                                    onClick={() => downloadFile("download", data?.userCV)}
                                    className="text-gray-900 hover:text-black transition-colors"
                                >
                                    <GoDownload size={24} />
                                </button>
                                <div className="
                                    absolute -top-9 left-1/2 transform -translate-x-1/2 
                                    bg-black text-white text-xs px-2 py-1 rounded 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                    before:absolute before:content-[''] before:border-4 before:border-transparent 
                                    before:border-t-black before:top-full before:left-1/2 before:-translate-x-1/2
                                ">
                                    Download CV
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <CommonButton 
                                disable={data?.status === 'rejected' || data?.status === 'approved' || data?.status === 'recruted'} 
                                func={() => handleApplicationStatus("approve", data)} 
                                text="Approve"
                                className="bg-green-700 hover:bg-green-800 text-white"
                            />
                            <CommonButton 
                                disable={data?.status === 'rejected' || data?.status === 'recruted'} 
                                func={() => handleApplicationStatus("reject", data)} 
                                text="Reject"
                                className="bg-red-700 hover:bg-red-800 text-white"
                            />
                        </div>
                        {data?.status === 'approved' && (
                            <CommonButton 
                                func={() => handleApplicationStatus("recrute", data)} 
                                text="Recruit"
                                className="bg-blue-700 hover:bg-blue-800 text-white"
                            />
                        )}
                    </div>
                </div>

                <DrawerFooter className="border-t border-gray-200 px-6 py-4 bg-white">
                    <p className='text-center text-black text-sm font-medium'>
                        Examine the CV, Envision the Future—Choose the Right Educator!
                    </p>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}