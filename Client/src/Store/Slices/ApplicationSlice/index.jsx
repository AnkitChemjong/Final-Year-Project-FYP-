import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Applications } from "@/Routes";
import { axiosService } from "@/Services";



 export const getApplication=createAsyncThunk("getApplication",async ()=>{
  try{
     const allApplication=await axiosService.get(Get_All_Applications,{withCredentials:true});
     return allApplication?.data?.application;
  }
  catch(error){
    toast.error("Something Wrong on getting applications");
    return rejectWithValue(error.message);
  }
})

const applicationSlice=createSlice({
    name:"application",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getApplication.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getApplication.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getApplication.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default applicationSlice.reducer;
