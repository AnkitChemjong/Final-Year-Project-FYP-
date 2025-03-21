import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { RiDeleteBin6Line } from "react-icons/ri";
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { FaRegEdit } from "react-icons/fa";
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { getStudentHireApplication } from '@/Pages/Profile';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import DialogForm from '../DialogForm';
import { Delete_Hire_All_Application, Delete_Hire_Selected_Application, Delete_Hire_Single_Application,Get_Hire_Application_Details, Update_Hire_Application_Details } from '@/Routes';
import { UseContextApi } from '../ContextApi';
import { useSelector } from 'react-redux';
import { hireTeacherComponents } from '@/Utils';


export default function CommonTableForHireApplication({ data, type, header,page }) {
  const [selectedApplication, setSelectedApplication] = useState([]);
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  const { studentHireApplicationList, setStudentHireApplicationList,loadingSpin,setLoadingSpin,
    hireTeacherApplicationEditId,setHireTeacherApplicationEditId,hireTeacherInitialStateData,setHireTeacherInitialStateData } = useContext(UseContextApi);
    const [hireDialogEdit,setHireDialogEdit]=useState(false);

  const deleteHireApplication = async ({ data = null, type, status }) => {
    try {
      if (type === "all") {
        if (selectedApplication.length < 1) {
          const response = await axiosService.delete(Delete_Hire_All_Application, { data: { status, data } }, { withCredentials: true, headers: {
            "Content-Type": "application/json"
          }});
          if (response.status === 200) {
            const result = await getStudentHireApplication(user?._id);
            setStudentHireApplicationList(result);
            toast.success(response?.data?.message);
          }
        } else {
          const response = await axiosService.delete(Delete_Hire_Selected_Application, { data: { data: selectedApplication } }, { withCredentials: true, headers: {
            "Content-Type": "application/json"
          }});
          if (response.status === 200) {
            const result = await getStudentHireApplication(user?._id);
            setStudentHireApplicationList(result);
            setSelectedApplication([]);
            toast.success(response?.data?.message);
          }
        }
      } else {
        const response = await axiosService.delete(Delete_Hire_Single_Application, { data: { data } }, { withCredentials: true, headers: {
          "Content-Type": "application/json"
        }});
        if (response.status === 200) {
          const result = await getStudentHireApplication(user?._id);
          setStudentHireApplicationList(result);
          toast.success(response?.data?.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handleAddApplication = (data, checked) => {
    if (checked) {
      setSelectedApplication((prev) => [...prev, data]);
    } else {
      setSelectedApplication((prev) => prev.filter((app) => app !== data));
    }
  };

  const handleSetApplicationId=(id)=>{
    setHireDialogEdit(true);
    setHireTeacherApplicationEditId(id);
  }
  const getApplicationDetails=async()=>{
    try{
      
     const response=await axiosService.get(`${Get_Hire_Application_Details}/${hireTeacherApplicationEditId}`);
     if(response?.status === 200){
       setHireTeacherInitialStateData((prevState) => ({
        ...prevState,
        hiringDate: response?.data?.application?.hiringDate,
        startTime: response?.data?.application?.startTime,
        endTime: response?.data?.application?.endTime,
      }));
     }
    }catch(error){
     console.log(error);
    }
 }


 useEffect(()=>{
  if(hireTeacherApplicationEditId !== null) getApplicationDetails();
 },[hireTeacherApplicationEditId])

  const updateHireApplicationDetails=async(data)=>{
    try{
     setLoadingSpin(true);
    const response=await axiosService.patch(`${Update_Hire_Application_Details}/${hireTeacherApplicationEditId}`,data);
    if(response?.status === 200){
      toast.success(response?.data?.message);
      setLoadingSpin(false);
      setHireDialogEdit(false);
    }

   }
   catch(error){
    console.log(error);
    toast.error(error?.response?.data?.message);
   }
  }
  return (
    <div className='w-full overflow-x-auto'>
      <p className="text-slate-500 text-sm mb-4">A list of {type} Requests.</p>
      {data && data.length >= 1 ? (
        <>
          <div className="flex flex-row justify-between items-center mb-4">
            <div className='flex flex-row gap-2'>
              <p className="text-black">Total Requests =</p>
              <p className="text-black">{data?.length}</p>
            </div>
            {
             page === "profile" &&
            <div className="relative cursor-pointer before:content-['Delete-All'] before:absolute before:-top-14 before:left-1/2 before:-translate-x-1/2 before:px-2 before:py-1 before:text-white before:text-sm before:bg-slate-900 before:rounded-md before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-300 hover:before:opacity-100">
              <RiDeleteBin6Line onClick={() => deleteHireApplication({ type: "all", status: type, data })} className='cursor-pointer text-black hover:scale-110 transition-transform duration-100 ease-in-out' size={20} />
            </div>
            }
            {page === "teacherdashboard" && type === "pending" &&(
    <div className="flex gap-2">

      <Button
        onClick={() => handleAccept(item?._id)}
        className="bg-green-500 text-white hover:scale-105  ease-in-out px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
      >
        Accept All
      </Button>

      <Button
        onClick={() => handleReject(item?._id)}
        className="bg-red-500 hover:scale-105  ease-in-out text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
      >
        Reject All
      </Button>
    </div>
  )}
          </div>
          <ScrollArea className="max-h-[350px] overflow-auto rounded-lg">
            <Table className="w-full">
              <TableHeader className="bg-gray-200 rounded-t-lg">
                <TableRow>
                  {header && header.map((item, index) => (
                    <TableHead key={index} className="text-black">
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <Checkbox disabled={page==='teacherdashboard'&& type !== 'pending'} checked={selectedApplication.includes(item)} onCheckedChange={(checked) => handleAddApplication(item, checked)} />
                    </TableCell>
                    <TableCell>{data.indexOf(item) + 1}</TableCell>
                    <TableCell>{item?.studentId?.userName}</TableCell>
                    <TableCell>{item?.teacherId?.userName}</TableCell>
                    <TableCell>{moment(item?.createdAt).format("MMMM DD, YYYY")}</TableCell>
                    <TableCell>{moment(item?.hiringDate).format("MMMM DD, YYYY")}</TableCell>
                    <TableCell className="text-center">{item?.startTime} To {item?.endTime}</TableCell>
                    <TableCell>{item?.status}</TableCell>
                    <TableCell className="text-right flex flex-row gap-5 justify-center items-center">
                    {page === "profile" && (
  <>
    {type === "pending" && (
      <FaRegEdit
        className="cursor-pointer"
        onClick={() => handleSetApplicationId(item?._id)}
        size={20}
      />
    )}
    <RiDeleteBin6Line
      onClick={() => deleteHireApplication({ data: item, type: "single" })}
      className="cursor-pointer hover:scale-110 transition-transform duration-100 ease-in-out"
      size={20}
    />
  </>
)}
   {page === "teacherdashboard" && (
    type === "pending" ? (
      <div className="flex gap-2">
        <Button
          onClick={() => handleAccept(item?._id)}
          className="bg-green-500 text-white hover:scale-105 ease-in-out px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          Accept
        </Button>

        <Button
          onClick={() => handleReject(item?._id)}
          className="bg-red-500 hover:scale-105 ease-in-out text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Reject
        </Button>
      </div>
    ) : (
      <Button disabled={true} className="bg-slate-400 cursor-not-allowed">
        N/A
      </Button>
    )
  )}              </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </>
      ) : (
        <p className="text-slate-500 text-sm">No Hire Requests Available.</p>
      )}
      <DialogForm
                  title="Update Hire Application."
                  description="Fill all the Information as Instructed."
                  dialog={hireDialogEdit}
                  setDialog={setHireDialogEdit}
                  func={updateHireApplicationDetails}
                  type="hireteacher"
                  componentInputs={hireTeacherComponents}
                  initialState={hireTeacherInitialStateData}
                />
    </div>
  );
}