import React, { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, } from '../ui/table';
  
  import moment from 'moment';
 import CommonButton from '../CommonButton';
 import CommonDrawer from '../CommonDrawer';
 import { RiDeleteBin6Line } from "react-icons/ri";
 import { Delete_Single_Application,Delete_All_Application,Delete_Selected_Application } from '@/Routes';
 import { axiosService } from '@/Services';
 import { toast } from 'react-toastify';
 import { useDispatch } from 'react-redux';
 import { getApplication } from '@/Store/Slices/ApplicationSlice';
 import DeleteDialog from '../DeleteDialog';
 import { useSelector } from 'react-redux';


export default function CommonTable({data,header,type}){
  const dispatch=useDispatch();
  const [handleDrawer,setHandleDrawer]=useState(false);
  const userState=useSelector(state=>state?.user);
  const {data:user}=userState;
  const [selectedApplication,setSelectedApplication]=useState([]);
  const [deleteMulti,setDeleteMulti]=useState(false);
  const [deleteSingle,setDeleteSingle]=useState(false);
  const [applicationToDelete,setApplicationToDelete]=useState(null);
  const [currentApplication,setCurrentApplication]=useState(null);
  const handleDrawerFunction=(item)=>{
    setHandleDrawer(true);
    setCurrentApplication(item);
  }
  

  const deleteApplication=async ({data=null,type,status=null})=>{
    try{
      if(type === "all" ){
        if(selectedApplication.length<1){
          const response=await axiosService.delete(Delete_All_Application,{data:{status}},{withCredentials:true, headers: {
            "Content-Type": "application/json"
    }});
    if(response.status===200){
      dispatch(getApplication());
      toast.success(response?.data?.message);
    }
        }
        
        else{
              const response=await axiosService.delete(Delete_Selected_Application,{data:{data:selectedApplication}},{withCredentials:true,
                headers: {
                  "Content-Type": "application/json"
          }
              });
              if(response.status===200){
                setSelectedApplication([]);
                dispatch(getApplication());
                toast.success(response?.data?.message);
              }
    
          }
      }   
      else{
        const response=await axiosService.delete(Delete_Single_Application,{data:{data}},{withCredentials:true, headers: {
                "Content-Type": "application/json"
        }});
        if(response.status===200){
          dispatch(getApplication());
          toast.success(response?.data?.message);
        }
          
        }
      }
        catch(error){
      toast.error(error?.response?.data?.message);
    }
  }

  const handleAddApplication = (data, checked) => {
    if (checked) {
      setSelectedApplication((prev) => [...prev, data]); 
    } else {
      setSelectedApplication((prev) => prev.filter((app) => app !== data)); 
    }
  };

  
  return (
    <div className='flex flex-col justify-center items-center gap-2 '>
      <p className="  text-sm font-heading">A list of {type} Applications.</p>
        <div className="flex flex-row justify-evenly items-center w-full">
          <div className="relative cursor-pointer before:content-['Delete-All'] before:absolute before:-top-14 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">
          <RiDeleteBin6Line onClick={()=>setDeleteMulti(true)} className='cursor-pointer hover:scale-110 transition-transform duration-100 ease-in-out' size={20}/>
          {deleteMulti && <DeleteDialog
                                deleteDialog={deleteMulti}
                                setDeleteDialog={setDeleteMulti}
                                title={`Delete ${selectedApplication?.length>0? "Selected":"Multiple"} Application.`}
                                description={"The process cannot be undone after Completion."}
                                func={()=>deleteApplication({type:"all",status:type})}
                              />}
          </div>
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
        {data.map((item,index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Checkbox className={`${user?.theme ===false && 'bg-white'}`}
               checked={selectedApplication.includes(item)} onCheckedChange={(checked)=>handleAddApplication(item,checked)}/>
            </TableCell>
            <TableCell>{data?.indexOf(item)+1}</TableCell>
            <TableCell>{item?.user?.userName}</TableCell>
            <TableCell>{moment(item?.createdAt).format("MMMM DD, YYYY")}</TableCell>
            <TableCell >{item?.status}</TableCell>

            <TableCell className="text-right flex flex-row gap-5 justify-center items-center">
            {
              type!=="all" && (
                <>
              <CommonButton func={()=>handleDrawerFunction(item)} text="View"/>
              <CommonDrawer 
            handleDrawer={handleDrawer} 
            setHandleDrawer={setHandleDrawer} 
            data={currentApplication} 
          />
                </>
              )
            }
              
            <RiDeleteBin6Line onClick={()=>{
              setDeleteSingle(true);
              setApplicationToDelete(item);
              }} className='cursor-pointer hover:scale-110 transition-transform duration-100 ease-in-out' size={20}/>
            {deleteSingle && <DeleteDialog
                                deleteDialog={deleteSingle}
                                setDeleteDialog={setDeleteSingle}
                                title={`Delete Single Application.`}
                                description={"The process cannot be undone after Completion."}
                                func={()=>deleteApplication({data:applicationToDelete,type:"single"})}
                              />}
            </TableCell>
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
        </ScrollArea>

    </div>
  )
}
