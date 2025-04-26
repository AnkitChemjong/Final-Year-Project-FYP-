import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LottieAnimation from '../LottieAnimation';
import hirerequest from '@/assets/hirerequest.json';
import { formatForHireApplication } from "@/Utils";
import CommonTableForHireApplication from '../CommonTableForHireApplication';
import SkeletonCard from '../SkeletonCard';
import { ScrollArea } from '../ui/scroll-area';
import { FaEnvelope, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function TeacherHireRequestData({ applicationList }) {
  const userState = useSelector(state => state?.user);
  const { data: user, loading } = userState;
  
  const uniqueStatus = [...new Set(applicationList?.map(item => item?.status).flat(1))];
  const [tabValue, setTabValue] = useState("all");

  const handleTabValue = (value) => {
    setTabValue(value);
  };

  const totalRequests = applicationList?.length || 0;
  const pendingRequests = applicationList?.filter(item => item.status === "pending").length || 0;
  const rejectedRequests = applicationList?.filter(item => item.status === "rejected").length || 0;
  const acceptedRequests = applicationList?.filter(item => item.status === "approved").length || 0;

  return (
    <ScrollArea className="h-screen overflow-auto">
      <div className={`flex flex-col w-full p-4 md:p-6 min-h-screen`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4 md:mb-0">
            <h1 className={`text-2xl sm:text-3xl font-bold ${user?.theme ? "text-gray-800" : "text-white"} font-heading`}>
              Hire Requests
            </h1>
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32">
              <LottieAnimation
                animationData={hirerequest}
                width="100%"
                height="100%"
                speed={1}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Requests */}
          <div className={`${user?.theme ? "bg-white" : "bg-black"} p-4 md:p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium font-heading">Total Requests</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{totalRequests}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <FaEnvelope className="text-blue-600 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className={`${user?.theme ? "bg-white" : "bg-black"} p-4 md:p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium font-heading">Pending Requests</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{pendingRequests}</p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                <FaClock className="text-yellow-600 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Accepted Requests */}
          <div className={`${user?.theme ? "bg-white" : "bg-black"} p-4 md:p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium font-heading">Accepted Requests</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{acceptedRequests}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Rejected Requests */}
          <div className={`${user?.theme ? "bg-white" : "bg-black"} p-4 md:p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium font-heading">Rejected Requests</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{rejectedRequests}</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                <FaTimesCircle className="text-red-600 text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="all" value={tabValue} className="w-full mx-auto">
          <div className="flex justify-center py-2 sm:py-4 border-b border-gray-200 overflow-x-auto">
            <TabsList className={`flex gap-2 sm:gap-4 ${user?.theme ? "bg-white" : "bg-black text-white"} rounded-lg shadow-sm p-1 sm:p-2`}>
              <TabsTrigger
                value="all"
                onClick={() => handleTabValue("all")}
                className="px-3 sm:px-6 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                ALL
              </TabsTrigger>
              {uniqueStatus?.map((status, index) => (
                <TabsTrigger
                  key={index}
                  value={status}
                  onClick={() => handleTabValue(status)}
                  className="px-3 sm:px-6 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {status.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {!applicationList ? (
            <SkeletonCard />
          ) : (
            <>
              <TabsContent value="all" className="mt-4 sm:mt-6">
                <CommonTableForHireApplication
                  data={applicationList}
                  type={"all"}
                  header={formatForHireApplication}
                  page={"teacherdashboard"}
                />
              </TabsContent>
              {uniqueStatus?.map((status, index) => (
                <TabsContent key={index} value={status} className="mt-4 sm:mt-6">
                  <CommonTableForHireApplication
                    data={applicationList?.filter(item => item?.status === status)}
                    type={status}
                    header={formatForHireApplication}
                    page={"teacherdashboard"}
                  />
                </TabsContent>
              ))}
            </>
          )}
        </Tabs>
      </div>
    </ScrollArea>
  );
}