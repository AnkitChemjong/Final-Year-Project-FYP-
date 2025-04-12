import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import CommonTableForUsers from '../CommonTableForUsers';
import { formatForCustomer } from '@/Utils';
import { FaUsers, FaUserSlash, FaUserCheck } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import customer from '@/assets/customer.json';
import LottieAnimation from '../LottieAnimation';
import { useSelector } from 'react-redux';

export default function AdminCustomerData({ customerList }) {
  const [tabValue, setTabValue] = useState("all");
  const uniqueStatuses = [...new Set(customerList?.map(customer => customer?.status))];
  const userState=useSelector(state=>state?.user);
  const {data:user}=userState;

  const handleTabValue = (value) => {
    setTabValue(value);
  };

 
  const totalCustomers = customerList?.length;
  const totalBanned = customerList?.filter(customer => customer?.status === 'banned').length;
  const totalActive = totalCustomers - totalBanned;

  return (
    <ScrollArea className="max-h-screen overflow-auto p-4">
      <div className="mb-6">
        <div className='flex items-center gap-2'>
               <h2 className="text-2xl font-bold mb-2 font-heading">All Customers</h2>
               <LottieAnimation animationData={customer} width={150} height={150} speed={1} />
          </div>
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} rounded-lg shadow p-4 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm font-heading">Total Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

         
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} rounded-lg shadow p-4 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm font-heading">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{totalActive}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaUserCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

        
          <div className={`${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} rounded-lg shadow p-4 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm font-heading">Banned Customers</p>
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
            <TabsList className={`flex gap-4 ${user?.theme & "bg-white"} ${user?.theme===false && "bg-black text-white"} rounded-lg shadow-sm p-2`}>
              <TabsTrigger
                value="all"
                onClick={() => handleTabValue("all")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200  data-[state=active]:bg-blue-600 data-[state=active]:text-white`}
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
              tableFormat={formatForCustomer} 
              customerList={customerList}
              forType='customer' 
            />
          </TabsContent>

          {uniqueStatuses?.map((status, index) => (
            <TabsContent key={index} value={status} className="mt-4">
              <CommonTableForUsers 
                tableFormat={formatForCustomer} 
                customerList={customerList.filter(customer => customer?.status === status)} 
                status={status}
                forType='customer'
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ScrollArea>
  );
}