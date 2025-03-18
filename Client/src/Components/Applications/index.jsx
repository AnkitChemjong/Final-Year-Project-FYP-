import React, { useState } from 'react';
import { Tabs,TabsContent,TabsList,TabsTrigger } from '../ui/tabs';
import { useSelector } from 'react-redux';
import { formatForAllApplication } from '@/Utils';
import CommonTable from '../CommonTableForApplication';
import SkeletonCard from '../SkeletonCard';


export default function Applications() {
  const [tabValue,setTabValue]=useState("all");
    const applicationState=useSelector(state=>state?.application);
    const {data:applications,loading}=applicationState;
    const uniqueStatus=[
        ...new Set(
          applications?.map((applicantItem) => applicantItem.status).flat(1)
        ),
      ];

      const handleTabValue=(value)=>{
          setTabValue(value);
      }
  return (
    <div className='flex flex-col h-screen w-screen'>
      <div className='relative md:left-10 md:top-5'>
        <p className='text-2xl font-bold'>Applications</p>
      </div>

      <Tabs defaultValue='all' value={tabValue} className='flex flex-col mt-10 relative md:right-44   items-center '>
        <div className='py-3 border-b-2 border-stone-950'>
        <TabsList className="gap-10">
        <TabsTrigger value="all" onClick={()=>handleTabValue("all")}>
         ALL
        </TabsTrigger>
         {
            uniqueStatus?.map((status,index)=>{
                return(
                    <TabsTrigger key={index} value={status} onClick={()=>handleTabValue(status)}>
                    {status}
                     </TabsTrigger>
                )
            })
         }
        </TabsList>
        </div>
        {
          loading? <SkeletonCard/>:
          (
             <>
             <TabsContent value="all">
        {
            applications?.length > 0 ? <CommonTable data={applications} header={formatForAllApplication} handleTabValue={handleTabValue} type="all"/>
            :<p>No Applications Avilable.</p>
         }
        </TabsContent>
        {
            uniqueStatus?.map((status,index)=>{
                return(
                    <TabsContent key={index} value={status}>
                    <CommonTable header={formatForAllApplication} type={status} handleTabValue={handleTabValue} data={applications?.filter(item=>item?.status===status)}/>
                     </TabsContent>
                )
            })
         }s
             </>
          )
        }
      </Tabs>
    </div>
  )
}
