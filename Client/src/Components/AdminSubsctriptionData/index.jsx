import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollArea } from '../ui/scroll-area';
import planSub from '@/assets/planSub.json';
import LottieAnimation from '../LottieAnimation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { subscribedUsers } from '@/Utils';
import CommonButton from '../CommonButton';
import DrawerForCustomer from '../Drawer_For_Customer';

function AdminSubscriptionData({ data }) {
  const userState = useSelector(state => state?.user);
  const { data: user } = userState;
  const subscriptionState = useSelector(state => state?.subscriptionPayment);
  const { data: subscriptionData } = subscriptionState;
  const [toggleDrawer,setToggleDrawer]=useState(false);
  const [userSubscriptionData,setUserSubscriptionData]=useState([]);
  const [temporaryUserData,setTemporaryUserData]=useState(null);


  return (
    <ScrollArea className="max-h-screen overflow-auto p-4">
      <div className='flex gap-2 items-center'>
        <h1 className="text-2xl font-bold  mb-4 font-heading">Subscription Management</h1>
        <LottieAnimation animationData={planSub} width={100} height={100} speed={1} />
      </div>
      <Table className="mt-6 border rounded-lg">
        <TableCaption>A list of subscribed users.</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            {subscribedUsers.map((item, index) => (
              <TableHead key={index} className={index === subscribedUsers.length - 1 ? "text-right" : ""}>
                {item}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{user?.userName}</TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user?.subscription?.subscriptionStatus === 'active' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.subscription?.subscriptionStatus}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <CommonButton func={()=>{
                    setToggleDrawer(true);
                    setTemporaryUserData(user);
                    const purchasedData=subscriptionData?.filter(item=>item?.userId?._id===user?._id);
                    setUserSubscriptionData(purchasedData);
                    }} text={"View Details"}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {toggleDrawer && 
      <DrawerForCustomer handleDrawer={toggleDrawer} setHandleDrawer={setToggleDrawer} title={"Subscription Data."} description={"View the user's subscription Data."}
                        footer={"User Subscription view."} userSubscriptionData={userSubscriptionData} setUserSubscriptionData={setUserSubscriptionData} data={temporaryUserData} setTemporaryUserData={setTemporaryUserData}/>}
    </ScrollArea>
  );
}

export default AdminSubscriptionData;