import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Progress_Data } from "@/Routes";
import { axiosService } from "@/Services";



 export const getAllProgress=createAsyncThunk("getAllProgress",async ()=>{

  try{
     const allProgress=await axiosService.get(Get_All_Progress_Data,{withCredentials:true});
     return allProgress?.data?.data;
  }
  catch(error){
    toast.error("Something Wrong on getting ratings");
    return rejectWithValue(error.message);
  }
})

const getAllProgressSlice=createSlice({
    name:"progress",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllProgress.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getAllProgress.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getAllProgress.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default getAllProgressSlice.reducer;
