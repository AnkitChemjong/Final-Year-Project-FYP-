import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slices/User_Slice'
import applicationSlice from "./Slices/ApplicationSlice";



const store=configureStore({
    reducer:{
     user:userSlice,
     application:applicationSlice
    }
});
export default store;