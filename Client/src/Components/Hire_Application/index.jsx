import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LottieAnimation from '../LottieAnimation';
import hirerequest from '@/assets/hirerequest.json';
import { formatForHireApplication } from "@/Utils";
import CommonTableForHireApplication from '../CommonTableForHireApplication';


export default function HireApplication({ applicationList }) {
  const uniqueStatus = [...new Set(applicationList?.map(item => item?.status).flat(1))];
  const [tabValue, setTabValue] = useState("all");

  const handleTabValue = (value) => {
    setTabValue(value);
  };

  return (
    <div className='flex flex-col items-center justify-center w-full p-4'>
     
      <div className='flex gap-2 items-center justify-center'>
        <p className='text-2xl font-bold'>Hiring Teacher Requests</p>
        <LottieAnimation animationData={hirerequest} width={150} height={150} speed={1} />
      </div>


      <Tabs defaultValue='all' value={tabValue} className='w-full max-w-6xl mt-10'>
      
        <div className='flex justify-center py-3 border-b-2 border-stone-950'>
          <TabsList className="flex gap-4">
            <TabsTrigger value="all" onClick={() => handleTabValue("all")}>
              ALL
            </TabsTrigger>
            {uniqueStatus?.map((status, index) => (
              <TabsTrigger key={index} value={status} onClick={() => handleTabValue(status)}>
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

    
        {!applicationList ? (
          <SkeletonCard />
        ) : (
          <>
            <TabsContent value="all">
              <CommonTableForHireApplication data={applicationList} type={"all"} header={formatForHireApplication} page={"profile"}/>
            </TabsContent>
            {uniqueStatus?.map((status, index) => (
              <TabsContent key={index} value={status}>
                <CommonTableForHireApplication data={applicationList} type={status} header={formatForHireApplication} page={"profile"}/>
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
}