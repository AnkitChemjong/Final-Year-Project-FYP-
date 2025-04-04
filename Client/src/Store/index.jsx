import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slices/User_Slice'
import applicationSlice from "./Slices/ApplicationSlice";
import courseSlice from './Slices/Course_Slice';
import getAllUserSlice from './Slices/Get_All_User';
import hireApplicationSlice from './Slices/Hire_Application';
import getAllRatingSlice from './Slices/Get_All_Rating';
import getAllProgressSlice from './Slices/Get_All_Progress';
import getAllPurchasedCourseSlice from './Slices/Get_All_Purchased_Course_Model';
import onlineUserSlice from './Slices/Get_Online_Users';
import getAllPurchaseDataSlice from './Slices/Get_All_Purchase_Data';

const store=configureStore({
    reducer:{
     user:userSlice,
     application:applicationSlice,
     course:courseSlice,
     allUsers:getAllUserSlice,
     hireApplication:hireApplicationSlice,
     rating:getAllRatingSlice,
     progress:getAllProgressSlice,
     coursePurchased:getAllPurchasedCourseSlice,
     onlineUsers:onlineUserSlice,
     purchase:getAllPurchaseDataSlice
    }
});
export default store;