import React,{useContext, useEffect, useState} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import SkeletonCard from '@/Components/SkeletonCard';
import { toast } from 'react-toastify';
import Footer from '@/Components/Footer';
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
import { Get_All_Course, Get_Purchase_Detail } from '@/Routes';
import { axiosService } from '@/Services';
import Search from '@/Components/Search';
import { SEARCH_COURSE_ROUTES } from '@/Routes';
import { useSelector } from 'react-redux';


export default function Course() {
  const userStates = useSelector(state => state.user);
    const { data: user, loading } = userStates;
  const navigate=useNavigate();
  const location=useLocation();
  const params = new URLSearchParams(location.search);
  const status=params.get('payment');
  const message=params.get('message');
    const [sort,setSort]=useState("create-rtoo");
    const [searchParams,setSearchParams]=useSearchParams();
    const [filters, setFilters] = useState({});
    const {allCourses,setAllCourses,loadingStateCourse,setLoadingStateCourse}=useContext(UseContextApi);

    useEffect(() => {
      if (status && status === 'failed' ) {
        toast.success(message);
        navigate(location.pathname,{ replace: true })
      }
    }, [status]);

  const getFilterCourses=async ({filters,sort})=>{
    try{
     const query = new URLSearchParams({
             ...filters,
             sortBy:sort
         })
          const response=await axiosService.get(`${Get_All_Course}?${query}`,{withCredentials:true});
          if(response.status===200){
            setAllCourses(response?.data?.course);
            setLoadingStateCourse(false);
          }
    }
    catch(error){
      console.log(error);
    }
    finally{
      setLoadingStateCourse(false);
    }
  }

     useEffect(()=>{
      if(filters !== null || sort !== null){
          getFilterCourses({filters,sort});
      }
     },[filters,sort]);

    const handleFilterOnChange=(getSectionId, getCurrentOption)=>{
      let copyFilters = { ...filters };
      const indexOfCurrentSection =
        Object.keys(copyFilters).indexOf(getSectionId);
      if (indexOfCurrentSection === -1) {
        copyFilters = {
          ...copyFilters,
          [getSectionId]: [getCurrentOption.id],
        };
      } else {
        const indexOfCurrentOption = copyFilters[getSectionId].indexOf(
          getCurrentOption.id
        );
  
        if (indexOfCurrentOption === -1){

          copyFilters[getSectionId].push(getCurrentOption.id);
        }
        else {
          copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }
      }
  
      setFilters(copyFilters);
      localStorage.setItem("filters", JSON.stringify(copyFilters));
    }
    
    
    const createSearchParamsMaker=(filterData)=>{
      const queryParams=[];
      for(const [key,value] of Object.entries(filterData)){
        if(Array.isArray(value) && value.length >0){
          const paramData=value.join(',');
          queryParams.push(`${key}=${encodeURIComponent(paramData)}`)
        }
      }
      return queryParams.join('&');
    }


    useEffect(()=>{
     const queryStringForFilter=createSearchParamsMaker(filters);
     setSearchParams(new URLSearchParams(queryStringForFilter));
    },[filters])


    useEffect(() => {
      setSort("create-rtoo");
      setFilters(JSON.parse(localStorage.getItem("filters")) || {});
    }, []);
     
    useEffect(() => {
      return () => {
        localStorage.removeItem("filters");
      };
    }, []);

    const searchCourses=async (searchTerm)=>{
            try{
                     if(searchTerm.length>0){   
                      const response=await axiosService.post(SEARCH_COURSE_ROUTES,{searchTerm});          
                      if(response.status===200 && response?.data?.data){
                        setAllCourses(response.data.data);
                      }
                     }
            }
            catch(e){
              console.log(e);
            }
            }
  const onChangeFunc=()=>{
    if(filters !== null || sort !== null){
      getFilterCourses({filters,sort});
  }
  }

  const handleNavigate=async(id)=>{
    try{
      if(!loading){
        const response=await axiosService.get(`${Get_Purchase_Detail}/${id}/${user?._id}`);
        // console.log(response);
        if(response?.data?.data){
          navigate(`/courseProgress/${id}`);

        }
        else{
          navigate(`/course/details/${id}`);
        }
      }
    }
    catch(error){
      console.log(error);
    }

  }
  return (
    <div>
      <Navbar/>
      <Search searchFunc={searchCourses} onChangeFunc={onChangeFunc}/>
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
         <div className='flex flex-col md:flex-row gap-4'>
          <aside className='w-full md:w-64 space-y-4'>
            <div className='p-4'>
             {
              Object.keys(filterOptions).map((item,index)=>{
                return(
                  <div key={index} className='p-4 border-2 rounded-2xl mt-1'>
                    <h3 className='fond-bold mb-3'>{item.toUpperCase()}</h3>
                    <div className='grid gap-2 mt-2'>
                    {filterOptions[item].map((option) => (
                    <Label key={option.id} className="flex font-medium items-center gap-3">
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[item] &&
                          filters[item].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(item, option)
                        }
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
              {allCourses?.length} Results
              </span>
            </div>
            <div className='space-y-4 text-center'>
              {
                allCourses && allCourses.length > 0?
                allCourses.map((item,index)=>{
                  return (
                    <Card onClick={()=>handleNavigate(item?._id)} className="cursor-pointer hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md" key={index}>
                      <CardContent className="flex p-4 gap-4 ">
                        <div className="w-48 h-32 flex-shrink-0">
                          <img src={item?.image}
                          className='w-full h-full object-cover'
                           alt="Course Thumbnail" />

                        </div>
                        <div className='felx-1'>
                          <CardTitle className="text-xl mb-2">
                            {item?.title}
                          </CardTitle>
                           <p className='text-sm text-gray-500 mb-1'>
                           Published By: <span className='font-bold'>
                            {item?.creator?.userName}
                            </span> 
                            </p>
                            <p className='text-[16px] text-gray-800 mb-2 mt-3'>
                               {
                                `${item?.curriculum?.length} ${item?.curriculum?.length<=1? "Content":"Contents"} 
                                - ${item?.level?.toUpperCase()}`
                               }
                            </p>
                            <p className='font-bold text-lg'>Rs. {item?.pricing}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }):(loadingStateCourse? 
                <SkeletonCard/>:<h1 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-bold font-mono text-slate-700'>No Courses Found</h1>)
              }
            </div>

          </main>

         </div>
      </div>
      <Footer/>
    </div>
  )
}
