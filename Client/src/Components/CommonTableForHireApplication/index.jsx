import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { RiDeleteBin6Line } from "react-icons/ri";
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { FaRegEdit } from "react-icons/fa";
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { getStudentHireApplication } from '@/Pages/Profile';
import { getTeacherHireApplication } from '@/Pages/TeacherHireRequest';
import { Button } from '../ui/button';
import DeleteDialog from '../DeleteDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import DialogForm from '../DialogForm';
import { Delete_Hire_All_Application, Delete_Hire_Selected_Application, Delete_Hire_Single_Application,Get_Hire_Application_Details, Update_Hire_Application_Details,
  Update_Hire_Application_All_Status,Update_Hire_Application_Selected_Status,Update_Hire_Application_Single_Status
 } from '@/Routes';
import { UseContextApi } from '../ContextApi';
import { useSelector } from 'react-redux';
import { hireTeacherComponents } from '@/Utils';
import DrawerForHireTeacherDataView from '../DrawerForHireTeacherDataView';


export default function CommonTableForHireApplication({ data, type, header, page }) {
  const [selectedApplication, setSelectedApplication] = useState([]);
  const [handleDrawer, setHandleDrawer] = useState(false);
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  const { 
    studentHireApplicationList, setStudentHireApplicationList,
    teacherHireApplicationList, setTeacherHireApplicationList,
    loadingSpin, setLoadingSpin,
    hireTeacherApplicationEditId, setHireTeacherApplicationEditId,
    hireTeacherInitialStateData, setHireTeacherInitialStateData 
  } = useContext(UseContextApi);
  const [hireDialogEdit, setHireDialogEdit] = useState(false);
  const [dialogSingle, setDialogSingle] = useState(false);
  const [dialogMulti, setDialogMulti] = useState(false);
  const [rejectSingle, setRejectSingle] = useState(false);
  const [acceptSingle, setAcceptSingle] = useState(false);
  const [rejectMulti, setRejectMulti] = useState(false);
  const [acceptMulti, setAcceptMulti] = useState(false);

  const deleteHireApplication = async ({ data = null, type, status }) => {
    try {
      setLoadingSpin(true);
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
    finally{
      setLoadingSpin(false);
    }
  };

  const updateHireApplication = async ({ data = null, type, status }) => {
    try {
      setLoadingSpin(true);
      if (type === "all") {
        if (selectedApplication.length < 1) {
          const response = await axiosService.patch(Update_Hire_Application_All_Status, { data:teacherHireApplicationList,status} , { withCredentials: true, headers: {
            "Content-Type": "application/json"
          }});
          if (response.status === 200) {
            const result = await getStudentHireApplication(user?._id);
            setStudentHireApplicationList(result);
            const teacherResult = await getTeacherHireApplication(user?._id);
            setTeacherHireApplicationList(teacherResult);
            toast.success(response?.data?.message);
          }
        } else {
          const response = await axiosService.patch(Update_Hire_Application_Selected_Status, { data:selectedApplication,status } , { withCredentials: true, headers: {
            "Content-Type": "application/json"
          }});
          if (response.status === 200) {
            const result = await getStudentHireApplication(user?._id);
            setStudentHireApplicationList(result);
            const teacherResult = await getTeacherHireApplication(user?._id);
            setTeacherHireApplicationList(teacherResult);
            setSelectedApplication([]);
            toast.success(response?.data?.message);
          }
        }
      } else {
        const response = await axiosService.patch(Update_Hire_Application_Single_Status, { data,status}, { withCredentials: true, headers: {
          "Content-Type": "application/json"
        }});
        console.log(response);
        if (response.status === 200) {
          const result = await getStudentHireApplication(user?._id);
          setStudentHireApplicationList(result);
          const teacherResult = await getTeacherHireApplication(user?._id);
            setTeacherHireApplicationList(teacherResult);
          toast.success(response?.data?.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    finally{
      setLoadingSpin(false);
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
        hireDescription: response?.data?.application?.hireDescription
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
   finally{
    setLoadingSpin(false);
   }
  }

  return (
    <div className="w-full overflow-x-auto p-2 sm:p-4">
      <div className="min-w-[800px]"> 
        <p className=" text-sm mb-4 font-heading">A list of {type} Requests.</p>
        
        {data && data.length >= 1 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              {page === 'profile' && (
                <div className='flex items-center gap-2'>
                  <p >Total Requests =</p>
                  <p className=" font-medium">{data?.length}</p>
                </div>
              )}
              
              {page === "profile" && (
                <div className="relative group inline-block"> 
                <RiDeleteBin6Line 
                  onClick={() => setDialogMulti(true)} 
                  className='cursor-pointer  hover:scale-110 transition-transform duration-100 ease-in-out' 
                  size={20} 
                />
                <span className="
                  absolute -top-6 left-1/2 -translate-x-1/2 
                  bg-gray-800 text-white px-2 py-1 rounded 
                  text-xs whitespace-nowrap opacity-0 
                  group-hover:opacity-100 pointer-events-none
                  transition-opacity duration-200
                ">
                  Delete All
                </span>
                
                {dialogMulti && (
                  <DeleteDialog
                    deleteDialog={dialogMulti}
                    setDeleteDialog={setDialogMulti}
                    title={`Delete ${selectedApplication?.length > 0 ? "Selected" : "Multiple"} Hire Application.`}
                    description={"The process cannot be undone after deletion."}
                    func={() => deleteHireApplication({ type: "all", status: type, data })}
                  />
                )}
              </div>
              )}

              {page === "teacherdashboard" && type === "pending" && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setAcceptMulti(true)}
                    className="bg-green-500 font-playfair text-white hover:scale-105 ease-in-out px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm sm:text-base"
                  >
                    {selectedApplication?.length > 0 ? "Accept Selected" : "Accept All"}
                  </Button>
                  {acceptMulti && <DeleteDialog
              deleteDialog={acceptMulti}
              setDeleteDialog={setAcceptMulti}
              title={`Accept ${selectedApplication?.length>0? "Selected":"Multiple"} Hire Application.`}
              description={"The process cannot be undone after Completion."}
              func={()=>updateHireApplication({type:"all",status:"approved"})}
            />}

                  <Button
                    onClick={() =>setRejectMulti(true) }
                    className="bg-red-500 font-playfair hover:scale-105 ease-in-out text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200 text-sm sm:text-base"
                  >
                    {selectedApplication?.length > 0 ? "Reject Selected" : "Reject All"}
                  </Button>
                  {rejectMulti && <DeleteDialog
              deleteDialog={rejectMulti}
              setDeleteDialog={setRejectMulti}
              title={`Reject ${selectedApplication?.length>0? "Selected":"Multiple"} Hire Application.`}
              description={"The process cannot be undone after Completion."}
              func={()=>updateHireApplication({type:"all",status:"rejected"})}
            />}
                </div>
              )}
            </div>

            <div className="border rounded-lg overflow-hidden">
              <ScrollArea className="h-[400px] sm:h-[200px]">
                <Table className="w-full">
                  <TableHeader className="bg-gray-100 sticky top-0">
                    <TableRow>
                      {header.map((item, index) => (
                        <TableHead 
                          key={index} 
                          className={`text-black px-3 py-3 ${index === 0 ? 'sticky left-0 bg-gray-100' : ''}`}
                        >
                          {item}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} >
                        <TableCell className="font-medium sticky left-0 ">
                          <Checkbox 
                          className={`${user?.theme? "":"bg-white"}`}
                            disabled={page === 'teacherdashboard' && type !== 'pending'} 
                            checked={selectedApplication.includes(item)} 
                            onCheckedChange={(checked) => handleAddApplication(item, checked)} 
                          />
                        </TableCell>
                        <TableCell className="px-3 py-3">{index + 1}</TableCell>
                        <TableCell className="px-3 py-3">{item?.studentId?.userName}</TableCell>
                        <TableCell className="px-3 py-3">{item?.teacherId?.userName}</TableCell>
                        <TableCell className="px-3 py-3 whitespace-nowrap">
                          {moment(item?.createdAt).format("MMM D, YYYY")}
                        </TableCell>
                        <TableCell className="px-3 py-3 whitespace-nowrap">
                          {moment(item?.hiringDate).format("MMM D, YYYY")}
                        </TableCell>
                        <TableCell className="px-3 py-3 text-center whitespace-nowrap">
                          {item?.startTime} - {item?.endTime}
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item?.status === 'approved' ? 'bg-green-100 text-green-800' :
                            item?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item?.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 py-3 text-right">
                          <div className="flex flex-col sm:flex-row gap-2 justify-end items-center">
                            {page === "profile" && (
                              <>
                                {type === "pending" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleSetApplicationId(item?._id)}
                                    className="hover:bg-gray-200 p-2"
                                  >
                                    <FaRegEdit className="text-blue-600" size={16} />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setDialogSingle(true)}
                                  className="hover:bg-gray-200 p-2"
                                >
                                  <RiDeleteBin6Line className="text-red-600" size={16} />
                                </Button>
                                {dialogSingle && <DeleteDialog
              deleteDialog={dialogSingle}
              setDeleteDialog={setDialogSingle}
              title={"Delete Single Hire Application."}
              description={"The process cannot be undone after deletion."}
              func={()=>deleteHireApplication({ data: item, type: "single" })}
            />}
                              </>
                            )}
                            
                            {page === "teacherdashboard" && (
                              type === "pending" ? (
                                <>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => setAcceptSingle(true)}
                                      className="bg-green-500 font-playfair text-white hover:bg-green-600 h-8 px-3 text-xs sm:text-sm"
                                    >
                                      Accept
                                    </Button>
                                    {acceptSingle && <DeleteDialog
              deleteDialog={acceptSingle}
              setDeleteDialog={setAcceptSingle}
              title={"Accept Single Hire Application."}
              description={"The process cannot be undone after completion."}
              func={()=>updateHireApplication({type:"single",data:item,status:"approved"})}
            />}
                                    <Button
                                      onClick={() => setRejectSingle(true)}
                                      className="bg-red-500 font-playfair text-white hover:bg-red-600 h-8 px-3 text-xs sm:text-sm"
                                    >
                                      Reject
                                    </Button>
                                    {rejectSingle && <DeleteDialog
              deleteDialog={rejectSingle}
              setDeleteDialog={setRejectSingle}
              title={"Reject Single Hire Application."}
              description={"The process cannot be undone after completion."}
              func={()=>updateHireApplication({type:"single",data:item,status:"rejected"})}
            />}
                                  </div>
                                  <Button 
                                    className="bg-gray-700 font-playfair text-white hover:bg-gray-800 h-8 px-3 text-xs sm:text-sm"
                                    onClick={() => setHandleDrawer(true)}
                                  >
                                    View
                                  </Button>
                                  {handleDrawer&&<DrawerForHireTeacherDataView footer={"Contact User by the details."} handleDrawer={handleDrawer} setHandleDrawer={setHandleDrawer} data={item} title={"Data of user."} description={"All the details of user is present here."}/>}
                                </>
                              ) : (
                                <Button 
                                  disabled 
                                  className="bg-gray-300 text-gray-600 cursor-not-allowed h-8 px-3 text-xs sm:text-sm"
                                >
                                  N/A
                                </Button>
                              )
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-slate-500">No Hire Requests Available</p>
          </div>
        )}
      </div>
      
      {hireDialogEdit && <DialogForm
        title="Update Hire Application"
        description="Fill all the Information as Instructed"
        dialog={hireDialogEdit}
        setDialog={setHireDialogEdit}
        func={updateHireApplicationDetails}
        type="hireteacher"
        componentInputs={hireTeacherComponents}
        initialState={hireTeacherInitialStateData}
      />}
      
    </div>
  );
}