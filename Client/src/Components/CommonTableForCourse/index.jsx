import React, { useContext, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import supabaseClient from '../SupabaseClient';
import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, } from '../ui/table';  
import moment from 'moment';
import { RiDeleteBin6Line } from "react-icons/ri";
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getCourse } from '@/Store/Slices/Course_Slice';
import { Delete_All_Course,Delete_Selected_Course,Delete_Single_Course,
  Update_Teacher_Single_Course,Update_Teacher_Selected_Course,Update_Teacher_All_Course
 } from '@/Routes';
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { getTeacherCoursesFromBackend } from '@/Pages/TeacherCourse';
import { UseContextApi } from '../ContextApi';
import { useSelector } from 'react-redux';
import DeleteDialog from '../DeleteDialog';
import CourseDetailsDrawer from '../CourseDetailsDrawer';



export default function CommonTableForCourse({data,header,type="",page}){
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  const purchaseStates = useSelector(state => state?.purchase);
  const { data: purchaseData, loading1 } = purchaseStates;
  const {teacherCourseList,setTeacherCourseList}=useContext(UseContextApi);
  const [selectedCourse,setSelectedCourse]=useState([]);
  const [publishSingle,setPublishSingle]=useState(false);
  const [unPublishSingle,setUnPublishSingle]=useState(false);
  const [publishMulti,setPublishMulti]=useState(false);
  const [unPublishMulti,setUnPublishMulti]=useState(false);
  const [deleteSingle,setDeleteSingle]=useState(false);
  const [deleteMulti,setDeleteMulti]=useState(false);
  const [toggleDrawer,setToggleDrawer]=useState(false);
  const [temporaryCourseData,setTemporaryCourseData]=useState(null);
  const [purchasedData,setPurchasedData]=useState([]);
  const [courseToPublish,setCourseToPublish]=useState(null);
  const [courseToUnPublish,setCourseToUnPublish]=useState(null);
  const [courseToDelete,setCourseToDelete]=useState(null);

  const deleteCourse=async ({data=null,type,status})=>{
    try{
      if(type === "all" ){
        if(selectedCourse.length<1){
          const response=await axiosService.delete(Delete_All_Course,{data:{status,data}},{withCredentials:true, headers: {
            "Content-Type": "application/json"
    }});
    for (const item of data) {
      if (item?.extraResources) {
        await supabaseClient.storage
          .from('extra-resources')
          .remove([item?.extraResources]);
      }
    }
    if(response.status===200){
      dispatch(getCourse());
      toast.success(response?.data?.message);
    }
        }
        
        else{
              const response=await axiosService.delete(Delete_Selected_Course,{data:{data:selectedCourse}},{withCredentials:true,
                headers: {
                  "Content-Type": "application/json"
          }
              });
              for (const item of selectedCourse) {
                if (item?.extraResources) {
                  await supabaseClient.storage
                    .from('extra-resources')
                    .remove([item?.extraResources]);
                }
              }
              
              if(response.status===200){
                setSelectedCourse([]);
                dispatch(getCourse());
                toast.success(response?.data?.message);
              }
    
          }
      }   
      else{
        const response=await axiosService.delete(Delete_Single_Course,{data:{data}},{withCredentials:true, headers: {
                "Content-Type": "application/json"
        }});
        await supabaseClient.storage
                    .from('extra-resources')
                    .remove([data?.extraResources]);
        if(response.status===200){
          dispatch(getCourse());
          toast.success(response?.data?.message);
        }
          
        }
      }
        catch(error){
      toast.error(error?.response?.data?.message);
    }
  }


  const updateCourse=async ({data=null,type,status})=>{
    try{
      if(type === "all" ){
        if(selectedCourse.length<1){
          const response=await axiosService.patch(Update_Teacher_All_Course,{status,data:teacherCourseList},{withCredentials:true, headers: {
            "Content-Type": "application/json"
    }});
    if(response.status===200){
      dispatch(getCourse());
      const result = await getTeacherCoursesFromBackend(user?._id);
      setTeacherCourseList(result);
      toast.success(response?.data?.message);
    }
        }
        
        else{
              const response=await axiosService.patch(Update_Teacher_Selected_Course,{data:selectedCourse,status},{withCredentials:true,
                headers: {
                  "Content-Type": "application/json"
          }
              });
              
              if(response.status===200){
                setSelectedCourse([]);
                dispatch(getCourse());
                const result = await getTeacherCoursesFromBackend(user?._id);
                 setTeacherCourseList(result);
                toast.success(response?.data?.message);
              }
    
          }
      }   
      else{
        const response=await axiosService.patch(Update_Teacher_Single_Course,{data,status},{withCredentials:true, headers: {
                "Content-Type": "application/json"
        }});
        if(response.status===200){
          dispatch(getCourse());
          const result = await getTeacherCoursesFromBackend(user?._id);
          setTeacherCourseList(result);
          toast.success(response?.data?.message);
        }
          
        }
      }
        catch(error){
      toast.error(error?.response?.data?.message);
    }
  }

  const handleAddCourse = (data, checked) => {
    if (checked) {
      setSelectedCourse((prev) => [...prev, data]); 
    } else {
      setSelectedCourse((prev) => prev.filter((app) => app !== data)); 
    }
  };

  const handleCourseEditId=(id)=>{
    navigate(`/edit_course/${id}`);
   }

  return (
    <div className='flex flex-col justify-center items-center gap-2 px-2'>
      <p className="  text-sm font-heading">A list of {type} Courses.</p>
        {
            data && data.length >=1? 
            (
                <>
        <div className="flex flex-row justify-evenly items-center w-full">
          {
            page === "admin-page" &&
            <>
          <div className="relative cursor-pointer before:content-['Delete-All'] before:absolute before:-top-14 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">
          <RiDeleteBin6Line onClick={()=>setDeleteMulti(true)} className='cursor-pointer  hover:scale-110 transition-transform duration-100 ease-in-out' size={20}/>
          </div>
          {deleteMulti && <DeleteDialog
                                deleteDialog={deleteMulti}
                                setDeleteDialog={setDeleteMulti}
                                title={`Delete ${selectedCourse?.length>0? "Selected":"Multiple"} Courses.`}
                                description={"The process cannot be undone after Completion."}
                                func={()=>deleteCourse({type:"all",status:type,data})}
                              />}
            </>
          }
          {
            page === "teacher-page" &&
            <div className="flex gap-2">
            
                  <Button
                  disabled={teacherCourseList?.every(item=>item?.isPublished===true)}
                    onClick={() =>setPublishMulti(true)}
                    className="bg-green-500 text-white font-playfair hover:scale-105  ease-in-out px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                   { selectedCourse?.length>0? "Publish Selected":"Publish All"}
                  </Button>
                  {publishMulti && <DeleteDialog
                                deleteDialog={publishMulti}
                                setDeleteDialog={setPublishMulti}
                                title={`Publish ${selectedCourse?.length>0? "Selected":"Multiple"} Courses.`}
                                description={"The process can be undone after Completion."}
                                func={()=>updateCourse({type:"all",status:true})}
                              />}
            
                  <Button
                   disabled={teacherCourseList?.every(item=>item?.isPublished===false)}
                    onClick={() =>setUnPublishMulti(true)}
                    className="bg-red-500 hover:scale-105 font-playfair  ease-in-out text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    {selectedCourse?.length>0? "unPublish Selected":"unPublish All"}
                  </Button>
                  {unPublishMulti && <DeleteDialog
                                deleteDialog={unPublishMulti}
                                setDeleteDialog={setUnPublishMulti}
                                title={`UnPublish ${selectedCourse?.length>0? "Selected":"Multiple"} Courses.`}
                                description={"The process can be undone after Completion."}
                                func={()=>updateCourse({type:"all",status:false})}
                              />}
                </div>
          }
        </div>
         <ScrollArea  className="border max-h-[350px] overflow-auto rounded-lg">
            <Table >
           <TableHeader className="bg-gray-200 rounded-t-lg">
           <TableRow>
         {header && header.map((item, index) => (
           <TableHead 
             key={index} 
             className="w-[100px] text-black first:rounded-tl-lg last:rounded-tr-lg"
           >
             {item}
           </TableHead>
         ))}
       </TableRow>
     </TableHeader>
           <TableBody>
             {data?.map((item,index) => (
               <TableRow key={index}>
                 <TableCell className="font-medium">
                   <Checkbox className={`${user?.theme? "":"bg-white"}`} checked={selectedCourse.includes(item)} onCheckedChange={(checked)=>handleAddCourse(item,checked)}/>
                 </TableCell>
                 <TableCell>{data?.indexOf(item)+1}</TableCell>
                 <TableCell>{item?.title}</TableCell>
                 <TableCell>Rs. {item?.pricing}</TableCell>
                 <TableCell className="text-center">{item?.students.length}</TableCell>
                 <TableCell>{moment(item?.createdAt).format("MMMM DD, YYYY")}</TableCell>
                 <TableCell className="text-center">Rs.{item?.students.length*item?.pricing}</TableCell>
                 {
                  page === 'teacher-page' &&
                  <TableCell className="text-center">Rs.{((item?.students?.length || 0) * (item?.pricing || 0)*(10/100)).toFixed(2)}</TableCell>
                 }
                 {
                  page === 'teacher-page' &&
                  <TableCell className="text-center">{item?.isPublished?.toString()}</TableCell>
                 }

                 <TableCell className="text-right flex flex-row gap-5 justify-center items-center ">
                   <FaRegEdit className='cursor-pointer hover:scale-105 duration-100 ease-in-out transition-all' onClick={()=>handleCourseEditId(item?._id)} size={20}/>
                    {
                      page === "admin-page" &&
                      <>
                     <RiDeleteBin6Line onClick={()=>{setDeleteSingle(true);
                      setCourseToDelete(item);
                     }} className='cursor-pointer hover:scale-110 transition-transform duration-100 ease-in-out' size={20}/>
                     {deleteSingle && <DeleteDialog
                                deleteDialog={deleteSingle}
                                setDeleteDialog={setDeleteSingle}
                                title={`Delete Single Courses.`}
                                description={"The process cannot be undone after Completion."}
                                func={()=>deleteCourse({data:courseToDelete,type:"single"})}
                              />}
                      </>
                    }
                    {
                      page === 'teacher-page' && 
                      (
                        item?.isPublished? 
                        <>
                        <Button
                        onClick={() =>{ 
                          setUnPublishSingle(true);
                          setCourseToUnPublish(item);
                        }}
                        className="bg-red-500 font-playfair hover:scale-105 ease-in-out text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        unPublish
                      </Button>
                      {unPublishSingle && <DeleteDialog
                                  deleteDialog={unPublishSingle}
                                  setDeleteDialog={setUnPublishSingle}
                                  title={"UnPublish Single Course."}
                                  description={"The process can be undone after completion."}
                                  func={()=>updateCourse({type:"single",data:courseToUnPublish,status:false})}
                                />}
                        </>
                                    :
                                    <>
                                    <Button
                                  onClick={() =>{
                                    setPublishSingle(true);
                                    setCourseToPublish(item);
                                  } }
                                  className="bg-green-500 font-playfair text-white hover:scale-105 ease-in-out px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                >
                                  Publish
                                </Button>
                                {publishSingle && <DeleteDialog
                                  deleteDialog={publishSingle}
                                  setDeleteDialog={setPublishSingle}
                                  title={"Publish Single Course."}
                                  description={"The process can be undone after completion."}
                                  func={()=>updateCourse({type:"single",data:courseToPublish,status:true})}
                                />}
                                    </>
                      )
                    }
                    <Button onClick={()=>{
                                            setToggleDrawer(true);
                                            setTemporaryCourseData(item);
                                            setPurchasedData(purchaseData?.filter(
                                              purchasedItem => purchasedItem?.courseId?._id === item?._id
                                            ));
                    }}
                                            className="bg-green-600 font-playfair hover:bg-blue-600 hover:scale-105 transition-all ease-in-out">
                                        View
                                      </Button>
                                      {toggleDrawer && 
                                      <CourseDetailsDrawer handleDrawer={toggleDrawer} setHandleDrawer={setToggleDrawer} title={"Course Data."} description={"View the user Data."}
                                                        footer={"Final data view."}   data={temporaryCourseData} setTemporaryCourseData={setTemporaryCourseData} purchasedData={purchasedData} 
                                                        setPurchasedData={setPurchasedData}/>
                                      
                                      }
                 </TableCell>
                 
               </TableRow>
             ))}
           </TableBody>
         </Table>
      </ScrollArea>
            </>
         )
         :
         (
            <p className=" text-slate-500 text-sm">No Courses Avilable.</p>
         )
        }

    </div>
  )
}
