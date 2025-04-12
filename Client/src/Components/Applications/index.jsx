import React, { useState,useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useSelector } from 'react-redux';
import { formatForAllApplication } from '@/Utils';
import CommonTable from '../CommonTableForApplication';
import SkeletonCard from '../SkeletonCard';
import { ScrollArea } from '../ui/scroll-area';
import LottieAnimation from '@/Components/LottieAnimation';
import hirerequest from '@/assets/hirerequest.json';
import { FaFileAlt, FaClock, FaCheckCircle, FaUserTie, FaTimesCircle } from 'react-icons/fa';


export default function Applications() {
  const [tabValue, setTabValue] = useState("all");
  const applicationState = useSelector(state => state?.application);
  const { data: applications, loading } = applicationState;
  const uniqueStatus = [...new Set(applications?.map((applicantItem) => applicantItem.status).flat(1))];
  const userState=useSelector(state=>state?.user);
  const {data:user}=userState;
  const handleTabValue = (value) => {
    setTabValue(value);
  };

  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(item => item.status === "pending").length || 0;
  const approvedApplications = applications?.filter(item => item.status === "approved").length || 0;
  const recruitedApplications = applications?.filter(item => item.status === "recruted").length || 0;
  const rejectedApplications = applications?.filter(item => item.status === "rejected").length || 0;
  

  return (
    <ScrollArea className="max-h-screen overflow-auto">
      <div className="flex flex-col w-full p-6 min-h-screen">
        <div className="flex md:flex-row items-center mb-8 gap-1">
          <h1 className="text-3xl font-bold  font-heading">Applications</h1>
          <LottieAnimation animationData={hirerequest} width={150} height={150} speed={1}/>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
   
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className=" text-sm font-medium font-heading">Total Applications</h3>
                <p className="text-3xl font-bold  mt-2">{totalApplications}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaFileAlt className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

         
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className=" text-sm font-medium font-heading">Pending Applications</h3>
                <p className="text-3xl font-bold  mt-2">{pendingApplications}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className=" text-sm font-medium font-heading">Approved Applications</h3>
                <p className="text-3xl font-bold  mt-2">{approvedApplications}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

         
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className=" text-sm font-medium font-heading">Recruited Applications</h3>
                <p className="text-3xl font-bold  mt-2">{recruitedApplications}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaUserTie className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className=" text-sm font-medium font-heading">Rejected Applications</h3>
                <p className="text-3xl font-bold  mt-2">{rejectedApplications}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={tabValue} className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center py-4 border-b border-gray-200">
            <TabsList className={`flex gap-4 ${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} rounded-lg shadow-sm p-2`}>
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

          {loading ? (
            <SkeletonCard />
          ) : (
            <>
              <TabsContent value="all" className="mt-6">
                {applications?.length > 0 ? (
                  <CommonTable
                    data={applications}
                    header={formatForAllApplication}
                    handleTabValue={handleTabValue}
                    type="all"
                  />
                ) : (
                  <p className="text-gray-600 text-center">No Applications Available.</p>
                )}
              </TabsContent>
              {uniqueStatus?.map((status, index) => (
                <TabsContent key={index} value={status} className="mt-6">
                  <CommonTable
                    header={formatForAllApplication}
                    type={status}
                    handleTabValue={handleTabValue}
                    data={applications?.filter(item => item.status === status)}
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