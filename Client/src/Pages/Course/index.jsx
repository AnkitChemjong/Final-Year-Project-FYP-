import React,{useContext, useEffect, useState} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import SkeletonCard from '@/Components/SkeletonCard';
import { toast } from 'react-toastify';
import Footer from '@/Components/Footer';
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import PaymentMessageDialog from '@/Components/PaymentMessageDialog';
import LottieAnimation from '@/Components/LottieAnimation';
import cancelpayment from '@/assets/cancelpayment.json';
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
import { useDispatch, useSelector } from 'react-redux';
import graduationcourse from '@/assets/graduationcourse.json';
import renderStars from '@/Components/RenderStars';




export default function Course() {
  const userStates = useSelector(state => state?.user);
    const { data: user, loading } = userStates;
  const ratingState=useSelector(state=>state?.rating);
  const {data:rating,loading1}=ratingState;
  const coursePurchasedState=useSelector(state=>state?.coursePurchased);
  const {data:purchasedAllCourse,loading2}=coursePurchasedState;
  const progressState=useSelector(state=>state?.progress);
  const {data:allProgress,loading3}=progressState;

  const navigate=useNavigate();
  const location=useLocation();
  const params = new URLSearchParams(location.search);
  const status=params.get('payment');
  const message=params.get('message');
    const [sort,setSort]=useState("create-rtoo");
    const [searchParams,setSearchParams]=useSearchParams();
    const [filters, setFilters] = useState({});
    const {allCourses,setAllCourses,loadingStateCourse,setLoadingStateCourse}=useContext(UseContextApi);
    const [paymentMessageDialog,setPaymentMessageDialog]=useState(false);
    const [paymentMessage,setPaymentMessage]=useState("");
    const [userProgress,setUserProgress]=useState([]);
    const [userPurchasedCourse,setUserPurchasedCourse]=useState(null);
    
    useEffect(()=>{
      if(user&&allProgress&&purchasedAllCourse){
        const userProgressData=allProgress?.filter(item=>item?.userId===user?._id);
        const userPruchasedCourseData=purchasedAllCourse?.find(item=>item?.userId===user?._id);
        setUserProgress(userProgressData);
        setUserPurchasedCourse(userPruchasedCourseData);
      }
    },[user,purchasedAllCourse,allProgress]);
    
    useEffect(() => {
      if (status && status === 'failed' ) {
        setPaymentMessage(message);
        setPaymentMessageDialog(true);
        toast.success(message);
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
              setLoadingStateCourse(true);
                     if(searchTerm.length>0){   
                      const response=await axiosService.post(SEARCH_COURSE_ROUTES,{searchTerm});          
                      if(response.status===200 && response?.data?.data){
                        setLoadingStateCourse(false);
                        setAllCourses(response.data.data);
                      }
                     }
            }
            catch(e){
              console.log(e);
            }
            finally{
              setLoadingStateCourse(false);
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
  const getRatingText = (courseId) => {
    const courseRatings = rating?.filter(r => r?.courseId?._id === courseId) || [];
    if (courseRatings.length === 0) return '(No ratings yet)';
    
    const avg = courseRatings.reduce((sum, r) => sum + r.rating, 0) / courseRatings.length;
    return `(${avg.toFixed(1)} from ${courseRatings.length} review${courseRatings.length !== 1 ? 's' : ''})`;
  };
  return (
    <div>
      <Navbar/>
      <Search searchFunc={searchCourses} onChangeFunc={onChangeFunc}/>
      <div className='container mx-auto p-4'>
        <div className='flex gap-2 items-center'>
        <h1 className='text-3xl font-bold mb-4 font-heading'>All Courses</h1>
          <LottieAnimation animationData={graduationcourse} width={150} height={150} speed={1}/>
        </div>
         <div className='flex flex-col md:flex-row gap-4'>
          <aside className='w-full md:w-64 space-y-4 md:sticky top-2 h-fit self-start'>
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
                    <Card 
  onClick={() => handleNavigate(item?._id)} 
  className="cursor-pointer hover:scale-[1.02] transform transition-transform duration-300 ease-in-out shadow-md hover:shadow-lg hover:bg-slate-50"
  key={index}
>
  <CardContent className="flex flex-col sm:flex-row p-4 gap-4">
   
    <div className="w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
      <img 
        src={item?.image}
        className='w-full h-full object-cover'
        alt="Course Thumbnail" 
      />
    </div>

 
    <div className='flex-1 space-y-2'>
 
      <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2">
        {item?.title}
      </CardTitle>

      
      <div className='flex items-center gap-2 text-sm text-gray-600'>
        <span>By:</span>
        <div className='flex items-center gap-2'>
          <Avatar className='w-8 h-8'>
            {item?.creator?.userImage ? (
              <AvatarImage
                className="rounded-full"
                src={
                  item?.creator?.userImage.startsWith("http")
                    ? item?.creator?.userImage
                    : `${import.meta.env.VITE_BACKEND_URL}/${item?.creator?.userImage}`
                }
                alt="creatorImage"
              />
            ) : (
              <div className='bg-slate-400 flex justify-center items-center w-full h-full rounded-full text-white font-medium'>
                {item?.creator?.userName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </Avatar>
          <span className='font-medium'>{item?.creator?.userName}</span>
        </div>
      </div>

   
      <div className="flex items-center gap-1">
        {renderStars(
          rating?.filter(r => r?.courseId?._id === item?._id)
            .reduce((avg, curr, _, arr) => arr.length ? avg + curr.rating/arr.length : 0, 0)
        )}
        <span className="text-sm text-gray-600 ml-1">
          {getRatingText(item?._id)}
        </span>
      </div>

    
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
        <p>
          {item?.curriculum?.length || 0} {item?.curriculum?.length === 1 ? "Lesson" : "Lessons"}
        </p>
        <p>•</p>
        <p>{item?.level?.toUpperCase()}</p>
        <p>•</p>
        <p>{item?.category?.toUpperCase()}</p>

        <p>•</p>
        <p>
  {userPurchasedCourse?.courses?.some(course => course.courseId === item?._id)
    ? "Purchased"
    : "Not-Purchased"}
</p>
{userPurchasedCourse?.courses?.some(course => course.courseId === item?._id) &&
<>
<p>•</p>
        <p>{ 
        userProgress?.find(itemData=>itemData?.userId===user?._id&&itemData?.courseId===item?._id)?.completed? "Completed":"Learning"
      }</p>
</>
      }
  </div>

      <p className='font-bold text-lg text-green-600 mt-2'>
        Rs. {item?.pricing || "Free"}
      </p>
    </div>
  </CardContent>
</Card>
                  )
                }):(loadingStateCourse? 
                <SkeletonCard/>:<h1 className='relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-bold font-mono text-slate-700'>No Courses Found</h1>)
              }
            </div>

          </main>

         </div>
      </div>
      <PaymentMessageDialog
      paymentMessageDialog={paymentMessageDialog}
      setPaymentMessageDialog={setPaymentMessageDialog}
      message={paymentMessage}
      icon={ <LottieAnimation animationData={cancelpayment} width={200} height={200} speed={1} />}
      />
      <Footer/>
    </div>
  )
}
