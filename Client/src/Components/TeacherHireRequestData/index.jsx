import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LottieAnimation from '../LottieAnimation';
import hirerequest from '@/assets/hirerequest.json';
import { formatForHireApplication } from "@/Utils";
import CommonTableForHireApplication from '../CommonTableForHireApplication';
import SkeletonCard from '../SkeletonCard';
import { ScrollArea } from '../ui/scroll-area';
import { FaEnvelope, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function TeacherHireRequestData({ applicationList }) {
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
    <ScrollArea className="max-h-screen overflow-auto">
      <div className="flex flex-col w-full p-6 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800 font-heading">Hire Requests</h1>
            <LottieAnimation
              animationData={hirerequest}
              width={150}
              height={150}
              speed={1}
            />
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium font-heading">Total Requests</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalRequests}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium font-heading">Pending Requests</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{pendingRequests}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium font-heading">Accepted Requests</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{acceptedRequests}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

         
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-medium font-heading">Rejected Requests</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{rejectedRequests}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={tabValue} className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center py-4 border-b border-gray-200">
            <TabsList className="flex gap-4 bg-white rounded-lg shadow-sm p-2">
              <TabsTrigger
                value="all"
                onClick={() => handleTabValue("all")}
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                ALL
              </TabsTrigger>
              {uniqueStatus?.map((status, index) => (
                <TabsTrigger
                  key={index}
                  value={status}
                  onClick={() => handleTabValue(status)}
                  className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
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
              <TabsContent value="all" className="mt-6">
                <CommonTableForHireApplication
                  data={applicationList}
                  type={"all"}
                  header={formatForHireApplication}
                  page={"teacherdashboard"}
                />
              </TabsContent>
              {uniqueStatus?.map((status, index) => (
                <TabsContent key={index} value={status} className="mt-6">
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