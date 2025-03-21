import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Hire_Application } from "@/Routes";
import { axiosService } from "@/Services";




 export const getHireApplication=createAsyncThunk("getHireApplication",async ()=>{
  try{
     const allApplication=await axiosService.get(Get_All_Hire_Application,{withCredentials:true});
     return allApplication?.data?.application;
  }
  catch(error){
    toast.error("Something Wrong on getting hire applications");
    return rejectWithValue(error.message);
  }
})

const hireApplicationSlice=createSlice({
    name:"hireApplication",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getHireApplication.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getHireApplication.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getHireApplication.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default hireApplicationSlice.reducer;
