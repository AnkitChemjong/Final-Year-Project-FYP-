import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slices/User_Slice'
import applicationSlice from "./Slices/ApplicationSlice";
import courseSlice from './Slices/Course_Slice';
import getAllUserSlice from './Slices/Get_All_User';
import hireApplicationSlice from './Slices/Hire_Application';
import getAllRatingSlice from './Slices/Get_All_Rating';

const store=configureStore({
    reducer:{
     user:userSlice,
     application:applicationSlice,
     course:courseSlice,
     allUsers:getAllUserSlice,
     hireApplication:hireApplicationSlice,
     rating:getAllRatingSlice
    }
});
export default store;