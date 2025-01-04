import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosService } from "@/Services";
import { toast } from "react-toastify";
import { User_Route } from "@/Routes";

export const getUser=createAsyncThunk("getUser",async ()=>{
  try{
     const logedInUser=await axiosService.get(User_Route,{withCredentials:true});
     return logedInUser?.data?.user;
  }
  catch(error){
    toast.error("Something Wrong on getting logged in User");
  }
});

const userSlice=createSlice({
    name:'user',
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getUser.fulfilled,(state,action)=>{
            state.status="fulfilled"
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(getUser.pending,(state,action)=>{
          state.status="pending";
          state.loading=true;
        })
        .addCase(getUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.loading=false;
        });
    }


})
export default userSlice.reducer;