import { configureStore } from "@reduxjs/toolkit";
import userSlice from './Slices/User_Slice'


const store=configureStore({
    reducer:{
     user:userSlice
    }
});
export default store;