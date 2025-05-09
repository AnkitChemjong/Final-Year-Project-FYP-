import React, { useContext, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { getAllUser } from '@/Store/Slices/Get_All_User';
import { useSelector, useDispatch } from 'react-redux';
import { Badge } from '../ui/badge';
import { axiosService } from '@/Services';
import { toast } from 'react-toastify';
import { Handle_Status } from '@/Routes';
import { UseContextApi } from '../ContextApi';
import DrawerForCustomer from '../Drawer_For_Customer';
import DeleteDialog from '../DeleteDialog';

export default function CommonTableForUsers({ tableFormat, customerList = [], status = "", forType = "" }) {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState([]);
  const progressState = useSelector(state => state?.progress);
  const { data: progress, loading } = progressState;
  const purchasedCourseState = useSelector(state => state?.coursePurchased);
  const { data: enrolledCourse, loading1 } = purchasedCourseState;
  const allCourseState = useSelector(state => state?.course);
  const { data: courses, loading2 } = allCourseState;
  const userState=useSelector(state=>state?.user);
  const {data:user}=userState;
  const {allTeacherPurchaseData,setAllteacherPurchaseData}=useContext(UseContextApi);
  const [toggleDrawer,setToggleDrawer]=useState(false);
  const [temporaryUserData,setTemporaryUserData]=useState(null);
  const [thisMonthEarning,setThisMonthEarning]=useState(0);
  const [banSingle,setBanSingle]=useState(false);
  const [unBanSingle,setUnBanSingle]=useState(false);
  const [banMulti,setBanMulti]=useState(false);
  const [unBanMulti,setUnBanMulti]=useState(false);
  const [userToBan,setUserToBan]=useState(null);
  const [userToUnBan,setUserToUnBan]=useState(null);

  const handleUserStatus = async ({ type, data = "", status }) => {
    try {
      switch (type) {
        case 'all':
          if (selectedUser?.length > 0) {
            const response = await axiosService.patch(Handle_Status, { data: selectedUser, status });
            if (response?.status === 200) {
              toast.success(response?.data?.message);
              dispatch(getAllUser());
              setSelectedUser([]);
            }
          } else {
            if (customerList.length === 0) {
              toast.warning("No users available to update");
              return;
            }
            const response = await axiosService.patch(Handle_Status, { data: customerList, status });
            if (response?.status === 200) {
              toast.success(response?.data?.message);
              dispatch(getAllUser());
            }
          }
          break;
        case 'single':
          console.log(data);
          const response = await axiosService.patch(Handle_Status, { data, status });
          if (response?.status === 200) {
            toast.success(response?.data?.message);
            dispatch(getAllUser());
          }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const handleAddUser = (data, checked) => {
    if (checked) {
      setSelectedUser((prev) => [...prev, data]);
    } else {
      setSelectedUser((prev) => prev.filter((user) => user._id !== data._id)); 
    }
  };

  
  if (customerList.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden p-2">
        <div className="p-4 text-center text-gray-500">
          No Data to show.
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden p-2">
      {status !== '' && (
        <div className="flex w-full justify-end p-5">
          {status === 'active' && (
            <>
            <Button
              onClick={() =>setBanMulti(true) }
              className="hover:scale-105 font-playfair transition-all ease-in-out px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              disabled={customerList.length === 0} 
            >
              {selectedUser?.length > 0 ? "Ban Selected" : "Ban All"}
            </Button>
            {banMulti && <DeleteDialog
                                deleteDialog={banMulti}
                                setDeleteDialog={setBanMulti}
                                title={`Ban ${selectedUser?.length>0? "Selected":"Multiple"} Users.`}
                                description={"The process can be undone after Completion."}
                                func={()=>handleUserStatus({ type: "all", status: "ban" })}
                              />}
            </>

          )}
          {status === 'banned' && (
            <>
            <Button
              onClick={() => setUnBanMulti(true)}
              className="hover:scale-105 transition-all font-playfair ease-in-out px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
              disabled={customerList.length === 0} 
            >
              {selectedUser?.length > 0 ? "Unban Selected" : "Unban All"}
            </Button>
            {unBanMulti && <DeleteDialog
                                deleteDialog={unBanMulti}
                                setDeleteDialog={setUnBanMulti}
                                title={`UnBan ${selectedUser?.length>0? "Selected":"Multiple"} Users.`}
                                description={"The process can be undone after Completion."}
                                func={()=>handleUserStatus({ type: "all", status: "unban" })}
                              />}
            </>
          )}
        </div>
      )}

      <ScrollArea className="max-h-[350px] overflow-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-gray-200">
            <TableRow>
              {tableFormat.map((header, index) => (
                <TableHead
                className=" text-black first:rounded-tl-lg last:rounded-tr-lg"
                 key={index}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerList.map((customer, index) => (
              <TableRow key={customer._id || index}>
                <TableCell>
                  <Checkbox
                  className={`${user?.theme===false && " bg-white"}`}
                    disabled={status === ''}
                    checked={selectedUser.some(user => user._id === customer._id)} 
                    onCheckedChange={(checked) => handleAddUser(customer, checked)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customer.userName || 'N/A'}</TableCell>
                <TableCell>{customer.email}</TableCell>

                {forType === "customer" &&
                  <TableCell>
                    {enrolledCourse?.find(item => item?.userId === customer?._id) ?
                      enrolledCourse?.find(item => item?.userId === customer?._id)?.courses?.length : 'N/A'}
                  </TableCell>
                }

                {forType === "customer" &&
                  <TableCell>
                    {progress?.filter(item => item?.userId === customer?._id && item?.completed === true)?.length || 0}
                  </TableCell>
                }
                
                {forType === "teacher" &&
                  <TableCell>
                    {courses?.filter(item => item?.creator?._id === customer?._id)?.length || 0}
                  </TableCell>
                }
                
                {forType === "teacher" &&
                  <TableCell>
                    {courses?.filter(item => item?.creator?._id === customer?._id)
                      ?.reduce((sum, obj) => sum + (obj?.students?.length || 0), 0) || 0}
                  </TableCell>
                }

                <TableCell className="flex gap-2">
                  {customer?.userRole?.map((item, i) => (
                    <Badge 
                      key={i} 
                      className="cursor-pointer bg-green-600 hover:scale-105 hover:bg-blue-600 transition-all ease-in-out"
                    >
                      {item}
                    </Badge>
                  ))}
                </TableCell>
                
                {forType === "teacher" && (
                    <TableCell>
  {Array.isArray(allTeacherPurchaseData) && customer
    ? allTeacherPurchaseData?.filter(item => item?.teacherId === customer?._id)
        .flatMap(item => item?.courses || [])
        .flatMap(course => course?.purchases || [])
        .filter(purchase => {
          if (!purchase?.createdAt) return false;
          const purchaseDate = new Date(purchase.createdAt);
          const now = new Date();
          return (
            purchaseDate.getFullYear() === now.getFullYear() &&
            purchaseDate.getMonth() === now.getMonth()
          );
        })
        .reduce((sum, purchase) => sum + (parseFloat(purchase?.teacherAmount) || 0), 0)
    : 0}
</TableCell>
)}

                
                <TableCell>{customer?.status?.toUpperCase()}</TableCell>
                
                <TableCell>
                  {status === '' ? (
                    <div className='flex flex-col gap-2'>
                    <Button disabled={true} className="bg-gray-700">
                      N/A
                    </Button>
                    <Button onClick={()=>{
                        setToggleDrawer(true);
                        setTemporaryUserData(customer);
                        setThisMonthEarning(Array.isArray(allTeacherPurchaseData) && customer
                        ? allTeacherPurchaseData?.filter(item => item?.teacherId === customer?._id)
                            .flatMap(item => item?.courses || [])
                            .flatMap(course => course?.purchases || [])
                            .filter(purchase => {
                              if (!purchase?.createdAt) return false;
                              const purchaseDate = new Date(purchase.createdAt);
                              const now = new Date();
                              return (
                                purchaseDate.getFullYear() === now.getFullYear() &&
                                purchaseDate.getMonth() === now.getMonth()
                              );
                            })
                            .reduce((sum, purchase) => sum + (parseFloat(purchase?.teacherAmount) || 0), 0)
                        : 0)

                    }} className="bg-green-600 font-playfair hover:bg-blue-600 hover:scale-105 transition-all ease-in-out">
                    View
                  </Button>
                  {toggleDrawer &&
                  <DrawerForCustomer handleDrawer={toggleDrawer} setHandleDrawer={setToggleDrawer} title={"User Data."} description={"View the user Data."}
                  footer={"Final data view."} thisMonthEarn={thisMonthEarning} setThisMonthEarning={setThisMonthEarning} data={temporaryUserData} setTemporaryUserData={setTemporaryUserData}/>
                  }
                    </div>
                  ) : customer?.status === 'banned' ? (
                    <>
                    <Button
                      onClick={() =>{
                         setUnBanSingle(true);
                        setUserToUnBan(customer);}}
                      className="px-3 py-1 font-playfair bg-green-500 text-white rounded hover:bg-green-600 hover:scale-105 transition-all ease-in-out"
                    >
                      Unban
                    </Button>
                    {unBanSingle && <DeleteDialog
                                deleteDialog={unBanSingle}
                                setDeleteDialog={setUnBanSingle}
                                title={`UnBan Single Users.`}
                                description={"The process can be undone after Completion."}
                                func={()=>handleUserStatus({ type: "single", data: userToUnBan, status: "unban" })}
                              />}
                    </>
                  ) : (
                    <>
                    <Button
                      onClick={() =>{
                        setBanSingle(true);
                      setUserToBan(customer);
                    } }
                      className="px-3 py-1 font-playfair bg-red-500 text-white rounded hover:bg-red-600 hover:scale-105 transition-all ease-in-out"
                    >
                      Ban
                    </Button>
                    {banSingle && <DeleteDialog
                                deleteDialog={banSingle}
                                setDeleteDialog={setBanSingle}
                                title={`Ban Single Users.`}
                                description={"The process can be undone after Completion."}
                                func={()=>handleUserStatus({ type: "single", data: userToBan, status: "ban" })}
                              />}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}