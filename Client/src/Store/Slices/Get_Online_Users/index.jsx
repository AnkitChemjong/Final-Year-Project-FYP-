import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosService } from "@/Services";
import { toast } from "react-toastify";
import { Get_Online_Users } from "@/Routes";

export const getOnlineUser=createAsyncThunk("getOnlineUser",async ()=>{
  try{
      const onlineUser=await axiosService.get(Get_Online_Users,{withCredentials:true});
      if (onlineUser?.data?.onlineUsers) {
        return onlineUser.data.onlineUsers;
      } 
  }
  catch(error){
    toast.error("Something Wrong on getting online User");
    return rejectWithValue(error.message);;
  }
});

const onlineUserSlice=createSlice({
    name:'onlineUser',
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getOnlineUser.fulfilled,(state,action)=>{
            state.status="fulfilled"
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(getOnlineUser.pending,(state,action)=>{
          state.status="pending";
          state.loading=true;
        })
        .addCase(getOnlineUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.loading=false;
        });
    }


})
export default onlineUserSlice.reducer;