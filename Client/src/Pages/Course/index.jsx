import React,{useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuArrowUpDown } from "react-icons/lu";
import { Button } from '@/Components/ui/button';
import { filterOptions, sortOptions } from '@/Utils';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { UseContextApi } from '@/Components/ContextApi';
import { useSelector } from 'react-redux';

export default function Course() {
    const navigate=useNavigate();
    const courses=useSelector(state=>state?.course?.data);
    const [sort,setSort]=useState("");
    const [filters, setFilters] = useState({});
    const {allCourses,setAllCourses}=useContext(UseContextApi);
    useEffect(()=>{
           setAllCourses(courses);
    },[courses]);
  return (
    <div>
      <Navbar/>
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
         <div className='flex flex-col md:flex-row gap-4'>
          <aside className='w-full md:w-64 space-y-4'>
            <div className='p-4 space-y-4 '>
             {
              Object.keys(filterOptions).map((item,index)=>{
                return(
                  <div key={index} className='p-4 space-y-4'>
                    <h3 className='fond-bold mb-3'>{item.toUpperCase()}</h3>
                    <div className='grid gap-2 mt-2'>
                    {filterOptions[item].map((option) => (
                    <Label className="flex font-medium items-center gap-3">
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[item] &&
                          filters[item].indexOf(option.id) > -1
                        }
                        // onCheckedChange={() =>
                        //   handleFilterOnChange(item, option)
                        // }
                      />
                      {option.label}
                    </Label>
                  ))}

                    </div>
                  </div>
              
                )
              })
             }
            </div>
          </aside>
          <main className='flex-1'>
            <div className='flex justify-end items-center mb-4 gap-5'>
              <DropdownMenu>
                < DropdownMenuTrigger asChild>
                       <Button variant='outline' size="sm" className="
                       flex items-center gap-2 p-5">
                      <LuArrowUpDown className='h-4 w-4' />
                      <span className='text-[16px] font-medium'>Sort By</span>
                       </Button>
                </ DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuRadioGroup value={sort} onValueChange={(value)=>setSort(value)}>
                     {
                      sortOptions?.map((item,index)=>{
                        return(
                          <DropdownMenuRadioItem key={index} value={item.id}>
                            {item.label}
                          </DropdownMenuRadioItem>
                        )
                      })
                     }
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className='text-sm text-black font-bold'>
              10 Results
              </span>
            </div>
            <div className='space-y-4'>
              {
                allCourses && allCourses.length > 0?
                allCourses.map((item,index)=>{
                  return (
                    <Card key={index}>
                      <CardContent className="flex p-4 gap-4 ">
                        <div className="w-48 h-32 flex-shrink-0">
                          <img src={item?.image}
                          className='w-full h-full object-cover'
                           alt="Course Thumbnail" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                }):(<h1>No Courses Found</h1>)
              }

            </div>

          </main>

         </div>
      </div>
    </div>
  )
}
