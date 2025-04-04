import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import CommonTableForUsers from '../CommonTableForUsers';
import { formatForTeacher } from '@/Utils';
import { FaUsers, FaUserSlash, FaUserCheck } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LottieAnimation from '../LottieAnimation';
import teacher from '@/assets/teacher.json';

export default function AdminTeacherData({ teacherList }) {
  const [tabValue, setTabValue] = useState("all");
  const uniqueStatuses = [...new Set(teacherList?.map(customer => customer?.status))];
 

  const handleTabValue = (value) => {
    setTabValue(value);
  };

 
  const totalTeachers = teacherList?.length;
  const totalBanned = teacherList?.filter(customer => customer?.status === 'banned').length;
  const totalActive = totalTeachers - totalBanned;

  return (
    <ScrollArea className="max-h-screen overflow-auto p-4">
      <div className="mb-6">
      <div className='flex  gap-2 items-center'>
               <h2 className="text-2xl font-bold mb-2">All Teachers</h2>
               <LottieAnimation animationData={teacher} width={150} height={150} speed={1} />
          </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Customers</p>
                <p className="text-2xl font-bold">{totalTeachers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

         
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{totalActive}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaUserCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

        
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Banned Customers</p>
                <p className="text-2xl font-bold text-red-600">{totalBanned}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaUserSlash className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={tabValue} className="w-full">
          <div className="flex justify-center py-4 border-b border-gray-200">
            <TabsList className="flex gap-4 bg-white rounded-lg shadow-sm p-2">
              <TabsTrigger
                value="all"
                onClick={() => handleTabValue("all")}
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                ALL
              </TabsTrigger>
              {uniqueStatuses?.map((status, index) => (
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

          <TabsContent value="all" className="mt-4">
            <CommonTableForUsers 
              tableFormat={formatForTeacher} 
              customerList={teacherList} 
              forType='teacher'
            />
          </TabsContent>

          {uniqueStatuses?.map((status, index) => (
            <TabsContent key={index} value={status} className="mt-4">
              <CommonTableForUsers 
                tableFormat={formatForTeacher} 
                customerList={teacherList.filter(customer => customer?.status === status)} 
                status={status}
                forType='teacher'
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ScrollArea>
  );
}